#!/bin/bash
# Fetch the latest OpenAPI spec from the backend
SPEC_URL="${API_URL:-https://d2mg6uv6rzxb1j.cloudfront.net}/api-json"
OUTPUT_PATH="./openapi/openapi.json"

mkdir -p "$(dirname "$OUTPUT_PATH")"

echo "Fetching OpenAPI spec from $SPEC_URL..."
HTTP_STATUS=$(curl -s -o "$OUTPUT_PATH.tmp" -w "%{http_code}" "$SPEC_URL" --max-time 15)

if [ "$HTTP_STATUS" = "200" ]; then
  mv "$OUTPUT_PATH.tmp" "$OUTPUT_PATH"
  echo "OpenAPI spec updated successfully."
else
  rm -f "$OUTPUT_PATH.tmp"
  if [ -f "$OUTPUT_PATH" ]; then
    echo "Warning: Could not fetch spec (HTTP $HTTP_STATUS). Using existing committed copy."
  else
    echo "Error: Could not fetch spec and no committed copy exists."
    exit 1
  fi
fi
