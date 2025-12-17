#!/bin/bash

# Cleanup AKS deployment
# This script removes all deployed resources from AKS

set -e

echo "🧹 Cleaning up AKS deployment..."

# Delete all resources
echo "🗑️  Deleting Kubernetes resources..."
kubectl delete -f k8s/ --ignore-not-found=true

# Wait for cleanup
echo "⏳ Waiting for resources to be deleted..."
sleep 10

# Check remaining resources
echo "📋 Checking remaining resources..."
kubectl get all

echo "✅ AKS cleanup complete!"
echo ""
echo "💡 To delete the entire AKS cluster:"
echo "az aks delete --resource-group lms-rg --name lms-aks-cluster"
echo ""
echo "💡 To delete the resource group:"
echo "az group delete --name lms-rg"