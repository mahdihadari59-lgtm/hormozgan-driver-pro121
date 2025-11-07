#!/bin/bash
echo "🎯 مدیریت سرورهای هرمزگان درایور"
echo "========================================="

# لیست سرورهای موجود
servers=("server.js" "server-new.js" "server-pro.js" "server-v8.js")

for server in "${servers[@]}"; do
    if [ -f "$server" ]; then
        echo "✅ $server - موجود"
    else
        echo "❌ $server - یافت نشد"
    fi
done

echo ""
echo "🔧 دستورات اجرا:"
echo "   node server.js          - سرور پایه"
echo "   node server-new.js      - سرور جدید"
echo "   node server-pro.js      - سرور حرفه‌ای"
echo "   node server-v8.js       - سرور نسخه ۸"
echo ""
echo "📊 بررسی سرورهای در حال اجرا:"
ps aux | grep node | grep -v grep
echo "========================================="
