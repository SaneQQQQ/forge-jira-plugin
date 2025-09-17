#!/usr/bin/env bash
set -euo pipefail

docker pull libretranslate/libretranslate:latest
docker run -d --rm --name libretranslate -p 5000:5000 libretranslate/libretranslate:latest

for i in {1..60}; do
  echo "Attempt $i/60: checking if LibreTranslate is up..."

  if curl -s -X GET "http://localhost:5000/frontend/settings" -H "accept: application/json" >/dev/null; then
    echo "LibreTranslate is ready on http://localhost:5000"
    exit 0
  fi

  sleep 10
done

echo "ERROR: LibreTranslate did not start in time."
exit 1