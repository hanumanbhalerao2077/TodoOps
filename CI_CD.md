# CI/CD Pipeline Documentation

This document describes the continuous integration and continuous deployment (CI/CD) pipeline for TodoOps.

## Overview

The TodoOps project uses GitHub Actions for automated testing, building, and security scanning. The pipeline ensures code quality and generates deployable Docker images.

## Table of Contents

- [Workflows](#workflows)
- [Pipeline Stages](#pipeline-stages)
- [Configuration](#configuration)
- [Secrets & Variables](#secrets--variables)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)

Main continuous integration workflow that runs on every push and pull request.

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
1. **Frontend Tests** - Linting and building React app
2. **Backend Tests** - Linting and testing Node.js API
3. **Build Images** - Building and pushing Docker images (only on main)
4. **Security Scan** - Vulnerability scanning with Trivy
5. **Code Quality** - npm audit and dependency checks
6. **Notify** - Final status notification

### 2. Docker Build & Deploy (`docker-build.yml`)

Specialized workflow for Docker image building and testing.

**Triggers:**
- Push to `main` branch
- Manual trigger via `workflow_dispatch`

**Jobs:**
1. **Build & Test** - Build Docker images
2. **Test Docker Compose** - Integration test with docker-compose
3. **Security Scan Docker** - Scan built images for vulnerabilities

## Pipeline Stages

### Stage 1: Code Quality

```
Frontend Tests          Backend Tests
    ↓                        ↓
- npm install          - npm install
- npm lint             - npm lint
- npm build            - npm test
```

**Checks:**
- Code formatting and style
- TypeScript/JavaScript errors
- Build compilation
- Unit tests (if configured)

### Stage 2: Docker Image Building

```
Build Frontend Image    Build Backend Image
    ↓                        ↓
Docker build           Docker build
    ↓                        ↓
Push to Registry       Push to Registry
```

**Only runs on:**
- Push to `main` branch (production builds)
- Manual trigger

### Stage 3: Security & Quality

```
Dependency Audit       Trivy Vulnerability Scan
    ↓                        ↓
Check npm audit        Scan images
    ↓                        ↓
Report findings        Upload SARIF results
```

**Tools:**
- `npm audit` - Dependency vulnerability checking
- **Trivy** - Container image scanning
- **GitHub Security** - Centralized security reporting

## Configuration

### Frontend Build Configuration

**Node Version:** 18 (Alpine)
**Package Manager:** npm with `npm ci` (clean install)
**Build Tool:** Vite
**Output:** `client/dist/`

**Build Steps:**
```yaml
1. Checkout code
2. Setup Node.js 18
3. Cache node_modules
4. npm ci (clean install)
5. npm run lint (if configured)
6. npm run build
7. Upload artifacts
```

### Backend Build Configuration

**Node Version:** 18 (Alpine)
**Package Manager:** npm with `npm ci`
**Database:** MongoDB (running in Docker service)
**Environment:** test

**Build Steps:**
```yaml
1. Checkout code
2. Start MongoDB service
3. Setup Node.js 18
4. npm ci (clean install)
5. npm run lint (if configured)
6. npm test (if configured)
7. Report test results
```

### Docker Image Configuration

**Frontend Image:**
- Base: `nginx:alpine`
- Size: ~20-30 MB
- Ports: 3000
- Health Check: HTTP GET /

**Backend Image:**
- Base: `node:18-alpine`
- Size: ~150-200 MB
- Ports: 5000
- Health Check: HTTP GET /

**Registry:**
- Default: GitHub Container Registry (ghcr.io)
- Supports: DockerHub, ECR, GCR, etc.

## Secrets & Variables

### Required Secrets

Configure in GitHub repository settings (**Settings** > **Secrets and variables** > **Actions**):

#### For Docker Hub (Optional)
```
DOCKERHUB_USERNAME      # Docker Hub username
DOCKERHUB_TOKEN         # Docker Hub access token
```

#### For AWS ECR (Optional)
```
AWS_ACCESS_KEY_ID       # AWS access key
AWS_SECRET_ACCESS_KEY   # AWS secret key
AWS_REGION              # ECR region (e.g., us-east-1)
```

#### For Kubernetes Deployment (Optional)
```
KUBECONFIG              # Base64 encoded kubeconfig
KUBERNETES_SERVER       # Kubernetes cluster URL
KUBERNETES_TOKEN        # Service account token
```

### Environment Variables

Add in **Settings** > **Secrets and variables** > **Variables**:

```
REGISTRY_URL           # Container registry URL
IMAGE_NAMESPACE        # Image namespace/organization
SLACK_WEBHOOK_URL      # Slack notification webhook
```

### Default Environment Variables

Available in all jobs:

```
REGISTRY=ghcr.io
IMAGE_NAME=${{ github.repository }}
```

## Monitoring

### View Workflow Runs

1. Go to **Actions** tab in repository
2. Select workflow to view runs
3. Click on specific run to see details

### View Job Logs

1. Click on run name
2. Select job from sidebar
3. Expand step to view logs

### View Build Artifacts

1. Click on run
2. Scroll to bottom
3. Download artifact files

### View Security Scan Results

1. Go to **Security** tab
2. Select **Code scanning** alerts
3. Review Trivy findings

## Triggering Workflows Manually

### Via GitHub UI

1. Go to **Actions** tab
2. Select workflow
3. Click **Run workflow** button
4. Choose branch
5. Click **Run workflow**

### Via GitHub CLI

```bash
# List workflows
gh workflow list

# Run workflow
gh workflow run ci-cd.yml --ref main

# View recent runs
gh run list
```

### Via API

```bash
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/actions/workflows/ci-cd.yml/dispatches \
  -d '{"ref":"main"}'
```

## Status Badges

Add to `README.md` to show pipeline status:

```markdown
## Build Status

[![CI/CD Pipeline](https://github.com/hanumanbhalerao2077/TodoOps/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/hanumanbhalerao2077/TodoOps/actions)
[![Docker Build](https://github.com/hanumanbhalerao2077/TodoOps/actions/workflows/docker-build.yml/badge.svg)](https://github.com/hanumanbhalerao2077/TodoOps/actions)
```

## Troubleshooting

### Workflow Not Running

**Solution:**
1. Check branch protection rules
2. Verify workflow file syntax (use YAML validator)
3. Check if workflow is enabled in Actions settings
4. Verify trigger conditions match

### npm ci Fails

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Verify package-lock.json exists
ls package-lock.json
```

### Docker Build Timeout

**Solution:**
```yaml
# Increase timeout in workflow
timeout-minutes: 30
```

### Registry Authentication Failed

**Solution:**
1. Verify secrets are set correctly
2. Check token/credentials expiration
3. Verify registry URL is correct
4. Check token has required permissions

### Test Failures

**Common Causes:**
- Database connection issues
- Missing environment variables
- Port already in use
- Service startup delay

**Solutions:**
```yaml
# Increase startup wait time
- name: Wait for services
  run: sleep 10

# Add retry logic
- uses: nick-invision/retry@v2
  with:
    timeout_minutes: 5
    max_attempts: 3
    command: npm test
```

## Best Practices

1. **Use Caching**
   - Cache `node_modules` for faster builds
   - Cache Docker layers for faster image builds

2. **Parallel Jobs**
   - Run independent jobs in parallel
   - Use `needs` for job dependencies

3. **Security**
   - Never commit secrets
   - Use GitHub encrypted secrets
   - Scan images before deployment
   - Review security alerts

4. **Notifications**
   - Integrate with Slack for notifications
   - Enable branch protection on failures
   - Review workflow logs regularly

5. **Optimization**
   - Use alpine images for smaller sizes
   - Multi-stage Docker builds
   - npm ci instead of npm install
   - Proper caching strategies

## Integration Examples

### Slack Notifications

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
  if: always()
```

### Deploy to Kubernetes

```yaml
- name: Deploy to Kubernetes
  run: |
    kubectl apply -k k8s/
    kubectl set image deployment/mern-todo-backend \
      mern-todo-backend=ghcr.io/${{ github.repository }}/backend:${{ github.sha }} \
      -n mern-todo
```

### Create GitHub Release

```yaml
- name: Create Release
  uses: actions/create-release@v1
  with:
    tag_name: v${{ github.run_number }}
    release_name: Release v${{ github.run_number }}
    body: ${{ github.event.head_commit.message }}
```

## Next Steps

1. Configure secrets in GitHub repository
2. Monitor first few workflow runs
3. Set up notifications for failures
4. Integrate with deployment platform
5. Review security scan results regularly
6. Optimize pipeline for your needs

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Trivy Vulnerability Scanner](https://github.com/aquasecurity/trivy-action)
- [Node.js Action](https://github.com/actions/setup-node)
