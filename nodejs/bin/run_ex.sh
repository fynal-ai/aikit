#!/bin/bash

# Check if the prefix argument is provided
if [ -z "$1" ]; then
  echo "Error: No prefix provided."
  echo "Usage: $0 <prefix>"
  exit 1
fi

SCRIPT_DIR=$(dirname "$0")
PRJ_HOME=$(cd "$SCRIPT_DIR/.." && pwd)
cd "${PRJ_HOME}" || exit
#npx tsc -p ./tsconfig_examples.json
pnpm run build
# Get the prefix from the first argument
PREFIX=$1

# Define the folder to search in
FOLDER="${PRJ_HOME}/build/examples"

rm -f "${FOLDER:?}/*"

# Find files that match the criteria
FILES=$(find "$FOLDER" -type f -name "${PREFIX}_*.js")

# Check if any files are found
if [ -z "$FILES" ]; then
  echo "Error: No files found with prefix '${PREFIX}_' and suffix '.js' in folder '$FOLDER'."
  exit 1
else
  echo "Found files:"
  echo "$FILES"

  # Run each found .js file with node
  for FILE in $FILES; do
    echo "Running $FILE with node..."
    node "$FILE"
  done
fi

