#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:3443}"

ROUTES=(
  "/"
  "/features"
  "/extension"
  "/app"
  "/app/source-docs"
  "/app/settings"
)

echo "Running route smoke checks against ${BASE_URL}"

for route in "${ROUTES[@]}"; do
  code="$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${route}")"
  if [[ "${code}" != "200" ]]; then
    echo "Route check failed: ${route} returned ${code}"
    exit 1
  fi
  echo "Route OK: ${route}"
done

echo "Smoke checks passed"
