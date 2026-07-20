با تشکر از شما برای این بازخورد بسیار دقیق و ارزشمند! تحلیل شما کاملاً درست است و نکات مطرح شده باعث می‌شود README به سطح حرفه‌ای‌تری برسد. در ادامه، نسخه اصلاح‌شده README را با اعمال تمام پیشنهادات شما آماده کرده‌ام:

---

```markdown
<div align="center">

# 🚕 Hormozgan Driver Pro

## پلتفرم هوشمند تاکسی‌یابی استان هرمزگان

![Hormozgan Driver Pro Demo](https://via.placeholder.com/800x400/0066cc/ffffff?text=Hormozgan+Driver+Pro+Demo)

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-18%2B-green.svg)](https://nodejs.org/)
[![Build](https://img.shields.io/github/actions/workflow/status/mahdihadari59-lgtm/hormozgan-driver-pro121/ci.yml?branch=main)](https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121/actions)
[![Coverage](https://img.shields.io/codecov/c/github/mahdihadari59-lgtm/hormozgan-driver-pro121)](https://codecov.io/gh/mahdihadari59-lgtm/hormozgan-driver-pro121)
[![GitHub stars](https://img.shields.io/github/stars/mahdihadari59-lgtm/hormozgan-driver-pro121)](https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121/stargazers)
[![Last Commit](https://img.shields.io/github/last-commit/mahdihadari59-lgtm/hormozgan-driver-pro121)](https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121/commits/main)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121/pulls)

**[🌐 مشاهده دمو](https://hormozgan-driver-pro.netlify.app)** •
**[📖 مستندات](https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121/wiki)** •
**[🐛 گزارش باگ](https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121/issues)** •
**[💬 انجمن گفتگو](https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121/discussions)**

</div>

---

## 📊 وضعیت پروژه

| مورد | مقدار |
|------|--------|
| **نسخه** | 2.1.0 |
| **وضعیت** | 🚧 Active Development |
| **پلتفرم** | Node.js |
| **دیتابیس** | SQLite |
| **لایسنس** | MIT |
| **زبان** | فارسی (اصلی) / English (Experimental) |
| **هوش مصنوعی** | AI Sahel + Bandari Engine + Knowledge Graph |
| **پوشش تست** | 78% |

---

## 🚀 ویژگی‌های کلیدی

- 🤖 **دستیار هوشمند AI Sahel** - مکالمه طبیعی و پاسخ‌های هوشمند
- 🚕 **مدیریت رانندگان و سفرها** - سیستم کامل مدیریت حمل‌ونقل
- 🗺️ **نقشه تعاملی و مسیریابی** - نمایش لحظه‌ای و مسیریابی هوشمند
- 🧠 **موتور پردازش زبان Bandari Engine** - تشخیص گویش بندری
- 📚 **Knowledge Graph هرمزگان** - گراف دانش تخصصی استان
- 📊 **داشبورد مدیریتی** - آمار و تحلیل لحظه‌ای
- 📱 **PWA و طراحی Responsive** - تجربه کاربری یکپارچه
- 🔒 **احراز هویت و امنیت** - امنیت کامل با JWT

---

## 📸 اسکرین‌شات

<div align="center">
  <img src="https://via.placeholder.com/400x250/0066cc/ffffff?text=Dashboard" alt="Dashboard" width="45%">
  <img src="https://via.placeholder.com/400x250/0066cc/ffffff?text=Map" alt="Map" width="45%">
  <br>
  <img src="https://via.placeholder.com/400x250/0066cc/ffffff?text=AI+Chat" alt="AI Chat" width="45%">
  <img src="https://via.placeholder.com/400x250/0066cc/ffffff?text=Driver+Panel" alt="Driver Panel" width="45%">
  <br>
  <img src="https://via.placeholder.com/400x250/0066cc/ffffff?text=Tourism" alt="Tourism" width="45%">
  <img src="https://via.placeholder.com/400x250/0066cc/ffffff?text=Admin" alt="Admin" width="45%">
</div>

---

## 📋 فهرست مطالب

- [معرفی](#معرفی)
- [ویژگی‌های کلیدی](#ویژگی‌های-کلیدی)
- [وضعیت قابلیت‌ها](#وضعیت-قابلیت‌ها)
- [معماری سیستم](#معماری-سیستم)
- [معماری هوش مصنوعی](#معماری-هوش-مصنوعی)
- [ساختار دیتابیس](#ساختار-دیتابیس)
- [فناوری‌ها](#فناوری‌ها)
- [نصب و راه‌اندازی](#نصب-و-راه‌اندازی)
- [ساختار پروژه](#ساختار-پروژه)
- [API مستندات](#api-مستندات)
- [امنیت](#امنیت)
- [عملکرد](#عملکرد)
- [استقرار](#استقرار)
- [توسعه](#توسعه)
- [نقشه راه](#نقشه-راه)
- [یادداشت‌های انتشار](#یادداشت‌های-انتشار)
- [مشارکت](#مشارکت)
- [لایسنس](#لایسنس)

---

## معرفی

**Hormozgan Driver Pro** یک پلتفرم جامع هوشمند برای مدیریت حمل‌ونقل درون‌شهری و برون‌شهری استان هرمزگان است. این سیستم با بهره‌گیری از هوش مصنوعی، پردازش زبان طبیعی و نقشه‌های تعاملی، تجربه‌ای بی‌نظیر برای رانندگان و مسافران فراهم می‌کند.

> **هدف این پروژه** ایجاد یک بستر هوشمند برای مدیریت حمل‌ونقل، گردشگری، خدمات شهری و سامانه‌های مبتنی بر هوش مصنوعی در استان هرمزگان با معماری ماژولار و قابلیت توسعه است.

---

## ✨ ویژگی‌ها

### 🗺️ نقشه تعاملی
- نمایش لحظه‌ای موقعیت رانندگان
- نقشه Leaflet.js با قابلیت شخصی‌سازی
- به‌روزرسانی خودکار هر ۵ ثانیه
- نشانگرهای سفارشی با وضعیت‌های مختلف
- مسیریابی هوشمند (در حال توسعه)

### 🤖 هوش مصنوعی و پردازش زبان
- **AI Sahel**: دستیار هوشمند مکالمه‌محور ✅
- **Bandari Engine**: موتور تشخیص گویش بندری 🧪
- **Intent Classification**: تشخیص هدف کاربر ✅
- **Semantic Search**: جستجوی معنایی در پایگاه دانش ✅
- **Knowledge Graph**: گراف دانش هرمزگان ✅
- **Voice Recognition**: تشخیص گفتار 📅

### 💰 محاسبه‌گر کرایه پیشرفته
- محاسبه دقیق قیمت بر اساس مسافت و زمان ✅
- انواع سرویس (اقتصادی، راحت، VIP، ون) ✅
- ضرایب زمانی (عادی، شلوغی، شب، تعطیلات) ✅
- جزئیات کامل قیمت با تخفیف‌ها ✅

### 📊 داشبورد مدیریت
- آمار لحظه‌ای با نمودارهای تعاملی ✅
- مانیتورینگ رانندگان آنلاین ✅
- پیگیری درآمد و گزارشات مالی ✅
- تحلیل رفتار کاربران 🚧

### 📝 سیستم ثبت‌نام هوشمند
- فرم چند مرحله‌ای با اعتبارسنجی ✅
- آپلود مدارک و تصاویر ✅
- تأیید هویت با SMS 🚧
- پروفایل کامل راننده ✅

### 🌐 پشتیبانی چندزبانه
- فارسی (اصلی) ✅
- انگلیسی 🧪
- عربی 📅

---

## 📊 وضعیت قابلیت‌ها

| قابلیت | وضعیت | پیشرفت |
|--------|--------|---------|
| AI Chat | ✅ آماده | 100% |
| Dashboard | ✅ آماده | 100% |
| Maps | ✅ آماده | 95% |
| Tourism | ✅ آماده | 90% |
| Voice Recognition | 📅 برنامه‌ریزی شده | 0% |
| SMS Verification | 🚧 در حال توسعه | 40% |
| Route Optimization | 🚧 در حال توسعه | 30% |
| Mobile App | 📅 برنامه‌ریزی شده | 0% |
| Hotels | 🚧 در حال توسعه | 25% |
| AI Recommendations | 📅 برنامه‌ریزی شده | 0% |

**راهنما:**
- ✅ آماده و فعال
- 🚧 در حال توسعه
- 🧪 مرحله آزمایش
- 📅 برنامه‌ریزی شده

---

## 🏗️ معماری سیستم

```

┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Web    │  │   PWA    │  │  Mobile  │  │   API    │  │
│  │   App    │  │          │  │  (Soon)  │  │  Client  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Authentication  │  Rate Limit  │  Validation       │  │
│  │  JWT             │  CORS        │  Input Sanitizer  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Driver  │  │   Ride   │  │ Payment  │  │  Admin   │  │
│  │  Service │  │  Service │  │ Service  │  │  Service │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Tourism  │  │ Traffic  │  │ Weather  │  │   AI     │  │
│  │  Service │  │  Service │  │  Service │  │  Service │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│                      AI Layer                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AI Sahel  │ Bandari Engine  │ Knowledge Graph      │  │
│  │            │                  │ Semantic Search      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              SQLite Database                         │  │
│  │  Users  │ Drivers  │ Rides  │ Payments  │ Knowledge │  │
│  │  Traffic │ Tourism │ Hotels │ Weather  │ Embeddings │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

```

---

## 🧠 معماری هوش مصنوعی

```

┌─────────────────────────────────────────────────────────────┐
│                      User Query                            │
│                        │                                   │
│                        ▼                                   │
│              ┌──────────────────┐                          │
│              │  Intent Classifier│                         │
│              │  (TF-IDF + ML)   │                         │
│              └──────────────────┘                          │
│                        │                                   │
│                        ▼                                   │
│              ┌──────────────────┐                          │
│              │ Expert Dispatcher │                         │
│              │  (Router)        │                         │
│              └──────────────────┘                          │
│          │              │               │                  │
│          ▼              ▼               ▼                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────────┐          │
│   │ Knowledge│  │ Bandari  │  │    Traffic   │          │
│   │  Graph   │  │  Engine  │  │    Service   │          │
│   └──────────┘  └──────────┘  └──────────────┘          │
│          │              │               │                  │
│          ▼              ▼               ▼                  │
│   ┌──────────────────────────────────────────────────┐    │
│   │         Embedding Search (Sentence-BERT)         │    │
│   │         Semantic Ranking & Reranking             │    │
│   └──────────────────────────────────────────────────┘    │
│                        │                                   │
│                        ▼                                   │
│              ┌──────────────────┐                          │
│              │   AI Sahel       │                          │
│              │  (LLM + Context) │                         │
│              └──────────────────┘                          │
│                        │                                   │
│                        ▼                                   │
│              ┌──────────────────┐                          │
│              │     Answer       │                          │
│              └──────────────────┘                          │
└─────────────────────────────────────────────────────────────┘

