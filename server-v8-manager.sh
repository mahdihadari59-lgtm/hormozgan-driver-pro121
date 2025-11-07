#!/bin/bash

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🚀 مدیریت سرور server-v8.js${NC}"
echo "===================================="

# بررسی وجود فایل
check_v8_file() {
    if [ ! -f "server-v8.js" ]; then
        echo -e "${RED}❌ فایل server-v8.js یافت نشد!${NC}"
        
        # جستجو برای فایل‌های مشابه
        echo -e "${YELLOW}🔍 در حال جستجو برای فایل‌های مشابه...${NC}"
        similar_files=$(find . -name "*server*v8*" -o -name "*v8*server*" -type f 2>/dev/null)
        
        if [ ! -z "$similar_files" ]; then
            echo -e "${GREEN}📁 فایل‌های مشابه پیدا شد:${NC}"
            echo "$similar_files"
        else
            echo -e "${YELLOW}⚠️ هیچ فایل مشابهی پیدا نشد${NC}"
            
            # ایجاد فایل نمونه اگر وجود ندارد
            echo -e "${BLUE}📝 ایجاد فایل server-v8.js نمونه...${NC}"
            create_sample_v8_server
        fi
        return 1
    else
        echo -e "${GREEN}✅ فایل server-v8.js موجود است${NC}"
        return 0
    fi
}

# ایجاد فایل سرور نمونه
create_sample_v8_server() {
    cat > server-v8.js << 'EOF'
// server-v8.js - سرور نمونه با قابلیت‌های پیشرفته
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// middleware پیشرفته
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// لاگینگ پیشرفته
const logger = (req, res, next) => {
    console.log(`📅 ${new Date().toISOString()} | 🌐 ${req.method} ${req.url} | 📍 ${req.ip}`);
    next();
};
app.use(logger);

// routes پیشرفته
app.get('/', (req, res) => {
    res.json({
        message: '🚀 سرور V8 در حال اجراست!',
        version: 'v8.0.0',
        timestamp: new Date().toISOString(),
        endpoints: [
            '/api/v1/status',
            '/api/v1/info',
            '/api/v1/users'
        ]
    });
});

app.get('/api/v1/status', (req, res) => {
    res.json({
        status: 'active',
        server: 'Node.js V8',
        memory: process.memoryUsage(),
        uptime: process.uptime()
    });
});

app.get('/api/v1/info', (req, res) => {
    res.json({
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        pid: process.pid
    });
});

// مدیریت خطای پیشرفته
app.use((err, req, res, next) => {
    console.error('❌ خطا:', err.stack);
    res.status(500).json({
        error: 'خطای داخلی سرور',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// route 404
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'صفحه یافت نشد',
        path: req.originalUrl,
        method: req.method
    });
});

// شروع سرور
app.listen(PORT, () => {
    console.log(`
✨ ===============================
   🚀 سرور V8 راه‌اندازی شد!
   📍 پورت: ${PORT}
   ⏰ زمان: ${new Date().toLocaleString('fa-IR')}
   🆔 PID: ${process.pid}
✨ ===============================
    `);
});

// مدیریت graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 دریافت SIGTERM، خروج graceful...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 دریافت SIGINT، خروج graceful...');
    process.exit(0);
});
EOF
    echo -e "${GREEN}✅ فایل server-v8.js نمونه ایجاد شد${NC}"
}

# اجرای سرور v8
start_v8_server() {
    check_v8_file || return 1
    
    echo -e "\n${YELLOW}🚀 در حال اجرای server-v8.js...${NC}"
    
    # بررسی آیا پورت در حال استفاده است
    if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null; then
        echo -e "${RED}⚠️ پورت 8080 در حال استفاده است${NC}"
        read -p "آیا می‌خواهید process فعلی را متوقف کنید؟ (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            sudo kill -9 $(sudo lsof -t -i:8080)
            sleep 2
        else
            echo -e "${YELLOW}🌀 اجرای روی پورت متفاوت...${NC}"
            PORT=8081 node server-v8.js &
            return 0
        fi
    fi
    
    # اجرای سرور
    node server-v8.js &
    local pid=$!
    
    echo -e "${GREEN}✅ server-v8.js اجرا شد (PID: $pid)${NC}"
    echo "$pid" > server-v8.pid
    
    # منتظر بمان و بررسی کن
    sleep 3
    if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null; then
        echo -e "${GREEN}🎉 سرور با موفقیت شروع شد!${NC}"
        echo -e "${BLUE}📡 آدرس: http://localhost:8080${NC}"
    else
        echo -e "${RED}❌ سرور شروع نشد${NC}"
    fi
}

