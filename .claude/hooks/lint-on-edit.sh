#!/bin/bash
# Auto-lint TypeScript/JavaScript files after Claude edits them.
input=$(cat)
file=$(echo "$input" | jq -r '.tool_input.file_path // empty')
[[ "$file" =~ \.(ts|tsx|js|jsx)$ ]] || exit 0
pnpm exec eslint --fix "$file" 2>/dev/null || true
exit 0
