#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# تابع چاپ هدر
print_header() {
    clear
    echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}   ${MAGENTA}🚀 مدیریت کامل و خودکار Git${NC}   ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}\n"
}

# تابع نمایش منو
show_menu() {
    echo -e "${CYAN}┌─ گزینه‌های موجود ─────────────────────────┐${NC}"
    echo -e "${YELLOW}1${NC}) 📝 ایجاد Commit و Push (ساده)"
    echo -e "${YELLOW}2${NC}) 🌳 ایجاد شاخه جدید"
    echo -e "${YELLOW}3${NC}) 🔄 Merge شاخه به main"
    echo -e "${YELLOW}4${NC}) 📊 مشاهده وضعیت مخزن"
    echo -e "${YELLOW}5${NC}) 📜 مشاهده لاگ کمیت‌ها"
    echo -e "${YELLOW}6${NC}) 🏷️  ایجاد Tag (نسخه)"
    echo -e "${YELLOW}7${NC}) 🗑️  حذف شاخه محلی یا ریموت"
    echo -e "${YELLOW}8${NC}) ⚙️  تنظیمات Git"
    echo -e "${YELLOW}9${NC}) 🧹 تمیز کردن مخزن"
    echo -e "${YELLOW}0${NC}) 🚪 خروج"
    echo -e "${CYAN}└─────────────────────────────────────────────┘${NC}"
}

# تابع Commit و Push ساده
simple_commit() {
    print_header
    echo -e "${YELLOW}📝 ایجاد Commit و Push${NC}\n"
    
    git status
    echo ""
    
    read -p "پیام Commit را وارد کنید: " msg
    
    if [ -z "$msg" ]; then
        echo -e "${RED}❌ پیام نمی‌تواند خالی باشد${NC}"
        read -p "برای ادامه Enter بزنید..."
        return
    fi
    
    echo -e "\n${YELLOW}📦 Stage کردن تغییرات...${NC}"
    git add .
    
    echo -e "${YELLOW}💾 ایجاد Commit...${NC}"
    git commit -m "$msg"
    
    echo -e "${YELLOW}🚀 ارسال به سرور...${NC}"
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ عملیات موفق بود!${NC}"
    else
        echo -e "${RED}❌ خطا در Push${NC}"
    fi
    
    read -p "برای ادامه Enter بزنید..."
}

# تابع ایجاد شاخه
create_branch() {
    print_header
    echo -e "${YELLOW}🌳 ایجاد شاخه جدید${NC}\n"
    
    read -p "نام شاخه جدید را وارد کنید: " branch_name
    
    if [ -z "$branch_name" ]; then
        echo -e "${RED}❌ نام شاخه نمی‌تواند خالی باشد${NC}"
        read -p "برای ادامه Enter بزنید..."
        return
    fi
    
    echo -e "\n${YELLOW}🔄 ایجاد شاخه...${NC}"
    git checkout -b "$branch_name"
    
    echo -e "\n${YELLOW}📤 ارسال شاخه به سرور...${NC}"
    git push -u origin "$branch_name"
    
    echo -e "${GREEN}✅ شاخه '$branch_name' ایجاد شد!${NC}"
    read -p "برای ادامه Enter بزنید..."
}

# تابع Merge شاخه
merge_branch() {
    print_header
    echo -e "${YELLOW}🔄 Merge شاخه به main${NC}\n"
    
    git branch -a
    echo ""
    
    read -p "نام شاخه برای Merge را وارد کنید: " branch_name
    
    if [ -z "$branch_name" ]; then
        echo -e "${RED}❌ نام شاخه نمی‌تواند خالی باشد${NC}"
        read -p "برای ادامه Enter بزنید..."
        return
    fi
    
    echo -e "\n${YELLOW}🔄 تبدیل به main...${NC}"
    git checkout main
    
    echo -e "${YELLOW}📥 دریافت آخرین تغییرات...${NC}"
    git pull origin main
    
    echo -e "${YELLOW}🔀 Merge شاخه...${NC}"
    if git merge "$branch_name"; then
        echo -e "${YELLOW}🚀 ارسال به سرور...${NC}"
        git push origin main
        echo -e "${GREEN}✅ Merge موفق بود!${NC}"
    else
        echo -e "${RED}❌ تضادهایی در Merge وجود دارد${NC}"
        echo -e "${YELLOW}💡 لطفا تضادها را دستی حل کنید${NC}"
    fi
    
    read -p "برای ادامه Enter بزنید..."
}

# تابع مشاهده وضعیت
show_status() {
    print_header
    echo -e "${YELLOW}📊 وضعیت مخزن${NC}\n"
    
    git status
    
    echo -e "\n${YELLOW}📈 شاخه‌های محلی:${NC}"
    git branch
    
    echo -e "\n${YELLOW}📡 شاخه‌های ریموت:${NC}"
    git branch -r
    
    read -p "برای ادامه Enter بزنید..."
}

# تابع مشاهده لاگ
show_log() {
    print_header
    echo -e "${YELLOW}📜 آخرین کمیت‌ها${NC}\n"
    
    git log --oneline --graph --decorate --all -15
    
    read -p "برای ادامه Enter بزنید..."
}

