#!/bin/bash

# Deploy Library Management System to AKS
# This script deploys the complete 3-tier application to Azure Kubernetes Service

set -e

# Configuration
DOCKER_USERNAME=${DOCKER_USERNAME:-"yourusername"}
IMAGE_TAG=${IMAGE_TAG:-"latest"}

echo "🚀 Deploying Library Management System to AKS..."

# Check if kubectl is configured
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ kubectl is not configured. Please run 'az aks get-credentials' first."
    exit 1
fi

# Update image references in manifests
echo "🔄 Updating image references..."
sed -i.bak "s|BACKEND_IMAGE_PLACEHOLDER|${DOCKER_USERNAME}/lms-backend:${IMAGE_TAG}|g" k8s/backend-deployment.yaml
sed -i.bak "s|FRONTEND_IMAGE_PLACEHOLDER|${DOCKER_USERNAME}/lms-frontend:${IMAGE_TAG}|g" k8s/frontend-deployment.yaml

# Deploy to Kubernetes
echo "📦 Deploying to Kubernetes..."

# Apply manifests in order
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/storage.yaml
kubectl apply -f k8s/database-deployment.yaml

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/lms-database

# Deploy backend
kubectl apply -f k8s/backend-deployment.yaml
echo "⏳ Waiting for backend to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/lms-backend

# Deploy frontend
kubectl apply -f k8s/frontend-deployment.yaml
echo "⏳ Waiting for frontend to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/lms-frontend

# Get service information
echo "🌐 Getting service information..."
kubectl get services

# Wait for LoadBalancer IP
echo "⏳ Waiting for LoadBalancer IP assignment..."
for i in {1..30}; do
    EXTERNAL_IP=$(kubectl get service lms-frontend-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    if [ ! -z "$EXTERNAL_IP" ] && [ "$EXTERNAL_IP" != "null" ]; then
        break
    fi
    echo "Waiting for IP assignment... ($i/30)"
    sleep 10
done

# Display deployment results
echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Deployment Status:"
kubectl get deployments
echo ""
echo "🌐 Services:"
kubectl get services
echo ""

if [ ! -z "$EXTERNAL_IP" ] && [ "$EXTERNAL_IP" != "null" ]; then
    echo "✅ Frontend URL: http://$EXTERNAL_IP"
    echo "✅ API Health Check: http://$EXTERNAL_IP/health"
else
    echo "⚠️  LoadBalancer IP not yet assigned. Check with: kubectl get services"
fi

echo ""
echo "🔍 To monitor the deployment:"
echo "kubectl get pods"
echo "kubectl logs -f deployment/lms-backend"
echo "kubectl logs -f deployment/lms-frontend"