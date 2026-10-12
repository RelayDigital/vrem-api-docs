#!/bin/bash
#
# Refresh static/openapi/openapi.json — the document the whole API reference is
# rendered from.
#
# ── WHY THIS DOES NOT FETCH ─────────────────────────────────────────────────
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
# code by `npm run openapi:emit` in apps/backend. That script compiles first
# (`nest build`) and then reads the real decorator metadata from the compiled
# app without listening on a port; run uncompiled it emits empty request bodies.
# It writes TWO documents: openapi.json, the complete internal surface the
# iOS client generates from, and openapi.public.json, the allowlist-filtered
# surface (src/openapi-public-surface.ts). This site publishes the PUBLIC one.
# To refresh it:
#
#     cd apps/backend && npm run openapi:emit
#     cp openapi.public.json <this-repo>/static/openapi/openapi.json
#
# Copying openapi.json instead would publish every internal route (payroll,
# platform administration, the unreleased agent hub) as public reference.
#
# ── WHY THERE IS NO URL FETCH ANY MORE ────────────────────────────────────────
#
# This script used to accept API_URL and download ${API_URL}/api-json over the
# committed file. /api-json serves the complete INTERNAL document, never the
# public one, so that mode could only ever overwrite the published spec with
# every internal route. It has been removed rather than documented around.
#
# ── THE PUBLIC-DOCUMENT CHECK ────────────────────────────────────────────────
#
# The backend's public filter stamps `x-vremly-required-scopes` on every
# operation it keeps; the internal openapi.json carries it on none. So a
# committed file in which any operation lacks it is the internal document (or
# not one the filter produced), and the build stops instead of publishing it.

set -euo pipefail

OUTPUT_PATH="./static/openapi/openapi.json"

if [ -n "${API_URL:-}" ]; then
  echo "Error: API_URL is set, but fetching the spec is no longer supported." >&2
  echo "/api-json serves the internal document. Commit openapi.public.json instead:" >&2
  echo "  cd apps/backend && npm run openapi:emit" >&2
  echo "  cp openapi.public.json <this-repo>/static/openapi/openapi.json" >&2
  exit 1
fi

if [ ! -f "$OUTPUT_PATH" ]; then
  echo "Error: no committed spec at $OUTPUT_PATH." >&2
  echo "Generate one with 'npm run openapi:emit' in apps/backend and copy openapi.public.json." >&2
  exit 1
fi

# Report what is about to be published, so a stale spec is visible in the
# build log rather than something you discover from the rendered site, and
# refuse anything that is not the public document.
node -e "
  let s;
  try {
    s = require('$OUTPUT_PATH');
  } catch (e) {
    console.error('Error: $OUTPUT_PATH is not readable JSON.');
    process.exit(1);
  }
  const methods = ['get', 'put', 'post', 'delete', 'patch', 'head', 'options'];
  let ops = 0;
  const unmarked = [];
  for (const [path, item] of Object.entries(s.paths || {}))
    for (const m of methods)
      if (item && item[m]) {
        ops += 1;
        if (!Array.isArray(item[m]['x-vremly-required-scopes']))
          unmarked.push(m.toUpperCase() + ' ' + path);
      }
  if (!ops) {
    console.error('Error: $OUTPUT_PATH has no operations.');
    process.exit(1);
  }
  if (unmarked.length) {
    console.error(
      'Error: ' + unmarked.length + ' of ' + ops + ' operations were not produced by the ' +
      'public-surface filter (no x-vremly-required-scopes), e.g. ' + unmarked.slice(0, 3).join(', ') +
      '. This looks like the INTERNAL openapi.json. Copy openapi.public.json instead.');
    process.exit(1);
  }
  console.log('Using committed public OpenAPI spec (' + Object.keys(s.paths).length +
    ' paths, ' + ops + ' operations).');
"
