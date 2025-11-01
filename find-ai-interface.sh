#!/bin/bash

echo "🔍 جستجوی رابط AI Sahel..."

# جستجوی فایل‌های مربوط به AI
echo "📁 فایل‌های HTML موجود:"
find public/ -name "*.html" -type f | while read file; do
    echo "• $file"
    grep -l "AI Sahel\|هوش مصنوعی" "$file" 2>/dev/null && echo "  ✅ شامل AI Sahel"
done

echo ""
echo "🎯 پیشنهاد:"
echo "1. http://localhost:8080/ai-chat.html"
echo "2. http://localhost:8080/"
echo "3. ایجاد رابط جدید"
