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
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Docker Login
Write-Host "[1/5] Authenticating with Docker Hub..." -ForegroundColor Yellow
docker login
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker login failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Authentication successful" -ForegroundColor Green
Write-Host ""

# Step 2: Build the image
Write-Host "[2/5] Building Docker image..." -ForegroundColor Yellow
docker build -t $ImageName .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Step 3: Tag with version
Write-Host "[3/5] Tagging image as $DockerHubRepo`:$Version..." -ForegroundColor Yellow
docker tag $ImageName "$DockerHubRepo`:$Version"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker tag failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Tagged successfully" -ForegroundColor Green
Write-Host ""

# Step 4: Tag as latest (if version is not 'latest')
if ($Version -ne "latest") {
    Write-Host "[4/5] Tagging image as $DockerHubRepo`:latest..." -ForegroundColor Yellow
    docker tag $ImageName "$DockerHubRepo`:latest"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️  Failed to tag as latest (continuing...)" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Tagged as latest" -ForegroundColor Green
    }
    Write-Host ""
} else {
    Write-Host "[4/5] Skipping additional 'latest' tag (already tagged)" -ForegroundColor Gray
    Write-Host ""
}

# Step 5: Push to Docker Hub
Write-Host "[5/5] Pushing to Docker Hub..." -ForegroundColor Yellow
docker push "$DockerHubRepo`:$Version"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker push failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Pushed $DockerHubRepo`:$Version" -ForegroundColor Green

# Push latest tag if it was created
if ($Version -ne "latest") {
    Write-Host "      Pushing latest tag..." -ForegroundColor Yellow
    docker push "$DockerHubRepo`:latest"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Pushed $DockerHubRepo`:latest" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host "✅ Successfully pushed to Docker Hub!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Image: $DockerHubRepo`:$Version" -ForegroundColor White
Write-Host "Pull command: docker pull $DockerHubRepo`:$Version" -ForegroundColor White
Write-Host "Run command:  docker run -d -p 99:80 --name sarifvisualizer $DockerHubRepo`:$Version" -ForegroundColor White
Write-Host ""
