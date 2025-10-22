#!/bin/bash
# Bash script to build and push SARIF Visualizer to Docker Hub
# Usage: ./docker-push.sh [version]
# Example: ./docker-push.sh 1.0.0

set -e  # Exit on error

VERSION="${1:-latest}"
IMAGE_NAME="sarifvisualizer"
DOCKERHUB_USER="mykolaa25"
DOCKERHUB_REPO="$DOCKERHUB_USER/$IMAGE_NAME"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}===================================${NC}"
echo -e "${CYAN}SARIF Visualizer - Docker Hub Push${NC}"
echo -e "${CYAN}===================================${NC}"
echo ""

# Step 1: Docker Login
echo -e "${YELLOW}[1/5] Authenticating with Docker Hub...${NC}"
if docker login; then
    echo -e "${GREEN}✅ Authentication successful${NC}"
else
    echo -e "${RED}❌ Docker login failed!${NC}"
    exit 1
fi
echo ""

# Step 2: Build the image
echo -e "${YELLOW}[2/5] Building Docker image...${NC}"
if docker build -t "$IMAGE_NAME" .; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Docker build failed!${NC}"
    exit 1
fi
echo ""

# Step 3: Tag with version
echo -e "${YELLOW}[3/5] Tagging image as $DOCKERHUB_REPO:$VERSION...${NC}"
if docker tag "$IMAGE_NAME" "$DOCKERHUB_REPO:$VERSION"; then
    echo -e "${GREEN}✅ Tagged successfully${NC}"
else
    echo -e "${RED}❌ Docker tag failed!${NC}"
    exit 1
fi
echo ""

# Step 4: Tag as latest (if version is not 'latest')
if [ "$VERSION" != "latest" ]; then
    echo -e "${YELLOW}[4/5] Tagging image as $DOCKERHUB_REPO:latest...${NC}"
    if docker tag "$IMAGE_NAME" "$DOCKERHUB_REPO:latest"; then
        echo -e "${GREEN}✅ Tagged as latest${NC}"
    else
        echo -e "${YELLOW}⚠️  Failed to tag as latest (continuing...)${NC}"
    fi
else
    echo -e "${GRAY}[4/5] Skipping additional 'latest' tag (already tagged)${NC}"
fi
echo ""

# Step 5: Push to Docker Hub
echo -e "${YELLOW}[5/5] Pushing to Docker Hub...${NC}"
if docker push "$DOCKERHUB_REPO:$VERSION"; then
    echo -e "${GREEN}✅ Pushed $DOCKERHUB_REPO:$VERSION${NC}"
else
    echo -e "${RED}❌ Docker push failed!${NC}"
    exit 1
fi

# Push latest tag if it was created
if [ "$VERSION" != "latest" ]; then
    echo -e "${YELLOW}      Pushing latest tag...${NC}"
    if docker push "$DOCKERHUB_REPO:latest"; then
        echo -e "${GREEN}✅ Pushed $DOCKERHUB_REPO:latest${NC}"
    fi
fi

echo ""
echo -e "${CYAN}===================================${NC}"
echo -e "${GREEN}✅ Successfully pushed to Docker Hub!${NC}"
echo -e "${CYAN}===================================${NC}"
echo ""
echo -e "${NC}Image: $DOCKERHUB_REPO:$VERSION${NC}"
echo -e "${NC}Pull command: docker pull $DOCKERHUB_REPO:$VERSION${NC}"
echo -e "${NC}Run command:  docker run -d -p 99:80 --name sarifvisualizer $DOCKERHUB_REPO:$VERSION${NC}"
echo ""