```

---

## 🗄️ ساختار دیتابیس

```sql
-- کاربران
Users {
  id INTEGER PRIMARY KEY
  name TEXT
  phone TEXT UNIQUE
  password TEXT
  role TEXT -- passenger, driver, admin
  created_at DATETIME
}

-- رانندگان
Drivers {
  id INTEGER PRIMARY KEY
  user_id INTEGER REFERENCES Users(id)
  car_model TEXT
  car_color TEXT
  plate_number TEXT
  license_number TEXT
  status TEXT -- offline, online, busy
  rating REAL
  location_lat REAL
  location_lng REAL
  last_location_update DATETIME
}

-- سفرها
Rides {
  id INTEGER PRIMARY KEY
  passenger_id INTEGER REFERENCES Users(id)
  driver_id INTEGER REFERENCES Drivers(id)
  status TEXT -- pending, confirmed, active, completed, cancelled
  pickup_lat REAL
  pickup_lng REAL
  dropoff_lat REAL
  dropoff_lng REAL
  distance REAL
  duration INTEGER
  fare REAL
  service_type TEXT -- economy, comfort, vip, van
  created_at DATETIME
  started_at DATETIME
  completed_at DATETIME
}

-- پرداخت‌ها
Payments {
  id INTEGER PRIMARY KEY
  ride_id INTEGER REFERENCES Rides(id)
  amount REAL
  method TEXT -- cash, card, wallet
  status TEXT -- pending, success, failed
  transaction_id TEXT
  created_at DATETIME
}

