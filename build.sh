#!/bin/bash

# Exit on error
set -e

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps --force

# Build the application
echo "Building the application..."
./node_modules/.bin/ng build

# Show build output
echo "Build completed. Contents of www directory:"
ls -la www/

# Create a success file to indicate build completed
echo "Build successful" > www/build-success.txt