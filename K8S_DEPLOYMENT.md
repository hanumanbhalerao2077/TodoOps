# Kubernetes Deployment Guide

Complete guide for deploying TodoOps on Kubernetes for production-ready environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Deployment Steps](#deployment-steps)
- [Verification](#verification)
- [Scaling](#scaling)
- [Monitoring](#monitoring)
- [Updates and Rollbacks](#updates-and-rollbacks)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools

1. **kubectl** - Kubernetes command-line tool
   ```bash
   # Download latest stable version
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   chmod +x kubectl
   sudo mv kubectl /usr/local/bin/
   ```

2. **Kubernetes Cluster** - One of:
   - **Local Development:**
     - Docker Desktop with Kubernetes enabled
     - Minikube: `brew install minikube && minikube start`
     - Kind: `brew install kind && kind create cluster`
   
   - **Cloud Platforms:**
     - AWS EKS
     - Google GKE
     - Azure AKS
     - DigitalOcean Kubernetes

3. **Container Registry** - For storing Docker images:
   - Docker Hub
   - Amazon ECR
   - Google Container Registry
   - Azure Container Registry

### Cluster Requirements

- **Kubernetes Version**: 1.20 or later
- **Resources**: Minimum 2 CPU, 2GB RAM per node
- **Storage**: PersistentVolume support for MongoDB data
- **Network**: Ingress controller installed (for external access)

## Architecture Overview

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Namespace: mern-todo                        │   │
│  │                                                     │   │
│  │  ┌──────────────┐  ┌──────────────────────────┐   │   │
│  │  │   Ingress    │  │   ConfigMap & Secret     │   │   │
│  │  │              │  │  (Env configuration)     │   │   │
│  │  └──────────────┘  └──────────────────────────┘   │   │
│  │         ↓                                          │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │      Service: mern-todo-frontend (3000)     │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │         ↓                                          │   │
│  │  ┌──────────────────┐  ┌──────────────────────┐   │   │
│  │  │  Frontend Pod    │  │  Frontend Pod (HPA)  │   │   │
│  │  │  (Nginx+React)   │  │  (Nginx+React)       │   │   │
│  │  └──────────────────┘  └──────────────────────┘   │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │      Service: mern-todo-backend (5000)      │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │         ↓                                          │   │
│  │  ┌──────────────────┐  ┌──────────────────────┐   │   │
│  │  │  Backend Pod     │  │  Backend Pod (HPA)   │   │   │
│  │  │  (Node.js)       │  │  (Node.js)           │   │   │
│  │  └──────────────────┘  └──────────────────────┘   │   │
│  │         ↓                                          │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │    Service: mern-todo-mongodb (27017)       │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │         ↓                                          │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │    MongoDB StatefulSet with PVC              │  │   │
│  │  │    Data: /data/db (Persistent Storage)       │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                     │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  HPA: Auto-scales based on CPU/Memory        │  │   │
│  │  │  Min replicas: 2, Max replicas: 5            │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Manifest Files

| File | Purpose |
|------|---------|
| `k8s/namespace.yaml` | Creates isolated mern-todo namespace |
| `k8s/configmap.yaml` | Non-sensitive environment configuration |
| `k8s/secret.yaml` | Sensitive data (passwords, API keys) |
| `k8s/deployment-backend.yaml` | Node.js backend deployment |
| `k8s/deployment-frontend.yaml` | React+Nginx frontend deployment |
| `k8s/service-backend.yaml` | Backend service endpoint |
| `k8s/service-frontend.yaml` | Frontend service endpoint |
| `k8s/service-mongodb.yaml` | MongoDB service endpoint |
| `k8s/statefulset-mongodb.yaml` | MongoDB database with persistent storage |
| `k8s/pvc-mongodb.yaml` | Persistent Volume Claim for MongoDB |
| `k8s/ingress.yaml` | External access via Ingress |
| `k8s/hpa-backend.yaml` | Horizontal Pod Autoscaler for backend |
| `k8s/hpa-frontend.yaml` | Horizontal Pod Autoscaler for frontend |
| `k8s/kustomization.yaml` | Kustomize overlay for all manifests |

## Deployment Steps

### Step 1: Prepare Container Images

Push your Docker images to a registry:

```bash
# Build images
docker build -t yourusername/mern-todo-backend:latest server/
docker build -t yourusername/mern-todo-frontend:latest client/

# Login to Docker Hub (or your registry)
docker login

# Push images
docker push yourusername/mern-todo-backend:latest
docker push yourusername/mern-todo-frontend:latest
```

### Step 2: Update Image References

Update `k8s/deployment-backend.yaml` and `k8s/deployment-frontend.yaml`:

```yaml
image: yourusername/mern-todo-backend:latest
imagePullPolicy: Always
```

### Step 3: Configure Secrets and ConfigMap

Edit `k8s/secret.yaml` with your sensitive data:

```bash
# Encode your MongoDB connection string
echo -n "mongodb+srv://user:password@cluster.mongodb.net/tododb" | base64

# Update the secret with the encoded value
kubectl apply -f k8s/secret.yaml
```

Edit `k8s/configmap.yaml` with configuration:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mern-todo-config
  namespace: mern-todo
data:
  NODE_ENV: "production"
  PORT: "5000"
  LOG_LEVEL: "info"
```

### Step 4: Deploy All Resources

Using Kustomize (recommended):
```bash
kubectl apply -k k8s/
```

Or apply individual files:
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/pvc-mongodb.yaml
kubectl apply -f k8s/statefulset-mongodb.yaml
kubectl apply -f k8s/service-mongodb.yaml
kubectl apply -f k8s/deployment-backend.yaml
kubectl apply -f k8s/service-backend.yaml
kubectl apply -f k8s/deployment-frontend.yaml
kubectl apply -f k8s/service-frontend.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa-backend.yaml
kubectl apply -f k8s/hpa-frontend.yaml
```

### Step 5: Verify Deployment

Check namespace creation:
```bash
kubectl get namespace mern-todo
```

Check all resources:
```bash
kubectl get all -n mern-todo
```

Check specific resource types:
```bash
kubectl get deployments -n mern-todo
kubectl get statefulsets -n mern-todo
kubectl get services -n mern-todo
kubectl get pods -n mern-todo
kubectl get pvc -n mern-todo
kubectl get ingress -n mern-todo
kubectl get hpa -n mern-todo
```

## Verification

### Pod Status

```bash
# Watch pods for deployment
kubectl get pods -n mern-todo -w

# Check specific pod details
kubectl describe pod <pod-name> -n mern-todo

# View pod logs
kubectl logs <pod-name> -n mern-todo
kubectl logs -f <pod-name> -n mern-todo  # Follow logs
```

### Service Connectivity

```bash
# Check services
kubectl get svc -n mern-todo

# Test backend connectivity from another pod
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- \
  sh -c 'curl http://mern-todo-backend:5000/' -n mern-todo

# Port-forward to test locally
kubectl port-forward svc/mern-todo-backend 5000:5000 -n mern-todo
curl http://localhost:5000/
```

### Database Connectivity

```bash
# Check MongoDB pod
kubectl get pods -n mern-todo | grep mongodb

# Connect to MongoDB
kubectl exec -it mern-todo-mongodb-0 -n mern-todo -- mongosh

# Inside MongoDB, verify collections
> use tododb
> db.todos.find()
```

### Health Checks

```bash
# Check liveness probe status
kubectl get pod <backend-pod-name> -n mern-todo -o jsonpath='{.status.conditions}'

# Manual health check
kubectl exec <backend-pod-name> -n mern-todo -- curl -f http://localhost:5000/
```

## Scaling

### Manual Scaling

Scale backend to 3 replicas:
```bash
kubectl scale deployment/mern-todo-backend --replicas=3 -n mern-todo
```

Scale frontend to 2 replicas:
```bash
kubectl scale deployment/mern-todo-frontend --replicas=2 -n mern-todo
```

### Horizontal Pod Autoscaler (HPA)

HPA is configured in `k8s/hpa-backend.yaml` and `k8s/hpa-frontend.yaml`:

```bash
# Check HPA status
kubectl get hpa -n mern-todo
kubectl describe hpa mern-todo-backend-hpa -n mern-todo

# View actual metrics (requires metrics-server)
kubectl top pod -n mern-todo
kubectl top nodes
```

### Manual HPA Adjustment

Edit HPA configuration:
```bash
kubectl edit hpa mern-todo-backend-hpa -n mern-todo
```

Change these values:
```yaml
minReplicas: 2        # Minimum pods
maxReplicas: 5        # Maximum pods
targetCPUUtilizationPercentage: 70  # Scale at 70% CPU
```

## Monitoring

### Pod Resource Usage

```bash
# Check CPU and memory usage
kubectl top pods -n mern-todo
kubectl top nodes

# Watch resource usage in real-time
watch 'kubectl top pods -n mern-todo'
```

### Event Monitoring

```bash
# View recent cluster events
kubectl get events -n mern-todo

# Watch events in real-time
kubectl get events -n mern-todo -w
```

### Logs Aggregation

View logs from all pods:
```bash
# Backend logs
kubectl logs -l app=mern-todo-backend -n mern-todo --all-containers=true

# Frontend logs
kubectl logs -l app=mern-todo-frontend -n mern-todo --all-containers=true

# Follow logs in real-time
kubectl logs -l app=mern-todo-backend -n mern-todo -f
```

### Debugging

Get detailed pod information:
```bash
kubectl describe pod <pod-name> -n mern-todo
```

Execute commands in pod:
```bash
kubectl exec -it <pod-name> -n mern-todo -- /bin/sh
```

## Updates and Rollbacks

### Rolling Update

Update deployment image:
```bash
kubectl set image deployment/mern-todo-backend \
  mern-todo-backend=yourusername/mern-todo-backend:v2 \
  -n mern-todo
```

Watch rollout:
```bash
kubectl rollout status deployment/mern-todo-backend -n mern-todo -w
```

### Rollback to Previous Version

Check rollout history:
```bash
kubectl rollout history deployment/mern-todo-backend -n mern-todo
```

Rollback to previous version:
```bash
kubectl rollout undo deployment/mern-todo-backend -n mern-todo
```

Rollback to specific revision:
```bash
kubectl rollout undo deployment/mern-todo-backend -n mern-todo --to-revision=2
```

### Canary Deployment

Deploy new version to one pod:
```bash
kubectl set image deployment/mern-todo-backend \
  mern-todo-backend=yourusername/mern-todo-backend:v2 \
  -n mern-todo --record
```

Monitor before complete rollout:
```bash
kubectl get pods -n mern-todo
kubectl logs -f <new-pod-name> -n mern-todo
```

## Troubleshooting

### Pod Stuck in Pending State

```bash
# Check why pod can't be scheduled
kubectl describe pod <pod-name> -n mern-todo

# Common causes:
# 1. No available resources
kubectl top nodes

# 2. PVC not bound
kubectl get pvc -n mern-todo

# 3. Image pull error
kubectl describe pod <pod-name> -n mern-todo | grep -i 'image'
```

### Image Pull Errors

```bash
# Check image exists in registry
docker pull yourusername/mern-todo-backend:latest

# Update image reference in deployment
kubectl set image deployment/mern-todo-backend \
  mern-todo-backend=yourusername/mern-todo-backend:correct-tag \
  -n mern-todo
```

### MongoDB Connection Issues

```bash
# Check MongoDB pod
kubectl logs -f mern-todo-mongodb-0 -n mern-todo

# Verify PVC binding
kubectl get pvc -n mern-todo

# Check MongoDB service
kubectl get svc mern-todo-mongodb -n mern-todo

# Test from backend pod
kubectl exec -it <backend-pod> -n mern-todo -- \
  curl -v mongodb://mern-todo-mongodb:27017/
```

### Health Check Failures

```bash
# Check liveness probe
kubectl describe pod <pod-name> -n mern-todo | grep -A 10 "Liveness"

# Manual health check
kubectl exec <pod-name> -n mern-todo -- curl -f http://localhost:5000/

# Increase initial delay if service takes time to start
kubectl edit deployment/mern-todo-backend -n mern-todo
# Change initialDelaySeconds to 60
```

### Ingress Not Accessible

```bash
# Check ingress configuration
kubectl describe ingress mern-todo-ingress -n mern-todo

# Verify ingress controller is running
kubectl get pods -n ingress-nginx

# For local development, add to /etc/hosts (Unix/macOS) or hosts file (Windows):
# 127.0.0.1 mern-todo.local

# Test with curl
curl http://mern-todo.local

# Or use port-forward
kubectl port-forward svc/mern-todo-frontend 3000:3000 -n mern-todo
# Visit http://localhost:3000
```

## Advanced Topics

### Resource Quotas

Limit namespace resources:
```bash
kubectl create quota mern-todo-quota \
  --hard=pods=20,requests.cpu=10,requests.memory=20Gi \
  -n mern-todo
```

### Network Policies

Restrict traffic between pods:
```bash
kubectl apply -f k8s/network-policy.yaml
```

### Pod Disruption Budgets

Maintain availability during cluster maintenance:
```bash
kubectl apply -f k8s/pod-disruption-budget.yaml
```

## Best Practices

1. **Always use Kustomize** for manifest management
2. **Enable resource requests/limits** for all containers
3. **Use ConfigMaps** for non-sensitive configuration
4. **Use Secrets** for sensitive data
5. **Set up HPA** for production workloads
6. **Monitor with Prometheus/Grafana** for production
7. **Use namespaces** to isolate environments
8. **Regular backup** of MongoDB data
9. **Use private container registry** for production
10. **Enable RBAC** for security in production

## Next Steps

1. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for multi-environment deployment
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
3. Set up monitoring with Prometheus and Grafana
4. Configure backup strategy for MongoDB data
5. Implement GitOps with ArgoCD or Flux

## References

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [MongoDB Kubernetes Operator](https://github.com/mongodb/mongodb-kubernetes-operator)
- [Helm Charts for MERN Stack](https://artifacthub.io/)
