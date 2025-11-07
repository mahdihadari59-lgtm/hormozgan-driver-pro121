#!/bin/bash

echo "🔧 مدیریت پروژه AI Sahel"
echo "========================"

case "$1" in
    "start")
        echo "🚀 راه‌اندازی سرور..."
        npm start
        ;;
    "status")
        echo "📊 وضعیت پروژه:"
        echo "- فایل‌های JS: $(find . -name "*.js" -type f | wc -l)"
        echo "- اسکریپت‌ها: $(find . -name "*.sh" -type f | wc -l)"
        echo "- صفحات وب: $(find . -name "*.html" -type f | wc -l)"
        echo "- سرور فعال: $(ps aux | grep "node server" | grep -v grep | wc -l)"
        ;;
    "test")
        echo "🧪 تست سرویس‌ها..."
        curl -s http://localhost:8080/api/contacts | head -2
        ;;
    "structure")
        echo "📁 ساختار پروژه:"
        ./show-structure.sh
        ;;
    *)
        echo "دستورات موجود:"
        echo "  start     - راه‌اندازی سرور"
        echo "  status    - نمایش وضعیت"
        echo "  test      - تست سرویس‌ها"
        echo "  structure - نمایش ساختار"
        echo ""
        echo "📞 پشتیبانی: 07635108"
        ;;
esac
