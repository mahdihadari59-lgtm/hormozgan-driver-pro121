#!/bin/bash
echo "🧪 تست صفحه چت AI Sahel"

# تست دسترسی به صفحه چت
echo "۱. تست دسترسی به /ai-chat:"
if curl -s -I http://localhost:8080/ai-chat | grep "200 OK" > /dev/null; then
    echo "✅ صفحه چت در دسترس است"
else
    echo "❌ مشکل در دسترسی به صفحه چت"
fi

# تست API
echo -e "\n۲. تست API:"
curl -s -X POST http://localhost:8080/api/ai/sahel-chat \
  -H "Content-Type: application/json" \
  -d '{"message":"سلام"}' | jq -r '.success'

echo -e "\n🎯 آدرس‌های قابل دسترسی:"
echo "📱 صفحه اصلی: http://localhost:8080"
echo "🤖 صفحه چت: http://localhost:8080/ai-chat"
