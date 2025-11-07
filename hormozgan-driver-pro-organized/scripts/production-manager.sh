#!/bin/bash

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# تنظیمات
APP_NAME="AI-Sahel-Production"
NODE_SCRIPT="server-v7.js"
PORT=8080
MAX_MEMORY="512M"
LOG_DIR="logs"
PID_FILE="production.pid"
ERROR_LOG="$LOG_DIR/error.log"
ACCESS_LOG="$LOG_DIR/access.log"
RESTART_LOG="$LOG_DIR/restart.log"
MAX_RESTARTS=10
RESTART_DELAY=5

# ایجاد پوشه لاگ
mkdir -p "$LOG_DIR"

# تابع نمایش بنر
show_banner() {
    clear
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║          🚀 AI Sahel Production Manager v2.0                 ║"
    echo "╠═══════════════════════════════════════════════════════════════╣"
    echo "║   🔥 Auto-Start | Keep-Alive | Advanced Monitoring          ║"
    echo "║   💪 Production-Grade Server Management                      ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# تابع لاگ
log_message() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$ACCESS_LOG"
}

# تابع لاگ خطا
log_error() {
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [ERROR] $message" | tee -a "$ERROR_LOG"
}

# تابع بررسی وضعیت
check_status() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            return 0
        fi
    fi
    return 1
}

# تابع شروع سرور
start_server() {
    log_message "INFO" "🚀 Starting production server..."
    
    if check_status; then
        log_message "WARN" "⚠️  Server already running (PID: $(cat $PID_FILE))"
        return 1
    fi
    
    # بررسی فایل
    if [ ! -f "$NODE_SCRIPT" ]; then
        log_error "❌ Server file not found: $NODE_SCRIPT"
        return 1
    fi
    
    # شروع سرور
    NODE_ENV=production node "$NODE_SCRIPT" > "$ACCESS_LOG" 2> "$ERROR_LOG" &
    echo $! > "$PID_FILE"
    
    sleep 3
    
    if check_status; then
        log_message "SUCCESS" "✅ Server started successfully (PID: $(cat $PID_FILE))"
        log_message "INFO" "📱 URL: http://localhost:$PORT"
        return 0
    else
        log_error "❌ Failed to start server"
        cat "$ERROR_LOG" | tail -5
        return 1
    fi
}

# تابع توقف سرور
stop_server() {
    log_message "INFO" "🛑 Stopping server..."
    
    if [ ! -f "$PID_FILE" ]; then
        log_message "WARN" "⚠️  Server not running"
        return 1
    fi
    
    PID=$(cat "$PID_FILE")
    
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID
        sleep 2
        
        if ps -p $PID > /dev/null 2>&1; then
            log_message "WARN" "⚠️  Force killing server..."
            kill -9 $PID
        fi
        
        rm -f "$PID_FILE"
        log_message "SUCCESS" "✅ Server stopped"
    else
        rm -f "$PID_FILE"
        log_message "WARN" "⚠️  Server was not running"
    fi
}

# تابع Keep-Alive (نگهداری سرور زنده)
keep_alive() {
    local restart_count=0
    
    log_message "INFO" "🔥 Keep-Alive mode activated"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Keep-Alive started" >> "$RESTART_LOG"
    
    while true; do
        if ! check_status; then
            restart_count=$((restart_count + 1))
            
            if [ $restart_count -gt $MAX_RESTARTS ]; then
                log_error "❌ Max restart limit reached ($MAX_RESTARTS). Stopping Keep-Alive."
                echo "$(date '+%Y-%m-%d %H:%M:%S') - Max restarts reached. Stopping." >> "$RESTART_LOG"
                exit 1
            fi
            
            log_message "WARN" "⚠️  Server crashed! Restarting... (Attempt $restart_count/$MAX_RESTARTS)"
            echo "$(date '+%Y-%m-%d %H:%M:%S') - Restart #$restart_count" >> "$RESTART_LOG"
            
            sleep $RESTART_DELAY
            start_server
        fi
        
        sleep 10
    done
}