-- گراف دانش
Knowledge {
  id INTEGER PRIMARY KEY
  entity_type TEXT -- attraction, restaurant, hotel, etc.
  name TEXT
  description TEXT
  category TEXT
  location_lat REAL
  location_lng REAL
  address TEXT
  phone TEXT
  website TEXT
  rating REAL
  embedding BLOB -- برای جستجوی معنایی
}

-- ترافیک
Traffic {
  id INTEGER PRIMARY KEY
  location_name TEXT
  status TEXT -- heavy, moderate, light
  severity INTEGER -- 1-5
  reported_at DATETIME
}

-- گردشگری
Tourism {
  id INTEGER PRIMARY KEY
  name TEXT
  description TEXT
  category TEXT -- historical, natural, cultural
  location_lat REAL
  location_lng REAL
  working_hours TEXT
  ticket_price REAL
  rating REAL
}

-- هتل‌ها
Hotels {
  id INTEGER PRIMARY KEY
  name TEXT
  address TEXT
  location_lat REAL
  location_lng REAL
  stars INTEGER
  rooms_available INTEGER
  price_per_night REAL
  amenities TEXT
  rating REAL
}

-- آب‌وهوا
Weather {
  id INTEGER PRIMARY KEY
  location TEXT
  temperature REAL
  humidity INTEGER
  condition TEXT -- sunny, rainy, cloudy
  updated_at DATETIME
}
```

نمودار روابط جداول

```
Users ◄─────────────── Drivers
  │                      │
  │                      │
  ▼                      ▼
Rides ──────────────── Payments
  │
  ▼
Knowledge
Traffic
Tourism
Hotels
Weather
```

---

🛠️ فناوری‌ها

بخش فناوری وضعیت
Frontend HTML5, CSS3, JavaScript, PWA ✅ Production
Backend Node.js 18+, Express.js ✅ Production
Database SQLite, better-sqlite3 ✅ Production
AI - Core AI Sahel + Bandari Engine + Knowledge Graph ✅ Production
AI - NLP Intent Classifier, Semantic Search (Sentence-BERT) ✅ Production
AI - Embedding Sentence Transformers ✅ Production
AI - Knowledge Graph Database + FTS5 ✅ Production
AI - Voice Vosk (برنامه‌ریزی شده) 📋 Planned
Maps Leaflet.js ✅ Production
Charts Chart.js ✅ Production
Deployment Netlify, Render, cPanel ✅ Production
Container Docker, Docker Compose (برنامه‌ریزی شده) 📋 Planned
CI/CD GitHub Actions ✅ Production
Security Helmet, JWT, Rate Limit, CORS ✅ Production
Development Git, GitHub ✅ Production

پشته هوش مصنوعی

فناوری کاربرد
Sentence Transformers جستجوی معنایی
TF-IDF + Logistic Regression طبقه‌بندی هدف
Knowledge Graph پایگاه دانش هرمزگان
SQLite FTS5 جستجوی تمام‌متن
Semantic Ranking مرتب‌سازی معنایی
Bandari Engine پردازش گویش بندری
AI Sahel تولید پاسخ هوشمند

---

🚀 نصب و راه‌اندازی

پیش‌نیازها

```bash
Node.js >= 18.0.0
SQLite3
Git
```

نصب سریع

```bash
# کلون کردن پروژه
git clone https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121.git

# ورود به پوشه
cd hormozgan-driver-pro121

# نصب وابستگی‌ها
npm install

# ایجاد دیتابیس
npm run init-db

# بارگذاری داده‌های اولیه
npm run seed

# اجرای سرور
npm start
```

اجرا با Docker

```bash
# ساخت Image
docker build -t hormozgan-driver-pro .

# اجرا
docker run -p 3000:3000 hormozgan-driver-pro
```

اجرا با Docker Compose (Planned)

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=/app/data/database.sqlite
    volumes:
      - ./data:/app/data
    restart: unless-stopped

  ai-service:
    image: python:3.9-slim
    command: python ai/services/nlp-service.py
    volumes:
      - ./ai:/app/ai
    restart: unless-stopped
```

```bash
docker-compose up -d
```

اجرا روی Termux (Android)

```bash
# نصب Termux
pkg update && pkg upgrade
pkg install nodejs git sqlite

# کلون و نصب
git clone https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121.git
cd hormozgan-driver-pro121
npm install

# اجرا
node server.js
```

اجرا روی cPanel

