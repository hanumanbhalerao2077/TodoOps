# Kubernetes Deployment for MERN-Todo

## Current Project Status

### What has been done so far
- The project is now fully runnable in two modes:
  - Docker Compose for local development and testing.
  - Kubernetes for production-like, scalable deployment.
- Added Docker containerization for both backend and frontend:
  - `server/Dockerfile` created and improved for a lean `node:18-alpine` build.
  - `client/Dockerfile` created as a multi-stage build; final stage uses `nginx` to serve optimized React assets.
  - `client/nginx.conf` added for SPA routing and caching.
- Created environment support and deployment orchestration:
  - `docker-compose.yml` created to run `mongo`, `backend`, and `frontend` together.
  - Backend service configured to connect to MongoDB using Docker service host names.
  - Frontend configured to call backend via internal Compose service host.
- Verified the Docker Compose workflow locally:
  - `docker-compose up -d` runs successfully.
  - Backend returns HTTP `200` on `http://localhost:5000`.
  - Frontend health endpoint returns HTTP `200` on `http://localhost:3000/health`.
  - API endpoint `http://localhost:5000/api/get` returns valid JSON (`[]`).
- Built Kubernetes deployment manifests under `k8s/`:
  - Namespace, ConfigMap, Secret, PVC, Deployments, Services, Ingress, and HPA manifests created.
  - `k8s/kustomization.yaml` prepared for `kubectl apply -k .`.
- Installed `kubectl` client support locally by downloading `kubectl.exe` to the repository root and verified the client binary works.

### Why these changes were made
- Dockerfiles and Compose orchestrate the MERN app reliably in a local dev container environment.
- Kubernetes manifests are required to deploy the same stack onto a cluster.
- Health checks and service connectivity were validated so the app can start and talk to MongoDB.
- Downloading `kubectl` is the prerequisite to manage and apply Kubernetes manifests from this machine.

### What is still pending
- A working Kubernetes cluster and active `kubectl` context are not yet available in this environment.
- The manifests need to be applied to a cluster using `kubectl apply -k .`.
- If using local Docker Desktop Kubernetes, the Kubernetes feature must be enabled in Docker Desktop.
- If using Minikube/Kind, one of those tools must be installed and a cluster created.
- The frontend ingress or service access method must be validated once the cluster is running.

## Remaining work and step-by-step completion plan

### 1. Enable or install a local Kubernetes cluster
- Option A: Docker Desktop Kubernetes
  1. Open Docker Desktop.
  2. Enable Kubernetes in Settings > Kubernetes.
  3. Wait for Kubernetes to become ready.
- Option B: Minikube
  1. Install Minikube (download from https://minikube.sigs.k8s.io/docs/start/).
  2. Run `minikube start`.
- Option C: Kind
  1. Install Kind (download from https://kind.sigs.k8s.io/).
  2. Run `kind create cluster`.

### 2. Confirm `kubectl` and cluster connectivity
```powershell
cd C:\Users\IK\MERN-Todo
.\kubectl.exe version --client
.\kubectl.exe config current-context
.\kubectl.exe get nodes
```

### 3. Deploy the Kubernetes manifests
```powershell
cd C:\Users\IK\MERN-Todo\k8s
..\kubectl.exe apply -k .
```

### 4. Verify the deployment
```powershell
..\kubectl.exe get all -n mern-todo
..\kubectl.exe get pvc -n mern-todo
..\kubectl.exe get ingress -n mern-todo
..\kubectl.exe get pods -n mern-todo
```

### 5. Check pod logs and rollout status
```powershell
..\kubectl.exe rollout status deployment/mern-todo-backend -n mern-todo
..\kubectl.exe rollout status deployment/mern-todo-frontend -n mern-todo
..\kubectl.exe logs deployment/mern-todo-backend -n mern-todo
..\kubectl.exe logs deployment/mern-todo-frontend -n mern-todo
```

### 6. Access the frontend
- If using ingress and `mern-todo.local`:
  1. Add `127.0.0.1 mern-todo.local` to your hosts file.
  2. Open `http://mern-todo.local`.
- If using port-forward:
```powershell
..\kubectl.exe port-forward svc/mern-todo-frontend 3000:3000 -n mern-todo
```
Then open `http://localhost:3000`.

### 7. Final cleanup and production readiness
- If you use a cluster registry, push backend/frontend images to a registry and update image names in `k8s/` manifests.
- Replace `imagePullPolicy: Never` with `IfNotPresent` or `Always` for registry-based images.
- Remove any local-only hardcoded host values once production deployment is planned.

## Notes and current caveats
- At present, the Docker Compose workflow is validated and working locally.
- Kubernetes deployment is prepared, but cluster deployment has not been executed yet.
- The final completion requires a running cluster and a valid `kubectl` context.
- If Docker Desktop Kubernetes is preferred, enabling Kubernetes there is the fastest next step.
