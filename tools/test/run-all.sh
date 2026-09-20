#!/bin/bash
# Run the whole suite. The tests share one headless browser tab, so they need a moment
# between runs to settle -- without the pause the long Act II playthrough intermittently
# starts before the previous navigation has finished.
cd "$(dirname "$0")"
fail=0
for t in test-*.js; do
  printf "%-20s " "$t"
  if node "$t" >/dev/null 2>&1; then echo PASS; else echo FAIL; fail=1; fi
  sleep 2
done
exit $fail
