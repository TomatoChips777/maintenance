# Dockerfile for backend
FROM node:22.14.0-alpine

WORKDIR /app

# Only copy dependency files first for better caching
COPY package.json package-lock.json* ./
RUN npm install

# Then copy the rest of your source code
COPY . .

# Expose your API port
EXPOSE 5000

# Start in dev mode (with nodemon, if configured)
CMD ["npm", "run", "dev"]
