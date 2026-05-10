# Stage 1: Build the React application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use ci for clean, reproducible builds)
RUN npm ci

# Copy source code
COPY . .

# Build the Vite application
# This creates optimized static files in dist/
# Vite produces smaller bundles than Create React App
RUN npm run build

# Stage 2: Serve with Nginx - Production image
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Install curl for health checks
RUN apk add --no-cache curl

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
# This configures Nginx to serve React SPA and handle routing
COPY nginx.conf /etc/nginx/conf.d/

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port for frontend
EXPOSE 3000

# Health check to verify container is running and responsive
# Interval: check every 30 seconds
# Timeout: wait 3 seconds for response
# Start period: wait 5 seconds before first check
# Retries: mark unhealthy after 3 failed checks
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Start Nginx in foreground (required for proper signal handling in containers)
CMD ["nginx", "-g", "daemon off;"]
