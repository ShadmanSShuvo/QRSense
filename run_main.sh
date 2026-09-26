#!/bin/bash
# Forwarding script for start.sh
exec "$(dirname "$0")/start.sh" "$@"
