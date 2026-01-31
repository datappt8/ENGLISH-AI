#!/bin/bash

# English Quest - Cross-platform Installation Script
# This script installs dependencies for all modules

set -e

echo "=================================="
echo "English Quest - Installation"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js (>=18.0.0) from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js version must be >= 18.0.0${NC}"
    echo "Current version: $(node -v)"
    exit 1
fi

echo -e "${GREEN}Node.js version: $(node -v)${NC}"
echo -e "${GREEN}NPM version: $(npm -v)${NC}"
echo ""

# Function to install dependencies
install_module() {
    local module_name=$1
    local module_path=$2
    
    echo -e "${BLUE}Installing $module_name dependencies...${NC}"
    cd "$module_path"
    npm install
    cd - > /dev/null
    echo -e "${GREEN}$module_name dependencies installed successfully!${NC}"
    echo ""
}

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Install root dependencies
echo -e "${BLUE}Installing root dependencies...${NC}"
npm install
echo -e "${GREEN}Root dependencies installed successfully!${NC}"
echo ""

# Install frontend dependencies
if [ -d "frontend" ]; then
    install_module "Frontend" "$SCRIPT_DIR/frontend"
else
    echo -e "${RED}Warning: frontend directory not found${NC}"
fi

# Install backend dependencies
if [ -d "backend" ]; then
    install_module "Backend" "$SCRIPT_DIR/backend"
else
    echo -e "${RED}Warning: backend directory not found${NC}"
fi

echo "=================================="
echo -e "${GREEN}Installation completed successfully!${NC}"
echo "=================================="
echo ""
echo "Next steps:"
echo "  1. Copy .env.example to .env in frontend and backend directories"
echo "  2. Configure your environment variables"
echo "  3. Run 'npm run dev' to start development servers"
echo ""
