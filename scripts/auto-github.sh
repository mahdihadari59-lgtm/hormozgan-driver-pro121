#!/bin/bash

echo "🚀 راه‌اندازی سیستم اتوماتیک GitHub..."

# بررسی وجود گیت
if [ ! -d ".git" ]; then
    echo "❌ دایرکتوری گیت یافت نشد. لطفاً ابتدا git init را اجرا کنید."
    exit 1
fi

# بررسی نود.جی‌اس
if ! command -v node &> /dev/null; then
    echo "❌ Node.js یافت نشد"
    exit 1
fi

# اجرای سیستم
node github-auto/github-automator.js --test

echo "✅ سیستم آماده است!"
echo "📝 برای استفاده: node github-auto/start.js"
