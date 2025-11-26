 HEAD
# 🚗 Hormozgan Driver Pro v2.0

سامانه هوشمند مدیریت رانندگان استان هرمزگان

## نصب و راه‌اندازی

### 1. نصب dependencies
```bash
pnpm install
2. ایجاد دیتابیس
npm run init-db
3. اجرای سرور
npm start
API Endpoints
Authentication
POST /api/auth/register - ثبت‌نام
POST /api/auth/login - ورود
GET /api/auth/me - اطلاعات کاربر
Drivers
GET /api/drivers - لیست رانندگان
GET /api/drivers/:id - اطلاعات یک راننده
Technologies
Node.js + Express
SQLite (better-sqlite3)
JWT Authentication
bcryptjs
Author
Mahdi Hadari
=======
## ✨ ویژگی‌ها

### 🗺️ نقشه تعاملی
- نمایش لحظه‌ای موقعیت رانندگان
- نقشه Leaflet.js
- به‌روزرسانی خودکار هر 5 ثانیه
- نشانگرهای سفارشی

### 💰 محاسبه‌> <div align="center">
>
> # 🚕 Hormozgan Driver Pro
ormozgan-driver-pro121

# اجرای سرور (بدون نیاز به npm install)
nod>
d.html        # داشبورد
│   ├── driver-registration.html  # ثبت‌نام راننده
│   ├── contact.html          # تماس با ما
│   ├── 404.html     > [![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121)
: Git> [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
> [![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-BADGE-ID/deploy-status)](https://app.netlify.com/sites/hormozgan-driver-pro/deploys)
>
�> **پلتفرم هوشمند تاکسی‌یابی استان هرمزگان**
>
�> [🌐 مشاهده دمو](https://hormozgan-driver-pro.netlify.app) •> [📖 مستندات](https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121/wiki) •
> [🐛 گزارش باگ](https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121/issues)
>
�> </div>
>
I> ---
>
E> ## ✨ ویژگی‌ها
>
> ### 🗺️ نقشه تعاملی
> - نمایش لحظه‌ای موقعیت رانندگان
> - نقشه Leaflet.js
> - به‌روزرسانی خودکار هر 5 ثانیه
> - نشانگرهای سفارشی
>
> ### 💰 محاسبه‌گر کرایه پیشرفته
> - محاسبه دقیق قیمت
> - انواع سرویس (اقتصادی، راحت، VIP)
> - ضرایب زمانی (عادی، شلوغی، شب)
> - جزئیات کامل قیمت
>
P> ### 📊 داشبورد مدیریت
> - آمار لحظه‌ای
> - نمودارهای زیبا (Chart.js)
> - پیگیری درآمد
> - مانیتورینگ رانندگان
>
> ### 📝 فرم ثبت‌نام راننده
> - فرم چند مرحله‌ای
> - آپلود مدارک
e Calculator
✅ Admin D> - اعتبارسنجی کامل
>
> ### 📞 صفحه تماس
> - اطلاعات تماس کامل
> - فرم ارتباطی
> - لینک‌های شبکه‌های اجتماعی
>
> ### 🏠 صفحه اصلی جامع
> - منوی کامل
> - نمایش ویژگی‌ها
> - آمار پلتفرم
> - طراحی ریسپانسیو
>
> ---
>
> ## 🚀 نصب و راه‌اندازی
>

> ### پیش‌نیازها
> ```bash
> Node.js >= 18.0.0
> npm یا yarn یا pnpm