1. آپلود فایل‌ها به public_html
2. تنظیم Node.js App از طریق cPanel
3. ایجاد دیتابیس SQLite
4. تنظیم Cron Jobs برای Backup خودکار

---

📁 ساختار پروژه

```
hormozgan-driver-pro121/
│
├── backend/                      # سرور Backend
│   ├── api/                      # API Endpoints
│   │   ├── auth.js
│   │   ├── drivers.js
│   │   ├── rides.js
│   │   ├── payments.js
│   │   └── admin.js
│   ├── services/                 # سرویس‌ها
│   │   ├── ai-service.js
│   │   ├── map-service.js
│   │   ├── notification.js
│   │   └── payment-gateway.js
│   ├── middleware/               # Middleware
│   │   ├── auth.js
│   │   ├── rate-limit.js
│   │   └── validation.js
│   ├── models/                   # مدل‌های دیتابیس
│   │   ├── Driver.js
│   │   ├── Ride.js
│   │   └── User.js
│   ├── database/                 # دیتابیس
│   │   ├── schema.sql
│   │   ├── migrations/
│   │   └── seeds/
│   ├── config/                   # تنظیمات
│   │   ├── database.js
│   │   ├── auth.js
│   │   └── ai.js
│   └── server.js                 # نقطه ورود
│
├── frontend/                     # Frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── map.html
│   │   ├── dashboard.html
│   │   ├── fare-calculator.html
│   │   ├── driver-registration.html
│   │   ├── contact.html
│   │   ├── 404.html
│   │   ├── sitemap.xml
│   │   ├── robots.txt
│   │   └── manifest.json
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style.css
│   │   │   ├── admin.css
│   │   │   └── responsive.css
│   │   ├── js/
│   │   │   ├── main.js
│   │   │   ├── maps.js
│   │   │   ├── booking.js
│   │   │   └── ai-chat.js
│   │   └── images/
│   │       ├── icons/
│   │       ├── logos/
│   │       └── backgrounds/
│   └── components/               # کامپوننت‌های قابل استفاده مجدد
│
├── ai/                           # هوش مصنوعی
│   ├── models/                   # مدل‌های AI
│   │   ├── intent-classifier/
│   │   ├── embedding/
│   │   └── knowledge-graph/
│   ├── services/                 # سرویس‌های AI
│   │   ├── nlp-service.py
│   │   ├── embedding-service.py
│   │   └── graph-service.py
│   ├── data/                     # داده‌های آموزشی
│   │   ├── corpus/
│   │   └── embeddings/
│   └── train.py                  # اسکریپت آموزش
│
├── mobile/                       # اپلیکیشن موبایل (Flutter)
│   ├── lib/
│   └── assets/
│
├── docs/                         # مستندات
│   ├── api/
│   ├── deployment/
│   ├── development/
│   └── user-guide/
│
├── scripts/                      # اسکریپت‌های ابزار
│   ├── backup.sh
│   ├── deploy.sh
│   └── migrate.sh
│
├── tests/                        # تست‌ها
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .github/                      # GitHub Actions
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── docker/                       # Docker
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── deploy/                       # فایل‌های استقرار
│   ├── netlify.toml
│   ├── render.yaml
│   └── cpanel/
│
├── package.json                  # وابستگی‌های Node
├── README.md                     # این فایل
├── LICENSE
└── .env.example                  # متغیرهای محیطی
```

---

🔗 API مستندات

Authentication

```http
POST   /api/auth/register       # ثبت‌نام کاربر
POST   /api/auth/login          # ورود
GET    /api/auth/me             # اطلاعات کاربر
POST   /api/auth/logout         # خروج
POST   /api/auth/refresh        # تمدید توکن
```

Drivers

```http
GET    /api/drivers              # لیست رانندگان
GET    /api/drivers/:id          # اطلاعات یک راننده
POST   /api/drivers              # ثبت راننده جدید
PUT    /api/drivers/:id          # به‌روزرسانی راننده
DELETE /api/drivers/:id          # حذف راننده
GET    /api/drivers/nearby       # رانندگان نزدیک
PUT    /api/drivers/:id/status   # تغییر وضعیت
```

Rides

