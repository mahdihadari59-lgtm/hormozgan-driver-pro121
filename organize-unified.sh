#!/bin/bash
echo "🏗️ ایجاد ساختار یکپارچه برای پروژه هرمزگان..."
mkdir -p hormozgan-driver-pro-organized/{core,public/pages,modules/traffic-laws,scripts,data}
cp server.js hormozgan-driver-pro-organized/core/
cp server-clean.js hormozgan-driver-pro-organized/core/ 
cp server-pro.js hormozgan-driver-pro-organized/core/
cp server-v8.js hormozgan-driver-pro-organized/core/
cp app.js hormozgan-driver-pro-organized/core/
cp public/index.html hormozgan-driver-pro-organized/public/pages/
cp public/festivals.html hormozgan-driver-pro-organized/public/pages/
cp public/ai-chat.html hormozgan-driver-pro-organized/public/pages/
cp public/driver-dashboard.html hormozgan-driver-pro-organized/public/pages/
cp overtaking-laws.js hormozgan-driver-pro-organized/modules/traffic-laws/
cp pedestrian-laws.js hormozgan-driver-pro-organized/modules/traffic-laws/ 
cp safety-laws.js hormozgan-driver-pro-organized/modules/traffic-laws/
cp speed-laws.js hormozgan-driver-pro-organized/modules/traffic-laws/
cp scripts/*.sh hormozgan-driver-pro-organized/scripts/ 2>/dev/null || true
cp *.sh hormozgan-driver-pro-organized/scripts/ 2>/dev/null || true
cp package.json hormozgan-driver-pro-organized/
cp project-config.json hormozgan-driver-pro-organized/data/
echo "✅ ساختار یکپارچه ایجاد شد!"
echo "📁 مسیر: hormozgan-driver-pro-organized"
