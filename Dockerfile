# Base image
FROM node:18.20.8-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Add polyfill for crypto
RUN echo "global.crypto = require('crypto');" > /usr/src/app/dist/crypto-polyfill.js

# Expose port
EXPOSE 3000

# Start the application with polyfill
CMD ["node", "-r", "./dist/crypto-polyfill.js", "dist/main.js"] 