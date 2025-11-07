#!/data/data/com.termux/files/usr/bin/bash
# 🚀 Auto Deployment Script for Hormozgan Driver Pro
# Author: Mahdi Hadari

# مسیر پروژه
cd ~/hormozgan-driver-pro121 || exit

# نمایش بنر
echo -e "\n🟢 Starting Auto-Deploy for Hormozgan Driver Pro...\n"

# بررسی وضعیت فایل‌ها
git status

# افزودن تمام تغییرات
git add .

# زمان فعلی برای پیام commit
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# انجام commit
git commit -m "Auto Commit at $DATE"

# push به GitHub
git push origin main

# بررسی نتیجه
if [ $? -eq 0 ]; then
  echo -e "\n✅ Successfully pushed to GitHub at $DATE"
else
  echo -e "\n❌ Push failed. Check your network or token settings."
  exit 1
fi

# اجرای CLI برنامه
echo -e "\n🚖 Running Hormozgan Driver Pro CLI...\n"
node ~/hormozgan-driver-pro121/cli/index.js
