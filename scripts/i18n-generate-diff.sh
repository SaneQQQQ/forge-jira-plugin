#!/usr/bin/env bash

APP_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)

EN_FILE="$APP_ROOT/locales/en-US.json"
RU_FILE="$APP_ROOT/locales/ru-RU.json"
DIFF_FILE="$APP_ROOT/locales/i18n-diff.json"

if ! command -v jq &> /dev/null; then
  echo "jq is required but not installed. Install it first."
  exit 1
fi

missing_keys() {
  local EN="$1"
  local RU="$2"
  jq -n --argjson en "$EN" --argjson ru "$RU" '
    def missing($en; $ru):
      reduce ($en | keys_unsorted[]) as $k ({};
        if ($ru | has($k)) then
          if ($en[$k] | type == "object") then
            . + {($k): missing($en[$k]; $ru[$k])}
          else .
          end
        else . + {($k): $en[$k]}
        end
      );
    missing($en; $ru)
  '
}

EN_JSON=$(cat "$EN_FILE")
RU_JSON=$(cat "$RU_FILE")

DIFF_JSON=$(missing_keys "$EN_JSON" "$RU_JSON")

echo "$DIFF_JSON" | jq '.' > "$DIFF_FILE"
echo "Diff saved to $DIFF_FILE"