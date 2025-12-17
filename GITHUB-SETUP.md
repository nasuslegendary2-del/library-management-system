# GitHub Repository Setup Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `library-management-system`
   - **Description**: `Cloud-native Library Management System with Docker, Kubernetes, and CI/CD`
   - **Visibility**: Public (recommended for portfolio)
   - **Initialize**: Do NOT check "Add a README file" (we already have one)
5. Click "Create repository"

## Step 2: Initialize Local Git Repository

Open your terminal in the project directory and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete Library Management System with Docker, K8s, and CI/CD"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/library-management-system.git

# Push to GitHub
git push -u origin main
```

## Step 3: Configure GitHub Secrets (Required for CI/CD)

Go to your repository on GitHub and navigate to:
**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:

### Required Secrets:

1. **DOCKERHUB_USERNAME**

   - Value: Your Docker Hub username
   - Example: `johndoe`

2. **DOCKERHUB_TOKEN**

   - Value: Your Docker Hub access token
   - How to get: Go to Docker Hub → Account Settings → Security → New Access Token

3. **AZURE_CREDENTIALS** (Optional - for AKS deployment)

   - Value: Azure service principal JSON
   - How to get: Run `az ad sp create-for-rbac --sdk-auth` in Azure CLI

4. **AZURE_RESOURCE_GROUP** (Optional - for AKS deployment)

   - Value: Your Azure resource group name
   - Example: `lms-rg`

5. **AKS_CLUSTER_NAME** (Optional - for AKS deployment)
   - Value: Your AKS cluster name
   - Example: `lms-aks-cluster`

## Step 4: Update Docker Hub References

Before pushing, update the Docker Hub username in these files:

1. **Update `.github/workflows/ci-cd.yml`**:

   ```yaml
   env:
     REGISTRY: docker.io
     BACKEND_IMAGE: YOUR_DOCKERHUB_USERNAME/lms-backend
     FRONTEND_IMAGE: YOUR_DOCKERHUB_USERNAME/lms-frontend
   ```

2. **Update `k8s/backend-deployment.yaml` and `k8s/frontend-deployment.yaml`**:
   - The CI/CD pipeline will automatically replace the placeholders
   - No manual changes needed

## Step 5: Test the Setup

After pushing to GitHub:

1. **Check CI/CD Pipeline**:

   - Go to your repository → **Actions** tab
   - You should see the workflow running automatically

2. **Verify Docker Images**:

   - Check your Docker Hub account for the built images

3. **Test Local Deployment**:

   ```bash
   # Test with Docker Compose
   docker-compose up -d

   # Test with containers
   node test-containers.js
   ```

## Step 6: Deploy to Production (Optional)

If you have Azure AKS set up:

```bash
# Make scripts executable
chmod +x deploy/*.sh

# Set your Docker Hub username
export DOCKER_USERNAME="your-dockerhub-username"

# Build and push images
./deploy/docker-build-push.sh

# Deploy to AKS
./deploy/deploy-to-aks.sh

# Test deployment
node deploy/test-aks-deployment.js
```

## Troubleshooting

### Common Issues:

1. **Permission denied on scripts**:

   ```bash
   chmod +x deploy/*.sh
   ```

2. **Docker Hub authentication failed**:

   - Verify your Docker Hub credentials
   - Create a new access token if needed

3. **CI/CD pipeline fails**:

   - Check that all GitHub secrets are configured
   - Verify Docker Hub username in workflow file

4. **AKS deployment fails**:
   - Ensure Azure CLI is installed and logged in
   - Verify AKS cluster exists and is accessible

## Repository Structure

After setup, your repository will contain:

```
library-management-system/
├── .github/workflows/     # CI/CD pipeline
├── deploy/               # Deployment scripts
├── k8s/                  # Kubernetes manifests
├── public/               # Frontend files
├── routes/               # API routes
├── config/               # Configuration
├── database/             # Database schema
├── Dockerfile.backend    # Backend container
├── Dockerfile.frontend   # Frontend container
├── docker-compose.yml    # Local orchestration
├── package.json          # Dependencies
├── server.js            # Main application
├── README.md            # Documentation
└── .gitignore           # Git ignore rules
```

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Configure GitHub Secrets
3. ✅ Test CI/CD pipeline
4. ✅ Deploy to AKS (optional)
5. ✅ Create portfolio documentation
6. ✅ Take screenshots for submission

Your Library Management System is now ready for cloud deployment! 🚀
