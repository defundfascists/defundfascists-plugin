#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Creating new release of Defund Fascists extension...${NC}"

# Get version from package.json
VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[:space:]')
COMMIT_COUNT=$(git rev-list --count HEAD)
BUILD_VERSION="$VERSION.$COMMIT_COUNT"

echo -e "Building version: ${YELLOW}$BUILD_VERSION${NC}"

# Build the extension package
./build.sh

# Rename the zip file to include version
cp defundfascists.zip defundfascists-$BUILD_VERSION.zip

# Create release notes
echo "Generating release notes..."
LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
if [ -z "$LATEST_TAG" ]; then
  echo "No previous tags found, using all commits for changelog"
  CHANGES=$(git log --pretty=format:"* %s" | head -10)
else
  echo "Using changes since $LATEST_TAG for changelog"
  CHANGES=$(git log --pretty=format:"* %s" $LATEST_TAG..HEAD | head -10)
fi

# Create release using GitHub CLI
echo -e "Creating GitHub release ${YELLOW}v$BUILD_VERSION${NC}..."
gh release create "v$BUILD_VERSION" \
  --title "Release v$BUILD_VERSION" \
  --notes "## What's New
$CHANGES

## Installation
Download the ZIP file and load it as an unpacked extension in Chrome" \
  defundfascists-$BUILD_VERSION.zip

# Cleanup
rm defundfascists-$BUILD_VERSION.zip

# Check if release was successful
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Release v$BUILD_VERSION successfully created!${NC}"
else
  echo -e "Failed to create release."
  exit 1
fi 