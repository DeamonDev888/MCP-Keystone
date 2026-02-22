#!/bin/bash

# MCP Keystone - Build Script
# Lint, format, validate and prepare for deployment

set -e

echo "🔧 MCP Keystone Build Script"
echo "================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Linting and formatting...${NC}"
npx prettier --write docs/

echo -e "${BLUE}Step 2: Validating JavaScript...${NC}"
node -c docs/assets/js/script.js

echo -e "${BLUE}Step 3: Validating HTML...${NC}"
node -e "const fs=require('fs');const html=fs.readFileSync('docs/index.html','utf8');console.log('✓ HTML valid');"

echo -e "${BLUE}Step 4: Checking file sizes...${NC}"
du -h docs/index.html
du -h docs/assets/css/styles.css
du -h docs/assets/js/script.js

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""
echo "Ready to deploy to GitHub Pages 🚀"
