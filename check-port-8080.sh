#!/bin/bash

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}🔍 بررسی پورت 8080...${NC}"
echo "============================"

# بررسی آیا پورت 8080 در حال استفاده است
check_port_8080() {
    echo -e "\n${YELLOW}📡 وضعیت پورت 8080:${NC}"
    
    if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${GREEN}✅ پورت 8080 در حال استفاده است${NC}"
        
        # پیدا کردن process استفاده کننده
        process_pid=$(lsof -ti:8080)
        process_name=$(ps -p $process_pid -o comm= 2>/dev/null)
        process_cmd=$(ps -p $process_pid -o command= 2>/dev/null)
        
        echo -e "${BLUE}   🖥️  Process: $process_name (PID: $process_pid)${NC}"
        echo -e "${BLUE}   📝 Command: $process_cmd${NC}"
        
        # پیدا کردن user
        process_user=$(ps -p $process_pid -o user= 2>/dev/null)
        echo -e "${BLUE}   👤 User: $process_user${NC}"
        
        return 0
    else
        echo -e "${RED}❌ پورت 8080 آزاد است${NC}"
        return 1
    fi
}

# توقف process استفاده کننده از پورت 8080
stop_port_8080() {
    echo -e "\n${YELLOW}🛑 توقف process پورت 8080...${NC}"
    
    if lsof -ti:8080 >/dev/null; then
        pids=$(lsof -ti:8080)
        for pid in $pids; do
            process_name=$(ps -p $pid -o comm= 2>/dev/null)
            echo -e "${RED}⏹️  در حال توقف Process $process_name (PID: $pid)...${NC}"
            kill -9 $pid
            sleep 1
            if kill -0 $pid 2>/dev/null; then
                echo -e "${RED}❌ توقف Process $pid ناموفق بود${NC}"
            else
                echo -e "${GREEN}✅ Process $pid متوقف شد${NC}"
            fi
        done
    else
        echo -e "${YELLOW}⚠️ هیچ Process فعالی روی پورت 8080 پیدا نشد${NC}"
    fi
}

# شروع سرور روی پورت 8080
start_server_8080() {
    echo -e "\n${YELLOW}🚀 شروع سرور روی پورت 8080...${NC}"
    
    # بررسی فایل‌های سرور ممکن
    server_files=("server.js" "server-v7.js" "app.js" "index.js" "main.js")
    
    for file in "${server_files[@]}"; do
        if [ -f "$file" ]; then
            echo -e "${GREEN}📁 فایل سرور پیدا شد: $file${NC}"
            echo -e "${BLUE}   در حال اجرای $file روی پورت 8080...${NC}"
            
            # اجرای سرور در پس‌زمینه
            node "$file" &
            local pid=$!
            echo -e "${GREEN}✅ سرور اجرا شد (PID: $pid)${NC}"
            
            # منتظر بمان و بررسی کن
            sleep 3
            if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null; then
                echo -e "${GREEN}🎉 سرور با موفقیت روی پورت 8080 شروع شد!${NC}"
                return 0
            else
                echo -e "${RED}❌ سرور روی پورت 8080 شروع نشد${NC}"
                kill $pid 2>/dev/null
            fi
        fi
    done
    
    echo -e "${RED}❌ هیچ فایل سروری برای اجرا پیدا نشد${NC}"
    return 1
}

# تست اتصال به پورت 8080
test_port_8080() {
    echo -e "\n${YELLOW}🧪 تست اتصال به پورت 8080...${NC}"
    
    if nc -z localhost 8080 2>/dev/null; then
        echo -e "${GREEN}✅ اتصال به localhost:8080 موفقیت‌آمیز است${NC}"
        
        # تست با curl
        echo -e "${BLUE}   در حال تست با curl...${NC}"
        response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080)
        if [ "$response" != "000" ]; then
            echo -e "${GREEN}   📡 پاسخ HTTP: $response${NC}"
        else
            echo -e "${RED}   ❌ سرور پاسخ نمی‌دهد${NC}"
        fi
    else
        echo -e "${RED}❌ اتصال به localhost:8080 ناموفق بود${NC}"
    fi
}

# منوی اصلی
main_menu() {
    while true; do
        echo -e "\n${CYAN}منوی مدیریت پورت 8080:${NC}"
        echo -e "${GREEN}1) بررسی وضعیت پورت 8080${NC}"
        echo -e "${GREEN}2) تست اتصال به پورت 8080${NC}"
        echo -e "${YELLOW}3) شروع سرور روی پورت 8080${NC}"
        echo -e "${RED}4) توقف process پورت 8080${NC}"
        echo -e "${RED}5) خروج${NC}"
        
        echo -e "\n${BLUE}لطفاً عدد مورد نظر را وارد کنید:${NC}"
        read -r choice
        
        case $choice in
            1)
                check_port_8080
                ;;
            2)
                test_port_8080
                ;;
            3)
                start_server_8080
                ;;
            4)
                stop_port_8080
                ;;
            5)
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

# بررسی آیا اسکریپت مستقیم اجرا شده
if [ "$1" = "status" ]; then
    check_port_8080
elif [ "$1" = "stop" ]; then
    stop_port_8080
elif [ "$1" = "start" ]; then
    start_server_8080
elif [ "$1" = "test" ]; then
    test_port_8080
else
    main_menu
fi
