# PowerShell script to build and push SARIF Visualizer to Docker Hub
# Usage: .\docker-push.ps1 [version]
# Example: .\docker-push.ps1 1.0.0

param(
    [string]$Version = "latest"
)

$ImageName = "sarifvisualizer"
$DockerHubUser = "mykolaa25"
$DockerHubRepo = "$DockerHubUser/$ImageName"

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "SARIF Visualizer - Docker Hub Push" -ForegroundColor Cyan
Write-Host "Multi-Platform Build (linux/amd64, linux/arm64)" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Docker Login
Write-Host "[1/4] Authenticating with Docker Hub..." -ForegroundColor Yellow
docker login
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker login failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Authentication successful" -ForegroundColor Green
Write-Host ""

# Step 2: Create/use buildx builder
Write-Host "[2/4] Setting up Docker Buildx for multi-platform builds..." -ForegroundColor Yellow
docker buildx create --name multiplatform --use 2>$null
if ($LASTEXITCODE -ne 0) {
    # Builder might already exist, try to use it
    docker buildx use multiplatform 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Using default builder" -ForegroundColor Yellow
    }
}
docker buildx inspect --bootstrap | Out-Null
Write-Host "✅ Buildx ready" -ForegroundColor Green
Write-Host ""

# Step 3: Build and push multi-platform image
Write-Host "[3/4] Building and pushing multi-platform image..." -ForegroundColor Yellow
Write-Host "      Platforms: linux/amd64, linux/arm64" -ForegroundColor Gray
Write-Host "      Tags: $DockerHubRepo`:$Version" -ForegroundColor Gray

$tags = "--tag $DockerHubRepo`:$Version"
if ($Version -ne "latest") {
    Write-Host "             $DockerHubRepo`:latest" -ForegroundColor Gray
    $tags += " --tag $DockerHubRepo`:latest"
}

$buildCmd = "docker buildx build --platform linux/amd64,linux/arm64 $tags --push ."
Invoke-Expression $buildCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Multi-platform build and push failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  1. Make sure Docker Desktop is running" -ForegroundColor White
    Write-Host "  2. Enable 'Use containerd for pulling and storing images' in Docker Desktop settings" -ForegroundColor White
    Write-Host "  3. Try: docker buildx ls" -ForegroundColor White
    exit 1
}
Write-Host "✅ Build and push successful" -ForegroundColor Green
Write-Host ""

# Step 4: Verify
Write-Host "[4/4] Verifying multi-platform manifest..." -ForegroundColor Yellow
docker buildx imagetools inspect "$DockerHubRepo`:$Version" | Select-String "Platform" | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
Write-Host "✅ Multi-platform image verified" -ForegroundColor Green

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "✅ Successfully pushed to Docker Hub!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Image: $DockerHubRepo`:$Version" -ForegroundColor White
Write-Host "Pull command: docker pull $DockerHubRepo`:$Version" -ForegroundColor White
Write-Host "Run command:  docker run -d -p 99:80 --name sarifvisualizer $DockerHubRepo`:$Version" -ForegroundColor White
Write-Host ""
