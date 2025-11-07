#!/bin/bash

# رنگ‌ها برای خروجی زیبا
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# متغیرهای پروژه
PROJECT_NAME="AI Sahel Hormozgan Driver"
VERSION="7.0"
PORT=8080
LOG_FILE="server.log"
PID_FILE="server.pid"

# تابع نمایش بنر
show_banner() {
    clear
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║           🤖 مدیریت خودکار سرور AI Sahel v7.0           ║"
    echo "╠════════════════════════════════════════════════════════════╣"
    echo "║   📱 سیستم مدیریت هوشمند سرور                            ║"
    echo "║   🚗 پروژه: Hormozgan Driver Pro                         ║"
    echo "║   📞 پشتیبانی: 07635108                                  ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# تابع چک کردن وضعیت سرور
check_server_status() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            echo -e "${GREEN}✅ سرور در حال اجرا است (PID: $PID)${NC}"
            return 0
        else
            echo -e "${RED}❌ فایل PID وجود دارد اما سرور متوقف است${NC}"
            rm -f "$PID_FILE"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  سرور در حال اجرا نیست${NC}"
        return 1
    fi
}

# تابع شروع سرور
start_server() {
    echo -e "${BLUE}🚀 در حال راه‌اندازی سرور...${NC}"
    
    if check_server_status > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  سرور قبلاً در حال اجرا است${NC}"
        return 1
    fi
    
    # بررسی فایل سرور
    if [ ! -f "server-v7.js" ]; then
        echo -e "${RED}❌ خطا: فایل server-v7.js یافت نشد${NC}"
        return 1
    fi
    
    # شروع سرور در پس‌زمینه
    nohup node server-v7.js > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    
    sleep 2
    
    if check_server_status > /dev/null 2>&1; then
        echo -e "${GREEN}✅ سرور با موفقیت راه‌اندازی شد${NC}"
        echo -e "${CYAN}📱 آدرس: http://localhost:$PORT${NC}"
        echo -e "${CYAN}🤖 AI Chat: http://localhost:$PORT/ai-chat${NC}"
        return 0
    else
        echo -e "${RED}❌ خطا در راه‌اندازی سرور${NC}"
        return 1
    fi
}

# تابع توقف سرور
stop_server() {
    echo -e "${YELLOW}🛑 در حال توقف سرور...${NC}"
    
    if [ ! -f "$PID_FILE" ]; then
        echo -e "${YELLOW}⚠️  سرور در حال اجرا نیست${NC}"
        return 1
    fi
    
    PID=$(cat "$PID_FILE")
    
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID
        sleep 2
        
        if ps -p $PID > /dev/null 2>&1; then
            echo -e "${RED}⚠️  سرور پاسخ نمی‌دهد، در حال kill اجباری...${NC}"
            kill -9 $PID
        fi
        
        rm -f "$PID_FILE"
        echo -e "${GREEN}✅ سرور با موفقیت متوقف شد${NC}"
    else
        rm -f "$PID_FILE"
        echo -e "${YELLOW}⚠️  سرور قبلاً متوقف شده بود${NC}"
    fi
}

# تابع ری‌استارت سرور
restart_server() {
    echo -e "${PURPLE}🔄 در حال ری‌استارت سرور...${NC}"
    stop_server
    sleep 1
    start_server
}

# تابع نمایش لاگ‌ها
show_logs() {
    echo -e "${CYAN}📋 نمایش لاگ‌های سرور (Ctrl+C برای خروج)${NC}"
    echo "─────────────────────────────────────────────────────"
    
    if [ -f "$LOG_FILE" ]; then
        tail -f "$LOG_FILE"
    else
        echo -e "${RED}❌ فایل لاگ یافت نشد${NC}"
    fi
}

# تابع نمایش آخرین لاگ‌ها
show_last_logs() {
    echo -e "${CYAN}📋 آخرین 20 خط از لاگ‌ها:${NC}"
    echo "─────────────────────────────────────────────────────"
    
    if [ -f "$LOG_FILE" ]; then
        tail -n 20 "$LOG_FILE"
    else
        echo -e "${RED}❌ فایل لاگ یافت نشد${NC}"
    fi
}

# تابع پاک کردن لاگ‌ها
clear_logs() {
    echo -e "${YELLOW}🗑️  در حال پاک کردن لاگ‌ها...${NC}"
    
    if [ -f "$LOG_FILE" ]; then
        > "$LOG_FILE"
        echo -e "${GREEN}✅ لاگ‌ها پاک شدند${NC}"
    else
        echo -e "${YELLOW}⚠️  فایل لاگ وجود ندارد${NC}"
    fi
}

# تابع تست سرور
test_server() {
    echo -e "${BLUE}🧪 در حال تست سرور...${NC}"
    echo "─────────────────────────────────────────────────────"
    
    if ! check_server_status > /dev/null 2>&1; then
        echo -e "${RED}❌ سرور در حال اجرا نیست${NC}"
        return 1
    fi
    
    # تست صفحه اصلی
    echo -e "${CYAN}📱 تست صفحه اصلی...${NC}"
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/ | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✅ صفحه اصلی: OK${NC}"
    else
        echo -e "${RED}❌ صفحه اصلی: خطا${NC}"
    fi
    
    # تست API health
    echo -e "${CYAN}🏥 تست Health Check...${NC}"
    if curl -s http://localhost:$PORT/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Health Check: OK${NC}"
    else
        echo -e "${RED}❌ Health Check: خطا${NC}"
    fi
    
    # تست صفحه AI Chat
    echo -e "${CYAN}🤖 تست AI Chat...${NC}"
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/ai-chat | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✅ AI Chat: OK${NC}"
    else
        echo -e "${RED}❌ AI Chat: خطا${NC}"
    fi
    
    echo "─────────────────────────────────────────────────────"
}