# تابع Tag
create_tag() {
    print_header
    echo -e "${YELLOW}🏷️  ایجاد Tag (نسخه)${NC}\n"
    
    read -p "نام Tag را وارد کنید (مثال: v1.0.0): " tag_name
    
    if [ -z "$tag_name" ]; then
        echo -e "${RED}❌ نام Tag نمی‌تواند خالی باشد${NC}"
        read -p "برای ادامه Enter بزنید..."
        return
    fi
    
    read -p "توضیح Tag را وارد کنید: " tag_msg
    
    echo -e "\n${YELLOW}🔖 ایجاد Tag...${NC}"
    git tag -a "$tag_name" -m "$tag_msg"
    
    echo -e "${YELLOW}📤 ارسال Tag به سرور...${NC}"
    git push origin "$tag_name"
    
    echo -e "${GREEN}✅ Tag '$tag_name' ایجاد شد!${NC}"
    read -p "برای ادامه Enter بزنید..."
}

# تابع حذف شاخه
delete_branch() {
    print_header
    echo -e "${YELLOW}🗑️  حذف شاخه${NC}\n"
    
    git branch -a
    echo ""
    
    read -p "نام شاخه برای حذف را وارد کنید: " branch_name
    
    if [ -z "$branch_name" ]; then
        echo -e "${RED}❌ نام شاخه نمی‌تواند خالی باشد${NC}"
        read -p "برای ادامه Enter بزنید..."
        return
    fi
    
    read -p "آیا مطمئن هستید؟ (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        echo -e "${YELLOW}🗑️  حذف محلی...${NC}"
        git branch -d "$branch_name"
        
        echo -e "${YELLOW}🗑️  حذف از سرور...${NC}"
        git push origin --delete "$branch_name" 2>/dev/null || echo -e "${YELLOW}شاخه از قبل حذف شده است${NC}"
        
        echo -e "${GREEN}✅ شاخه حذف شد!${NC}"
    else
        echo -e "${YELLOW}❌ عملیات لغو شد${NC}"
    fi
    
    read -p "برای ادامه Enter بزنید..."
}

# تابع تنظیمات
settings() {
    print_header
    echo -e "${YELLOW}⚙️  تنظیمات Git${NC}\n"
    
    echo -e "${BLUE}تنظیمات فعلی:${NC}"
    git config --list | grep -E "user|remote"
    
    echo -e "\n${CYAN}┌─ گزینه‌ها ─────┐${NC}"
    echo -e "${YELLOW}1${NC}) تغییر نام کاربری"
    echo -e "${YELLOW}2${NC}) تغییر ایمیل"
    echo -e "${YELLOW}3${NC}) بازگشت"
    echo -e "${CYAN}└──────────────────┘${NC}"
    
    read -p "انتخاب کنید: " choice
    
    case $choice in
        1)
            read -p "نام جدید: " new_name
            git config --global user.name "$new_name"
            echo -e "${GREEN}✅ نام تغییر کرد${NC}"
            ;;
        2)
            read -p "ایمیل جدید: " new_email
            git config --global user.email "$new_email"
            echo -e "${GREEN}✅ ایمیل تغییر کرد${NC}"
            ;;
    esac
    
    read -p "برای ادامه Enter بزنید..."
}

# تابع تمیز کردن
cleanup() {
    print_header
    echo -e "${YELLOW}🧹 تمیز کردن مخزن${NC}\n"
    
    echo -e "${RED}⚠️  این عملیات غیرقابل برگشت است!${NC}\n"
    
    echo -e "${CYAN}┌─ گزینه‌ها ─────────────────────┐${NC}"
    echo -e "${YELLOW}1${NC}) حذف شاخه‌های حذف‌شده از سرور"
    echo -e "${YELLOW}2${NC}) بهینه‌سازی مخزن"
    echo -e "${YELLOW}3${NC}) بازگشت"
    echo -e "${CYAN}└─────────────────────────────────┘${NC}"
    
    read -p "انتخاب کنید: " choice
    
    case $choice in
        1)
            echo -e "${YELLOW}🧹 حذف شاخه‌های حذف‌شده...${NC}"
            git fetch --prune
            echo -e "${GREEN}✅ تمیز شد${NC}"
            ;;
        2)
            echo -e "${YELLOW}🧹 بهینه‌سازی...${NC}"
            git gc --aggressive
            echo -e "${GREEN}✅ بهینه شد${NC}"
            ;;
    esac
    
    read -p "برای ادامه Enter بزنید..."
}

# حلقه اصلی
main() {
    while true; do
        print_header
        show_menu
        read -p "انتخاب کنید (0-9): " choice
        
        case $choice in
            1) simple_commit ;;
            2) create_branch ;;
            3) merge_branch ;;
            4) show_status ;;
            5) show_log ;;
            6) create_tag ;;
            7) delete_branch ;;
            8) settings ;;
            9) cleanup ;;
            0) 
                echo -e "${GREEN}👋 خداحافظ!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ انتخاب نامعتبر${NC}"
                sleep 2
                ;;
        esac
    done
}

# شروع برنامه
main
