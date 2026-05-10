#!/bin/bash

# TodoOps Development Setup Script
# This script automates the setup of the TodoOps development environment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main setup
main() {
    print_header "TodoOps Development Environment Setup"

    # Check Node.js
    print_info "Checking Node.js installation..."
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_success "Node.js $NODE_VERSION found"
    else
        print_error "Node.js not found. Please install Node.js 16+ from https://nodejs.org/"
        exit 1
    fi

    # Check npm
    print_info "Checking npm installation..."
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        print_success "npm $NPM_VERSION found"
    else
        print_error "npm not found. Please install npm with Node.js"
        exit 1
    fi

    # Check Git
    print_info "Checking Git installation..."
    if command_exists git; then
        GIT_VERSION=$(git --version)
        print_success "$GIT_VERSION found"
    else
        print_error "Git not found. Please install Git from https://git-scm.com/"
        exit 1
    fi

    # Setup project
    print_header "Setting Up TodoOps Project"

    # Install backend dependencies
    print_info "Installing backend dependencies..."
    cd server
    npm install
    print_success "Backend dependencies installed"
    cd ..

    # Install frontend dependencies
    print_info "Installing frontend dependencies..."
    cd client
    npm install
    print_success "Frontend dependencies installed"
    cd ..

    # Setup environment files
    print_header "Configuring Environment"

    # Server .env
    if [ ! -f server/.env ]; then
        print_warning "server/.env not found. Creating from example..."
        if [ -f server/.env.example ]; then
            cp server/.env.example server/.env
            print_success "server/.env created (please update with your values)"
        else
            print_warning "server/.env.example not found. Please create server/.env manually"
        fi
    else
        print_success "server/.env already exists"
    fi

    # Client .env
    if [ ! -f client/.env ]; then
        print_warning "client/.env not found. Creating from example..."
        if [ -f client/.env.example ]; then
            cp client/.env.example client/.env
            print_success "client/.env created (please update with your values)"
        else
            print_warning "client/.env.example not found. Please create client/.env manually"
        fi
    else
        print_success "client/.env already exists"
    fi

    # Optional: Check Docker
    print_header "Optional: Docker Setup"
    if command_exists docker; then
        DOCKER_VERSION=$(docker --version)
        print_success "$DOCKER_VERSION found"
        
        if command_exists docker-compose; then
            DC_VERSION=$(docker-compose --version)
            print_success "$DC_VERSION found"
        else
            print_warning "docker-compose not found. Please install from https://docs.docker.com/compose/install/"
        fi
    else
        print_info "Docker not found. This is optional for local development."
        print_info "Install from https://www.docker.com/products/docker-desktop if you want to use Docker"
    fi

    # Summary
    print_header "Setup Complete!"
    print_success "TodoOps development environment is ready"

    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "1. Update configuration files:"
    echo -e "   - server/.env (MongoDB connection string)"
    echo -e "   - client/.env (API endpoint)"
    echo ""
    echo -e "2. Start the development servers:"
    echo -e "   ${YELLOW}Terminal 1:${NC} cd server && npm run dev"
    echo -e "   ${YELLOW}Terminal 2:${NC} cd client && npm run dev"
    echo ""
    echo -e "3. Or use Docker Compose:"
    echo -e "   ${YELLOW}docker-compose up --build${NC}"
    echo ""
    echo -e "4. Visit:"
    echo -e "   ${YELLOW}Frontend:${NC} http://localhost:5173 (Vite) or http://localhost:3000 (Docker)"
    echo -e "   ${YELLOW}Backend:${NC} http://localhost:5000"
    echo ""
    echo -e "5. See documentation:"
    echo -e "   - ${YELLOW}QUICK_START.md${NC} - 5-minute quick start"
    echo -e "   - ${YELLOW}ENVIRONMENT_SETUP.md${NC} - Detailed setup guide"
    echo -e "   - ${YELLOW}README.md${NC} - Project overview"
    echo ""
}

# Run main setup
main "$@"
