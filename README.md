# TodoOps

A cloud-native MERN Todo application containerized with Docker and deployable on Kubernetes for scalable environments.

## ⚡ Quick Start

Get started in 5 minutes! See [QUICK_START.md](./QUICK_START.md) for fast setup options.

```bash
git clone https://github.com/hanumanbhalerao2077/TodoOps.git
cd TodoOps
docker compose up --build
```

Then open: **http://localhost:3000**

## 📋 What this repository contains

- **client/** - React frontend application built with Vite
- **server/** - Node.js + Express backend API with MongoDB
- **docker-compose.yml** - Local multi-container development setup
- **k8s/** - Kubernetes manifests for production deployment
- **.github/workflows/** - CI/CD pipelines with GitHub Actions
- **Documentation** - Comprehensive guides for development and deployment

## ✨ Features

- **Full MERN Stack** - MongoDB, Express.js, React, Node.js
- **Containerized** - Docker and Docker Compose for consistent environments
- **Kubernetes Ready** - Complete K8s manifests for production deployments
- **CI/CD Automation** - GitHub Actions workflows for testing and deployment
- **Optimized Frontend** - Vite-based React build with Nginx serving
- **Persistent Storage** - MongoDB with PersistentVolume support
- **Auto-scaling** - Horizontal Pod Autoscaler configuration
- **Health Checks** - Liveness and readiness probes configured
- **API Documentation** - Complete REST API reference documentation
- **Contributing Guide** - Guidelines for contributors

## 📚 Documentation

Comprehensive documentation for all aspects of the project:

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](./QUICK_START.md) | Get up and running in 5 minutes |
| [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) | Development environment setup for all OSes |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Multi-environment deployment guide |
| [K8S_DEPLOYMENT.md](./K8S_DEPLOYMENT.md) | Kubernetes deployment and management |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Complete REST API reference |
| [CI_CD.md](./CI_CD.md) | GitHub Actions CI/CD pipeline documentation |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute to the project |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Common issues and solutions |

## 🚀 Get Started

### Option 1: Docker Compose (Recommended)

Fastest way to get up and running with all services:

```bash
git clone https://github.com/hanumanbhalerao2077/TodoOps.git
cd TodoOps
docker compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Option 2: Local Development

For development with live code reloading:

```bash
git clone https://github.com/hanumanbhalerao2077/TodoOps.git
cd TodoOps

# Install backend dependencies
cd server
npm install
cd ..

# Install frontend dependencies
cd client
npm install
cd ..

# Copy and configure environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Start backend (Terminal 1)
cd server && npm run dev

# Start frontend (Terminal 2)
cd client && npm run dev
```

Access:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Option 3: Kubernetes Deployment

For production-ready deployment:

```bash
git clone https://github.com/hanumanbhalerao2077/TodoOps.git
cd TodoOps

# Deploy to Kubernetes
kubectl apply -k k8s/

# Verify deployment
kubectl get all -n mern-todo

# Access via port-forward
kubectl port-forward svc/mern-todo-frontend 3000:3000 -n mern-todo
```

Access: http://localhost:3000

**See [QUICK_START.md](./QUICK_START.md) for more detailed setup instructions.**

## 💻 Development

### Project Structure

```
TodoOps/
├── client/                       # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx              # Main app component
│   │   ├── ToDoList.jsx         # Todo list component
│   │   ├── ListItem.jsx         # Individual todo item
│   │   └── index.jsx            # Entry point
│   ├── Dockerfile               # Frontend container image
│   ├── nginx.conf               # Nginx configuration
│   ├── package.json
│   └── vite.config.js
│
├── server/                       # Node.js/Express backend
│   ├── controllers/
│   │   └── todoController.js    # Business logic
│   ├── models/
│   │   └── todoModel.js         # MongoDB schema
│   ├── routes/
│   │   └── todoRoutes.js        # API routes
│   ├── index.js                 # Server entry point
│   ├── Dockerfile               # Backend container image
│   └── package.json
│
├── k8s/                          # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── deployment-backend.yaml
│   ├── deployment-frontend.yaml
│   ├── statefulset-mongodb.yaml
│   ├── pvc-mongodb.yaml
│   ├── ingress.yaml
│   ├── hpa-backend.yaml
│   └── kustomization.yaml
│
├── .github/workflows/            # GitHub Actions CI/CD
│   ├── ci-cd.yml                # Main CI/CD pipeline
│   └── docker-build.yml         # Docker build workflow
│
├── docker-compose.yml            # Local development
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

### Backend API

**Base URL:** `http://localhost:5000`

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

#### Health Check
```bash
GET /
```

#### Todo Operations
```bash
GET /api/todos              # Get all todos
POST /api/todos             # Create new todo
GET /api/todos/:id          # Get specific todo
PUT /api/todos/:id          # Update todo
DELETE /api/todos/:id       # Delete todo
```

### Frontend

Built with:
- **React** - UI library
- **Vite** - Build tool (faster than CRA)
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Database

- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Persistent Storage** - Kubernetes PVC for data persistence

## 🐳 Docker

### Build Images

```bash
# Backend
docker build -t mern-todo-backend:latest server/

# Frontend
docker build -t mern-todo-frontend:latest client/
```

### Docker Compose

```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb

# Stop services
docker compose down
```

### Health Checks

All services include health checks:
```bash
# Check service status
docker ps
```

## ☸️ Kubernetes

### Deployment

```bash
# Apply all manifests
kubectl apply -k k8s/

# Verify deployment
kubectl get pods -n mern-todo
```

### Scaling

```bash
# Manual scaling
kubectl scale deployment/mern-todo-backend --replicas=3 -n mern-todo

# Check autoscaler
kubectl get hpa -n mern-todo
```

### Accessing the App

```bash
# Port forward
kubectl port-forward svc/mern-todo-frontend 3000:3000 -n mern-todo

# Or use Ingress (if configured)
# Add to /etc/hosts: 127.0.0.1 mern-todo.local
# Visit: http://mern-todo.local
```

See [K8S_DEPLOYMENT.md](./K8S_DEPLOYMENT.md) for detailed Kubernetes guide.

## 🔄 CI/CD Pipeline

GitHub Actions automatically:
- Lints and tests code
- Builds Docker images
- Scans for vulnerabilities
- Pushes images to registry
- Generates artifacts

View workflow runs in: **Settings > Actions** or check `.github/workflows/`

See [CI_CD.md](./CI_CD.md) for configuration details.

## 📝 Configuration

### Environment Variables

**Server (.env):**
```env
MONGODB_ATLAS_CONNECTION=mongodb+srv://user:pass@cluster.mongodb.net/tododb
PORT=5000
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
```

**Client (.env):**
```env
VITE_API_URL=http://localhost:5000
VITE_ENV=development
```

### Docker Compose

Environment variables can be set in `docker-compose.yml`:
```yaml
environment:
  - MONGODB_ATLAS_CONNECTION=${MONGODB_URI}
  - PORT=5000
```

### Kubernetes

Use ConfigMaps and Secrets:
```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
```

## 🧪 Testing

### Backend
```bash
cd server
npm test
npm run lint
```

### Frontend
```bash
cd client
npm test
npm run lint
```

## 📦 Building for Production

### Docker Images

```bash
docker build -t yourusername/mern-todo-backend:latest server/
docker build -t yourusername/mern-todo-frontend:latest client/

# Push to registry
docker push yourusername/mern-todo-backend:latest
docker push yourusername/mern-todo-frontend:latest
```

### Update Kubernetes Manifests

Edit `k8s/deployment-backend.yaml` and `k8s/deployment-frontend.yaml`:
```yaml
image: yourusername/mern-todo-backend:latest
```

## 🛠️ Troubleshooting

Common issues and solutions: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Quick Fixes

**Port already in use:**
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows
```

**MongoDB connection failed:**
```bash
# Verify MongoDB is running
docker ps | grep mongodb
mongosh --eval "db.adminCommand('ping')"
```

**Cannot reach frontend:**
```bash
# Check if containers are healthy
docker ps
# Verify API is accessible
curl http://localhost:5000/
```

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Development workflow
- Commit message guidelines
- Pull request process
- Coding standards

## 📖 Additional Resources

- [MERN Stack Guide](https://www.mongodb.com/languages/mern-stack)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev/)

## 📄 License

This project is open for collaboration and can be extended for deployment automation and DevOps workflows.

## 👥 Authors & Contributors

- **Original Author:** Chetan Nada
- **Cloud-native Enhancements:** TodoOps Community

## 🎯 Roadmap

Planned features:
- [ ] User authentication and authorization
- [ ] Advanced filtering and search capabilities
- [ ] Todo categories/tags
- [ ] Recurring todos
- [ ] Mobile app
- [ ] Real-time updates with WebSockets
- [ ] Backup and recovery automation
- [ ] Monitoring with Prometheus/Grafana
- [ ] ArgoCD GitOps integration

## 📞 Support & Issues

- 🐛 **Report Bugs:** [GitHub Issues](https://github.com/hanumanbhalerao2077/TodoOps/issues)
- 💬 **Discuss Ideas:** [GitHub Discussions](https://github.com/hanumanbhalerao2077/TodoOps/discussions)
- 📚 **Read Docs:** Check repository documentation
- 🆘 **Common Issues:** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Ready to deploy?** Start with [QUICK_START.md](./QUICK_START.md) ⚡ or dive into [DEPLOYMENT.md](./DEPLOYMENT.md) 🚀
