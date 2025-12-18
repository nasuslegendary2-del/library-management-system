@echo off
echo 🚀 Setting up Azure AKS for Library Management System
echo.

REM Add Azure CLI to PATH
set PATH=%PATH%;C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin

echo 📋 Step 1: Verify Azure login
az account show
if errorlevel 1 (
    echo ❌ Not logged in to Azure
    echo Please run: az login
    echo Then run this script again
    pause
    exit /b 1
)

echo ✅ Azure login verified
echo.

echo 📦 Step 2: Creating resource group...
az group create --name lms-rg --location eastus
if errorlevel 1 (
    echo ❌ Failed to create resource group
    pause
    exit /b 1
)

echo ✅ Resource group created
echo.

echo 🎯 Step 3: Creating AKS cluster (this takes 5-10 minutes)...
echo Please wait...
az aks create ^
  --resource-group lms-rg ^
  --name lms-aks-cluster ^
  --node-count 2 ^
  --node-vm-size Standard_B2s ^
  --enable-addons monitoring ^
  --generate-ssh-keys ^
  --enable-managed-identity

if errorlevel 1 (
    echo ❌ Failed to create AKS cluster
    pause
    exit /b 1
)

echo ✅ AKS cluster created successfully!
echo.

echo 🔑 Step 4: Getting cluster credentials...
az aks get-credentials --resource-group lms-rg --name lms-aks-cluster

if errorlevel 1 (
    echo ❌ Failed to get cluster credentials
    pause
    exit /b 1
)

echo ✅ Cluster credentials configured
echo.

echo 🧪 Step 5: Testing connection...
kubectl get nodes

echo.
echo 🎉 AKS setup complete!
echo.
echo 📋 Next steps:
echo 1. Update Docker image references in k8s files
echo 2. Deploy application: kubectl apply -f k8s/
echo 3. Check services: kubectl get services
echo.
pause