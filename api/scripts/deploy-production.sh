#!/bin/bash

# Production Deployment Script
# This script builds the application and runs database migrations safely

set -e  # Exit on error

echo "🚀 Starting production deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with production database credentials"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Verify NODE_ENV is set to production
if [ "$NODE_ENV" != "production" ]; then
    echo "⚠️  Warning: NODE_ENV is not set to 'production'"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Run database migrations
echo "🗄️  Running database migrations..."
npm run migration:run

# Check migration status
echo "✅ Checking migration status..."
npm run migration:show

echo "✨ Deployment complete!"
echo "Start the application with: npm run start:prod"