# تابع نمایش اطلاعات سیستم
show_info() {
    echo -e "${CYAN}ℹ️  اطلاعات سیستم:${NC}"
    echo "─────────────────────────────────────────────────────"
    echo -e "${BLUE}پروژه:${NC} $PROJECT_NAME"
    echo -e "${BLUE}نسخه:${NC} $VERSION"
    echo -e "${BLUE}پورت:${NC} $PORT"
    echo -e "${BLUE}فایل لاگ:${NC} $LOG_FILE"
    echo -e "${BLUE}Node.js:${NC} $(node --version 2>/dev/null || echo 'نصب نشده')"
    echo -e "${BLUE}npm:${NC} $(npm --version 2>/dev/null || echo 'نصب نشده')"
    echo "─────────────────────────────────────────────────────"
    check_server_status
    echo "─────────────────────────────────────────────────────"
}

# تابع نصب وابستگی‌ها
install_dependencies() {
    echo -e "${BLUE}📦 در حال نصب وابستگی‌ها...${NC}"
    
    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ فایل package.json یافت نشد${NC}"
        return 1
    fi
    
    npm install
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ وابستگی‌ها با موفقیت نصب شدند${NC}"
    else
        echo -e "${RED}❌ خطا در نصب وابستگی‌ها${NC}"
    fi
}

# تابع بک‌آپ
create_backup() {
    BACKUP_DIR="backups"
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S).tar.gz"
    
    echo -e "${BLUE}💾 در حال ایجاد بک‌آپ...${NC}"
    
    mkdir -p "$BACKUP_DIR"
    
    tar -czf "$BACKUP_DIR/$BACKUP_NAME" \
        --exclude=node_modules \
        --exclude=backups \
        --exclude=*.log \
        --exclude=*.pid \
        . 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ بک‌آپ ایجاد شد: $BACKUP_DIR/$BACKUP_NAME${NC}"
    else
        echo -e "${RED}❌ خطا در ایجاد بک‌آپ${NC}"
    fi
}

# تابع مانیتورینگ
monitor_server() {
    echo -e "${CYAN}📊 مانیتورینگ سرور (Ctrl+C برای خروج)${NC}"
    echo "─────────────────────────────────────────────────────"
    
    while true; do
        clear
        show_banner
        show_info
        
        if check_server_status > /dev/null 2>&1; then
            PID=$(cat "$PID_FILE")
            echo -e "${CYAN}💻 مصرف منابع:${NC}"
            ps -p $PID -o %cpu,%mem,etime,cmd 2>/dev/null || echo "اطلاعات در دسترس نیست"
        fi
        
        echo ""
        echo -e "${YELLOW}⏱️  به‌روزرسانی در 5 ثانیه...${NC}"
        sleep 5
    done
}

# منوی اصلی
show_menu() {
    while true; do
        show_banner
        check_server_status
        echo ""
        echo -e "${CYAN}┌─────────────────────────────────────────────────────┐${NC}"
        echo -e "${CYAN}│               🎮 منوی مدیریت سرور                  │${NC}"
        echo -e "${CYAN}├─────────────────────────────────────────────────────┤${NC}"
        echo -e "${CYAN}│${NC}  ${GREEN}1.${NC} 🚀 شروع سرور                                  ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${RED}2.${NC} 🛑 توقف سرور                                   ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${PURPLE}3.${NC} 🔄 ری‌استارت سرور                            ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${BLUE}4.${NC} 📋 نمایش لاگ‌ها (زنده)                       ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${BLUE}5.${NC} 📜 نمایش آخرین لاگ‌ها                        ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${YELLOW}6.${NC} 🗑️  پاک کردن لاگ‌ها                         ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${BLUE}7.${NC} 🧪 تست سرور                                  ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${CYAN}8.${NC} ℹ️  نمایش اطلاعات                             ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${BLUE}9.${NC} 📦 نصب وابستگی‌ها                            ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${PURPLE}10.${NC} 💾 ایجاد بک‌آپ                             ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${GREEN}11.${NC} 📊 مانیتورینگ                              ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${RED}0.${NC} 🚪 خروج                                       ${CYAN}│${NC}"
        echo -e "${CYAN}└─────────────────────────────────────────────────────┘${NC}"
        echo ""
        echo -n -e "${YELLOW}انتخاب شما: ${NC}"
        read choice
        
        case $choice in
            1) start_server ;;
            2) stop_server ;;
            3) restart_server ;;
            4) show_logs ;;
            5) show_last_logs ;;
            6) clear_logs ;;
            7) test_server ;;
            8) show_info ;;
            9) install_dependencies ;;
            10) create_backup ;;
            11) monitor_server ;;
            0) 
                echo -e "${GREEN}👋 خداحافظ!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ انتخاب نامعتبر${NC}"
                ;;
        esac
        
        echo ""
        echo -n -e "${YELLOW}برای ادامه Enter بزنید...${NC}"
        read
    done
}

# اجرای منوی اصلی
show_menu
