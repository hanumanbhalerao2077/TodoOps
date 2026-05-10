# Environment Setup Guide

This guide provides detailed instructions for setting up the development environment for TodoOps on different operating systems.

## Table of Contents

- [System Requirements](#system-requirements)
- [Windows Setup](#windows-setup)
- [macOS Setup](#macos-setup)
- [Linux Setup](#linux-setup)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements

- **RAM**: 4GB (8GB recommended for Docker)
- **Disk Space**: 5GB free
- **CPU**: 2-core processor

### Network Requirements

- Stable internet connection for npm package downloads
- Access to MongoDB Atlas (if using cloud database)
- Ports available: 3000, 5000, 5173, 27017

## Windows Setup

### 1. Install Node.js and npm

1. Download from [nodejs.org](https://nodejs.org/)
   - Use LTS version (16.x or higher)
   - Installer includes npm automatically

2. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

3. Configure npm:
   ```powershell
   npm config set registry https://registry.npmjs.org/
   npm cache clean --force
   ```

### 2. Install Git

1. Download from [git-scm.com](https://git-scm.com/)
2. Use default installation settings
3. Verify:
   ```powershell
   git --version
   ```

### 3. Install Docker Desktop

1. Download from [docker.com](https://www.docker.com/products/docker-desktop)
2. Run installer with default settings
3. Enable Hyper-V and WSL 2 when prompted
4. Restart Windows when requested
5. Verify:
   ```powershell
   docker --version
   docker run hello-world
   ```

### 4. Install MongoDB (Optional - for local development)

Option A: Use Docker (Recommended)
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Option B: Local installation
1. Download from [mongodb.com/community](https://www.mongodb.com/try/download/community)
2. Run installer with default settings
3. MongoDB will run as a service automatically

### 5. Configure Environment Variables

1. Create `.env` files:
   ```powershell
   cd TodoOps\server
   Copy-Item .env.example .env
   
   cd ..\client
   Copy-Item .env.example .env
   ```

2. Edit files with your settings using preferred editor (VS Code, Notepad++)

### 6. Install Project Dependencies

```powershell
# From project root directory
cd TodoOps

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ..\client
npm install

cd ..
```

## macOS Setup

### 1. Install Homebrew (Package Manager)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js and npm

```bash
brew install node
node --version
npm --version
```

### 3. Install Git

```bash
brew install git
git --version
```

### 4. Install Docker Desktop

1. Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Choose Intel or Apple Silicon version
3. Run installer and move Docker to Applications
4. Verify:
   ```bash
   docker --version
   docker run hello-world
   ```

### 5. Install MongoDB (Optional)

Using Docker (Recommended):
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Using Homebrew:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### 6. Configure Project

```bash
cd TodoOps

# Create .env files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Install dependencies
cd server
npm install

cd ../client
npm install
```

## Linux Setup

### Ubuntu/Debian

#### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

#### 2. Install Node.js and npm

```bash
# Using NodeSource repository for latest LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

#### 3. Install Git

```bash
sudo apt install -y git
```

#### 4. Install Docker

```bash
# Remove old Docker versions
sudo apt remove docker docker.io

# Install Docker using convenience script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group (avoid using sudo)
sudo usermod -aG docker $USER
# Log out and log back in for changes to take effect
```

#### 5. Install MongoDB (Optional)

Using Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Using apt:
```bash
sudo apt install -y mongodb
sudo systemctl start mongodb
```

#### 6. Configure Project

```bash
cd TodoOps

cp server/.env.example server/.env
cp client/.env.example client/.env

cd server
npm install

cd ../client
npm install
```

### CentOS/RHEL

```bash
# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# Install MongoDB via Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Verification

Run these commands to verify your setup:

```bash
# Node.js and npm
node --version        # Should be v16+
npm --version        # Should be v7+

# Git
git --version        # Should show version

# Docker
docker --version
docker ps            # Should show (may be empty or list containers)

# Clone and test
git clone https://github.com/hanumanbhalerao2077/TodoOps.git
cd TodoOps

# Test npm installation
npm --version

# Test docker-compose
docker compose version

# Test Docker build
docker build -t test-app:latest server/
```

## Troubleshooting

### npm Install Fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install

# If still failing, check node_modules
rm -rf node_modules package-lock.json
npm install
```

### Docker Desktop Won't Start

**Windows:**
- Enable virtualization in BIOS
- Check if Hyper-V is enabled (should be auto-enabled)
- Restart the system

**macOS:**
- Grant Docker permissions (System Preferences > Security & Privacy)
- Reset Docker to factory defaults (Docker menu > Preferences > Reset)

### Port Already in Use

```bash
# Windows - Find and kill process
netstat -ano | findstr :PORT_NUMBER
taskkill /PID PROCESS_ID /F

# macOS/Linux
lsof -ti:PORT_NUMBER | xargs kill -9
```

### MongoDB Connection Issues

```bash
# Test MongoDB connection
mongosh
# or
mongo --version

# Check MongoDB is running
docker ps | grep mongodb
```

### Permission Denied on Docker

```bash
# Linux - Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker run hello-world
```

## IDE Setup

### VS Code (Recommended)

1. Download from [code.visualstudio.com](https://code.visualstudio.com/)
2. Install recommended extensions:
   - ES7+ React/Redux/React-Native snippets
   - MongoDB for VS Code
   - Docker
   - Kubernetes
   - Prettier - Code formatter
   - ESLint

3. Open project:
   ```bash
   code .
   ```

### WebStorm

1. Download from [jetbrains.com/webstorm](https://www.jetbrains.com/webstorm/)
2. Built-in support for Node.js, Docker, and Kubernetes
3. Open project folder directly

## Next Steps

After completing setup:

1. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
2. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
3. Review [docker-compose.yml](./docker-compose.yml) for local development
4. Check [k8s/](./k8s/) directory for Kubernetes manifests

## Getting Help

- Check [Troubleshooting](#troubleshooting) section
- Review error logs in terminal output
- Check official documentation:
  - [Node.js Docs](https://nodejs.org/docs/)
  - [Docker Docs](https://docs.docker.com/)
  - [Git Book](https://git-scm.com/book/)
