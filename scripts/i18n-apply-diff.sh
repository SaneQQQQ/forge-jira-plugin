#!/usr/bin/env bash
set -e

APP_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
LOCALES_DIR="$APP_ROOT/locales"
DIFF_FILE="$LOCALES_DIR/i18n-diff.json"
LIBRE_URL="https://libretranslate.com/translate"

if ! command -v jq &> /dev/null; then
  echo "jq is required but not installed. Install it first."
  exit 1
fi

# Translate a single string using LibreTranslate
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

# Recursively translate all strings in JSON
translate_json() {
  local json="$1"
  local target="$2"
  local translated="$json"

  # Use jq to get all string paths
  jq -r 'paths(scalars) | map(tostring) | join(".")' <<< "$json" | while read path; do
    # Get original string
    orig=$(jq -r ".$path" <<< "$translated")
    # Translate string
    trans=$(translate_string "$orig" "$target")
    # Replace value in JSON
    translated=$(jq --arg v "$trans" ".$path = \$v" <<< "$translated")
  done

  echo "$translated"
}

# Iterate over all translation files
for FILE in "$LOCALES_DIR"/*.json; do
  BASENAME=$(basename "$FILE")
  if [[ "$BASENAME" != "en-US.json" && "$BASENAME" != "$(basename "$DIFF_FILE")" ]]; then
    TARGET_LANG=$(echo "$BASENAME" | cut -d'-' -f1 | tr '[:upper:]' '[:lower:]')
    echo "Translating missing keys for $BASENAME (target: $TARGET_LANG)..."

    TRANSLATED_DIFF=$(translate_json "$(cat "$DIFF_FILE")" "$TARGET_LANG")

    # Merge translated diff into existing locale
    jq -s '.[0] * .[1]' "$FILE" <(echo "$TRANSLATED_DIFF") > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"
  fi
done

echo "All translation files updated with translated missing keys from diff."