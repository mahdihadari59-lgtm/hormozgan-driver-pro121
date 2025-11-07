#!/bin/bash

echo "╔════════════════════════════════════════════╗"
echo "║   🚗 Hormozgan Driver Pro Installer       ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# بررسی وجود پوشه‌ها
echo "📁 Checking directory structure..."

# لیست پوشه‌های موجود در apps
echo "📂 Apps directory contents:"
ls -la apps/

# لیست پوشه‌های موجود در packages  
echo "📦 Packages directory contents:"
ls -la packages/

echo ""
echo "📦 Installing root dependencies..."
npm install

# ایجاد package.json برای سرویس‌هایی که ندارند
create_package_json() {
    local dir=$1
    local name=$2
    local deps=$3
    
    if [ ! -f "$dir/package.json" ]; then
        echo "📄 Creating package.json for $name..."
        cat > "$dir/package.json" << EOF
{
  "name": "$name",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    $deps
  }
}
EOF
    else
        echo "✅ Package.json exists: $dir/package.json"
    fi
}

# ایجاد package.json برای سرویس‌ها
echo ""
echo "🔧 Setting up service packages..."

create_package_json "apps/mobile-app" "@hormozgan/mobile-app" '"express": "^4.18.2", "socket.io-client": "^4.6.1"'
create_package_json "apps/api-gateway" "@hormozgan/api-gateway" '"express": "^4.18.2", "cors": "^2.8.5", "helmet": "^7.1.0", "express-rate-limit": "^7.1.5", "socket.io": "^4.7.2"'
create_package_json "apps/location-service" "@hormozgan/location-service" '"express": "^4.18.2", "socket.io": "^4.6.1", "cors": "^2.8.5"'
create_package_json "apps/ai-service" "@hormozgan/ai-service" '"express": "^4.18.2", "cors": "^2.8.5"'
create_package_json "apps/database-service" "@hormozgan/database-service" '"express": "^4.18.2", "pg": "^8.11.3", "cors": "^2.8.5"'
create_package_json "apps/map-service" "@hormozgan/map-service" '"express": "^4.18.2", "socket.io": "^4.7.2", "cors": "^2.8.5", "leaflet": "^1.9.4"'
create_package_json "packages/ml-models" "@hormozgan/ml-models" '"@tensorflow/tfjs": "^4.15.0"'
create_package_json "packages/geo-utils" "@hormozgan/geo-utils" '"geolib": "^3.3.3"'

echo ""
echo "📦 Installing dependencies for each service..."

# نصب وابستگی‌ها برای هر سرویس (فقط اگر package.json دارند)
services=(
    "apps/mobile-app"
    "apps/api-gateway" 
    "apps/location-service"
    "apps/ai-service"
    "apps/database-service"
    "apps/map-service"
)

for service in "${services[@]}"; do
    if [ -f "$service/package.json" ]; then
        echo "📦 Installing $service dependencies..."
        cd "$service"
        npm install --production
        cd ../..
        echo "✅ $service dependencies installed"
    else
        echo "⚠️  Skipping $service (no package.json)"
    fi
done

# نصب وابستگی‌های packages
packages=(
    "packages/ml-models"
    "packages/geo-utils"
)

for package in "${packages[@]}"; do
    if [ -f "$package/package.json" ]; then
        echo "📦 Installing $package dependencies..."
        cd "$package"
        npm install --production
        cd ../..
        echo "✅ $package dependencies installed"
    else
        echo "⚠️  Skipping $package (no package.json)"
    fi
done

echo ""
echo "✅ Installation completed successfully!"
echo ""
echo "To start the unified server, run:"
echo "  npm start"
echo "  or"
echo "  node server-unified.js"
