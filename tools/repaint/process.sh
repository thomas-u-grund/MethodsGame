#!/bin/bash
# Cut a repaint sheet into figures, clean them (haze + rim light) and grade them to the cast palette.
# Output per figure: new-<n>.png (raw cut), clean-<n>.png, final-<n>.png (the one to install).
#   tools/repaint/process.sh <sheet.png> <dir> name1 name2 ...
set -e
root="$(cd "$(dirname "$0")/../.." && pwd)"; py="$root/.venv-tts/bin/python"
sheet="$1"; dir="$2"; shift 2
"$py" "$root/tools/repaint/cut.py" "$sheet" "$dir" "$@"
for n in "$@"; do
  "$py" "$root/tools/repaint/defringe.py" "$dir/new-$n.png" /tmp/cb-df.png
  "$py" "$root/tools/repaint/derim.py" /tmp/cb-df.png "$dir/clean-$n.png" 12 1.0 >/dev/null
  "$py" "$root/tools/repaint/grade.py" "$dir/clean-$n.png" "$dir/final-$n.png"
done
echo "cleaned: $*"
