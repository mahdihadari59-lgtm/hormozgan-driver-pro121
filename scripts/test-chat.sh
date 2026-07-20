#!/bin/bash

echo "🧪 تست صفحه چت AI Sahel"
echo "================================================"

# ۱. تست دسترسی به صفحه چت
echo ""
echo "۱. تست دسترسی به /ai-chat:"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ai-chat | grep -q "200\|304"; then
    echo "✅ صفحه چت در دسترس است!"
else
    echo "❌ مشکل در دسترسی به صفحه چت"
fi

# ۲. تست API
echo ""
echo "۲. تست API:"
if curl -s http://localhost:8080/api/health 2>/dev/null | grep -q "ok"; then
    echo "✅ API سالم است!"
else
    echo "ℹ️ API در دسترس نیست (ممکن است وجود نداشته باشد)"
fi

# ۳. نمایش اطلاعات سرور
echo ""
echo "۳. اطلاعات سرور:"
ps aux | grep "node server" | grep -v grep

# ۴. نمایش آدرس‌ها
echo ""
echo "🎯 آدرس‌های قابل دسترسی:"
echo "📱 صفحه اصلی: http://localhost:8080"
echo "🤖 صفحه چت: http://localhost:8080/ai-chat"

echo ""
echo "================================================"
echo "✅ تست کامل شد!"
