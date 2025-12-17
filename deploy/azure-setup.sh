#!/bin/bash

# Azure AKS Setup Script for Library Management System
# This script creates the necessary Azure resources for deployment

set -e

# Configuration
RESOURCE_GROUP="lms-rg"
LOCATION="eastus"
AKS_CLUSTER_NAME="lms-aks-cluster"
NODE_COUNT=2
VM_SIZE="Standard_B2s"

echo "🚀 Setting up Azure AKS for Library Management System..."

# Login to Azure (if not already logged in)
echo "📋 Checking Azure login status..."
if ! az account show &> /dev/null; then
    echo "Please login to Azure:"
    az login
fi

# Create Resource Group
echo "📦 Creating resource group: $RESOURCE_GROUP"
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create AKS Cluster
echo "🎯 Creating AKS cluster: $AKS_CLUSTER_NAME"
az aks create \
    --resource-group $RESOURCE_GROUP \
    --name $AKS_CLUSTER_NAME \
    --node-count $NODE_COUNT \
    --node-vm-size $VM_SIZE \
    --enable-addons monitoring \
    --generate-ssh-keys \
    --enable-managed-identity

# Get AKS credentials
echo "🔑 Getting AKS credentials..."
az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_CLUSTER_NAME

# Verify cluster connection
echo "✅ Verifying cluster connection..."
kubectl get nodes

echo "🎉 Azure AKS setup complete!"
echo ""
echo "📋 Cluster Information:"
echo "Resource Group: $RESOURCE_GROUP"
echo "Cluster Name: $AKS_CLUSTER_NAME"
echo "Location: $LOCATION"
echo ""
echo "🔧 Next steps:"
echo "1. Push your Docker images to Docker Hub"
echo "2. Update the image references in k8s manifests"
echo "3. Deploy using: kubectl apply -f k8s/"