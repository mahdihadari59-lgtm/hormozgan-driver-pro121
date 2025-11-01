#!/bin/bash

# Hormozgan Driver Pro - Stability System Starter
echo "🚀 Starting Stability System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if the stability script exists
if [ ! -f "stability-system.js" ]; then
    echo "❌ stability-system.js not found. Please make sure the file exists."
    exit 1
fi

# Create necessary directories
mkdir -p logs backups temp

# Start the stability system
node stability-system.js

echo "✅ Stability System Started"
