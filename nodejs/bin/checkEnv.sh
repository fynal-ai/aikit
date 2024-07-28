#!/bin/bash

# Array of environment variable names to check
VARS=("MY_VAR1" "MY_VAR2" "MY_VAR3")

# Loop through each variable and check if it is set
for VAR in "${VARS[@]}"; do
  [ -z "${!VAR}" ] && echo "Error: Variable '$VAR' is not set." && exit 1 || echo "Variable '$VAR' is set to '${!VAR}'."
done

echo "All variables are set."

