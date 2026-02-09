# Production Deployment Script for Windows
# This script builds the application and runs database migrations safely

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting production deployment..." -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path .env)) {
    Write-Host "❌ Error: .env file not found!" -ForegroundColor Red
    Write-Host "Please create .env file with production database credentials"
    exit 1
}

# Load environment variables from .env file
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        Set-Item -Path "env:$name" -Value $value
    }
}

# Verify NODE_ENV is set to production
if ($env:NODE_ENV -ne "production") {
    Write-Host "⚠️  Warning: NODE_ENV is not set to 'production'" -ForegroundColor Yellow
    $response = Read-Host "Continue anyway? (y/n)"
    if ($response -ne "y") {
        exit 1
    }
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm ci --only=production

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Cyan
npm run build

# Run database migrations
Write-Host "🗄️  Running database migrations..." -ForegroundColor Cyan
npm run migration:run

# Check migration status
Write-Host "✅ Checking migration status..." -ForegroundColor Cyan
npm run migration:show

Write-Host "✨ Deployment complete!" -ForegroundColor Green
Write-Host "Start the application with: npm run start:prod"
