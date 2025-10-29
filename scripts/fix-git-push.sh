#!/data/data/com.termux/files/usr/bin/bash

set -e

echo "🔧 حل مشکل Git Push"
echo "===================="

# رنگ‌ها
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${YELLOW}[ℹ]${NC} $1"; }
success() { echo -e "${GREEN}[✓]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; }

# بررسی وضعیت فعلی
log "بررسی وضعیت Git..."
git status

# روش 1: Pull و سپس Push
log "روش 1: دریافت تغییرات از GitHub..."
if git pull origin main; then
    success "تغییرات با موفقیت دریافت شد"
    
    log "ارسال تغییرات به GitHub..."
    if git push origin main; then
        success "✅ تغییرات با موفقیت ارسال شد!"
    else
        error "خطا در ارسال تغییرات"
    fi
else
    error "خطا در دریافت تغییرات"
    
    # روش 2: استفاده از --allow-unrelated-histories
    log "امتحان روش جایگزین..."
    git fetch origin
    if git merge origin/main --allow-unrelated-histories; then
        success "ادغام انجام شد"
        git push origin main
    else
        error "ادغام با مشکل مواجه شد"
        
        # روش 3: نمایش راهنمای دستی
        echo ""
        echo "🛠️ راهنمای حل دستی:"
        echo "1. وضعیت فعلی: git status"
        echo "2. تفاوت‌ها: git diff"
        echo "3. لاگ: git log --oneline"
        echo "4. اگر فایل‌های conflict دارید، آنها را ویرایش کنید"
        echo "5. سپس: git add ."
        echo "6. سپس: git commit -m 'حل conflicts'"
        echo "7. سپس: git push origin main"
    fi
fi

# نمایش وضعیت نهایی
echo ""
log "وضعیت نهایی:"
git log --oneline -5
echo ""
success "پروسه کامل شد"
