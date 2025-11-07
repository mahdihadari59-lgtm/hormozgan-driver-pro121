#!/bin/bash

# دستورات سریع برای پورت 8080
case "$1" in
    "check")
        echo "🔍 بررسی پورت 8080..."
        lsof -i :8080
        ;;
    "stop")
        echo "🛑 توقف پورت 8080..."
        sudo kill -9 $(sudo lsof -t -i:8080)
        ;;
    "test")
        echo "🧪 تست پورت 8080..."
        curl -I http://localhost:8080
        ;;
    *)
        echo "استفاده: quick-8080.sh [check|stop|test]"
        ;;
esac
