#!/data/data/com.termux/files/usr/bin/bash

set -e

echo "🎵 استقرار ماژول موزیک بندرعباس"
echo "================================"

# رنگ‌ها
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${YELLOW}[ℹ]${NC} $1"; }
success() { echo -e "${GREEN}[✓]${NC} $1"; }
info() { echo -e "${BLUE}[→]${NC} $1"; }

# مسیر ماژول
MODULE_DIR="modules/music-bandari"

# بررسی وجود ماژول
if [ ! -d "$MODULE_DIR" ]; then
    log "ماژول موزیک یافت نشد. در حال ایجاد..."
    mkdir -p "$MODULE_DIR"
fi

# بررسی فایل‌های ماژول
log "بررسی فایل‌های ماژول..."
required_files=("index.html" "player.js" "music.json")
for file in "${required_files[@]}"; do
    if [ -f "$MODULE_DIR/$file" ]; then
        success "$file موجود است"
    else
        echo "❌ $file یافت نشد"
    fi
done

# اضافه کردن به Git
log "اضافه کردن ماژول به Git..."
git add "$MODULE_DIR"
git commit -m "🎵 افزودن ماژول موزیک بندرعباس" || true

# پرسش برای ارسال به GitHub
read -p "آیا می‌خواهید ماژول به GitHub ارسال شود؟ (y/n): " push_choice
if [ "$push_choice" = "y" ] || [ "$push_choice" = "Y" ]; then
    git push origin main
    success "ماژول به GitHub ارسال شد"
    
    echo ""
    echo "🌐 آدرس ماژول:"
    echo "   https://mahdihadari59-lgtm.github.io/hormozgan-driver-website/modules/music-bandari/"
    echo ""
    echo "📱 برای تست در کروم باز کنید:"
    echo "   https://mahdihadari59-lgtm.github.io/hormozgan-driver-website/modules/music-bandari/index.html"
else
    info "ارسال به GitHub لغو شد"
fi

# نمایش اطلاعات
echo ""
echo "🎉 ماژول موزیک آماده است!"
echo "========================"
echo "📁 ساختار ماژول:"
find "$MODULE_DIR" -type f | while read file; do
    size=$(du -h "$file" | cut -f1)
    echo "   📄 $file ($size)"
done

echo ""
echo "🚀 مراحل بعدی:"
echo "1. فایل‌های MP3 واقعی را در assets قرار دهید"
echo "2. اطلاعات آهنگ‌ها را در music.json به‌روزرسانی کنید"
echo "3. تصاویر کاور را اضافه کنید"
echo "4. در اپلیکیشن اصلی ادغام کنید"
