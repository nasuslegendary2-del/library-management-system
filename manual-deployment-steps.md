# Manual AKS Deployment Steps

## Step 1: Update Image References

Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username:

```bash
# Update backend deployment
sed -i 's|BACKEND_IMAGE_PLACEHOLDER|YOUR_DOCKERHUB_USERNAME/lms-backend:latest|g' k8s/backend-deployment.yaml

# Update frontend deployment
sed -i 's|FRONTEND_IMAGE_PLACEHOLDER|YOUR_DOCKERHUB_USERNAME/lms-frontend:latest|g' k8s/frontend-deployment.yaml
```

## Step 2: Deploy Infrastructure

```bash
# Create namespace and basic resources
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/storage.yaml
```

## Step 3: Deploy Database

```bash
# Deploy PostgreSQL database
kubectl apply -f k8s/database-deployment.yaml

# Wait for database to be ready
kubectl wait --for=condition=available --timeout=300s deployment/lms-database
```

## Step 4: Deploy Backend

```bash
# Deploy backend API
kubectl apply -f k8s/backend-deployment.yaml

# Wait for backend to be ready
kubectl wait --for=condition=available --timeout=300s deployment/lms-backend
```

## Step 5: Deploy Frontend

```bash
# Deploy frontend web server
kubectl apply -f k8s/frontend-deployment.yaml

# Wait for frontend to be ready
kubectl wait --for=condition=available --timeout=300s deployment/lms-frontend
```

## Step 6: Check Deployment

```bash
# Check all deployments
kubectl get deployments

# Check services
kubectl get services

# Check pods
kubectl get pods
```

## Step 7: Get Public IP

```bash
# Get the LoadBalancer IP (may take a few minutes)
kubectl get service lms-frontend-service

# Once you have the EXTERNAL-IP, access your app at:
# http://EXTERNAL-IP
```

## Troubleshooting Commands

```bash
# Check pod logs
kubectl logs deployment/lms-backend
kubectl logs deployment/lms-frontend
kubectl logs deployment/lms-database

# Describe services
kubectl describe service lms-frontend-service

# Check pod details
kubectl describe pods
```
