#!/bin/bash
# After a successful test run, remind Claude to apply the mutation-testing skill
# to any changed source files — ensuring tests would catch real bugs, not just execute code.
input=$(cat)
cmd=$(echo "$input" | jq -r '.tool_input.command // empty')
exit_code=$(echo "$input" | jq -r '(.tool_response.exit_code // 1) | tostring')

echo "$cmd" | grep -qE '(pnpm test|jest)' || exit 0
[ "$exit_code" = "0" ] || exit 0

changed=$(git diff --name-only HEAD -- '*.ts' '*.tsx' 2>/dev/null \
  | grep -v '\.test\.' \
  | grep -v '\.spec\.' \
  | grep -v '\.integration\.')
[ -n "$changed" ] || exit 0

echo "Tests passed. Apply the mutation-testing skill to verify test quality for these changed source files:"
echo "$changed"
exit 0
