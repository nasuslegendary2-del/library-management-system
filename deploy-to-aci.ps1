# Deploy Library Management System to Azure Container Instances (ACI)
# This is an alternative to AKS that works with Azure for Students

Write-Host "🚀 Deploying Library Management System to Azure Container Instances..." -ForegroundColor Green

# Add Azure CLI to PATH
$env:PATH += ";C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin"

# Set variables
$RESOURCE_GROUP = "lms-rg"
$LOCATION = "eastus"
$DOCKER_USERNAME = "nasuslegendary2-del"  # Replace with your actual username

Write-Host "📋 Using Docker Hub username: $DOCKER_USERNAME" -ForegroundColor Yellow

# Create container instances
Write-Host "📦 Creating container instances..." -ForegroundColor Cyan

# Deploy backend container
Write-Host "1. Deploying backend container..." -ForegroundColor Yellow
az container create `
  --resource-group $RESOURCE_GROUP `
  --name lms-backend `
  --image "$DOCKER_USERNAME/lms-backend:latest" `
  --dns-name-label "lms-backend-$(Get-Random)" `
  --ports 3000 `
  --environment-variables `
    PORT=3000 `
    DB_HOST=localhost `
    DB_PORT=5432 `
    DB_NAME=library_db `
    DB_USER=postgres `
    DB_PASSWORD=password `
  --cpu 1 `
  --memory 1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create backend container" -ForegroundColor Red
    exit 1
}

# Deploy frontend container
Write-Host "2. Deploying frontend container..." -ForegroundColor Yellow
az container create `
  --resource-group $RESOURCE_GROUP `
  --name lms-frontend `
  --image "$DOCKER_USERNAME/lms-frontend:latest" `
  --dns-name-label "lms-frontend-$(Get-Random)" `
  --ports 80 `
  --cpu 1 `
  --memory 1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create frontend container" -ForegroundColor Red
    exit 1
}

# Get container information
Write-Host "📊 Container Status:" -ForegroundColor Green
az container list --resource-group $RESOURCE_GROUP --output table

# Get frontend URL
Write-Host "`n🌐 Getting frontend URL..." -ForegroundColor Cyan
$frontendFQDN = az container show --resource-group $RESOURCE_GROUP --name lms-frontend --query "ipAddress.fqdn" --output tsv

if ($frontendFQDN) {
    Write-Host "`n🎉 Deployment Complete!" -ForegroundColor Green
    Write-Host "✅ Frontend URL: http://$frontendFQDN" -ForegroundColor Green
    Write-Host "✅ Try accessing your Library Management System!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Could not get frontend URL. Check container status." -ForegroundColor Yellow
}

# Get backend URL
$backendFQDN = az container show --resource-group $RESOURCE_GROUP --name lms-backend --query "ipAddress.fqdn" --output tsv
if ($backendFQDN) {
    Write-Host "✅ Backend URL: http://$backendFQDN`:3000" -ForegroundColor Green
    Write-Host "✅ API Health: http://$backendFQDN`:3000/health" -ForegroundColor Green
}

Write-Host "`n🔍 Useful commands:" -ForegroundColor Cyan
Write-Host "az container list --resource-group $RESOURCE_GROUP --output table"
Write-Host "az container logs --resource-group $RESOURCE_GROUP --name lms-backend"
Write-Host "az container logs --resource-group $RESOURCE_GROUP --name lms-frontend"

Write-Host "`n💡 Note: This deployment uses Azure Container Instances instead of AKS" -ForegroundColor Yellow
Write-Host "This still demonstrates containerization and cloud deployment for your project!" -ForegroundColor Yellow

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")