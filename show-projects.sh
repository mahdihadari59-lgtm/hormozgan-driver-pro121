#!/bin/bash

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m'

PROJECTS_DIR="$HOME/projects"

show_banner() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════╗"
    echo "║           📁 PROJECT MANAGER 📁     ║"
    echo "║         مدیر پروژه‌های ترومکس      ║"
    echo "╚══════════════════════════════════════╝"
    echo -e "${NC}"
}

check_projects_dir() {
    if [ ! -d "$PROJECTS_DIR" ]; then
        echo -e "${RED}❌ پوشه projects وجود ندارد!${NC}"
        echo -e "${YELLOW}📁 در حال ایجاد پوشه projects...${NC}"
        mkdir -p "$PROJECTS_DIR"
        echo -e "${GREEN}✅ پوشه projects ایجاد شد${NC}"
        return 1
    fi
    return 0
}

show_projects_tree() {
    echo -e "${CYAN}🌳 ساختار درختی پروژه‌ها:${NC}"
    echo -e "${YELLOW}────────────────────────────${NC}"
    
    if [ -d "$PROJECTS_DIR" ] && [ "$(ls -A $PROJECTS_DIR)" ]; then
        tree -a -L 3 -I 'node_modules|.git|__pycache__|.env' "$PROJECTS_DIR"
    else
        echo -e "${RED}📭 پوشه projects خالی است${NC}"
    fi
}

