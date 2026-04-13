#!/usr/bin/env bash
# Build and start the Mushaf production server on all network interfaces.
# Usage: bash scripts/start.sh [port]

set -euo pipefail

PORT="${1:-3000}"
cd "$(dirname "$0")/.."

echo "Building..."
npm run build

echo ""
echo "Killing anything on port $PORT..."
npx kill-port "$PORT" 2>/dev/null || true

echo ""
echo "Starting production server on port $PORT..."
npm run start -- --hostname 0.0.0.0 --port "$PORT"
