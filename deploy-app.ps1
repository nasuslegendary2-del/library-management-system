# Deploy Library Management System to AKS
Write-Host "🚀 Deploying Library Management System to AKS..." -ForegroundColor Green

# Add Azure CLI to PATH
$env:PATH += ";C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin"

# Set Docker Hub username
$DOCKER_USERNAME = "nasuslegendary2-del"  # Replace with your actual username
Write-Host "📋 Using Docker Hub username: $DOCKER_USERNAME" -ForegroundColor Yellow

# Update image references in Kubernetes manifests
Write-Host "🔄 Updating image references..." -ForegroundColor Cyan

# Update backend deployment
$backendContent = Get-Content "k8s/backend-deployment.yaml" -Raw
$backendContent = $backendContent -replace "BACKEND_IMAGE_PLACEHOLDER", "$DOCKER_USERNAME/lms-backend:latest"
Set-Content "k8s/backend-deployment.yaml" -Value $backendContent

# Update frontend deployment
$frontendContent = Get-Content "k8s/frontend-deployment.yaml" -Raw
$frontendContent = $frontendContent -replace "FRONTEND_IMAGE_PLACEHOLDER", "$DOCKER_USERNAME/lms-frontend:latest"
Set-Content "k8s/frontend-deployment.yaml" -Value $frontendContent

Write-Host "✅ Image references updated" -ForegroundColor Green

# Deploy to Kubernetes
Write-Host "📦 Deploying to Kubernetes..." -ForegroundColor Cyan

# Deploy in order
Write-Host "1. Creating namespace and secrets..." -ForegroundColor Yellow
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/storage.yaml

Write-Host "2. Deploying database..." -ForegroundColor Yellow
kubectl apply -f k8s/database-deployment.yaml

Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=available --timeout=300s deployment/lms-database

Write-Host "3. Deploying backend..." -ForegroundColor Yellow
kubectl apply -f k8s/backend-deployment.yaml

Write-Host "⏳ Waiting for backend to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=available --timeout=300s deployment/lms-backend

Write-Host "4. Deploying frontend..." -ForegroundColor Yellow
kubectl apply -f k8s/frontend-deployment.yaml

Write-Host "⏳ Waiting for frontend to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=available --timeout=300s deployment/lms-frontend

# Check deployment status
Write-Host "📊 Deployment Status:" -ForegroundColor Green
kubectl get deployments

Write-Host "`n🌐 Services:" -ForegroundColor Green
kubectl get services

# Wait for LoadBalancer IP
Write-Host "`n⏳ Waiting for LoadBalancer IP assignment..." -ForegroundColor Yellow
$attempts = 0
$maxAttempts = 30

do {
    $attempts++
    $externalIP = kubectl get service lms-frontend-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
    
    if ($externalIP -and $externalIP -ne "null" -and $externalIP.Trim() -ne "") {
        break
    }
    
    Write-Host "Waiting for IP assignment... ($attempts/$maxAttempts)" -ForegroundColor Yellow
    Start-Sleep -Seconds 10
} while ($attempts -lt $maxAttempts)

Write-Host "`n🎉 Deployment Complete!" -ForegroundColor Green

if ($externalIP -and $externalIP -ne "null" -and $externalIP.Trim() -ne "") {
    Write-Host "✅ Frontend URL: http://$externalIP" -ForegroundColor Green
    Write-Host "✅ API Health Check: http://$externalIP/health" -ForegroundColor Green
} else {
    Write-Host "⚠️ LoadBalancer IP not yet assigned. Check with: kubectl get services" -ForegroundColor Yellow
}

Write-Host "`n🔍 Useful commands:" -ForegroundColor Cyan
Write-Host "kubectl get pods                    # Check pod status"
Write-Host "kubectl get services                # Check services"
Write-Host "kubectl logs deployment/lms-backend # Check backend logs"
Write-Host "kubectl logs deployment/lms-frontend# Check frontend logs"

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")