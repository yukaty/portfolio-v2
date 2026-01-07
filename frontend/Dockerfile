# Multi-stage Dockerfile for Frontend
# Usage:
#   Development: docker build --target development
#   Production:  docker build --target production (default)

# --- Builder Stage ---
FROM node:20.11-slim AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build arg for API URL (provided at build time for production)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# --- Production Stage ---
FROM node:20.11-slim AS production
WORKDIR /app

# Install serve globally for static file serving
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

EXPOSE 8080

# Serve with SPA fallback
# -s = single page app mode (fallback to index.html)
# -l = listen port
CMD ["serve", "-s", "dist", "-l", "8080"]

# --- Development Stage ---
FROM node:20.11-slim AS development
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code (will be overridden by volume in docker-compose)
COPY . .

EXPOSE 5173

# Run dev server with host binding for Docker networking
CMD ["npm", "run", "dev", "--", "--host"]