#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Building Defund Fascists Chrome Extension...${NC}"

# Check if zip command exists
if ! command -v zip &> /dev/null; then
    echo "Error: zip command not found. Please install zip."
    exit 1
fi

# Clean any existing build
rm -f defundfascists.zip

# Create the zip file
zip -r defundfascists.zip \
    manifest.json \
    *.js \
    *.html \
    *.css \
    images/ \
    .github/ISSUE_TEMPLATE/ \
    docs/ \
    LICENSE \
    README.md \
    flagged_companies.json \
    -x "*.DS_Store"

# Check if zip was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Build successful!${NC}"
    echo -e "Package created: ${YELLOW}defundfascists.zip${NC}"
    echo -e "Size: $(du -h defundfascists.zip | cut -f1)"
    echo ""
    echo -e "To install in Chrome:"
    echo -e "1. Go to ${YELLOW}chrome://extensions/${NC}"
    echo -e "2. Enable ${YELLOW}Developer mode${NC} (toggle in top-right corner)"
    echo -e "3. Drag and drop ${YELLOW}defundfascists.zip${NC} into the browser window"
else
    echo "Error: Failed to create zip file."
    exit 1
fi 