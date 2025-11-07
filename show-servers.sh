#!/bin/bash
echo "🔄 بررسی سرورهای هرمزگان درایور..."
echo "========================================="

# بررسی سرورهای در حال اجرا
echo "🔍 سرورهای در حال اجرا:"
ps aux | grep node | grep -v grep

echo ""
echo "📁 فایل‌های سرور موجود:"
ls -la *.js | grep server

echo ""
echo "🌐 پورت‌های فعال:"
netstat -tulpn 2>/dev/null | grep :80

echo ""
echo "📊 وضعیت سرورها:"
for server in complete-server.js complete-server-v2.js server.js server-new.js mobile-server.js; do
    if [ -f "$server" ]; then
        echo "✅ $server - موجود"
    else
        echo "❌ $server - یافت نشد"
    fi
done

echo "========================================="
