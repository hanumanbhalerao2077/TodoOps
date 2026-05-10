# Deployment Guide for TodoOps

This guide provides comprehensive instructions for deploying the TodoOps MERN application across different environments.

## Table of Contents

- [Local Development](#local-development)
- [Docker Compose Deployment](#docker-compose-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

## Local Development

### Prerequisites

- Node.js 16+ and npm
- MongoDB local instance or MongoDB Atlas account
- Git

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/hanumanbhalerao2077/TodoOps.git
   cd TodoOps
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   cd ..
   ```

3. Set up environment variables:
   ```bash
   # Copy example env files
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   
   # Edit .env files with your configuration
   ```

4. Start the development servers:
   ```bash
   # Terminal 1: Start client (from client directory)
   npm run dev
   
   # Terminal 2: Start server (from server directory)
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:5173 (Vite)
   - Backend API: http://localhost:5000

## Docker Compose Deployment

Docker Compose provides a containerized development environment with all services (MongoDB, Node.js API, React frontend).

### Prerequisites

- Docker Desktop installed and running
- At least 2GB available RAM
- Ports 3000, 5000, 27017 available

### Quick Start

1. Build and start all services:
   ```bash
   docker compose up --build
   ```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

3. View logs:
   ```bash
   docker compose logs -f
   ```

4. Stop services:
   ```bash
   docker compose down
   ```

### Service Health Checks

Each service includes health checks configured in `docker-compose.yml`:

- **Backend**: Health endpoint at `GET http://localhost:5000/`
- **Frontend**: Health check via HTTP status code
- **MongoDB**: Successful connection verification

### Common Issues

#### Port 5000 Already in Use
```bash
# Find and kill process using port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# For macOS/Linux
lsof -ti:5000 | xargs kill -9
```

#### MongoDB Connection Issues
```bash
# Check MongoDB container logs
docker compose logs mongodb

# Verify MongoDB is running
docker exec mongodb mongosh --eval "db.adminCommand('ping')"
```

#### Cannot pull image
```bash
# Log in to Docker Hub if needed
docker login

# Retry the compose command
docker compose pull
docker compose up --build
```

## Kubernetes Deployment

Kubernetes allows you to deploy TodoOps in a production-ready, scalable environment.

### Prerequisites

- Kubernetes cluster (local or cloud)
  - Local options: Docker Desktop Kubernetes, Minikube, Kind
  - Cloud options: AWS EKS, Google GKE, Azure AKS
- `kubectl` command-line tool installed and configured
- Docker images pushed to a container registry (Docker Hub, ECR, etc.)

### Quick Start

1. Deploy all resources:
   ```bash
   kubectl apply -k k8s/
   ```

2. Verify deployment:
   ```bash
   kubectl get all -n mern-todo
   kubectl get pvc -n mern-todo
   kubectl get ingress -n mern-todo
   ```

3. Access the application:
   - Port-forward method:
     ```bash
     kubectl port-forward svc/mern-todo-frontend 3000:3000 -n mern-todo
     ```
   - Then visit: http://localhost:3000

4. Monitor the deployment:
   ```bash
   kubectl get pods -n mern-todo -w
   kubectl describe pod <pod-name> -n mern-todo
   kubectl logs <pod-name> -n mern-todo
   ```

### Scaling

Scale the backend replicas:
```bash
kubectl scale deployment/mern-todo-backend --replicas=3 -n mern-todo
```

### Checking Horizontal Pod Autoscaler (HPA)

```bash
kubectl get hpa -n mern-todo
kubectl top pod -n mern-todo
```

### Cleanup

Remove all Kubernetes resources:
```bash
kubectl delete namespace mern-todo
```

## Environment Configuration

### Server Environment Variables

Create `server/.env`:
```env
# Database
MONGODB_ATLAS_CONNECTION=mongodb+srv://user:password@cluster.mongodb.net/tododb

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Client Environment Variables

Create `client/.env`:
```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_ENV=development
```

### Docker Compose Environment

Variables are set in `docker-compose.yml`. Update the `environment` sections for:
- MongoDB credentials
- API connection strings
- Frontend API endpoints

### Kubernetes Configuration

Environment variables are managed via:
- `ConfigMap`: Non-sensitive configuration (`k8s/configmap.yaml`)
- `Secret`: Sensitive data like passwords (`k8s/secret.yaml`)

Update these files before deploying to production.

## Troubleshooting

### Docker Compose Issues

**Service fails to start:**
```bash
# View detailed logs
docker compose logs <service-name>

# Rebuild without cache
docker compose build --no-cache
docker compose up
```

**Permission denied errors:**
```bash
# On Unix/macOS, ensure proper permissions
sudo usermod -aG docker $USER
# Log out and log back in
```

### Kubernetes Issues

**Pod stuck in pending state:**
```bash
kubectl describe pod <pod-name> -n mern-todo
kubectl top nodes
```

**MongoDB connection issues in K8s:**
```bash
# Check MongoDB pod logs
kubectl logs -f mern-todo-mongodb-0 -n mern-todo

# Verify PVC is bound
kubectl get pvc -n mern-todo
```

**Ingress not working:**
```bash
# Check ingress controller
kubectl get ingress -n mern-todo
kubectl describe ingress mern-todo-ingress -n mern-todo

# Verify DNS entry in /etc/hosts (127.0.0.1 mern-todo.local)
```

### Health Check Debugging

**Backend health check failing:**
```bash
# Test health endpoint from within container
kubectl exec -it <pod-name> -n mern-todo -- curl http://localhost:5000/

# Check backend logs
kubectl logs -f <pod-name> -n mern-todo
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [MERN Stack Guide](https://www.mongodb.com/languages/mern-stack)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## Support

For issues or questions, please:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review container/pod logs
3. Open an issue on the repository
