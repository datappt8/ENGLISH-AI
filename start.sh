#!/bin/bash

# English Quest - Cross-platform Startup Script
# This script starts both frontend and backend development servers

set -e

echo "=================================="
echo "English Quest - Starting Development Servers"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${RED}Error: Dependencies not installed${NC}"
    echo "Please run ./install.sh first"
    exit 1
fi

echo -e "${GREEN}Starting development servers...${NC}"
echo -e "${BLUE}Frontend: http://localhost:5173${NC}"
echo -e "${BLUE}Backend: http://localhost:3000${NC}"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start both servers using npm-run-all
npm run dev
