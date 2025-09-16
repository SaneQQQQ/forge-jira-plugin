#!/usr/bin/env bash
set -e

APP_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
LOCALES_DIR="$APP_ROOT/locales"
DIFF_FILE="$LOCALES_DIR/i18n-diff.json"
LIBRE_URL="http://localhost:5000/translate"

if ! command -v jq &> /dev/null; then
  echo "jq is required but not installed. Install it first."
  exit 1
fi

translate_string() {
  local text="$1"
  local target="$2"
  if [[ -z "$text" ]]; then
    echo ""
    return
  fi
  curl -s -X POST "$LIBRE_URL" \
       -H "Content-Type: application/json" \
       -d "{\"q\":\"$text\",\"source\":\"en\",\"target\":\"$target\"}" \
       | jq -r '.translatedText'
}

translate_json() {
  local json="$1"
  local target="$2"
  local translated="$json"

  paths=$(jq -r 'paths(scalars) | map(tostring) | join(".")' <<< "$json")
  for path in $paths; do
      orig=$(jq -r ".$path" <<< "$translated")
      trans=$(translate_string "$orig" "$target")
      translated=$(jq --arg v "$trans" ".$path = \$v" <<< "$translated")
  done

  echo "$translated"
}

for FILE in "$LOCALES_DIR"/*.json; do
  BASENAME=$(basename "$FILE")
  if [[ "$BASENAME" != "$(basename "$DIFF_FILE")" ]]; then
    case "$BASENAME" in
      "pt-BR.json") TARGET_LANG="pt-BR" ;;
      "zh-CN.json") TARGET_LANG="zh-Hans" ;;
      "zh-TW.json") TARGET_LANG="zh-Hant" ;;
      "no-NO.json") TARGET_LANG="nb" ;;
      *) TARGET_LANG=$(echo "$BASENAME" | cut -d'-' -f1 | tr '[:upper:]' '[:lower:]') ;;
    esac
    echo "Translating missing keys for $BASENAME (target: $TARGET_LANG)..."

    TRANSLATED_DIFF=$(translate_json "$(cat "$DIFF_FILE")" "$TARGET_LANG")

    if [[ -n "$TRANSLATED_DIFF" && "$TRANSLATED_DIFF" != "null" ]]; then
      jq -s '.[0] * .[1]' "$FILE" <(echo "$TRANSLATED_DIFF") > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"
    else
      echo "No translations generated for $FILE, skipping merge."
    fi
  fi
done

rm -fv "$DIFF_FILE"

echo "All translation files updated with translated missing keys from diff."