```http
GET    /api/rides                # لیست سفرها
POST   /api/rides                # ثبت سفر جدید
GET    /api/rides/:id            # اطلاعات سفر
PUT    /api/rides/:id            # به‌روزرسانی سفر
DELETE /api/rides/:id            # لغو سفر
GET    /api/rides/history        # تاریخچه سفرها
POST   /api/rides/:id/cancel     # لغو سفر توسط مسافر
POST   /api/rides/:id/complete   # تکمیل سفر
```

Payments

```http
POST   /api/payments             # پرداخت جدید
GET    /api/payments/:id         # وضعیت پرداخت
GET    /api/payments/history     # تاریخچه پرداخت‌ها
POST   /api/payments/verify      # تأیید پرداخت
```

AI Services

```http
POST   /api/ai/chat              # گفتگو با AI
POST   /api/ai/analyze           # تحلیل متن
GET    /api/ai/traffic           # وضعیت ترافیک ✅
GET    /api/ai/weather           # وضعیت آب و هوا ✅
POST   /api/ai/route             # مسیریابی هوشمند 🚧
GET    /api/ai/suggestions       # پیشنهادات هوشمند 🚧
POST   /api/ai/voice             # تشخیص گفتار 📅
```

Maps

```http
GET    /api/maps/search          # جستجوی آدرس ✅
GET    /api/maps/route           # مسیریابی ✅
GET    /api/maps/distance        # محاسبه مسافت ✅
GET    /api/maps/nearby          # مکان‌های نزدیک ✅
```

Tourism

```http
GET    /api/tourism/attractions  # جاذبه‌های گردشگری ✅
GET    /api/tourism/hotels       # هتل‌ها ✅
GET    /api/tourism/restaurants  # رستوران‌ها ✅
GET    /api/tourism/:id          # جزئیات مکان ✅
```

📌 نکته: APIهای با علامت ✅ در Production فعال هستند. سایر APIها در حال توسعه می‌باشند.

---

🔒 امنیت

لایه فناوری توضیح
Headers Helmet محافظت در برابر حملات XSS، CSRF و کلیک‌جکی
Authentication JWT احراز هویت مبتنی بر توکن با انقضای ۷ روزه
Rate Limiting express-rate-limit محدودیت درخواست‌ها (۱۰۰ درخواست در دقیقه)
Input Validation Joi اعتبارسنجی ورودی‌های کاربر
Sanitization xss-clean پاک‌سازی ورودی‌ها از XSS
CORS cors کنترل دسترسی منابع متقابل
SQL Injection Parameterized Queries محافظت در برابر SQL Injection
Password Hashing bcrypt هش کردن رمزهای عبور
CSRF csurf محافظت در برابر CSRF

---

⚡ عملکرد

متریک مقدار
میانگین پاسخ API 120 ms
جستجوی معنایی 35 ms
جستجوی گراف دانش 20 ms
طبقه‌بندی هدف 15 ms
تولید پاسخ AI 250 ms
بارگذاری نقشه 1.2 s
زمان بارگذاری صفحه 1.8 s
PWA Score 92/100

---

🚀 استقرار

Netlify (Frontend)

```toml
# netlify.toml
[build]
  publish = "frontend/public"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

Render (Backend)

```yaml
# render.yaml
services:
  - type: web
    name: hormozgan-api
    env: node
    buildCommand: npm install
    startCommand: node backend/server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: hormozgan-db
          property: connectionString
```

Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "backend/server.js"]
```

cPanel

1. آپلود فایل‌ها به public_html
2. تنظیم Node.js App از طریق cPanel
3. ایجاد دیتابیس SQLite
4. تنظیم Cron Jobs برای Backup خودکار

---

🔧 توسعه

راه‌اندازی محیط توسعه

```bash
# Clone
git clone https://github.com/mahdihadari59-lgtm/hormozgan-driver-pro121.git
cd hormozgan-driver-pro121

# نصب وابستگی‌ها
npm install

# دیتابیس
cp .env.example .env
npm run init-db
npm run seed

# اجرا
npm run dev
```

اجرای تست‌ها

```bash
# تست‌های واحد
npm test

# تست‌های یکپارچگی
npm run test:integration

# تست‌های End-to-End
npm run test:e2e
```

ایجاد PR

```bash
# ایجاد branch
git checkout -b feature/your-feature

# Commit
git add .
git commit -m "feat: add your feature"

# Push
git push origin feature/your-feature

# ایجاد Pull Request
```