📊 راهنمای جامع به‌روزرسانی Hormozgan Driver Pro
🎯 مرحله اول: تجزیه و تحلیل (روزهای 1-2)
1️⃣ بررسی ساختار فعلی
☑️ بررسی فایل‌های موجود در cPanel
☑️ شناسایی فایل‌های قدیمی و غیرفعال
☑️ بروزرسانی فهرست فایل‌ها
☑️ مستندسازی وضعیت موجود
2️⃣ فهرست فایل‌های قدیمی‌ای که باید حذف شوند
❌ old.about.html
❌ Ferr.index.html
❌ copymove.html.tt
❌ فایل‌های بدون استفاده‌ای
❌ نسخه‌های قدیمی HTML
3️⃣ فایل‌های جدیدی که باید اضافه شوند
✅ live-maps/ (سیستم نقشه‌های زنده)
✅ ai-sahel-pro-v3.html (هوش مصنوعی)
✅ booking.html (سیستم رزرو)
✅ dashboard/ (پنل‌های کاربری)
✅ api/ (سرویس‌های backend)
🔧 مرحله دوم: ساختار جدید (روزهای 3-5)
📁 ساختار درخت‌ی پیشنهادی
public_html/
├── 📄 index.html (صفحه اصلی - نسخه جدید)
├── 📄 robots.txt
├── 📄 sitemap.xml
├── 📄 .htaccess
│
├── 📁 pages/ (صفحات اصلی)
│   ├── about.html
│   ├── services.html
│   ├── contact.html
│   ├── booking.html ✨ جدید
│   ├── register.html
│   └── login.html
│
├── 📁 admin/ (پنل مدیریت)
│   ├── dashboard.html
│   ├── bookings.html
│   ├── drivers.html
│   ├── analytics.html
│   └── settings.html
│
├── 📁 user-dashboard/ (پنل کاربر)
│   ├── profile.html
│   ├── my-bookings.html
│   ├── payments.html
│   └── settings.html
│
├── 📁 ai/ (سیستم هوش مصنوعی)
│   ├── sahel-pro-v3.html ✨ جدید
│   ├── chatbot.html
│   ├── analytics.html
│   └── training.html
│
├── 📁 maps/ (نقشه‌های تعاملی)
│   ├── live-maps/
│   │   ├── index.html
│   │   ├── driver-map.html
│   │   ├── tourist-map.html
│   │   └── traffic-map.html
│   └── maps-backend/
│       ├── live-traffic.php
│       ├── route-calculator.php
│       └── navigation-engine.php
│
├── 📁 api/ (سرویس‌های backend)
│   ├── booking.php
│   ├── payment.php
│   ├── drivers.php
│   ├── users.php
│   ├── sms.php
│   ├── maps.php
│   ├── ai-chat.php
│   └── analytics.php
│
├── 📁 assets/ (منابع استاتیک)
│   ├── 📁 css/
│   │   ├── style.css (استایل اصلی)
│   │   ├── admin.css
│   │   ├── responsive.css
│   │   ├── animations.css
│   │   └── dark-mode.css
│   │
│   ├── 📁 js/
│   │   ├── main.js
│   │   ├── admin.js
│   │   ├── booking.js
│   │   ├── payment.js
│   │   ├── maps.js
│   │   ├── chatbot.js
│   │   ├── analytics.js
│   │   └── utils.js
│   │
│   ├── 📁 images/
│   │   ├── 📁 heroes/
│   │   ├── 📁 services/
│   │   ├── 📁 cities/
│   │   ├── 📁 icons/
│   │   ├── 📁 logos/
│   │   └── 📁 backgrounds/
│   │
│   └── 📁 fonts/
│       ├── vazir.woff2
│       └── vazir.ttf
│
├── 📁 database/
│   ├── schema.sql (ساختار دیتابیس)
│   ├── migrations/
│   │   ├── 001_create_tables.sql
│   │   ├── 002_add_ai_tables.sql
│   │   ├── 003_add_payments.sql
│   │   └── 004_add_analytics.sql
│   └── sample-data.sql
│
├── 📁 config/
│   ├── database.php
│   ├── api.php
│   ├── payment-gateway.php
│   ├── sms-service.php
│   └── email-service.php
│
└── 📁 docs/
    ├── README.md
    ├── API-DOCS.md
    ├── SETUP.md
    ├── DEPLOYMENT.md
    └── CHANGELOG.md
