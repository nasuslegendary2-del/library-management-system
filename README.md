# Library Management System

A cloud-native Library Management System built with Node.js, Express, PostgreSQL, and deployed on Azure Kubernetes Service (AKS).

## Features

- **Books Management**: Add, view, and track book availability
- **User Management**: Register and manage library users
- **Borrowing System**: Borrow and return books with real-time availability tracking
- **Cloud-Native**: Containerized with Docker and orchestrated with Kubernetes
- **CI/CD Pipeline**: Automated testing, building, and deployment with GitHub Actions

## Architecture

- **Frontend**: HTML/CSS/JavaScript served by Nginx
- **Backend**: Node.js/Express REST API
- **Database**: PostgreSQL with persistent storage
- **Container Orchestration**: Docker Compose (local) / Kubernetes (production)
- **CI/CD**: GitHub Actions with Docker Hub registry

## Quick Start

### Local Development (Docker Compose)

```bash
# Clone the repository
git clone <repository-url>
cd library-management-system

# Start all services
docker-compose up -d

# Access the application
open http://localhost
```

### Local Development (SQLite)

```bash
# Install dependencies
npm install

# Start with SQLite database
npm run dev-sqlite

# Access the application
open http://localhost:3000
```

## API Endpoints

- `GET /api/books` - Get all books
- `POST /api/books` - Add a new book
- `GET /api/users` - Get all users
- `POST /api/users` - Register a new user
- `GET /api/borrowings` - Get borrowing history
- `POST /api/borrowings` - Borrow a book
- `PUT /api/borrowings/:id` - Return a book

## Deployment

### Prerequisites

- Docker Hub account
- Azure subscription with AKS cluster
- GitHub repository with secrets configured

### GitHub Secrets Required

```
DOCKERHUB_USERNAME=<your-dockerhub-username>
DOCKERHUB_TOKEN=<your-dockerhub-token>
AZURE_CREDENTIALS=<azure-service-principal-json>
AZURE_RESOURCE_GROUP=<your-resource-group>
AKS_CLUSTER_NAME=<your-aks-cluster-name>
```

### CI/CD Pipeline

The GitHub Actions pipeline automatically:

1. **Build & Test**: Installs dependencies, runs tests, builds Docker images
2. **Push Images**: Pushes images to Docker Hub registry
3. **Deploy to AKS**: Deploys to Azure Kubernetes Service with LoadBalancer

## Project Structure

```
├── .github/workflows/     # CI/CD pipeline
├── k8s/                  # Kubernetes manifests
├── public/               # Frontend files
├── routes/               # API routes
├── config/               # Database configuration
├── database/             # Database schema
├── Dockerfile.backend    # Backend container
├── Dockerfile.frontend   # Frontend container
├── docker-compose.yml    # Local orchestration
└── server.js            # Application entry point
```

## Testing

```bash
# Test local application
node test-api.js

# Test containerized application
node test-containers.js

# Run CI/CD pipeline tests
npm test
```

## License

MIT License
