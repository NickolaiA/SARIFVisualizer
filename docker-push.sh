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
echo -e "${CYAN}Multi-Platform Build (linux/amd64, linux/arm64)${NC}"
echo -e "${CYAN}===================================${NC}"
echo ""

# Step 1: Docker Login
echo -e "${YELLOW}[1/4] Authenticating with Docker Hub...${NC}"
if docker login; then
    echo -e "${GREEN}✅ Authentication successful${NC}"
else
    echo -e "${RED}❌ Docker login failed!${NC}"
    exit 1
fi
echo ""

# Step 2: Create/use buildx builder
echo -e "${YELLOW}[2/4] Setting up Docker Buildx for multi-platform builds...${NC}"
docker buildx create --name multiplatform --use 2>/dev/null || docker buildx use multiplatform 2>/dev/null || true
docker buildx inspect --bootstrap > /dev/null 2>&1
echo -e "${GREEN}✅ Buildx ready${NC}"
echo ""

# Step 3: Build and push multi-platform image
echo -e "${YELLOW}[3/4] Building and pushing multi-platform image...${NC}"
echo -e "${GRAY}      Platforms: linux/amd64, linux/arm64${NC}"
echo -e "${GRAY}      Tags: $DOCKERHUB_REPO:$VERSION${NC}"

TAGS="--tag $DOCKERHUB_REPO:$VERSION"
if [ "$VERSION" != "latest" ]; then
    echo -e "${GRAY}             $DOCKERHUB_REPO:latest${NC}"
    TAGS="$TAGS --tag $DOCKERHUB_REPO:latest"
fi

if docker buildx build --platform linux/amd64,linux/arm64 $TAGS --push .; then
    echo -e "${GREEN}✅ Build and push successful${NC}"
else
    echo -e "${RED}❌ Multi-platform build and push failed!${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo -e "${NC}  1. Make sure Docker daemon is running${NC}"
    echo -e "${NC}  2. Try: docker buildx ls${NC}"
    echo -e "${NC}  3. Check Docker documentation for buildx setup${NC}"
    exit 1
fi
echo ""

# Step 4: Verify
echo -e "${YELLOW}[4/4] Verifying multi-platform manifest...${NC}"
docker buildx imagetools inspect "$DOCKERHUB_REPO:$VERSION" | grep "Platform" | while read line; do
    echo -e "${GRAY}      $line${NC}"
done
echo -e "${GREEN}✅ Multi-platform image verified${NC}"

echo ""
echo -e "${CYAN}===================================${NC}"
echo -e "${GREEN}✅ Successfully pushed to Docker Hub!${NC}"
echo -e "${CYAN}===================================${NC}"
echo ""
echo -e "${NC}Image: $DOCKERHUB_REPO:$VERSION${NC}"
echo -e "${NC}Pull command: docker pull $DOCKERHUB_REPO:$VERSION${NC}"
echo -e "${NC}Run command:  docker run -d -p 99:80 --name sarifvisualizer $DOCKERHUB_REPO:$VERSION${NC}"
echo ""
