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
