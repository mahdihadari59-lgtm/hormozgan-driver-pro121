#!/bin/bash

echo "🚀 شروع استقرار Hormozgan Driver Pro v8.0"

# بررسی Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker نصب نیست!"
    exit 1
fi

# Build
echo "📦 ساخت Docker Image..."
docker build -t hormozgan-driver:v8 .

# Deploy
echo "🚀 استقرار با Docker Compose..."
docker-compose up -d

echo "✅ استقرار کامل شد!"
echo "📱 دسترسی: http://localhost:80"
echo "📊 Grafana: http://localhost:3000"
echo "📈 Prometheus: http://localhost:9090"
