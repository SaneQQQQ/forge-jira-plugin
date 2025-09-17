#!/usr/bin/env bash
set -euo pipefail

APP_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
BASE_EN_PATH="locales/default/en-US.json"
EN_FILE="$APP_ROOT/locales/default/en-US.json"
DIFF_FILE="$APP_ROOT/locales/default/i18n-diff.json"

if ! command -v jq &> /dev/null; then
  echo "jq is required but not installed. Install it first."
  exit 1
fi

TMP_BASE_EN="$(mktemp)"
git fetch origin main --quiet || true
if git show "origin/main:$BASE_EN_PATH" > "$TMP_BASE_EN" 2>/dev/null; then
  echo "Loaded base $BASE_EN_PATH from origin/main"
else
  echo "{}" > "$TMP_BASE_EN"
  echo "File $BASE_EN_PATH not found in origin/main — treating base as empty."
  exit 1
fi

generate_diff() {
  jq -n --slurpfile cur "$EN_FILE" --slurpfile base "$TMP_BASE_EN" '
    # walk_diff: produce an object that contains only keys that are new or changed
    def walk_diff($cur; $base):
      reduce ($cur | keys_unsorted[]) as $k ({};
        if ($cur[$k] | type == "object") then
          if ($base | has($k)) then
            . + { ($k): walk_diff($cur[$k]; $base[$k]) }
          else
            . + { ($k): $cur[$k] }
          end
        else
          if ($base | has($k)) then
            if ($cur[$k] == $base[$k]) then
              . + { ($k): {} }
            else
              . + { ($k): $cur[$k] }
            end
          else
            . + { ($k): $cur[$k] }
          end
        end
      );

    walk_diff($cur[0]; $base[0])
  '
}

echo "Generate i18n-diff.json file..."
DIFF_JSON=$(generate_diff)

echo "$DIFF_JSON" | jq '.' > "$DIFF_FILE"
echo "Diff saved to $DIFF_FILE"

scalars_count=$(jq '[.. | scalars] | length' "$DIFF_FILE")

deleted_count=$(comm -23 \
  <(jq -r 'paths(scalars) | map(tostring) | join(".")' "$TMP_BASE_EN" | sort -u) \
  <(jq -r 'paths(scalars) | map(tostring) | join(".")' "$EN_FILE" | sort -u) \
  | sed '/^\s*$/d' | wc -l | tr -d '[:space:]')

if [[ "${scalars_count:-0}" -gt 0 || "${deleted_count:-0}" -gt 0 ]]; then
  echo "Diff contains translations or structural differences (new/changed strings: $scalars_count, deleted keys: $deleted_count)."
  [[ -n "${GITHUB_OUTPUT:-}" ]] && echo "empty=false" >> $GITHUB_OUTPUT
else
  echo "Diff has no translations and no structural differences."
  [[ -n "${GITHUB_OUTPUT:-}" ]] && echo "empty=true" >> $GITHUB_OUTPUT
fi

rm -f "$TMP_BASE_EN"