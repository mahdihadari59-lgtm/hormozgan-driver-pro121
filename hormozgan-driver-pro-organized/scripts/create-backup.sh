#!/bin/bash

BACKUP_DIR="backups"
BACKUP_NAME="complete_backup_$(date +%Y%m%d_%H%M%S)"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

echo "💾 در حال ایجاد بک‌آپ کامل..."

# ایجاد پوشه بک‌آپ
mkdir -p "$BACKUP_DIR"

# ایجاد بک‌آپ
tar -czf "$BACKUP_PATH.tar.gz" \
    --exclude=node_modules \
    --exclude=backups \
    --exclude=*.log \
    --exclude=*.pid \
    --exclude=.git \
    public/ \
    server-v7.js \
    production-manager.sh \
    package.json \
    2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ بک‌آپ با موفقیت ایجاد شد:"
    echo "   📁 $BACKUP_PATH.tar.gz"
    echo "   📊 حجم: $(du -h "$BACKUP_PATH.tar.gz" | cut -f1)"
    echo ""
    echo "📋 محتویات بک‌آپ:"
    echo "   ✅ public/index.html (صفحه اصلی)"
    echo "   ✅ public/ai-chat-complete.html (چت AI)"
    echo "   ✅ public/css/common.css"
    echo "   ✅ public/js/common.js"
    echo "   ✅ server-v7.js (سرور بروز)"
    echo "   ✅ production-manager.sh"
    echo ""
else
    echo "❌ خطا در ایجاد بک‌آپ"
    exit 1
fi
