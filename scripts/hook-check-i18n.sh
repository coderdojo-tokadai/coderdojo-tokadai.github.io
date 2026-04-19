#!/usr/bin/env bash
# PostToolUse hook: runs check-i18n.py when an HTML or i18n.js file is edited.
# Outputs JSON with additionalContext if issues are found.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"

# Read stdin JSON to get the file path
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('file_path','') or d.get('tool_response',{}).get('filePath',''))" 2>/dev/null)

# Only run for .html and i18n.js files
case "$FILE_PATH" in
  *.html|*/i18n.js|*i18n.js) ;;
  *) exit 0 ;;
esac

# Run the check script
OUTPUT=$(python3 "$SCRIPT_DIR/check-i18n.py" 2>/dev/null)
EXIT_CODE=$?

# Only inject context if there are issues
if [ $EXIT_CODE -ne 0 ] && [ -n "$OUTPUT" ]; then
  FNAME=$(basename "$FILE_PATH")
  python3 -c "
import sys, json
output = sys.argv[1]
fname = sys.argv[2]
print(json.dumps({
  'hookSpecificOutput': {
    'hookEventName': 'PostToolUse',
    'additionalContext': 'i18n check (triggered by editing ' + fname + '):\n' + output
  }
}))
" "$OUTPUT" "$FNAME"
fi
