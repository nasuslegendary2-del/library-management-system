# Azure Secrets Setup for CI/CD

## Your Cluster Information:

- **Resource Group**: `lms-rg`
- **Cluster Name**: `lms-aks-cluster`
- **Region**: `southeastasia`

## Required GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### 1. AZURE_CREDENTIALS

You need to create an Azure Service Principal. Run this in Azure Cloud Shell or where Azure CLI is installed:

```bash
# Get your subscription ID first
az account show --query id --output tsv

# Create service principal (replace YOUR_SUBSCRIPTION_ID with actual ID)
az ad sp create-for-rbac --name "github-actions-lms" --role contributor --scopes /subscriptions/YOUR_SUBSCRIPTION_ID --sdk-auth
```

Copy the entire JSON output and add it as `AZURE_CREDENTIALS` secret.

### 2. AZURE_RESOURCE_GROUP

Value: `lms-rg`

### 3. AKS_CLUSTER_NAME

Value: `lms-aks-cluster`

### 4. DOCKERHUB_USERNAME

Value: `hamzayounis`

### 5. DOCKERHUB_TOKEN

Your Docker Hub access token (already created)

## Quick Setup Steps:

1. **Go to GitHub Repository**: https://github.com/nasuslegendary2-del/library-management-system
2. **Navigate to**: Settings → Secrets and variables → Actions
3. **Add each secret** with exact names above
4. **For AZURE_CREDENTIALS**: Use Azure Cloud Shell at https://shell.azure.com to run the service principal command

## Test the Pipeline:

After adding secrets, push any change to trigger the CI/CD pipeline with AKS deployment!
