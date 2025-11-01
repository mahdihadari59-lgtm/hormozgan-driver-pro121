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
git commit -m "🔄 ذخیره تغییرات قبل از همگام‌سازی" || echo "⚠ کامیت انجام نشد"

# 2. برگشت به شاخه main
echo -e "\n${YELLOW}🌿 تغییر به شاخه اصلی...${NC}"
git checkout main

# 3. دریافت آخرین تغییرات
echo -e "\n${YELLOW}📥 دریافت تغییرات از GitHub...${NC}"
git config --global --unset http.proxy
git config --global --unset https.proxy

git fetch origin
git pull origin main

# 4. سازماندهی فایل‌ها
echo -e "\n${YELLOW}📁 سازماندهی فایل‌ها...${NC}"
mkdir -p scripts servers backups docs

# انتقال فایل‌های اسکریپت
mv *.sh scripts/ 2>/dev/null || true

# انتقال فایل‌های سرور
mv server-*.js servers/ 2>/dev/null || true
mv app.js servers/ 2>/dev/null || true

# نگه داشتن فقط سرورهای اصلی
cp servers/server-v7.js ./ 2>/dev/null || true
cp servers/app.js ./ 2>/dev/null || true

# 5. ایجاد فایل پیکربندی
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

# 6. بروزرسانی package.json
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

# 7. ایجاد داکیومنت
cat > DEPLOYMENT.md << 'DEPLOY_EOF'
# 🚀 راهنمای استقرار

## سرورهای موجود:
- **server-v7.js** - سرور اصلی با AI کامل
- **app.js** - سرور جایگزین

## استقرار سریع:
\`\`\`bash
npm install
npm start
\`\`\`

## آدرس‌ها:
- رابط اصلی: http://localhost:8080
- API چت: POST http://localhost:8080/ai-chat
- پشتیبانی: 07635108
DEPLOY_EOF

# 8. کامیت نهایی
echo -e "\n${YELLOW}📝 کامیت نهایی...${NC}"
git add .
git commit -m "🎉 انتشار نسخه ۲.۰.۰

- سیستم نوتیفیکیشن خودکار
- هوش مصنوعی پیشرفته
- مسیریابی هوشمند
- سازماندهی فایل‌ها

پشتیبانی: 07635108"

# 9. پوش به GitHub
echo -e "\n${YELLOW}📤 ارسال به GitHub...${NC}"
git push origin main

# 10. نصب وابستگی‌ها
echo -e "\n${YELLOW}📦 نصب وابستگی‌ها...${NC}"
npm install

echo -e "\n${GREEN}✅ همگام‌سازی کامل شد!${NC}"
echo -e "${BLUE}🎯 برای اجرا:${NC}"
echo -e "   ${GREEN}npm start${NC}"
echo -e "${BLUE}📱 آدرس:${NC}"
echo -e "   ${GREEN}http://localhost:8080${NC}"
echo -e "${BLUE}📞 پشتیبانی:${NC}"
echo -e "   ${GREEN}07635108${NC}"
