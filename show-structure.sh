#!/bin/bash

echo "📁 ساختار کامل پروژه:"
echo "========================"

echo -e "\n📂 دایرکتوری روت:"
ls -la | grep -E "(.js|.json|.md|.sh)$" | head -20

echo -e "\n📂 دایرکتوری scripts:"
ls -la scripts/ 2>/dev/null | head -10 || echo "دایرکتوری scripts وجود ندارد"

echo -e "\n📂 دایرکتوری servers:"
ls -la servers/ 2>/dev/null | head -10 || echo "دایرکتوری servers وجود ندارد"

echo -e "\n📂 دایرکتوری public:"
ls -la public/ 2>/dev/null | head -10 || echo "دایرکتوری public وجود ندارد"

echo -e "\n📂 دایرکتوری data:"
ls -la data/ 2>/dev/null | head -10 || echo "دایرکتوری data وجود ندارد"

echo -e "\n🎯 سرورهای اصلی:"
find . -name "*.js" -type f | grep -E "(server|app)" | head -10

echo -e "\n🔧 اسکریپت‌های مدیریت:"
find . -name "*.sh" -type f | head -10

echo -e "\n📊 خلاصه:"
echo "- فایل‌های JavaScript: $(find . -name "*.js" -type f | wc -l)"
echo "- اسکریپت‌های Shell: $(find . -name "*.sh" -type f | wc -l)"
echo "- فایل‌های HTML: $(find . -name "*.html" -type f | wc -l)"
