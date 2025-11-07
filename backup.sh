#!/bin/bash

BACKUP_DIR="$HOME/hormozgan-backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "📦 شروع Backup..."

# Backup کد
tar -czf $BACKUP_DIR/code-$DATE.tar.gz \
    --exclude='node_modules' \
    --exclude='logs' \
    ~/hormozgan-driver-pro121

# Backup لاگ‌ها
tar -czf $BACKUP_DIR/logs-$DATE.tar.gz \
    ~/hormozgan-driver-pro121/logs

# حذف backup های قدیمی (بیش از 7 روز)
find $BACKUP_DIR -type f -mtime +7 -delete

echo "✅ Backup در $BACKUP_DIR ذخیره شد"
