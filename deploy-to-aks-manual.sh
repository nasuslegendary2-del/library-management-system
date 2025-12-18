#!/bin/bash

# Manual AKS Deployment Script
# Run this after setting up AKS cluster

echo "🚀 Deploying Library Management System to AKS..."

# Set your Docker Hub username here
DOCKER_USERNAME="nasuslegendary2-del"  # Replace with your actual username

echo "📋 Using Docker Hub username: $DOCKER_USERNAME"

# Update image references in Kubernetes manifests
echo "🔄 Updating image references..."
sed -i.bak "s|BACKEND_IMAGE_PLACEHOLDER|${DOCKER_USERNAME}/lms-backend:latest|g" k8s/backend-deployment.yaml
sed -i.bak "s|FRONTEND_IMAGE_PLACEHOLDER|${DOCKER_USERNAME}/lms-frontend:latest|g" k8s/frontend-deployment.yaml

# Deploy to Kubernetes in order
echo "📦 Deploying to Kubernetes..."

# 1. Create namespace and secrets
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/storage.yaml

# 2. Deploy database first
echo "🗄️ Deploying database..."
kubectl apply -f k8s/database-deployment.yaml

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/lms-database

# 3. Deploy backend
echo "🔧 Deploying backend..."
kubectl apply -f k8s/backend-deployment.yaml

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/lms-backend

# 4. Deploy frontend
echo "🌐 Deploying frontend..."
kubectl apply -f k8s/frontend-deployment.yaml

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/lms-frontend

# Get service information
echo "📊 Deployment Status:"
kubectl get deployments
echo ""
echo "🌐 Services:"
kubectl get services
echo ""

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

echo ""
echo "🎉 Deployment Complete!"
echo ""
if [ ! -z "$EXTERNAL_IP" ] && [ "$EXTERNAL_IP" != "null" ]; then
    echo "✅ Frontend URL: http://$EXTERNAL_IP"
    echo "✅ API Health Check: http://$EXTERNAL_IP/health"
else
    echo "⚠️ LoadBalancer IP not yet assigned. Check with: kubectl get services"
fi

echo ""
echo "🔍 Useful commands:"
echo "kubectl get pods                    # Check pod status"
echo "kubectl get services                # Check services"
echo "kubectl logs deployment/lms-backend # Check backend logs"
echo "kubectl logs deployment/lms-frontend# Check frontend logs"