# تابع مانیتور منابع
monitor_resources() {
    show_banner
    log_message "INFO" "📊 Starting resource monitor..."
    
    while true; do
        clear
        show_banner
        
        if check_status; then
            PID=$(cat "$PID_FILE")
            echo -e "${GREEN}✅ Server Status: RUNNING${NC}"
            echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo -e "${BLUE}📊 Process Info:${NC}"
            echo "   PID: $PID"
            echo "   Port: $PORT"
            echo "   Uptime: $(ps -p $PID -o etime= 2>/dev/null | xargs)"
            echo ""
            echo -e "${BLUE}💻 Resource Usage:${NC}"
            ps -p $PID -o %cpu,%mem,vsz,rss,cmd 2>/dev/null | tail -1 | awk '{
                printf "   CPU: %s%%\n", $1
                printf "   Memory: %s%% (RSS: %s KB)\n", $2, $4
                printf "   Virtual Memory: %s KB\n", $3
            }'
            echo ""
            echo -e "${BLUE}🌐 Network:${NC}"
            echo "   URL: http://localhost:$PORT"
            netstat -tulpn 2>/dev/null | grep ":$PORT " | head -3
            echo ""
            echo -e "${BLUE}📁 Recent Logs:${NC}"
            tail -5 "$ACCESS_LOG" 2>/dev/null | sed 's/^/   /'
            echo ""
            echo -e "${YELLOW}⏱️  Auto-refresh in 5 seconds... (Ctrl+C to exit)${NC}"
        else
            echo -e "${RED}❌ Server Status: STOPPED${NC}"
            echo ""
            echo -e "${YELLOW}Press Ctrl+C to exit${NC}"
        fi
        
        sleep 5
    done
}

# تابع آنالیز لاگ
analyze_logs() {
    show_banner
    echo -e "${CYAN}📊 Log Analysis${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ -f "$ERROR_LOG" ]; then
        echo -e "${RED}🔥 Errors (Last 10):${NC}"
        tail -10 "$ERROR_LOG" | sed 's/^/   /'
        echo ""
    fi
    
    if [ -f "$RESTART_LOG" ]; then
        echo -e "${YELLOW}🔄 Restarts:${NC}"
        cat "$RESTART_LOG" | sed 's/^/   /'
        echo ""
    fi
    
    if [ -f "$ACCESS_LOG" ]; then
        echo -e "${GREEN}📝 Access Log (Last 20):${NC}"
        tail -20 "$ACCESS_LOG" | sed 's/^/   /'
    fi
}

# تابع پاکسازی
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up old logs...${NC}"
    
    find "$LOG_DIR" -name "*.log" -mtime +7 -delete
    
    if [ -f "$ERROR_LOG" ]; then
        if [ $(wc -l < "$ERROR_LOG") -gt 1000 ]; then
            tail -500 "$ERROR_LOG" > "$ERROR_LOG.tmp"
            mv "$ERROR_LOG.tmp" "$ERROR_LOG"
        fi
    fi
    
    if [ -f "$ACCESS_LOG" ]; then
        if [ $(wc -l < "$ACCESS_LOG") -gt 5000 ]; then
            tail -2500 "$ACCESS_LOG" > "$ACCESS_LOG.tmp"
            mv "$ACCESS_LOG.tmp" "$ACCESS_LOG"
        fi
    fi
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# تابع نصب سرویس systemd (اختیاری)
install_systemd_service() {
    echo -e "${BLUE}📦 Installing systemd service...${NC}"
    
    SCRIPT_PATH=$(realpath "$0")
    WORK_DIR=$(pwd)
    
    cat > /tmp/ai-sahel.service << EOFS
[Unit]
Description=AI Sahel Production Server
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$WORK_DIR
ExecStart=$SCRIPT_PATH daemon
Restart=always
RestartSec=10
StandardOutput=append:$WORK_DIR/$ACCESS_LOG
StandardError=append:$WORK_DIR/$ERROR_LOG

[Install]
WantedBy=multi-user.target
EOFS
    
    echo "Service file created at: /tmp/ai-sahel.service"
    echo ""
    echo "To install (requires sudo):"
    echo "  sudo cp /tmp/ai-sahel.service /etc/systemd/system/"
    echo "  sudo systemctl daemon-reload"
    echo "  sudo systemctl enable ai-sahel"
    echo "  sudo systemctl start ai-sahel"
}

