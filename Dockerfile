# Base image for Node.js
FROM node:18-slim AS base

# Set working directory
WORKDIR /usr/src/app

# Install dependencies only (for development or build)
FROM base AS deps

# Install required tools for image optimization in Next.js
RUN apt-get update && apt-get install -y libvips-dev && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Build stage
FROM base AS builder

# Copy application source code
COPY . .

# Copy dependencies from deps stage
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Build the application
RUN npm run build

# Production image
FROM base AS production

# Set environment variable to enable production mode
ENV NODE_ENV=production

# Expose the port Next.js will run on
EXPOSE 3000

# Copy the application build and production dependencies
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

# Start the application
CMD ["npm", "start"]