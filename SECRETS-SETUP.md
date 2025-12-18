# GitHub Secrets Setup

## Required Secrets (5 total)

Add these to: GitHub Repository → Settings → Secrets and variables → Actions

1. **AZURE_CREDENTIALS** - The JSON from Azure CLI
2. **AZURE_RESOURCE_GROUP** - Value: lms-rg
3. **AKS_CLUSTER_NAME** - Value: lms-aks-cluster
4. **DOCKERHUB_USERNAME** - Value: hamzayounis
5. **DOCKERHUB_TOKEN** - Your Docker Hub token

## After Adding Secrets

Push any change to trigger the full CI/CD pipeline with AKS deployment!