# منوی اصلی
show_menu() {
    while true; do
        show_banner
        
        if check_status; then
            echo -e "${GREEN}✅ Server Status: RUNNING (PID: $(cat $PID_FILE))${NC}"
        else
            echo -e "${RED}❌ Server Status: STOPPED${NC}"
        fi
        
        echo ""
        echo -e "${CYAN}┌────────────────────────────────────────────────────────┐${NC}"
        echo -e "${CYAN}│           🎮 Production Management Menu               │${NC}"
        echo -e "${CYAN}├────────────────────────────────────────────────────────┤${NC}"
        echo -e "${CYAN}│${NC}  ${GREEN}1.${NC}  🚀 Start Server                                  ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${RED}2.${NC}  🛑 Stop Server                                   ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${PURPLE}3.${NC}  🔄 Restart Server                              ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${YELLOW}4.${NC}  🔥 Start with Keep-Alive (Auto-Restart)       ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${BLUE}5.${NC}  📊 Monitor Resources (Live)                    ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${BLUE}6.${NC}  📋 Analyze Logs                                ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${YELLOW}7.${NC}  🧹 Cleanup Old Logs                           ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${PURPLE}8.${NC}  📦 Install as System Service                  ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${CYAN}9.${NC}  ℹ️  Show Server Info                            ${CYAN}│${NC}"
        echo -e "${CYAN}│${NC}  ${RED}0.${NC}  🚪 Exit                                         ${CYAN}│${NC}"
        echo -e "${CYAN}└────────────────────────────────────────────────────────┘${NC}"
        echo ""
        echo -n -e "${YELLOW}Select option: ${NC}"
        read choice
        
        case $choice in
            1)
                start_server
                ;;
            2)
                stop_server
                ;;
            3)
                stop_server
                sleep 1
                start_server
                ;;
            4)
                start_server
                if [ $? -eq 0 ]; then
                    echo ""
                    echo -e "${GREEN}🔥 Keep-Alive mode starting...${NC}"
                    echo -e "${YELLOW}Press Ctrl+C to stop Keep-Alive${NC}"
                    sleep 2
                    keep_alive
                fi
                ;;
            5)
                monitor_resources
                ;;
            6)
                analyze_logs
                ;;
            7)
                cleanup
                ;;
            8)
                install_systemd_service
                ;;
            9)
                show_banner
                echo -e "${CYAN}ℹ️  Server Information:${NC}"
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                echo "App Name: $APP_NAME"
                echo "Script: $NODE_SCRIPT"
                echo "Port: $PORT"
                echo "Log Directory: $LOG_DIR"
                echo "Node.js: $(node --version 2>/dev/null || echo 'Not found')"
                echo "npm: $(npm --version 2>/dev/null || echo 'Not found')"
                echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                ;;
            0)
                echo -e "${GREEN}👋 Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Invalid option${NC}"
                ;;
        esac
        
        echo ""
        echo -n -e "${YELLOW}Press Enter to continue...${NC}"
        read
    done
}

# اجرای اصلی
case "${1:-menu}" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        stop_server
        sleep 1
        start_server
        ;;
    daemon)
        start_server
        keep_alive
        ;;
    monitor)
        monitor_resources
        ;;
    logs)
        analyze_logs
        ;;
    cleanup)
        cleanup
        ;;
    *)
        show_menu
        ;;
esac
