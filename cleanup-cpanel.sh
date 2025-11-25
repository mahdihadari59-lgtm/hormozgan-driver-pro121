#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# مسیر cPanel
CPANEL_PATH="$HOME/public_html"
BACKUP_DIR="$HOME/backup_before_cleanup_$(date +%Y%m%d_%H%M%S)"

print_header() {
    clear
    echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}   ${RED}🧹 تمیز کردن cPanel${NC}   ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}\n"
}

# فایل‌ها و پوشه‌های برای حذف
FILES_TO_DELETE=(
    "V.1.booking.html"
    "V.1bio.html"
    "V.1contact.html"
    "V1.about.html"
    "V1.hotels.html"
    "Simple.index.html"
    "Ferr.index.html"
    "old.about.html"
    "index.htmly"
    "register.php"
    "chat-sahel.php"
    "sahel-chat.php"
    "ai-proxy.php"
    "register-driver.html"
    "public_html-driver-dashboard.html"
    "public_html: driver-dashboard.html"
    "attractions.html"
    ")"
    "\"v.0.registration.html"
    "}"
)

FOLDERS_TO_DELETE=(
    "archive.v1"
    "backup"
    "cgi-bin"
    "ruby"
    "lscache"
    "hormozgan-driver-pro"
    "hormozgan-driver-pro-organized"
    "new-project"
    "website_public"
    "official.hormozgandriver.ir"
)

FILES_TO_KEEP=(
    "index.html"
    "sitemap.xml"
    "robots.txt"
    ".htaccess"
    "package.json"
    "package-lock.json"
    ".gitignore"
    "README.md"
    "render.yaml"
    "server.js"
)

FOLDERS_TO_KEEP=(
    "ai"
    "api"
    "assets"
    "auth"
    "pages"
    "services"
    "public"
    "ssl"
    "mail"
)

print_header
echo -e "${YELLOW}📊 بررسی فایل‌های برای حذف...${NC}\n"

# ایجاد بک‌آپ
echo -e "${YELLOW}💾 ایجاد بک‌آپ...${NC}"
mkdir -p "$BACKUP_DIR"
cp -r "$CPANEL_PATH"/* "$BACKUP_DIR/" 2>/dev/null
echo -e "${GREEN}✅ بک‌آپ ایجاد شد: $BACKUP_DIR${NC}\n"

# شمارش برای حذف
delete_count=0
folder_count=0

# حذف فایل‌های اضافی
echo -e "${YELLOW}📋 فایل‌های برای حذف:${NC}"
for file in "${FILES_TO_DELETE[@]}"; do
    if [ -f "$CPANEL_PATH/$file" ]; then
        echo -e "${RED}  ❌ $file${NC}"
        rm -f "$CPANEL_PATH/$file"
        ((delete_count++))
    fi
done

echo ""

# حذف پوشه‌های اضافی
echo -e "${YELLOW}📁 پوشه‌های برای حذف:${NC}"
for folder in "${FOLDERS_TO_DELETE[@]}"; do
    if [ -d "$CPANEL_PATH/$folder" ]; then
        echo -e "${RED}  ❌ $folder/${NC}"
        rm -rf "$CPANEL_PATH/$folder"
        ((folder_count++))
    fi
done

echo ""

# فایل‌های ضروری را نگه دارید
echo -e "${YELLOW}📋 فایل‌های ضروری:${NC}"
for file in "${FILES_TO_KEEP[@]}"; do
    if [ -f "$CPANEL_PATH/$file" ]; then
        echo -e "${GREEN}  ✅ $file${NC}"
    fi
done

echo ""

# پوشه‌های ضروری را نگه دارید
echo -e "${YELLOW}📁 پوشه‌های ضروری:${NC}"
for folder in "${FOLDERS_TO_KEEP[@]}"; do
    if [ -d "$CPANEL_PATH/$folder" ]; then
        echo -e "${GREEN}  ✅ $folder/${NC}"
    fi
done

echo ""

# خلاصه
echo -e "${CYAN}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ تمیز کردن کامل شد!${NC}"
echo ""
echo -e "${YELLOW}📊 خلاصه:${NC}"
echo -e "  🗑️  فایل‌های حذف شده: ${RED}$delete_count${NC}"
echo -e "  🗑️  پوشه‌های حذف شده: ${RED}$folder_count${NC}"
echo -e "  💾 بک‌آپ در: ${BLUE}$BACKUP_DIR${NC}"
echo ""

# اندازه پوشه
du -sh "$CPANEL_PATH" | awk '{print "  📦 اندازه نهایی: " $1}'

echo ""
echo -e "${CYAN}════════════════════════════════════════════${NC}"

# گزینه بازگشت
echo ""
echo -e "${YELLOW}💡 اگر مشکلی پیش آمد، می‌تونید از بک‌آپ بازگردانی کنید:${NC}"
echo -e "${BLUE}cp -r $BACKUP_DIR/* $CPANEL_PATH/${NC}"
echo ""

read -p "برای ادامه Enter بزنید..."
