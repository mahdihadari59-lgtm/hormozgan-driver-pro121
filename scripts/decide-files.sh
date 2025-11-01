#!/bin/bash

echo "🎯 تصمیم‌گیری برای فایل‌های یکتا و ضروری"
echo "=========================================="

# مسیرها
WEBSITE_DIR="../hormozgan-driver-website"
PRO121_DIR="."

# رنگ‌ها برای نمایش
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# تابع برای بررسی وجود فایل
check_file() {
    local file="$1"
    local description="$2"
    local category="$3"
    
    if [ -f "$WEBSITE_DIR/$file" ]; then
        if [ -f "$PRO121_DIR/$file" ]; then
            echo -e "${YELLOW}⚠️  تکراری${NC}: $file - $description"
            echo "   📍 موجود در: $PRO121_DIR/$file"
        else
            echo -e "${GREEN}✅ یکتا${NC}: $file - $description"
            echo "   📍 پیشنهاد: $category"
        fi
    else
        echo -e "${RED}❌ وجود ندارد${NC}: $file"
    fi
    echo ""
}

# تابع برای بررسی پوشه
check_dir() {
    local dir="$1"
    local description="$2"
    local category="$3"
    
    if [ -d "$WEBSITE_DIR/$dir" ]; then
        if [ -d "$PRO121_DIR/$dir" ]; then
            echo -e "${YELLOW}⚠️  تکراری${NC}: $dir/ - $description"
            echo "   📍 موجود در: $PRO121_DIR/$dir"
        else
            echo -e "${GREEN}✅ یکتا${NC}: $dir/ - $description"
            echo "   📍 پیشنهاد: $category"
        fi
    else
        echo -e "${RED}❌ وجود ندارد${NC}: $dir/"
    fi
    echo ""
}

echo -e "${BLUE}📁 فایل‌های اصلی:${NC}"
check_file "index.html" "صفحه اصلی" "public/"
check_file "welcome.html" "صفحه خوش‌آمدگویی" "public/"
check_file "music-player.js" "پخش کننده موسیقی" "public/js/"
check_file "server.js" "سرور اصلی" "BACKUP (نگهداری نسخه pro121)"
check_file "package.json" "تنظیمات پروژه" "BACKUP (نگهداری نسخه pro121)"

echo -e "${BLUE}📁 پوشه‌ها:${NC}"
check_dir "assets" "فایل‌های رسانه‌ای" "public/assets/"
check_dir "controllers" "کنترلرهای بک‌اند" "src/controllers/"
check_dir "routes" "مسیرهای API" "src/routes/"
check_dir "views" "ویوهای سرور" "src/views/"
check_dir "modules" "ماژول‌های اضافی" "modules/"
check_dir "scripts" "اسکریپت‌های کمکی" "scripts/"

echo -e "${BLUE}🔧 اسکریپت‌ها:${NC}"
check_file "auto-deploy.sh.save" "اسکریپت استقرار خودکار" "scripts/"
check_file "deploy-music-module.sh" "اسکریپت استقرار موسیقی" "scripts/"
check_file "fix-git-push.sh" "اسکریپت رفع مشکل Git" "scripts/"

echo -e "${BLUE}🎯 تصمیم‌گیری نهایی:${NC}"
echo "1. فایل‌های HTML یکتا → public/"
echo "2. فایل‌های JavaScript یکتا → public/js/"
echo "3. پوشه assets → public/assets/"
echo "4. پوشه‌های بک‌اند → src/"
echo "5. اسکریپت‌ها → scripts/"
echo "6. فایل‌های سرور و پیکربندی → BACKUP (نگهداری نسخه pro121)"
echo ""
echo -e "${GREEN}📋 برای اجرای این تصمیم‌ها از دستورات زیر استفاده کنید:${NC}"
echo "cd ~/hormozgan-driver-pro121"
echo "cp ../hormozgan-driver-website/welcome.html public/"
echo "cp ../hormozgan-driver-website/music-player.js public/js/"
echo "cp -r ../hormozgan-driver-website/assets/* public/assets/"
echo "cp -r ../hormozgan-driver-website/controllers src/"
echo "cp -r ../hormozgan-driver-website/routes src/"
echo "cp -r ../hormozgan-driver-website/views src/"
echo "mkdir -p scripts && cp ../hormozgan-driver-website/*.sh scripts/"
