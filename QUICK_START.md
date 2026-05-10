# Quick Start Guide

Get TodoOps up and running in 5 minutes!

## Table of Contents

- [Prerequisites](#prerequisites)
- [Option 1: Docker Compose (Easiest)](#option-1-docker-compose-easiest)
- [Option 2: Local Development](#option-2-local-development)
- [Option 3: Kubernetes](#option-3-kubernetes)
- [Verify Installation](#verify-installation)
- [Next Steps](#next-steps)

## Prerequisites

Choose based on your preferred deployment method:

### For Docker Compose
- Docker Desktop installed
- At least 2GB RAM available
- Ports 3000, 5000 available

### For Local Development
- Node.js 16+ and npm
- MongoDB local instance or MongoDB Atlas account
- Git

### For Kubernetes
- kubectl installed
- Kubernetes cluster (Docker Desktop, Minikube, or cloud)
- Container registry access

## Option 1: Docker Compose (Easiest)

### Step 1: Clone the Repository
```bash
git clone https://github.com/hanumanbhalerao2077/TodoOps.git
cd TodoOps
```

### Step 2: Start Services
```bash
docker-compose up --build
```

Wait for services to be healthy:
```
✅ Frontend: http://localhost:3000
✅ Backend: http://localhost:5000
✅ MongoDB: localhost:27017
```

### Step 3: Test the Application
Open browser: **http://localhost:3000**

You should see the TodoOps frontend!

### Stop Services
```bash
docker-compose down
```

**Done!** 🎉

---

## Option 2: Local Development

### Step 1: Clone the Repository
```bash
git clone https://github.com/hanumanbhalerao2077/TodoOps.git
cd TodoOps
```

### Step 2: Install Dependencies
```bash
# Install backend dependencies
cd server
npm install
cd ..

# Install frontend dependencies  
cd client
npm install
cd ..
```

### Step 3: Configure Environment

Server configuration:
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB connection string
```

Client configuration:
```bash
cd ../client
cp .env.example .env
# Edit .env with API URL
```

### Step 4: Start Services

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

### Step 5: Access Application
- Frontend: **http://localhost:5173** (Vite dev server)
- Backend: **http://localhost:5000**

**Done!** 🎉

---

## Option 3: Kubernetes

### Step 1: Clone the Repository
```bash
git clone https://github.com/hanumanbhalerao2077/TodoOps.git
cd TodoOps
```

### Step 2: Prepare Images (Optional)
If using custom images:
```bash
docker build -t yourusername/mern-todo-backend:latest server/
docker build -t yourusername/mern-todo-frontend:latest client/

docker push yourusername/mern-todo-backend:latest
docker push yourusername/mern-todo-frontend:latest
```

Update image references in `k8s/deployment-backend.yaml` and `k8s/deployment-frontend.yaml`.

### Step 3: Deploy to Kubernetes
```bash
kubectl apply -k k8s/
```

### Step 4: Verify Deployment
```bash
kubectl get all -n mern-todo
```

### Step 5: Access Application

Option A - Port Forward:
```bash
kubectl port-forward svc/mern-todo-frontend 3000:3000 -n mern-todo
```
Visit: **http://localhost:3000**

Option B - Ingress (if configured):
Add to `/etc/hosts`:
```
127.0.0.1 mern-todo.local
```
Visit: **http://mern-todo.local**

**Done!** 🎉

---

## Verify Installation

### Check Services are Running

Docker Compose:
```bash
docker ps
```
You should see:
- mern-todo-backend
- mern-todo-frontend  
- mongodb

Local Development:
```bash
curl http://localhost:5000/
curl http://localhost:5173/
```
Both should return responses.

Kubernetes:
```bash
kubectl get pods -n mern-todo
```
All pods should be in `Running` state.

### Test API

```bash
# Health check
curl http://localhost:5000/

# Get todos
curl http://localhost:5000/api/todos

# Create a todo
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Todo"}'
```

### View Logs

Docker Compose:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

Local Development:
Check the terminal where you ran `npm run dev`

Kubernetes:
```bash
kubectl logs -f <pod-name> -n mern-todo
```

---

## Common Issues

### Port Already in Use

Windows:
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

macOS/Linux:
```bash
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Failed

Ensure MongoDB is running:
```bash
# Docker Compose
docker ps | grep mongodb

# Local
mongosh  # or mongo --version
```

### Frontend shows "Cannot reach API"

Check backend is running:
```bash
curl http://localhost:5000/
```

If using Docker Compose, ensure containers are healthy:
```bash
docker-compose ps
```

---

## Next Steps

### Learn More

1. **Local Development** - See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)
2. **API Reference** - See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. **Deployment** - See [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Kubernetes** - See [K8S_DEPLOYMENT.md](./K8S_DEPLOYMENT.md)
5. **CI/CD** - See [CI_CD.md](./CI_CD.md)

### Contribute

Want to contribute? See [CONTRIBUTING.md](./CONTRIBUTING.md)

### Run Tests

Backend:
```bash
cd server
npm test
```

Frontend:
```bash
cd client
npm test
```

### Build for Production

Backend:
```bash
docker build -t mern-todo-backend:prod server/
```

Frontend:
```bash
docker build -t mern-todo-frontend:prod client/
```

---

## Troubleshooting

Having issues? Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions.

---

## Getting Help

- 📚 Read the [README.md](./README.md)
- 🐛 Check [GitHub Issues](https://github.com/hanumanbhalerao2077/TodoOps/issues)
- 📖 Browse [Full Documentation](./DEPLOYMENT.md)
- 💬 Create a GitHub Discussion

---

**Ready to dive in?** Start with [Docker Compose](#option-1-docker-compose-easiest) if you want the fastest setup! 🚀
