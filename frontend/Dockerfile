FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Default: development mode
# For production build: docker-compose run --rm frontend npm run build
CMD ["npm", "run", "dev"]