💻 مرحله سوم: توسعه فایل‌های جدید (روزهای 6-15)
📝 1. فایل index.html جدید (صفحه اصلی)
ویژگی‌های جدید:
✨ طراحی مدرن با Dark Mode
🎨 انیمیشن‌های جذاب
📱 رسپانسیو کامل
⚡ بارگذاری سریع
🔍 SEO بهتر
🎯 UX بهتر
📝 2. سیستم رزرو (booking.html)
بخش‌های اصلی:
✅ جستجوی تاکسی (Real-time)
✅ انتخاب نوع خودرو
✅ نمایش قیمت فوری
✅ مدیریت سفارش
✅ درگاه پرداخت
✅ پیگیری سفر
✅ ارزیابی سفر
📝 3. هوش مصنوعی (ai-sahel-pro-v3.html)
ویژگی‌های AI:
🤖 چت‌بات ساحل
📊 تحلیل داده‌ها
🗺️ بهینه‌سازی مسیر
🔮 پیش‌بینی تقاضا
📈 گزارشات تحلیلی
💡 توصیه‌های هوشمند
📝 4. سیستم نقشه‌های زنده (live-maps/)
ویژگی‌ها:
🗺️ نقشه تعاملی
🚗 موقعیت رانندگان
🚦 وضعیت ترافیک
📍 جستجوی آدرس
📏 محاسبه مسیر
⏱️ تخمین زمان
🗄️ مرحله چهارم: تنظیم دیتابیس (روز 16-17)
SQL Schema:
-- جداول اصلی
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255),
    role ENUM('customer', 'driver', 'admin'),
    status ENUM('active', 'inactive', 'suspended'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    driver_id INT,
    pickup_location VARCHAR(255),
    dropoff_location VARCHAR(255),
    car_type VARCHAR(50),
    price DECIMAL(10, 2),
    status ENUM('pending', 'accepted', 'completed', 'cancelled'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (driver_id) REFERENCES users(id)
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    amount DECIMAL(10, 2),
    payment_method VARCHAR(50),
    status ENUM('pending', 'completed', 'failed'),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

CREATE TABLE ai_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    query TEXT,
    response TEXT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
🔐 مرحله پنجم: درگاه‌های خارجی (روز 18-19)
1️⃣ درگاه پرداخت (Payment Gateway)
// config/payment-gateway.php
return [
    'zarinpal' => [
        'merchant_id' => 'YOUR_MERCHANT_ID',
        'api_url' => 'https://api.zarinpal.com/rest/',
        'enabled' => true
    ],
    'paypal' => [
        'client_id' => 'YOUR_CLIENT_ID',
        'secret' => 'YOUR_SECRET',
        'enabled' => false
    ]
];
2️⃣ سرویس پیامک (SMS Service)
// config/sms-service.php
return [
    'provider' => 'kavenegar', // یا payamak
    'api_key' => 'YOUR_API_KEY',
    'sender' => 'HDP',
    'enabled' => true
];
3️⃣ سرویس ایمیل
// config/email-service.php
return [
    'from' => 'info@hormozgandriver.ir',
    'from_name' => 'تاکسی هرمزگان پرو',
    'smtp_host' => 'mail.hormozgandriver.ir',
    'smtp_port' => 587,
    'smtp_user' => 'info@hormozgandriver.ir',
    'smtp_pass' => 'YOUR_PASSWORD'
];
🚀 مرحله ششم: استقرار و تست (روز 20-21)
✅ Checklist استقرار:
Pre-Deployment:
☑️ تست تمام صفحات
☑️ تست فرم‌ها
☑️ تست پیوند‌ها
☑️ تست درگاه‌های خارجی
☑️ تست سرعت بارگذاری
☑️ تست نسخه‌ی موبایل
☑️ تست HTTPS و SSL
☑️ بکاپ گیری کامل

Deployment:
☑️ آپلود فایل‌ها
☑️ تنظیم دسترسی‌ها
☑️ فعال‌سازی درگاه‌ها
☑️ کوکی و Session
☑️ Cache و CDN
☑️ Monitoring و Logging

Post-Deployment:
☑️ تست عملکردی کامل
☑️ نظارت بر خطاها
☑️ Backup خودکار
☑️ بهینه‌سازی Performance
📈 مرحله هفتم: نظارت و بهینه‌سازی (مستمر)
🔍 KPIs مهم:
📊 Performance:
- Page Load Time < 3s
- Core Web Vitals: بخش سبز
- Uptime: > 99.9%

📱 User Experience:
- Booking Conversion: > 15%
- User Retention: > 80%
- NPS Score: > 70

💰 Business:
- Daily Bookings: رشد 20% ماه‌وار
- Revenue per Booking: ثابت/رشد
- Customer Satisfaction: > 4.5/5
🔐 نکات امنیتی حیاتی
⚠️ Security Checklist:
☑️ Input Validation (تمام فرم‌ها)
☑️ SQL Injection Prevention
☑️ XSS Protection
☑️ CSRF Protection
☑️ Rate Limiting
☑️ SSL/TLS (HTTPS)
☑️ Password Hashing (bcrypt)
☑️ Two-Factor Authentication (اختیاری)
☑️ GDPR Compliance
☑️ Regular Security Audits
📞 تماس و پشتیبانی
📧 Email: info@hormozgandriver.ir
📱 Phone: 0916-462-1660
💬 Telegram: @hormozgandriver
🌐 Website: hormozgandriver.ir
📝 نکات مهم
Backup: قبل از هر تغییر، backup گیری کنید
Version Control: از Git استفاده کنید
Testing: هر تغییری را تست کنید
Documentation: مستندات را به‌روز نگه دارید
Communication: تغییرات را اطلاع دهید
آخرین به‌روزرسانی: نوامبر 2025
وضعیت پروژه: در حال توسعه فعال 🚀
> دانلود و نصب
> # کلون کردن پروژه
> git clone https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121.git
>
> # ورود به پوشه
> cd hormozgan-driver-pro121
>
> # اجرای سرور (بدون نیاز به npm install)
> node server.js
> سرور روی http://localhost:3000 اجرا می‌شود.
> 📁 ساختار پروژه
> hormozgan-driver-pro121/
> ├── public/                    # Frontend files
> │   ├── index.html            # صفحه اصلی
> │   ├── map.html              # نقشه تعاملی
> │   ├── fare-calculator.html  # محاسبه‌گر کرایه
> │   ├── dashboard.html        # داشبورد
> │   ├── driver-registration.html  # ثبت‌نام راننده
> │   ├── contact.html          # تماس با ما
> │   ├── 404.html              # صفحه خطا
> │   ├── sitemap.xml           # نقشه سایت
> │   ├── robots.txt            # SEO
> │   ├── manifest.json         # PWA
> │   └── _headers              # Security headers
> ├── data/                      # Database
> │   └── database.json
> ├── server.js                  # Backend server
> ├── database.js                # Database manager
> ├── package.json
> ├── netlify.toml              # Netlify config
> ├── render.yaml               # Render config
> └── README.md
> 🌐 دمو زنده
> Frontend (Netlify)
> صفحه اصلی: https://hormozgan-driver-pro.netlify.app
> نقشه: https://hormozgan-driver-pro.netlify.app/map.html
> محاسبه کرایه: https://hormozgan-driver-pro.netlify.app/fare-calculator.html
> داشبورد: https://hormozgan-driver-pro.netlify.app/dashboard.html
> ثبت‌نام: https://hormozgan-driver-pro.netlify.app/driver-registration.html
> تماس: https://hormozgan-driver-pro.netlify.app/contact.html
> Backend API (Render)
> Health Check: https://hormozgan-api.onrender.com/health
> Drivers API: https://hormozgan-api.onrender.com/api/drivers
> Passengers API: https://hormozgan-api.onrender.com/api/passengers
> Rides API: https://hormozgan-api.onrender.com/api/rides
> 🛠️ تکنولوژی‌ها
> Frontend: HTML5, CSS3, Vanilla JavaScript
> Backend: Node.js (Pure HTTP)
> Database: JSON File-based
> Maps: Leaflet.js
> Charts: Chart.js
> Deploy: Netlify + Render
> Version Control: Git, GitHub
> 📊 آمار پروژه
> 150+ راننده فعال
> 5000+ مسافر راضی
> 25,000+ سفر موفق
> 4.8 امتیاز میانگین
> 🤝 مشارکت
> برای مشارکت در این پروژه:
> Fork کنید
> یک branch جدید بسازید (git checkout -b feature/AmazingFeature)
> تغییرات را commit کنید (git commit -m 'Add some AmazingFeature')
> Push کنید (git push origin feature/AmazingFeature)
> یک Pull Request باز کنید
> 📝 لایسنس
> این پروژه تحت لایسنس MIT منتشر شده است - برای جزئیات LICENSE را ببینید.
> 👨‍💻 سازنده
> Mahdi Hadari
> GitHub: @mahdihadari59-lgtm
> Email: mahdihadari59@gmail.com
> 🌟 حمایت
> اگر این پروژه برایتان مفید بود، لطفاً یک ⭐ به آن بدهید!
> �
>
> ساخته شده با ❤️ برای استان هرمزگان
> ⬆ بازگشت به بالا
> �
> EOF ```
> 🎊 مرحله 15: Commit و Push نهایی
> cd ~/hormozgan-driver-pro121
>
> git add .
> git commit -m "🎉 v2.0 Complete: Production Ready Platform
>
> 📦 Added Files:
> - sitemap.xml (SEO)
> - robots.txt (SEO)
> - manifest.json (PWA)
> - 404.html (Custom error page)
> - _headers (Security)
> - Complete README.md
>
> ✨ Platform Features:
> ✅ 6 Complete Pages
> ✅ Interactive Map
> ✅ Fare Calculator
> ✅ Admin Dashboard
> ✅ Registration Form
> ✅ Contact Page
> ✅ SEO Optimized
> ✅ PWA Ready
> ✅ Mobile Responsive
> ✅ Security Headers
>
> 🚀 Deploy Ready:
> ✅ Netlify Configuration
> ✅ Render Configuration
> ✅ Performance Optimized
>
> 📊 Statistics:
> - 150+ Drivers
> - 5000+ Passengers
> - 25K+ Successful Rides
> - 4.8 Average Rating
>
> 🎯 Status: PRODUCTION READY
> Version: 2.0.0
>
> Made with ❤️برای استان هرمزگان
> 
 dc540f91759c412c5753bd9555a0f0a5484b90ff
# 🚀 AI Sahel Pro Ultra - Hormozgan Driver System

هوشمندترین دستیار رانندگی هرمزگان با قابلیت‌های پیشرفته AI

## ✨ ویژگی‌ها

### 🤖 هوش مصنوعی پیشرفته
- مکالمه طبیعی و هوشمند
- تشخیص قصد کاربر
- یادگیری و بهبود مستمر
- پاسخ‌های زمینه‌ای

### 🚦 سیستم ترافیک هوشمند
- وضعیت زنده ترافیک
- مسیریابی بهینه
- هشدار نقاط حساس
- پیش‌بینی ترافیک

### 🌤️ سرویس آب و هوایی
- وضعیت فعلی جوی
- پیش‌بینی ۳ روزه
- هشدارهای ایمنی
- شرایط جاده‌ها

### ⚖️ پایگاه قوانین
- مقررات سرعت
- قوانین سبقت
- تجهیزات ایمنی
- جرایم رانندگی

## 🚀 نصب و راه‌اندازی

### روش سریع:
```bash
git clone https://github.com/username/hormozgan-driver-pro.git
cd hormozgan-driver-pro
./setup.sh
