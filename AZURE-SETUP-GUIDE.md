# Azure AKS Setup Guide

## ✅ Step 1: Tools Installed

- ✅ Azure CLI installed and working
- ✅ kubectl installed
- ✅ Ready to proceed!

## 📋 Step 2: Azure Login

**Run this command and follow the browser authentication:**

```powershell
az login
```

**What happens:**

1. Browser window opens
2. Sign in with your Azure account (or create free account)
3. Return to PowerShell when done

## 📋 Step 3: Create AKS Cluster

**Set variables:**

```powershell
$RESOURCE_GROUP = "lms-rg"
$LOCATION = "eastus"
$AKS_CLUSTER_NAME = "lms-aks-cluster"
```

**Create resource group:**

```powershell
az group create --name $RESOURCE_GROUP --location $LOCATION
```

**Create AKS cluster (takes 5-10 minutes):**

```powershell
az aks create `
  --resource-group $RESOURCE_GROUP `
  --name $AKS_CLUSTER_NAME `
  --node-count 2 `
  --node-vm-size Standard_B2s `
  --enable-addons monitoring `
  --generate-ssh-keys `
  --enable-managed-identity
```

## 📋 Step 4: Connect to Cluster

**Get cluster credentials:**

```powershell
az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_CLUSTER_NAME
```

**Verify connection:**

```powershell
kubectl get nodes
```

## 📋 Step 5: Deploy Application

**Update image references (replace YOUR_USERNAME):**

```powershell
# Update backend deployment
(Get-Content k8s/backend-deployment.yaml) -replace 'BACKEND_IMAGE_PLACEHOLDER', 'YOUR_USERNAME/lms-backend:latest' | Set-Content k8s/backend-deployment.yaml

# Update frontend deployment
(Get-Content k8s/frontend-deployment.yaml) -replace 'FRONTEND_IMAGE_PLACEHOLDER', 'YOUR_USERNAME/lms-frontend:latest' | Set-Content k8s/frontend-deployment.yaml
```

**Deploy to Kubernetes:**

```powershell
# Deploy all resources
kubectl apply -f k8s/

# Check deployment status
kubectl get deployments
kubectl get services
kubectl get pods
```

## 📋 Step 6: Get Public IP

**Wait for LoadBalancer IP (takes 2-5 minutes):**

```powershell
kubectl get service lms-frontend-service
```

**Once you have EXTERNAL-IP, access your app:**

- Frontend: `http://EXTERNAL-IP`
- API: `http://EXTERNAL-IP/health`

## 🚨 Troubleshooting

**Check pod status:**

```powershell
kubectl get pods
kubectl describe pods
```

**Check logs:**

```powershell
kubectl logs deployment/lms-backend
kubectl logs deployment/lms-frontend
```

**Delete deployment (if needed):**

```powershell
kubectl delete -f k8s/
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

## 💰 Cost Management

**Free tier includes:**

- 750 hours of B1S virtual machines (enough for this project)
- AKS cluster management is free

**To avoid charges:**

- Delete resources when done: `az group delete --name lms-rg`
- Monitor usage in Azure portal

## 🎯 Expected Results

After successful deployment:

- ✅ 3 deployments running (database, backend, frontend)
- ✅ Public IP assigned to frontend service
- ✅ Application accessible via browser
- ✅ All grading requirements met for Section C (Kubernetes)
