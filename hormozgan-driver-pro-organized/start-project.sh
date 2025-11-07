#!/bin/bash

echo "🚀 راه‌اندازی پروژه هم‌راز..."

# بررسی وجود فایل‌های لازم
if [ ! -f "server-final-complete.js" ]; then
    echo "❌ فایل سرور یافت نشد!"
    exit 1
fi

if [ ! -f "index.html" ]; then
    echo "❌ فایل index.html یافت نشد!"
    exit 1
fi

echo "✅ فایل‌های لازم موجود هستند"

# اجرای سرور در پس‌زمینه
echo "🔧 در حال راه‌اندازی سرور Express..."
node server-final-complete.js &
SERVER_PID=$!

# صبر کردن برای راه‌اندازی سرور
sleep 3

# باز کردن مرورگر
echo "🌐 باز کردن مرورگر..."
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:8080
    xdg-open index.html
elif command -v open &> /dev/null; then
    open http://localhost:8080
    open index.html
else
    echo "📱 لطفا دستی باز کنید:"
    echo "   http://localhost:8080"
    echo "   و فایل index.html"
fi

echo "🎯 پروژه اجرا شد!"
echo "   سرور: http://localhost:8080"
echo "   صفحه استاتیک: index.html"
echo "   برای توقف: kill $SERVER_PID"

# انتظار برای خروج
wait $SERVER_PID
