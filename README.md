# TodoOps

A cloud-native MERN Todo application containerized with Docker and deployable on Kubernetes for scalable environments.

## What this repository contains

- client/ - React frontend application
- server/ - Node.js + Express backend API
- docker-compose.yml - local multi-container development setup
- k8s/ - Kubernetes manifests for namespace, deployments, services, ingress, PVC, ConfigMap, and HPA
- .gitignore - ignores local artifacts such as kubectl.exe, .env, and 
ode_modules

## Features

- Full MERN stack: MongoDB, Express, React, Node
- Docker Compose for local development
- Kubernetes manifests for production-like deployments
- Nginx-based frontend serving optimized React build
- MongoDB persistent storage via PVC
- Backend and frontend service definitions
- Ingress support for local Kubernetes access

## Get started

### 1. Clone the repository

`ash
git clone https://github.com/hanumanbhalerao2077/TodoOps.git
cd TodoOps
`

### 2. Install dependencies

`ash
cd client
npm install
cd ../server
npm install
`

### 3. Use Docker Compose for local development

`ash
docker compose up --build
`

Then open:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 4. Use Kubernetes for scalable deployment

If you have a local cluster (Docker Desktop Kubernetes, Minikube, or Kind):

`ash
kubectl apply -k k8s
`

Verify resources:

`ash
kubectl get all -n mern-todo
kubectl get pvc -n mern-todo
kubectl get ingress -n mern-todo
`

### 5. Access the app in Kubernetes

If using ingress with a local host entry:

- Add 127.0.0.1 mern-todo.local to your hosts file
- Visit http://mern-todo.local

Or port-forward the frontend service:

`ash
kubectl port-forward svc/mern-todo-frontend 3000:3000 -n mern-todo
`

Then open http://localhost:3000.

## Notes

- .env files are used for local configuration and should not be pushed with sensitive values.
- kubectl.exe is ignored and not included in the repository.
- For production deployments, update image references in k8s/ manifests and use a container registry.

## Project structure

`	ext
TodoOps/
├── client/
├── server/
├── k8s/
├── docker-compose.yml
└── README.md
`

## License

This project is open for collaboration and can be extended for deployment automation and DevOps workflows.