show_projects_list() {
    echo -e "${CYAN}📋 لیست پروژه‌ها:${NC}"
    echo -e "${YELLOW}────────────────${NC}"
    
    local projects=($(find "$PROJECTS_DIR" -maxdepth 1 -type d ! -path "$PROJECTS_DIR" | sort))
    
    if [ ${#projects[@]} -eq 0 ]; then
        echo -e "${RED}❌ هیچ پروژه‌ای یافت نشد${NC}"
        return 1
    fi
    
    for i in "${!projects[@]}"; do
        local project_name=$(basename "${projects[i]}")
        local project_size=$(du -sh "${projects[i]}" 2>/dev/null | cut -f1)
        local file_count=$(find "${projects[i]}" -type f | wc -l)
        
        echo -e "${GREEN}$((i+1))) ${project_name}${NC}"
        echo -e "   📊 حجم: ${YELLOW}${project_size}${NC} | 📄 فایل‌ها: ${BLUE}${file_count}${NC}"
        
        # تشخیص نوع پروژه
        detect_project_type "${projects[i]}"
        echo -e "${YELLOW}   ────────────────────────${NC}"
    done
}

detect_project_type() {
    local project_path=$1
    
    if [ -f "$project_path/package.json" ]; then
        echo -e "   🟢 ${GREEN}Node.js Project${NC}"
        local node_version=$(grep -o '"node": "[^"]*' "$project_path/package.json" | cut -d'"' -f4 2>/dev/null || echo "N/A")
        echo -e "   📦 Node Version: ${BLUE}$node_version${NC}"
    fi
    
    if [ -f "$project_path/requirements.txt" ]; then
        echo -e "   🐍 ${GREEN}Python Project${NC}"
        local req_count=$(wc -l < "$project_path/requirements.txt" 2>/dev/null || echo "0")
        echo -e "   📦 Requirements: ${BLUE}$req_count${NC} packages"
    fi
    
    if [ -f "$project_path/index.html" ]; then
        echo -e "   🌐 ${GREEN}Web Project${NC}"
    fi
    
    if [ -f "$project_path/.git" ] || [ -d "$project_path/.git" ]; then
        echo -e "   🔰 ${GREEN}Git Repository${NC}"
    fi
    
    if [ -f "$project_path/Dockerfile" ]; then
        echo -e "   🐳 ${GREEN}Docker Project${NC}"
    fi
    
    if [ -f "$project_path/server.js" ] || [ -f "$project_path/app.js" ]; then
        echo -e "   🚀 ${GREEN}Server Project${NC}"
    fi
}

show_project_details() {
    echo -e "\n${CYAN}🔍 مشاهده جزئیات پروژه:${NC}"
    read -p "شماره پروژه را وارد کنید: " project_num
    
    local projects=($(find "$PROJECTS_DIR" -maxdepth 1 -type d ! -path "$PROJECTS_DIR" | sort))
    
    if [[ $project_num -ge 1 && $project_num -le ${#projects[@]} ]]; then
        local selected_project="${projects[$((project_num-1))]}"
        local project_name=$(basename "$selected_project")
        
        echo -e "\n${GREEN}📊 جزئیات پروژه: ${project_name}${NC}"
        echo -e "${YELLOW}────────────────────────────────${NC}"
        
        # اطلاعات عمومی
        echo -e "📁 ${BLUE}مسیر:${NC} $selected_project"
        echo -e "📅 ${BLUE}تاریخ ایجاد:${NC} $(stat -c %y "$selected_project" 2>/dev/null | cut -d' ' -f1)"
        echo -e "💾 ${BLUE}حجم:${NC} $(du -sh "$selected_project" 2>/dev/null | cut -f1)"
        echo -e "📄 ${BLUE}تعداد فایل‌ها:${NC} $(find "$selected_project" -type f | wc -l)"
        
        # اطلاعات خاص پروژه
        echo -e "\n${YELLOW}🛠️ مشخصات فنی:${NC}"
        show_technical_details "$selected_project"
        
        # فایل‌های مهم
        echo -e "\n${YELLOW}📁 فایل‌های مهم:${NC}"
        show_important_files "$selected_project"
        
        # دسترسی به پروژه
        echo -e "\n${GREEN}🚀 دسترسی سریع:${NC}"
        echo -e "cd \"$selected_project\""
    else
        echo -e "${RED}❌ شماره پروژه نامعتبر${NC}"
    fi
}

show_technical_details() {
    local project_path=$1
    
    # Node.js
    if [ -f "$project_path/package.json" ]; then
        echo -e "🟢 ${GREEN}Node.js:${NC}"
        echo -e "   📦 نام: $(grep -o '"name": "[^"]*' "$project_path/package.json" | cut -d'"' -f4)"
        echo -e "   🏷️ نسخه: $(grep -o '"version": "[^"]*' "$project_path/package.json" | cut -d'"' -f4)"
        echo -e "   📚 وابستگی‌ها: $(grep -c '"dependencies"' "$project_path/package.json")"
    fi
    
    # Python
    if [ -f "$project_path/requirements.txt" ]; then
        echo -e "🐍 ${GREEN}Python:${NC}"
        echo -e "   📦 پکیج‌ها: $(wc -l < "$project_path/requirements.txt")"
    fi
    
    # Git
    if [ -d "$project_path/.git" ]; then
        echo -e "🔰 ${GREEN}Git:${NC}"
        cd "$project_path" && git branch 2>/dev/null | grep '*' | cut -d' ' -f2
        cd - >/dev/null
    fi
}

show_important_files() {
    local project_path=$1
    
    important_files=(
        "package.json" "requirements.txt" "Dockerfile" 
        "docker-compose.yml" "README.md" "index.html" 
        "server.js" "app.js" "main.py" "config.json"
    )
    
    for file in "${important_files[@]}"; do
        if [ -f "$project_path/$file" ]; then
            echo -e "   ✅ $file"
        fi
    done
}

create_new_project() {
    echo -e "\n${CYAN}🆕 ایجاد پروژه جدید:${NC}"
    read -p "نام پروژه: " project_name
    
    if [ -z "$project_name" ]; then
        echo -e "${RED}❌ نام پروژه نمی‌تواند خالی باشد${NC}"
        return 1
    fi
    
    local project_path="$PROJECTS_DIR/$project_name"
    
    if [ -d "$project_path" ]; then
        echo -e "${RED}❌ پروژه با این نام وجود دارد${NC}"
        return 1
    fi
    
    mkdir -p "$project_path"
    echo -e "${GREEN}✅ پروژه $project_name ایجاد شد${NC}"
    
    # ایجاد فایل‌های اولیه
    touch "$project_path/README.md"
    echo "# $project_name" > "$project_path/README.md"
    
    echo -e "${BLUE}📍 مسیر پروژه: $project_path${NC}"
}

navigate_to_project() {
    echo -e "\n${CYAN}🚀 انتقال به پروژه:${NC}"
    read -p "شماره پروژه: " project_num
    
    local projects=($(find "$PROJECTS_DIR" -maxdepth 1 -type d ! -path "$PROJECTS_DIR" | sort))
    
    if [[ $project_num -ge 1 && $project_num -le ${#projects[@]} ]]; then
        local selected_project="${projects[$((project_num-1))]}"
        cd "$selected_project"
        echo -e "${GREEN}✅ انتقال به $(basename "$selected_project")${NC}"
        echo -e "${BLUE}📍 مسیر فعلی: $(pwd)${NC}"
        ls -la
    else
        echo -e "${RED}❌ شماره پروژه نامعتبر${NC}"
    fi
}

main_menu() {
    while true; do
        show_banner
        
        echo -e "${GREEN}منوی اصلی:${NC}"
        echo -e "  ${YELLOW}1) نمایش ساختار درختی پروژه‌ها${NC}"
        echo -e "  ${YELLOW}2) لیست پروژه‌ها با جزئیات${NC}"
        echo -e "  ${YELLOW}3) مشاهده جزئیات یک پروژه${NC}"
        echo -e "  ${YELLOW}4) ایجاد پروژه جدید${NC}"
        echo -e "  ${YELLOW}5) انتقال به پوشه پروژه${NC}"
        echo -e "  ${YELLOW}6) بروزرسانی لیست${NC}"
        echo -e "  ${YELLOW}7) خروج${NC}"
        
        echo -e "\n${BLUE}لطفاً عدد مورد نظر را وارد کنید:${NC}"
        read -r choice
        
        case $choice in
            1) show_projects_tree ;;
            2) show_projects_list ;;
            3) show_project_details ;;
            4) create_new_project ;;
            5) navigate_to_project ;;
            6) echo -e "${GREEN}🔄 بروزرسانی شد${NC}" ;;
            7) 
                echo -e "${GREEN}👋 خروج از مدیر پروژه${NC}"
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

# شروع برنامه
check_projects_dir
main_menu
