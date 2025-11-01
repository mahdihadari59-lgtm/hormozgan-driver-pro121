#!/bin/bash

echo "🔍 بررسی مخزن GitHub..."
GITHUB_REPO="https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121"

# بررسی اتصال به GitHub
if curl --output /dev/null --silent --head --fail "$GITHUB_REPO"; then
    echo "✅ مخزن GitHub در دسترس است"
    
    # بررسی وضعیت Git محلی
    if [ -d ".git" ]; then
        echo "📊 وضعیت Git محلی:"
        git status
        
        echo "🌿 شاخه‌ها:"
        git branch -a
        
        echo "🔄 تفاوت با مخزن اصلی:"
        git fetch origin
        git log HEAD..origin/main --oneline
    else
        echo "⚠ پروژه Git نیست. راه‌اندازی می‌کنم..."
        git init
        git remote add origin "$GITHUB_REPO"
        git fetch origin
        
        # بررسی شاخه‌های موجود
        BRANCHES=$(git branch -r)
        if echo "$BRANCHES" | grep -q "origin/main"; then
            echo "✅ شاخه main وجود دارد"
            git checkout -b main origin/main
        else
            echo "🆕 ایجاد شاخه main جدید"
            git checkout -b main
        fi
    fi
else
    echo "❌ مخزن GitHub در دسترس نیست"
fi
