# Stage 1: Dependencies and build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use ci for predictable installations)
# CI (clean install) ensures exact versions from lock file
RUN npm ci --only=production

# Stage 2: Runtime - Production image
FROM node:18-alpine

WORKDIR /app

# Install dumb-init to handle signals properly in container
RUN apk add --no-cache dumb-init curl

# Copy dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set NODE_ENV to production for optimizations
ENV NODE_ENV=production

# Expose the port backend runs on
EXPOSE 5000

# Health check - verify server is responding on health endpoint
# Interval: check every 30 seconds
# Timeout: wait 3 seconds for response
# Start period: wait 10 seconds before first check
# Retries: mark unhealthy after 3 failed checks
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:5000/ || exit 1

# Use dumb-init to properly handle SIGTERM for graceful shutdown
ENTRYPOINT ["/usr/sbin/dumb-init", "--"]

# Use npm start (runs node index.js based on package.json)
CMD ["npm", "start"]