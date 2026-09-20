#!/bin/bash
# Run the whole suite. The tests share one headless browser tab, so they need a moment
# between runs to settle. The game file is large now, so a fresh navigation takes a moment;
# without the pause the long playthrough tests intermittently start before the previous
# navigation has finished and fail on a button that has not rendered yet.
cd "$(dirname "$0")"
fail=0
for t in test-*.js; do
  printf "%-20s " "$t"
  if node "$t" >/dev/null 2>&1; then echo PASS; else echo FAIL; fail=1; fi
  sleep 5
done
exit $fail