# توقف سرور v8
stop_v8_server() {
    echo -e "\n${YELLOW}🛑 توقف server-v8.js...${NC}"
    
    if [ -f "server-v8.pid" ]; then
        pid=$(cat server-v8.pid)
        if kill -0 $pid 2>/dev/null; then
            kill $pid
            echo -e "${GREEN}✅ سرور متوقف شد (PID: $pid)${NC}"
            rm -f server-v8.pid
        else
            echo -e "${YELLOW}⚠️ Process با PID $pid پیدا نشد${NC}"
            rm -f server-v8.pid
        fi
    fi
    
    # توقف با پورت
    if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null; then
        pids=$(lsof -ti:8080)
        for pid in $pids; do
            process_name=$(ps -p $pid -o comm= 2>/dev/null)
            if [[ "$process_name" == "node" ]]; then
                echo -e "${RED}⏹️ در حال توقف Process $pid...${NC}"
                kill $pid
                echo -e "${GREEN}✅ Process $pid متوقف شد${NC}"
            fi
        done
    else
        echo -e "${YELLOW}⚠️ هیچ سرور فعالی پیدا نشد${NC}"
    fi
}

# وضعیت سرور v8
status_v8_server() {
    echo -e "\n${YELLOW}📊 وضعیت server-v8.js:${NC}"
    
    if [ -f "server-v8.pid" ]; then
        pid=$(cat server-v8.pid)
        if kill -0 $pid 2>/dev/null; then
            echo -e "${GREEN}✅ سرور در حال اجراست (PID: $pid)${NC}"
            
            # اطلاعات process
            process_info=$(ps -p $pid -o pid,user,%cpu,%mem,command --no-headers)
            echo -e "${BLUE}   📟 اطلاعات Process:${NC}"
            echo "   $process_info"
            
            # پورت‌ها
            ports=$(lsof -Pan -p $pid -i 2>/dev/null | grep LISTEN | awk '{print $9}')
            if [ ! -z "$ports" ]; then
                echo -e "${BLUE}   🚪 پورت‌ها: $ports${NC}"
            fi
        else
            echo -e "${RED}❌ سرور متوقف شده (PID: $pid)${NC}"
            rm -f server-v8.pid
        fi
    else
        echo -e "${YELLOW}⚠️ فایل PID یافت نشد${NC}"
    fi
    
    # بررسی از طریق پورت
    if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null; then
        echo -e "${GREEN}🌐 پورت 8080 فعال است${NC}"
    else
        echo -e "${RED}🌐 پورت 8080 غیرفعال است${NC}"
    fi
}

# منوی اصلی
main_menu() {
    while true; do
        echo -e "\n${CYAN}منوی مدیریت server-v8.js:${NC}"
        echo -e "${GREEN}1) اجرای سرور${NC}"
        echo -e "${GREEN}2) توقف سرور${NC}"
        echo -e "${GREEN}3) وضعیت سرور${NC}"
        echo -e "${BLUE}4) ایجاد فایل نمونه${NC}"
        echo -e "${YELLOW}5) تست سرور${NC}"
        echo -e "${RED}6) خروج${NC}"
        
        echo -e "\n${BLUE}لطفاً عدد مورد نظر را وارد کنید:${NC}"
        read -r choice
        
        case $choice in
            1)
                start_v8_server
                ;;
            2)
                stop_v8_server
                ;;
            3)
                status_v8_server
                ;;
            4)
                create_sample_v8_server
                ;;
            5)
                echo -e "\n${YELLOW}🧪 تست سرور...${NC}"
                curl -s http://localhost:8080 | head -n 10
                ;;
            6)
                echo -e "${CYAN}👋 خروج${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ انتخاب نامعتبر!${NC}"
                ;;
        esac
        
        echo -e "\n${YELLOW}────────────────────────────────${NC}"
        read -p "ادامه؟ (Enter برای ادامه): "
    done
}

# اجرا بر اساس پارامتر
case "$1" in
    "start")
        start_v8_server
        ;;
    "stop")
        stop_v8_server
        ;;
    "status")
        status_v8_server
        ;;
    "create")
        create_sample_v8_server
        ;;
    *)
        main_menu
        ;;
esac
