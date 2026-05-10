# Stage 1: Dependencies and build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use ci for predictable installations)
RUN npm ci

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Copy dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy source code
COPY . .

# Expose the port backend runs on
EXPOSE 5000

# Health check - verify server is responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use npm start (runs node index.js based on package.json)
CMD ["npm", "start"]