#!/bin/bash
#
# Refresh static/openapi/openapi.json — the document the whole API reference is
# rendered from.
#
# ── WHY THIS NO LONGER FETCHES BY DEFAULT ────────────────────────────────────
#
# It used to curl ${API_URL}/api-json on every build, and fall back to the
# committed copy with a warning if that failed. Production does not serve
# /api-json at all — apps/backend/src/main.ts wraps SwaggerModule.setup in
# `if (!isProduction)`, so the endpoint 404s on the live API by design.
#
# The fetch therefore failed on EVERY build, printed a warning nobody reads,
# exited 0, and shipped whatever stale copy was committed. It went unnoticed
# for months: the published reference described 115 routes while the API had
# 854, and /webhooks, /api-keys and /marketplace — the three surfaces the
# guides tell integrators to call — were absent from it entirely.
#
# The committed copy is now the source, generated from the backend's own source
# code by `npm run openapi:emit` in apps/backend (which walks the real
# decorator metadata without booting a server). To refresh it:
#
#     cd apps/backend && npm run openapi:emit
#     cp openapi.json <this-repo>/static/openapi/openapi.json
#
# A URL fetch is still supported for an environment that genuinely serves
# /api-json — pass API_URL explicitly. When you ask for a fetch, a failed fetch
# is a BUILD FAILURE, not a silent downgrade to whatever is on disk. That
# silent downgrade is the entire bug this file exists to prevent repeating.

set -euo pipefail

OUTPUT_PATH="./static/openapi/openapi.json"

if [ -z "${API_URL:-}" ]; then
  if [ ! -f "$OUTPUT_PATH" ]; then
    echo "Error: no committed spec at $OUTPUT_PATH and no API_URL to fetch from." >&2
    echo "Generate one with 'npm run openapi:emit' in apps/backend." >&2
    exit 1
  fi

  # Report what is about to be published, so a stale spec is visible in the
  # build log rather than something you discover from the rendered site.
  PATH_COUNT=$(node -e "
    try {
      const s = require('$OUTPUT_PATH');
      process.stdout.write(String(Object.keys(s.paths || {}).length));
    } catch (e) {
      process.stdout.write('unreadable');
    }
  ")
  echo "Using committed OpenAPI spec ($PATH_COUNT paths). Set API_URL to fetch instead."

  if [ "$PATH_COUNT" = "unreadable" ]; then
    echo "Error: $OUTPUT_PATH is not readable JSON." >&2
    exit 1
  fi
  exit 0
fi

SPEC_URL="${API_URL}/api-json"
echo "Fetching OpenAPI spec from $SPEC_URL..."

HTTP_STATUS=$(curl -s -o "$OUTPUT_PATH.tmp" -w "%{http_code}" "$SPEC_URL" --max-time 30)

if [ "$HTTP_STATUS" != "200" ]; then
  rm -f "$OUTPUT_PATH.tmp"
  echo "Error: fetch failed (HTTP $HTTP_STATUS)." >&2
  echo "Not falling back to the committed copy — you asked for a fetch, and" >&2
  echo "silently publishing a different spec than the one requested is how the" >&2
  echo "reference went 739 routes out of date without anyone noticing." >&2
  exit 1
fi

# A 200 that is not the document is still a failure — a login page or an error
# body would otherwise overwrite a good spec with something that renders empty.
if ! node -e "
  const s = require('./$OUTPUT_PATH.tmp');
  const n = Object.keys(s.paths || {}).length;
  if (!n) throw new Error('spec has no paths');
  console.log('Fetched spec has ' + n + ' paths.');
"; then
  rm -f "$OUTPUT_PATH.tmp"
  echo "Error: fetched body is not a usable OpenAPI document." >&2
  exit 1
fi

mv "$OUTPUT_PATH.tmp" "$OUTPUT_PATH"
echo "OpenAPI spec updated successfully."
