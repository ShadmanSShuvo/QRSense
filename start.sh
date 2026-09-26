#!/bin/bash

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
    echo ""
    echo "Stopping servers..."

    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi

    wait "$BACKEND_PID" 2>/dev/null || true

    echo "Servers stopped."
}

trap cleanup INT TERM EXIT

# Start backend
echo "Starting backend..."
cd "$ROOT_DIR/backend"

# Automatically find uvicorn in local venv, user venv, or system path
if [ -d "$ROOT_DIR/backend/venv" ] && [ -f "$ROOT_DIR/backend/venv/bin/uvicorn" ]; then
    UVICORN_BIN="$ROOT_DIR/backend/venv/bin/uvicorn"
elif command -v uvicorn >/dev/null 2>&1; then
    UVICORN_BIN="uvicorn"
else
    UVICORN_BIN="python3 -m uvicorn"
fi

$UVICORN_BIN app:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend..."
cd "$ROOT_DIR/frontend"

npm run dev
