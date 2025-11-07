#!/bin/bash

echo "╔════════════════════════════════════════════╗"
echo "║   🚗 Hormozgan Driver Pro Installer       ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# نصب وابستگی‌های ریشه
echo "📦 Installing root dependencies..."
npm install

# نصب وابستگی‌های تمام سرویس‌ها
services=("mobile-app" "api-gateway" "location-service" "ai-service" "database-service" "map-service")
packages=("ml-models" "geo-utils")

for service in "${services[@]}"; do
    echo "🔧 Installing $service dependencies..."
    cd "apps/$service"
    npm install
    cd ../..
done

for package in "${packages[@]}"; do
    echo "📦 Installing $package dependencies..."
    cd "packages/$package"
    npm install
    cd ../..
done

echo ""
echo "✅ Installation completed successfully!"
echo ""
echo "To start services, run:"
echo "  ./start.sh"
