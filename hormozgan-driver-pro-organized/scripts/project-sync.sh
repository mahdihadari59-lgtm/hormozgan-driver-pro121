#!/bin/bash

# رنگ‌ها
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 شروع مدیریت و همگام‌سازی پروژه${NC}"

# 1. ذخیره تغییرات فعلی
echo -e "\n${YELLOW}💾 ذخیره تغییرات فعلی...${NC}"
git add .
git commit -m "🔄 ذخیره تغییرات قبل از همگام‌سازی

- به‌روزرسانی سرور v7
- اضافه شدن رابط‌های جدید
- بهبود عملکرد AI
- اضافه شدن فایل‌های مدیریتی" || echo "⚠ کامیت انجام نشد"

# 2. برگشت به شاخه main
echo -e "\n${YELLOW}🌿 تغییر به شاخه اصلی...${NC}"
git checkout main

# 3. دریافت آخرین تغییرات
echo -e "\n${YELLOW}📥 دریافت تغییرات از GitHub...${NC}"
# رفع مشکل proxy
git config --global --unset http.proxy
git config --global --unset https.proxy

git fetch origin
git pull origin main

# 4. ادغام تغییرات feature branch
echo -e "\n${YELLOW}🔄 ادغام تغییرات feature branch...${NC}"
git merge feature/auto-notifications-1761920915926 --no-ff -m "🔀 ادغام feature/auto-notifications

- اضافه شدن سیستم نوتیفیکیشن
- بهبود رابط کاربری
- اضافه شدن AI Assistant
- به‌روزرسانی سرورها"

# 5. سازماندهی فایل‌ها
echo -e "\n${YELLOW}📁 سازماندهی فایل‌ها...${NC}"

# ایجاد دایرکتوری‌های سازمان‌یافته
mkdir -p scripts/ servers/ backups/ docs/

# انتقال فایل‌های اسکریپت
mv *.sh scripts/ 2>/dev/null || true

# انتقال فایل‌های سرور
mv server-*.js servers/ 2>/dev/null
mv app.js servers/ 2>/dev/null

# نگه داشتن فقط سرورهای اصلی
cp servers/server-v7.js ./
cp servers/app.js ./

# 6. ایجاد فایل پیکربندی
cat > project-config.json << 'CONFIG_EOF'
{
  "project": "hormozgan-driver-pro",
  "version": "2.0.0",
  "mainServer": "server-v7.js",
  "backupServer": "app.js",
  "port": 8080,
  "features": {
    "aiChat": true,
    "notifications": true,
    "driverManagement": true,
    "payment": true,
    "analytics": true
  },
  "contacts": {
    "support": "07635108",
    "security": "09164321660",
    "driver": "09179940272"
  }
}
CONFIG_EOF

# 7. بروزرسانی package.json
cat > package.json << 'PKG_EOF'
{
  "name": "hormozgan-driver-pro",
  "version": "2.0.0",
  "description": "AI Sahel - سیستم کامل مدیریت رانندگان ساحل هرمزگان",
  "main": "server-v7.js",
  "scripts": {
    "start": "node server-v7.js",
    "dev": "node app.js",
    "deploy": "node server-final.js",
    "backup": "node servers/server-v7-backup.js",
    "ai": "node ai-assistant.js",
    "db": "node database-manager.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.5"
  },
  "keywords": [
    "ai",
    "driver",
    "hormozgan",
    "assistant",
    "notification",
    "management"
  ],
  "author": "Mahdi Hadari",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121"
  }
}
PKG_EOF

# 8. ایجاد داکیومنت‌های پروژه
cat > DEPLOYMENT.md << 'DEPLOY_EOF'
# 🚀 راهنمای استقرار

## سرورهای موجود:
- **server-v7.js** - سرور اصلی با AI کامل
- **app.js** - سرور جایگزین
- **servers/** - سایر سرورها

## اسکریپت‌های مدیریت:
- **scripts/project-sync.sh** - همگام‌سازی پروژه
- **scripts/check-github.sh** - بررسی وضعیت GitHub

## استقرار سریع:
```bash
# نصب وابستگی‌ها
npm install

# اجرای سرور اصلی
npm start

# اجرای نسخه توسعه
npm run dev
