#!/bin/bash

echo "🔄 حل conflicts و سازماندهی پروژه..."

# 1. cancel merge
git merge --abort

# 2. بررسی وضعیت
git status

# 3. ایجاد دایرکتوری‌ها
mkdir -p scripts servers data backups

# 4. انتقال فایل‌ها
mv *.sh scripts/ 2>/dev/null || echo "📁 اسکریپت‌ها منتقل شدند"
mv server-*.js servers/ 2>/dev/null || echo "🖥️ سرورها منتقل شدند"
mv app.js servers/ 2>/dev/null || echo "📱 app.js منتقل شد"
mv *-data/ data/ 2>/dev/null || echo "🗃️ دیتا منتقل شد"
mv auto-features/ backups/ 2>/dev/null || echo "🔧 auto-features منتقل شد"
mv github-auto/ backups/ 2>/dev/null || echo "🐙 github-auto منتقل شد"
mv hormozgan_data/ data/ 2>/dev/null || echo "🏖️ hormozgan_data منتقل شد"

# 5. حذف فایل‌های غیرضروری
rm -f test-*.js stability-*.js simple-*.js hormozgan-*.js 2>/dev/null || echo "🗑️ فایل‌های اضافی حذف شدند"

# 6. کپی سرورهای اصلی
cp servers/server-v7.js ./ && echo "✅ server-v7.js کپی شد" || echo "⚠ server-v7.js یافت نشد"
cp servers/app.js ./ && echo "✅ app.js کپی شد" || echo "⚠ app.js یافت نشد"

# 7. کامیت تغییرات
git add .
git commit -m "🔧 سازماندهی نهایی پروژه

- انتقال فایل‌ها به دایرکتوری‌های مرتبط
- حذف فایل‌های تست و غیرضروری
- نگهداری سرورهای اصلی
- ساختار سازمان‌یافته"

echo "✅ سازماندهی کامل شد!"
echo "🚀 برای اجرای سرور: npm start"
echo "📱 آدرس: http://localhost:8080"
echo "📞 پشتیبانی: 07635108"
