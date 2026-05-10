# Troubleshooting Guide

Common issues and solutions for TodoOps development and deployment.

## Table of Contents

- [Local Development Issues](#local-development-issues)
- [Docker & Docker Compose Issues](#docker--docker-compose-issues)
- [Kubernetes Issues](#kubernetes-issues)
- [Database Issues](#database-issues)
- [Network Issues](#network-issues)
- [Build and Deployment Issues](#build-and-deployment-issues)

## Local Development Issues

### npm install Fails

**Error:** `npm ERR! code ERESOLVE` or dependency conflicts

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove package-lock.json and node_modules
rm -rf node_modules package-lock.json

# Install dependencies again
npm install

# For dependency conflicts, use legacy peer deps
npm install --legacy-peer-deps
```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**

Windows:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the number)
taskkill /PID <PID> /F
```

macOS/Linux:
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
lsof -ti:5000 | xargs kill -9

# Or use fuser
fuser -k 5000/tcp
```

### Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Verify node_modules exists
ls -la node_modules

# If missing, reinstall
npm install

# Check package.json for typos
cat package.json | grep '"express"'
```

### Environment Variables Not Loading

**Error:** `undefined` for `process.env.MONGODB_ATLAS_CONNECTION`

**Solution:**
```bash
# Verify .env file exists
ls -la .env

# Check environment variables are loaded
node -e "console.log(process.env.MONGODB_ATLAS_CONNECTION)"

# For local development, use dotenv-flow as configured
# Ensure .env file is in server directory
```

## Docker & Docker Compose Issues

### Docker Daemon Not Running

**Error:** `Cannot connect to Docker daemon`

**Solution:**

Windows:
- Open Docker Desktop application
- Wait for Docker icon in system tray to be stable

macOS:
```bash
# Start Docker
open /Applications/Docker.app

# Or restart if already running
pkill -SIGHUP -f /Applications/Docker.app/Contents/MacOS/Docker
```

Linux:
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Permission Denied on Docker

**Error:** `docker: permission denied while trying to connect to Docker daemon`

**Solution:**

Linux:
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Apply group changes
newgrp docker

# Verify
docker run hello-world
```

### Docker Image Build Fails

**Error:** Build fails with `COPY` or file not found

**Solution:**
```bash
# Check working directory
pwd

# Verify Dockerfile and context
ls -la Dockerfile
docker build -t app:latest .

# Check Docker daemon version
docker version

# Try building with verbose output
DOCKER_BUILDKIT=0 docker build -t app:latest .
```

### Docker Compose Services Won't Start

**Error:** `docker-compose up` fails for services

**Solution:**
```bash
# Check compose file syntax
docker-compose config

# View detailed logs
docker-compose logs -f

# Rebuild without cache
docker-compose build --no-cache
docker-compose up

# Check resource constraints
docker stats

# Increase Docker resources if needed
# Windows/macOS: Docker Desktop > Preferences > Resources
```

### MongoDB Container Fails to Start

**Error:** `mongo:latest` container exits immediately

**Solution:**
```bash
# Check logs
docker logs mongodb

# Verify volume permissions
ls -la k8s/mongodb-data/

# Try with volume removed
docker rm mongodb
docker volume rm mern-todo_mongodb-data

# Rebuild and restart
docker-compose down
docker-compose up --build
```

### Container Health Check Failures

**Error:** `container is unhealthy`

**Solution:**
```bash
# Check health status
docker ps | grep -E 'UNHEALTHY|HEALTHY'

# View health check details
docker inspect <container-name> | grep -A 10 '"Health"'

# Test health endpoint manually
docker exec <container-name> curl http://localhost:5000/

# Increase timeouts in docker-compose.yml
# Change healthcheck: start_period from 10s to 30s
```

## Kubernetes Issues

### kubectl Connection Failed

**Error:** `Unable to connect to the server`

**Solution:**
```bash
# Check kubeconfig
echo $KUBECONFIG
export KUBECONFIG=~/.kube/config

# Verify cluster is running
kubectl cluster-info

# For Docker Desktop, enable Kubernetes
# Settings > Kubernetes > Enable Kubernetes

# Check context
kubectl config current-context
kubectl config get-contexts

# Switch context
kubectl config use-context docker-desktop
```

### Pod Stuck in Pending State

**Error:** Pod doesn't transition to Running

**Solution:**
```bash
# Check pod details
kubectl describe pod <pod-name> -n mern-todo

# Common causes and solutions:
# 1. Insufficient resources
kubectl top nodes
kubectl describe nodes

# 2. PVC not bound
kubectl get pvc -n mern-todo

# 3. Image pull error
kubectl describe pod <pod-name> -n mern-todo | grep -i image

# 4. Resource quotas exceeded
kubectl describe quota -n mern-todo
```

### ImagePullBackOff Error

**Error:** Cannot pull container image

**Solution:**
```bash
# Verify image exists in registry
docker pull yourusername/mern-todo-backend:latest

# Check image reference
kubectl describe pod <pod-name> -n mern-todo | grep Image:

# Update image in deployment
kubectl set image deployment/mern-todo-backend \
  mern-todo-backend=yourusername/mern-todo-backend:latest \
  -n mern-todo

# Create image pull secret if private registry
kubectl create secret docker-registry regcred \
  --docker-server=<registry> \
  --docker-username=<username> \
  --docker-password=<password> \
  -n mern-todo
```

### Service Not Accessible

**Error:** Cannot reach service via IP or DNS

**Solution:**
```bash
# Check service
kubectl get svc -n mern-todo
kubectl describe svc mern-todo-backend -n mern-todo

# Test DNS resolution from pod
kubectl run -it --rm debug --image=busybox --restart=Never -- \
  nslookup mern-todo-backend.mern-todo.svc.cluster.local

# Test connectivity
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- \
  curl http://mern-todo-backend:5000/

# Port-forward for local testing
kubectl port-forward svc/mern-todo-backend 5000:5000 -n mern-todo
```

### Persistent Volume Claim Not Bound

**Error:** PVC remains in Pending state

**Solution:**
```bash
# Check PVC
kubectl get pvc -n mern-todo
kubectl describe pvc mongodb-pvc -n mern-todo

# Check available PVs
kubectl get pv
kubectl describe pv <pv-name>

# For local development, create PV manually
kubectl apply -f k8s/pv-mongodb.yaml

# Check storage class
kubectl get storageclass
```

## Database Issues

### MongoDB Connection Refused

**Error:** `connect ECONNREFUSED 127.0.0.1:27017`

**Solution:**
```bash
# Check MongoDB is running
docker ps | grep mongodb

# For local MongoDB
mongosh
# If mongosh not available, install:
# npm install -g mongosh

# Check connection string
echo $MONGODB_ATLAS_CONNECTION

# Test connection
mongosh --eval "db.adminCommand('ping')"

# For Docker container
docker exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### Database Locked or Corruption

**Error:** `E11000 duplicate key error` or write errors

**Solution:**
```bash
# Backup current data
docker exec mongodb mongodump --archive --gzip > backup.archive.gz

# Connect to MongoDB
docker exec -it mongodb mongosh

# In MongoDB shell:
> use tododb
> db.todos.find()
> db.todos.deleteMany({})  # Clear if corrupted

# Restart MongoDB container
docker restart mongodb
```

### Slow Queries

**Error:** Application response times are slow

**Solution:**
```bash
# Check MongoDB profiling
mongosh
> use tododb
> db.setProfilingLevel(1, { slowms: 100 })
> db.system.profile.find().sort({ ts: -1 }).pretty()

# Add indexes
db.todos.createIndex({ createdAt: -1 })
db.todos.createIndex({ userId: 1 })

# Check query plan
db.todos.find({ completed: true }).explain('executionStats')
```

## Network Issues

### Cross-Origin Request (CORS) Blocked

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
```bash
# Check CORS configuration in server/index.js
# Should have: app.use(cors());

# Verify origin matches
# Frontend: http://localhost:3000
# Backend: http://localhost:5000

# For development, CORS should be enabled for all origins
# For production, specify allowed origins:
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### Connection Timeout

**Error:** `request timeout after 30s`

**Solution:**
```bash
# Check if service is running
curl -v http://localhost:5000/

# Check network connectivity
ping localhost
telnet localhost 5000

# Increase timeout in client code
const response = await fetch(url, {
  timeout: 60000  // 60 seconds
});

# Check for blocking firewall
# Windows: Check Windows Defender Firewall
# macOS: Check System Preferences > Security & Privacy
# Linux: Check iptables rules
```

### DNS Resolution Failed

**Error:** `getaddrinfo ENOTFOUND mongodb`

**Solution:**
```bash
# For Docker Compose, ensure services are named correctly
# Use service name as hostname: mongodb:27017

# For Kubernetes, use full DNS name
# Service: mern-todo-mongodb.mern-todo.svc.cluster.local

# Check DNS from pod
kubectl exec -it <pod-name> -n mern-todo -- nslookup mern-todo-mongodb

# Verify service name
kubectl get svc -n mern-todo | grep mongodb
```

## Build and Deployment Issues

### GitHub Actions Workflow Fails

**Error:** Workflow fails in CI/CD pipeline

**Solution:**
```bash
# Check workflow file syntax
# Use GitHub YAML validator or yamllint

# View workflow logs in GitHub Actions tab
# Settings > Actions > View workflow runs

# Common issues:
# - Incorrect secret names
# - Missing permissions
# - Syntax errors in YAML

# Retry workflow
# Click "Re-run jobs" in GitHub Actions
```

### Docker Image Build Takes Too Long

**Error:** Build times exceed expected time

**Solution:**
```bash
# Check build cache
docker buildx du

# Clear build cache
docker buildx prune

# Use BuildKit for faster builds
DOCKER_BUILDKIT=1 docker build -t app:latest .

# Optimize Dockerfile
# - Put frequently changing lines last
# - Combine RUN commands to reduce layers
# - Use .dockerignore to exclude files
```

### Deployment Fails Due to Image Size

**Error:** `image too large` or upload timeout

**Solution:**
```bash
# Check image size
docker images | grep mern-todo

# Use .dockerignore to exclude files
# Add: node_modules, .git, .env, .next, coverage

# Use multi-stage builds (already configured)

# Compress image
docker run <image> | gzip > image.tar.gz

# Use minimal base images
# Current: node:18-alpine (good choice)
# Alternative: node:18-slim
```

## Still Having Issues?

1. **Check Logs**
   - Application logs
   - Container logs
   - Kubernetes logs
   - GitHub Actions logs

2. **Search Documentation**
   - [DEPLOYMENT.md](./DEPLOYMENT.md)
   - [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
   - [K8S_DEPLOYMENT.md](./K8S_DEPLOYMENT.md)

3. **Check GitHub Issues**
   - Search for similar issues
   - Create new issue with:
     - Error message
     - Steps to reproduce
     - OS and version
     - Logs output

4. **Ask for Help**
   - Create GitHub Discussion
   - Include detailed error information
   - Provide relevant configuration files
