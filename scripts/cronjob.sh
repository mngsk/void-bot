#!/bin/sh

# configuration
clone_url=https://github.com/void-linux/void-packages.git
data_dir=/path/to/data/dir
repo_dir="$data_dir/repo"
lastrun_file="$data_dir/lastrun"
base_dir=/path/to/base/dir
notify_script="$base_dir/commit-parser.js"

# directory validations
if [ ! -d "$data_dir" ]; then
  mkdir -p "$data_dir"
fi
if [ ! -d "$repo_dir" ]; then
  git clone --quiet --depth 10 "$clone_url" "$repo_dir"
fi

# date calculations
current_date=$(date +%s)
if [ -f "$lastrun_file" ]; then
  read -r lastrun < "$lastrun_file"
else
  # five minutes ago
  lastrun=$((current_date - 300))
fi
echo "$current_date" > "$lastrun_file"

# get latest commits
cd "$repo_dir"
git pull --quiet
log=$(git log --since="$lastrun" --pretty=format:"%s")

if [ ! -z "$log" ]; then
  echo "$log" | node "$notify_script"
fi
