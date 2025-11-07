#!/bin/bash

echo "╔════════════════════════════════════════════╗"
echo "║   🚗 Starting Hormozgan Driver Pro        ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Start Database Service
echo "🗄️  Starting Database Service (Port 7000)..."
cd apps/database-service
node index.js &
cd ../..
sleep 2

# Start API Gateway
echo "🌐 Starting API Gateway (Port 8080)..."
cd apps/api-gateway
node index.js &
cd ../..
sleep 2

# Start Location Service
echo "📍 Starting Location Service (Port 5000)..."
cd apps/location-service
node index.js &
cd ../..
sleep 2

# Start AI Service
echo "🤖 Starting AI Service (Port 6000)..."
cd apps/ai-service
node index.js &
cd ../..
sleep 2

# Start Map Service
echo "🗺️  Starting Map Service (Port 8000)..."
cd apps/map-service
node index.js &
cd ../..
sleep 2

# Start Mobile App
echo "📱 Starting Mobile App (Port 3000)..."
cd apps/mobile-app
node server.js &
cd ../..

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   ✅ All Services Started Successfully    ║"
echo "╠════════════════════════════════════════════╣"
echo "║   📱 Mobile App:     http://localhost:3000 ║"
echo "║   🌐 API Gateway:    http://localhost:8080 ║"
echo "║   📍 Location:       http://localhost:5000 ║"
echo "║   🤖 AI Service:     http://localhost:6000 ║"
echo "║   🗄️  Database:      http://localhost:7000 ║"
echo "║   🗺️  Map Service:   http://localhost:8000 ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "Press Ctrl+C to stop all services"

# Keep script running
wait