---

🗺️ نقشه راه

نسخه هدف وضعیت
2.1 بهینه‌سازی هسته و مستندات ✅ منتشر شده
2.2 بهبود موتور هوش مصنوعی 📋 برنامه‌ریزی شده
2.5 اپلیکیشن Android (Flutter) 📋 برنامه‌ریزی شده
3.0 معماری Microservices + PostgreSQL + Redis + WebSocket 📋 برنامه‌ریزی شده

برنامه نسخه 3.0

· معماری: Microservices, Kubernetes
· دیتابیس: PostgreSQL, Redis, Elasticsearch
· ارتباطات: WebSocket, Push Notification
· هوش مصنوعی:
  · Offline AI
  · Speech-to-Text
  · Text-to-Speech
  · AI Recommendation Engine
· موبایل: Flutter (Android + iOS)
· زیرساخت: Docker Compose, CI/CD پیشرفته

---

📝 یادداشت‌های انتشار

v2.1.0 (Current)

· ✨ اضافه شدن AI Sahel - دستیار هوشمند
· ✨ اضافه شدن Bandari Engine - تشخیص گویش بندری
· ✨ اضافه شدن Knowledge Graph هرمزگان
· ✨ اضافه شدن Semantic Search با Sentence Transformers
· ✨ اضافه شدن داشبورد مدیریت با نمودارهای تعاملی
· ✨ اضافه شدن محاسبه‌گر کرایه پیشرفته
· ✨ اضافه شدن PWA
· 🔧 بهبود عملکرد جستجو
· 🔧 بهبود امنیت با Helmet و Rate Limit
· 🔧 بهینه‌سازی دیتابیس
· 🐛 رفع باگ‌های API

v2.0.0 (Previous)

· ✨ اضافه شدن نقشه تعاملی
· ✨ اضافه شدن سیستم ثبت‌نام رانندگان
· ✨ اضافه شدن مدیریت سفرها
· ✨ اضافه شدن سیستم پرداخت
· ✨ اضافه شدن گردشگری (Attractions, Hotels, Restaurants)
· ✨ اضافه شدن وضعیت ترافیک و آب‌وهوا

---

🤝 مشارکت

راهنمای مشارکت

1. گزارش باگ: از Issue Tracker استفاده کنید
2. پیشنهاد ویژگی: Feature Request باز کنید
3. Pull Request: کد خود را ارسال کنید
4. مستندات: مستندات را به‌روز کنید

کدهای اخلاق

· کد را تمیز و خوانا بنویسید
· از ESLint و Prettier استفاده کنید
· تست بنویسید
· مستندات را به‌روز کنید
· از Conventional Commits استفاده کنید

ساختار Commit

```bash
feat: add new feature
fix: bug fix
docs: documentation update
style: code style
refactor: code refactor
test: add tests
chore: maintenance
```

---

📊 آمار پروژه

آمار مقدار وضعیت
🚗 راننده فعال Coming Soon ⏳
👤 مسافر راضی Coming Soon ⏳
🚕 سفر موفق Coming Soon ⏳
⭐ امتیاز میانگین Coming Soon ⏳
📝 API Endpoints ۳۵+ ✅
🧪 تست‌ها ۲۰۰+ ✅
📊 پوشش تست ۷۸% ✅
🔒 آسیب‌پذیری‌ها ۰ ✅

---

📝 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است - برای جزئیات LICENSE را ببینید.

---

👨‍💻 توسعه‌دهندگان

نام نقش GitHub
Mahdi Hadari Lead Developer, AI Engineer @mahdihadari59-lgtm
HDP Team Contributors @hdp-org

---

📞 تماس

· Email: info@hormozgandriver.ir
· Phone: 0916-462-1660
· Telegram: @hormozgandriver
· Instagram: @hormozgan_driver_pro
· GitHub: @mahdihadari59-lgtm

---

🙏 قدردانی

· استان هرمزگان - حمایت و همکاری
· جامعه Open Source - کتابخانه‌های عالی
· همه مشارکت‌کنندگان - کمک به بهبود پروژه

---

<div align="center">

🌟 اگر این پروژه برای شما مفید بود، لطفاً یک ⭐ به آن بدهید!

⬆ بازگشت به بالا

ساخته شده با ❤️ برای استان هرمزگان

</div>

