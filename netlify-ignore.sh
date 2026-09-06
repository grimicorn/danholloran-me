#!/bin/bash
# Exit 0 = skip build, exit 1 = proceed with build.
# Skips the build only when the diff was computed successfully AND every
# changed file is a .md with "draft: true" in its frontmatter. Any failure or
# ambiguity in computing the diff (shallow clone, first commit, squash, etc.)
# fails safe and builds — we'd rather build unnecessarily than silently skip
# a real deploy.

diff_stderr_file=$(mktemp)
changed_files=$(git diff --name-only HEAD^ HEAD 2>"$diff_stderr_file")
diff_exit_code=$?
diff_stderr=$(cat "$diff_stderr_file")
rm -f "$diff_stderr_file"

if [ "$diff_exit_code" -ne 0 ]; then
  echo "Could not compute diff (git diff exited $diff_exit_code: $diff_stderr) — proceeding with build."
  exit 1
fi

if [ -z "$changed_files" ]; then
  echo "Diff computed successfully but no changed files were reported — proceeding with build."
  exit 1
fi

while IFS= read -r file; do
  if [[ "$file" != *.md ]]; then
    echo "Non-markdown file changed: $file — proceeding with build."
    exit 1
  fi

  if [ ! -f "$file" ]; then
    echo "Markdown file deleted: $file — proceeding with build."
    exit 1
  fi

  if ! grep -qE "^draft:\s*true\s*$" "$file"; then
    echo "Non-draft markdown file changed: $file — proceeding with build."
    exit 1
  fi
done <<< "$changed_files"

echo "Only draft markdown files changed — skipping build."
exit 0
