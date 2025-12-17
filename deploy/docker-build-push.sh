#!/bin/bash

# Build and push Docker images to Docker Hub
# This script builds both frontend and backend images and pushes them to Docker Hub

set -e

# Configuration
DOCKER_USERNAME=${DOCKER_USERNAME:-"yourusername"}
IMAGE_TAG=${IMAGE_TAG:-"latest"}

echo "🐳 Building and pushing Docker images..."

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Login to Docker Hub
echo "🔑 Logging into Docker Hub..."
if [ -z "$DOCKER_PASSWORD" ]; then
    echo "Please enter your Docker Hub password:"
    docker login -u "$DOCKER_USERNAME"
else
    echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
fi

# Build backend image
echo "🏗️  Building backend image..."
docker build -f Dockerfile.backend -t "${DOCKER_USERNAME}/lms-backend:${IMAGE_TAG}" .

# Build frontend image
echo "🏗️  Building frontend image..."
docker build -f Dockerfile.frontend -t "${DOCKER_USERNAME}/lms-frontend:${IMAGE_TAG}" .

# Push backend image
echo "📤 Pushing backend image..."
docker push "${DOCKER_USERNAME}/lms-backend:${IMAGE_TAG}"

# Push frontend image
echo "📤 Pushing frontend image..."
docker push "${DOCKER_USERNAME}/lms-frontend:${IMAGE_TAG}"

echo "✅ Docker images built and pushed successfully!"
echo ""
echo "📋 Images pushed:"
echo "- ${DOCKER_USERNAME}/lms-backend:${IMAGE_TAG}"
echo "- ${DOCKER_USERNAME}/lms-frontend:${IMAGE_TAG}"
echo ""
echo "🔧 Next step: Deploy to AKS using deploy-to-aks.sh"