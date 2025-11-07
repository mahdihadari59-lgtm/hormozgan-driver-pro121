// =========================================
// 🚀 سرور هرمزگان درایور پرو - نسخه نهایی کامل (اصلاح شده)
// =========================================
const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// میدلورهای ضروری
app.use(express.static('.'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// دیتابیس ساده برای ذخیره اطلاعات
const database = {
    drivers: [
        {
            id: 1,
            name: "علی محمدی",
            phone: "09123456789",
            car: "پژو 206",
            license: "B12345678",
            balance: 4500000,
            rating: 4.9,
            status: "online",
            tripsToday: 12,
            weeklyEarnings: 32500000
        }
    ],
    trips: [
        { id: 1, driver: "علی محمدی", passenger: "رضا احمدی", from: "میدان آزادی", to: "فرودگاه", price: 120000, status: "completed", time: "14:30" },
        { id: 2, driver: "علی محمدی", passenger: "سارا کریمی", from: "خیابان امام", to: "پل زیبا", price: 85000, status: "completed", time: "16:45" },
        { id: 3, driver: "علی محمدی", passenger: "محمد حسینی", from: "پارک لاله", to: "ایستگاه مترو", price: 65000, status: "completed", time: "18:20" }
    ],
    payments: [
        { id: 1, amount: 120000, method: "کارت بانکی", status: "success", time: "14:32" },
        { id: 2, amount: 85000, method: "نقدی", status: "success", time: "16:47" }
    ]
};

// =========================================
// 🎯 ROUTEهای اصلی
// =========================================

// صفحه اصلی - دشبورد مدیریت
app.get('/', (req, res) => {
    res.redirect('/admin-dashboard');
});

// صفحه اصلی index
app.get('/index', (req, res) => {
    const driver = database.drivers[0];
    const todayTrips = database.trips.filter(trip => trip.status === 'completed');
    const todayEarnings = todayTrips.reduce((sum, trip) => sum + trip.price, 0);
    
    res.send(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>هم‌راز - سامانه هوشمند رانندگی و توریسم</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Vazirmatn', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            :root {
                --primary: #667eea;
                --secondary: #764ba2;
                --success: #10b981;
                --warning: #f59e0b;
                --danger: #ef4444;
                --glass: rgba(255, 255, 255, 0.1);
                --glass-border: rgba(255, 255, 255, 0.2);
            }
            
            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
                color: white;
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .hero-section {
                text-align: center;
                padding: 60px 20px;
                background: var(--glass);
                backdrop-filter: blur(20px);
                border-radius: 25px;
                border: 1px solid var(--glass-border);
                margin-bottom: 40px;
            }
            
            .hero-title {
                font-size: 3.5rem;
                font-weight: 900;
                margin-bottom: 20px;
                background: linear-gradient(135deg, #fff 0%, #e2e8f0 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .hero-subtitle {
                font-size: 1.5rem;
                opacity: 0.9;
                margin-bottom: 40px;
                line-height: 1.6;
            }
            
            .stats-overview {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin: 40px 0;
            }
            
            .stat-item {
                background: rgba(255,255,255,0.15);
                padding: 25px;
                border-radius: 15px;
                text-align: center;
                border: 1px solid rgba(255,255,255,0.2);
            }
            
            .stat-number {
                font-size: 2.5rem;
                font-weight: 900;
                display: block;
                margin-bottom: 10px;
            }
            
            .stat-label {
                font-size: 1.1rem;
                opacity: 0.9;
            }
            
            .services-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 25px;
                margin: 50px 0;
            }
            
            .service-card {
                background: var(--glass);
                backdrop-filter: blur(20px);
                padding: 35px;
                border-radius: 20px;
                border: 1px solid var(--glass-border);
                transition: all 0.3s ease;
                text-align: center;
            }
            
            .service-card:hover {
                transform: translateY(-10px);
                background: rgba(255,255,255,0.15);
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            }
            
            .service-icon {
                font-size: 4rem;
                margin-bottom: 20px;
                display: block;
            }
            
            .service-title {
                font-size: 1.8rem;
                margin-bottom: 15px;
                font-weight: 700;
            }
            
            .service-description {
                font-size: 1.1rem;
                opacity: 0.9;
                line-height: 1.6;
                margin-bottom: 25px;
            }
            
            .btn-group {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .btn {
                background: rgba(255,255,255,0.2);
                color: white;
                padding: 15px 25px;
                border-radius: 12px;
                text-decoration: none;
                transition: all 0.3s ease;
                border: 1px solid rgba(255,255,255,0.3);
                font-weight: 600;
                font-size: 1rem;
            }
            
            .btn:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-2px);
            }
            
            .btn-primary {
                background: linear-gradient(45deg, var(--primary), var(--secondary));
                border: none;
            }
            
            .btn-large {
                padding: 18px 35px;
                font-size: 1.2rem;
            }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;700;900&display=swap" rel="stylesheet">
    </head>
    <body>
        <div class="container">
            <div class="hero-section">
                <h1 class="hero-title">🚗 هم‌راز - پلتفرم هوشمند</h1>
                <p class="hero-subtitle">
                    اولین سامانه جامع مدیریت سفر، درآمد و خدمات توریستی در استان هرمزگان
                </p>
                
                <div class="stats-overview">
                    <div class="stat-item">
                        <span class="stat-number">${database.drivers.length}+</span>
                        <span class="stat-label">راننده فعال</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${database.trips.length}+</span>
                        <span class="stat-label">سفر موفق</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${(todayEarnings / 1000000).toFixed(1)}M+</span>
                        <span class="stat-label">درآمد روزانه</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${driver.rating}/5</span>
                        <span class="stat-label">رضایت کاربران</span>
                    </div>
                </div>
                
                <div class="btn-group">
                    <a href="/admin-dashboard" class="btn btn-primary btn-large">🎯 شروع کنید</a>
                    <a href="/driver-dashboard" class="btn btn-large">🚗 داشبورد راننده</a>
                    <a href="/tourism" class="btn btn-large">🏝️ بخش توریسم</a>
                </div>
            </div>

            <div class="services-grid">
                <div class="service-card">
                    <span class="service-icon">🚗</span>
                    <h3 class="service-title">سیستم رانندگی هوشمند</h3>
                    <p class="service-description">
                        مدیریت حرفه‌ای سفرها، پیگیری درآمد، تحلیل عملکرد و بهینه‌سازی زمان کاری
                    </p>
                    <div class="btn-group">
                        <a href="/driver-dashboard" class="btn">🎯 داشبورد راننده</a>
                        <a href="/driver-dashboard-advanced" class="btn">🚀 نسخه پیشرفته</a>
                    </div>
                </div>
                
                <div class="service-card">
                    <span class="service-icon">🏝️</span>
                    <h3 class="service-title">گردشگری هرمزگان</h3>
                    <p class="service-description">
                        معرفی جاذبه‌های طبیعی، فستیوال‌ها و خدمات توریستی استان هرمزگان
                    </p>
                    <div class="btn-group">
                        <a href="/tourism" class="btn">🏝️ گردشگری</a>
                        <a href="/festivals" class="btn">🎉 فستیوال‌ها</a>
                    </div>
                </div>
                
                <div class="service-card">
                    <span class="service-icon">💳</span>
                    <h3 class="service-title">سیستم مالی یکپارچه</h3>
                    <p class="service-description">
                        درگاه پرداخت امن، مدیریت درآمد، تحلیل مالی و برنامه‌ریزی سرمایه
                    </p>
                    <div class="btn-group">
                        <a href="/payment" class="btn">💳 درگاه پرداخت</a>
                        <a href="/driver-dashboard/income" class="btn">📊 تحلیل درآمد</a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
});

// =========================================
// 🏠 دشبورد ادمین
// =========================================

app.get('/admin-dashboard', (req, res) => {
    const driver = database.drivers[0];
    const todayEarnings = database.trips.reduce((sum, trip) => sum + trip.price, 0);
    
    res.send(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>دشبورد مدیریت - هم‌راز</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Vazirmatn', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            :root {
                --primary: #667eea;
                --secondary: #764ba2;
                --success: #10b981;
                --glass: rgba(255, 255, 255, 0.1);
                --glass-border: rgba(255, 255, 255, 0.2);
            }
            
            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
                color: white;
            }
            
            .container {
                max-width: 1400px;
                margin: 0 auto;
            }
            
            .admin-header {
                background: var(--glass);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 30px;
                margin-bottom: 20px;
                border: 1px solid var(--glass-border);
                text-align: center;
            }
            
            .admin-header h1 {
                font-size: 2.5rem;
                margin-bottom: 10px;
                background: linear-gradient(135deg, #fff 0%, #e2e8f0 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin: 30px 0;
            }
            
            .stat-card {
                background: var(--glass);
                backdrop-filter: blur(20px);
                padding: 25px;
                border-radius: 15px;
                border: 1px solid var(--glass-border);
                text-align: center;
                transition: all 0.3s ease;
            }
            
            .stat-card:hover {
                transform: translateY(-5px);
            }
            
            .stat-value {
                font-size: 2.5rem;
                font-weight: 900;
                display: block;
                margin-bottom: 10px;
            }
            
            .stat-label {
                font-size: 1.1rem;
                opacity: 0.9;
            }
            
            .sections-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 30px;
            }
            
            .section-card {
                background: var(--glass);
                backdrop-filter: blur(20px);
                padding: 30px;
                border-radius: 20px;
                border: 1px solid var(--glass-border);
                transition: all 0.3s ease;
            }
            
            .section-card:hover {
                background: rgba(255,255,255,0.15);
                transform: translateY(-3px);
            }
            
            .section-icon {
                font-size: 3rem;
                margin-bottom: 15px;
                display: block;
            }
            
            .section-title {
                font-size: 1.5rem;
                margin-bottom: 15px;
                font-weight: 700;
            }
            
            .btn-grid {
                display: grid;
                gap: 10px;
            }
            
            .btn {
                background: rgba(255,255,255,0.2);
                color: white;
                padding: 15px;
                border-radius: 12px;
                text-decoration: none;
                text-align: center;
                transition: all 0.3s ease;
                border: 1px solid rgba(255,255,255,0.3);
                font-weight: 600;
            }
            
            .btn:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-2px);
            }
            
            .btn-primary {
                background: linear-gradient(45deg, var(--primary), var(--secondary));
                border: none;
            }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;700;900&display=swap" rel="stylesheet">
    </head>
    <body>
        <div class="container">
            <div class="admin-header">
                <h1>🚗 سیستم مدیریت هم‌راز</h1>
                <p>پلتفرم جامع رانندگی، گردشگری و خدمات هوشمند هرمزگان</p>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <span class="stat-value">${database.drivers.length}</span>
                        <span class="stat-label">راننده فعال</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">${database.trips.length}</span>
                        <span class="stat-label">سفر امروز</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">${(todayEarnings / 1000000).toFixed(1)}M</span>
                        <span class="stat-label">درآمد امروز</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-value">${driver.rating}/5</span>
                        <span class="stat-label">میانگین امتیاز</span>
                    </div>
                </div>
            </div>

            <div class="sections-grid">
                <div class="section-card">
                    <span class="section-icon">🚗</span>
                    <h3 class="section-title">سیستم رانندگی</h3>
                    <p>مدیریت سفرها، درآمد و عملکرد رانندگان</p>
                    <div class="btn-grid">
                        <a href="/driver-dashboard" class="btn btn-primary">🎯 داشبورد راننده</a>
                        <a href="/driver-dashboard-advanced" class="btn">🚀 داشبورد پیشرفته</a>
                        <a href="/driver-registration" class="btn">📝 ثبت‌نام راننده</a>
                        <a href="/map" class="btn">🗺️ نقشه زنده</a>
                    </div>
                </div>

                <div class="section-card">
                    <span class="section-icon">🏝️</span>
                    <h3 class="section-title">گردشگری هرمزگان</h3>
                    <p>جاذبه‌های طبیعی و خدمات توریستی</p>
                    <div class="btn-grid">
                        <a href="/tourism" class="btn btn-primary">🏝️ گردشگری</a>
                        <a href="/festivals" class="btn">🎉 فستیوال‌ها</a>
                        <a href="/attractions" class="btn">📸 جاذبه‌ها</a>
                        <a href="/cultural" class="btn">🎎 فرهنگی</a>
                    </div>
                </div>

                <div class="section-card">
                    <span class="section-icon">💳</span>
                    <h3 class="section-title">سیستم مالی</h3>
                    <p>درگاه پرداخت و مدیریت مالی</p>
                    <div class="btn-grid">
                        <a href="/payment" class="btn btn-primary">💳 درگاه پرداخت</a>
                        <a href="/payment-receipt" class="btn">🧾 رسید پرداخت</a>
                        <a href="/driver-dashboard/income" class="btn">📊 تحلیل درآمد</a>
                        <a href="/driver-dashboard/calculator" class="btn">🧮 ماشین حساب</a>
                    </div>
                </div>

                <div class="section-card">
                    <span class="section-icon">🎬</span>
                    <h3 class="section-title">دمو و نمایش</h3>
                    <p>مشاهده قابلیت‌های سیستم</p>
                    <div class="btn-grid">
                        <a href="/video-demo" class="btn btn-primary">🚀 دمو ویدیو</a>
                        <a href="/demo" class="btn">📺 دمو پروژه</a>
                        <a href="/modern-ui" class="btn">🎨 رابط مدرن</a>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
});
// =========================================
// 🚗 بخش رانندگی
// =========================================

app.get('/driver-dashboard', (req, res) => {
    const driver = database.drivers[0];
    const todayTrips = database.trips.filter(trip => trip.status === 'completed');
    const todayEarnings = todayTrips.reduce((sum, trip) => sum + trip.price, 0);
    
    res.send(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>داشبورد راننده - هم‌راز</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Vazirmatn', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            :root {
                --primary: #667eea;
                --secondary: #764ba2;
                --success: #10b981;
                --glass: rgba(255, 255, 255, 0.1);
                --glass-border: rgba(255, 255, 255, 0.2);
            }
            
            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
                color: white;
            }
            
            .container {
                max-width: 1400px;
                margin: 0 auto;
            }
            
            .glass-card {
                background: var(--glass);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                border: 1px solid var(--glass-border);
                padding: 25px;
                margin-bottom: 20px;
                transition: all 0.3s ease;
            }
            
            .glass-card:hover {
                transform: translateY(-2px);
            }
            
            .user-header {
                display: grid;
                grid-template-columns: auto 1fr auto;
                align-items: center;
                gap: 20px;
                padding: 30px;
            }
            
            .user-info h1 {
                font-size: 1.8rem;
                margin-bottom: 5px;
            }
            
            .user-stats {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                text-align: center;
            }
            
            .stat-value {
                font-size: 2rem;
                font-weight: bold;
                display: block;
            }
            
            .stat-label {
                font-size: 0.9rem;
                opacity: 0.8;
            }
            
            .btn-primary {
                background: linear-gradient(45deg, var(--primary), var(--secondary));
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 12px;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
            }
            
            .dashboard-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }
            
            .quick-access-buttons {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }
            
            .quick-btn {
                background: rgba(255,255,255,0.15);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 15px;
                padding: 20px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                color: white;
            }
            
            .quick-btn:hover {
                background: rgba(255,255,255,0.25);
                transform: translateY(-3px);
            }
            
            .quick-btn-icon {
                font-size: 2rem;
                margin-bottom: 10px;
                display: block;
            }
            
            .section-title {
                font-size: 1.5rem;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 700;
            }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;700;900&display=swap" rel="stylesheet">
    </head>
    <body>
        <div class="container">
            <div class="glass-card user-header">
                <div class="user-avatar">
                    <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                        👤
                    </div>
                </div>
                <div class="user-info">
                    <h1>${driver.name}، خوش آمدید!</h1>
                    <p>امروز: ${new Date().toLocaleDateString('fa-IR')} | وضعیت: ${driver.status === 'online' ? '🟢 آنلاین' : '🔴 آفلاین'}</p>
                </div>
                <div class="user-actions">
                    <button class="btn-primary" onclick="startNewTrip()">🚗 شروع سفر جدید</button>
                </div>
                
                <div class="user-stats">
                    <div class="stat-box">
                        <span class="stat-value">${todayTrips.length}</span>
                        <span class="stat-label">سفرهای امروز</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-value">${(todayEarnings / 1000000).toFixed(1)}M</span>
                        <span class="stat-label">درآمد امروز</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-value">${driver.rating}/5</span>
                        <span class="stat-label">امتیاز شما</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-value">${(driver.weeklyEarnings / 1000000).toFixed(1)}M</span>
                        <span class="stat-label">درآمد هفته</span>
                    </div>
                </div>
            </div>

            <div class="glass-card">
                <h3 class="section-title">⚡ دسترسی سریع</h3>
                <div class="quick-access-buttons">
                    <a href="/driver-dashboard-advanced" class="quick-btn">
                        <span class="quick-btn-icon">🚀</span>
                        <div>داشبورد پیشرفته</div>
                    </a>
                    <a href="/driver-dashboard/income" class="quick-btn">
                        <span class="quick-btn-icon">📊</span>
                        <div>تحلیل درآمد</div>
                    </a>
                    <a href="/driver-dashboard/calculator" class="quick-btn">
                        <span class="quick-btn-icon">🧮</span>
                        <div>ماشین حساب</div>
                    </a>
                    <a href="/driver-dashboard/savings" class="quick-btn">
                        <span class="quick-btn-icon">💰</span>
                        <div>پس‌انداز</div>
                    </a>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="glass-card">
                    <h3 class="section-title">📊 تحلیل درآمد هفتگی</h3>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin: 10px 0;">
                        <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                            <span>میانگین روزانه:</span>
                            <strong>${((driver.weeklyEarnings / 7) / 1000000).toFixed(1)}M تومان</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                            <span>رشد هفتگی:</span>
                            <strong style="color: var(--success);">↑ ۱۲٪</strong>
                        </div>
                    </div>
                    <button class="btn-primary" style="width: 100%; margin-top: 10px;" onclick="showIncomeDetails()">مشاهده جزئیات</button>
                </div>

                <div class="glass-card">
                    <h3 class="section-title">🧮 ماشین حساب هوشمند</h3>
                    <div style="margin: 15px 0;">
                        <input type="number" placeholder="مبلغ سفر (تومان)" style="width: 100%; padding: 12px; border: none; border-radius: 8px; margin: 5px 0; background: rgba(255,255,255,0.9); color: #000;" id="tripAmount">
                    </div>
                    <div id="calcResult" style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin: 10px 0;">
                        <div>درآمد خالص: <strong>۰ تومان</strong></div>
                    </div>
                    <button class="btn-primary" style="width: 100%;" onclick="calculateTrip()">محاسبه</button>
                </div>

                <div class="glass-card">
                    <h3 class="section-title">💰 برنامه‌ریزی مالی</h3>
                    <div style="margin: 15px 0;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>پس‌انداز ماهانه:</span>
                            <strong>۶۵٪</strong>
                        </div>
                        <div style="background: rgba(255,255,255,0.2); height: 10px; border-radius: 5px; margin: 10px 0;">
                            <div style="background: var(--success); height: 100%; width: 65%; border-radius: 5px;"></div>
                        </div>
                    </div>
                    <button class="btn-primary" style="width: 100%;" onclick="showSavingsPlan()">مدیریت برنامه</button>
                </div>
            </div>
        </div>

        <script>
            function startNewTrip() {
                alert('🚗 سیستم شروع سفر فعال شد! به صفحه نقشه منتقل می‌شوید...');
window.location.href = '/map';
            }
            
            function calculateTrip() {
                const amount = document.getElementById('tripAmount').value;
                if (amount) {
                    const net = amount * 0.76;
                    document.getElementById('calcResult').innerHTML = 
                        '<div>درآمد خالص: <strong>' + parseInt(net).toLocaleString() + ' تومان</strong></div>';
                }
            }
            
            function showIncomeDetails() {
                window.location.href = '/driver-dashboard/income';
            }
            
            function showSavingsPlan() {
                window.location.href = '/driver-dashboard/savings';
            }
        </script>
    </body>
    </html>
    `);
});

// =========================================
// 🏝️ بخش توریسم و گردشگری
// =========================================

app.get('/tourism', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>گردشگری هرمزگان - هم‌راز</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Vazirmatn', sans-serif;
            }
            
            body { 
                padding: 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
            }
            
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .header h1 {
                font-size: 3rem;
                margin-bottom: 10px;
                background: linear-gradient(135deg, #fff 0%, #e2e8f0 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .attractions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 25px;
            }
            
            .attraction-card {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 30px;
                border: 1px solid rgba(255,255,255,0.2);
                transition: all 0.3s ease;
            }
            
            .attraction-card:hover {
                transform: translateY(-10px);
                background: rgba(255,255,255,0.15);
            }
            
            .attraction-icon {
                font-size: 4rem;
                margin-bottom: 20px;
                display: block;
            }
            
            .attraction-title {
                font-size: 1.8rem;
                margin-bottom: 15px;
                font-weight: 700;
            }
            
            .btn {
                display: inline-block;
                background: rgba(255,255,255,0.2);
                color: white;
                padding: 12px 25px;
                margin: 10px 5px;
                border-radius: 10px;
                text-decoration: none;
                transition: all 0.3s ease;
                border: 1px solid rgba(255,255,255,0.3);
            }
            
            .btn:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-2px);
            }
            
            .btn-primary {
                background: linear-gradient(45deg, #667eea, #764ba2);
                border: none;
                font-weight: 600;
            }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;700;900&display=swap" rel="stylesheet">
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏝️ گردشگری هرمزگان</h1>
                <p style="font-size: 1.3rem; opacity: 0.9;">کشف زیبایی‌های منحصر به فرد جنوب ایران</p>
                <div style="margin-top: 20px;">
                    <a href="/admin-dashboard" class="btn">🏠 صفحه اصلی</a>
                    <a href="/festivals" class="btn btn-primary">🎉 فستیوال‌ها</a>
                </div>
            </div>

            <div class="attractions-grid">
                <div class="attraction-card">
                    <span class="attraction-icon">🏖️</span>
                    <h3 class="attraction-title">سواحل بکر</h3>
                    <p>سواحل زیبای جزیره قشم، هرمز و کیش با شن‌های رنگارنگ و آب‌های زلال</p>
                </div>
                
                <div class="attraction-card">
                    <span class="attraction-icon">🏜️</span>
                    <h3 class="attraction-title">جنگل‌های حرا</h3>
                    <p>جنگل‌های مانگرو حرا با اکوسیستم منحصر به فرد و پرندگان مهاجر</p>
                </div>
                
                <div class="attraction-card">
                    <span class="attraction-icon">🎎</span>
                    <h3 class="attraction-title">فرهنگ بومی</h3>
                    <p>آداب و رسوم، موسیقی و صنایع دستی مردم خونگرم جنوب ایران</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `);
});

//============================================
// 🚀 بخش‌های جدید و پیشرفته
// =========================================

app.get('/driver-dashboard-advanced', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>داشبورد پیشرفته - هم‌راز</title>
        <style>
            body { 
                font-family: 'Vazirmatn', sans-serif;
                padding: 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
            }
            .container {
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 20px;
                margin: 20px auto;
                max-width: 800px;
                backdrop-filter: blur(10px);
            }
            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 30px 0;
            }
            .feature-card {
                background: rgba(255,255,255,0.15);
                padding: 25px;
                border-radius: 15px;
                text-align: center;
                transition: all 0.3s ease;
            }
            .feature-card:hover {
                background: rgba(255,255,255,0.25);
                transform: translateY(-5px);
            }
            .feature-icon {
                font-size: 3rem;
                margin-bottom: 15px;
            }
            .btn {
                display: inline-block;
                background: rgba(255,255,255,0.2);
                color: white;
                padding: 15px 30px;
                margin: 10px;
                border-radius: 10px;
                text-decoration: none;
                transition: all 0.3s ease;
            }
            .btn:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-2px);
            }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;700;900&display=swap" rel="stylesheet">
    </head>
    <body>
        <h1>🚀 داشبورد پیشرفته راننده</h1>
        <div class="container">
            <h2>مدیریت حرفه‌ای درآمد و زمان</h2>
            <p>دسترسی به ابزارهای پیشرفته تحلیل و برنامه‌ریزی</p>
            
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3>تحلیل درآمد</h3>
                    <p>نمودارها و آمار پیشرفته درآمدی</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🧮</div>
                    <h3>ماشین حساب</h3>
                    <p>محاسبه سود و زیان سفرها</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💰</div>
                    <h3>پس‌انداز</h3>
                    <p>برنامه‌ریزی مالی هوشمند</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🕒</div>
                    <h3>برنامه‌ریزی</h3>
                    <p>مدیریت زمان کاری</p>
                </div>
            </div>
            
            <div style="margin-top: 30px;">
                <a href="/driver-dashboard" class="btn">🎯 بازگشت به داشبورد اصلی</a>
                <a href="/admin-dashboard" class="btn">🏠 صفحه اصلی مدیریت</a>
            </div>
        </div>
    </body>
    </html>
    `);
});

// =========================================
// 📍 ROUTEهای موجود دیگر
// =========================================

// Routeهای بخش‌های مختلف داشبورد پیشرفته
app.get('/driver-dashboard/income', (req, res) => {
    res.send('📊 صفحه تحلیل درآمد - به زودی...');
});

app.get('/driver-dashboard/calculator', (req, res) => {
    res.send('🧮 صفحه ماشین حساب - به زودی...');
});

app.get('/driver-dashboard/savings', (req, res) => {
    res.send('💰 صفحه پس‌انداز - به زودی...');
});

app.get('/driver-dashboard/schedule', (req, res) => {
    res.send('🕒 صفحه برنامه‌ریزی - به زودی...');
});

app.get('/driver-dashboard/reviews', (req, res) => {
    res.send('⭐ صفحه نظرات - به زودی...');
});

app.get('/driver-dashboard/support', (req, res) => {
    res.send('🛠 صفحه پشتیبانی - به زودی...');
});

// سایر صفحات
const simplePages = {
    '/modern-ui': '🎨 صفحه مدرن',
    '/mobile-app': '📱 اپلیکیشن موبایل',
    '/festivals': '🎉 فستیوال‌ها',
    '/ai-chat': '🤖 چت هوشمند',
    '/driver-registration': '📝 ثبت‌نام راننده',
    '/payment': '💳 درگاه پرداخت',
    '/map': '🗺️ نقشه هوشمند',
    '/calls': '📞 تماس‌ها',
    '/music': '🎵 موسیقی',
    '/login': '🔐 ورود',
    '/register': '📝 ثبت‌نام',
    '/security': '🛡️ امنیت',
    '/music-player': '🎵 پخش کننده موسیقی',
    '/traffic-ai': '🚦 هوش مصنوعی ترافیک',
    '/smart-map': '🗺️ نقشه هوشمند',
    '/payment-receipt': '🧾 رسید پرداخت',
    '/payment-receipt-simple': '🧾 رسید ساده',
    '/payment-receipt-edit': '📝 ویرایش رسید',
    '/attractions': '📸 جاذبه‌های طبیعی',
    '/cultural': '🎎 آثار فرهنگی',
    '/demo': '📺 صفحه دموهای پروژه',
'/video-demo': '🎬 دمو ویدیو حرفه‌ای',
'/demo': '🎬 دمو حرفه‌ای با انیمیشن',
    '/settings': '⚙️ صفحه تنظیمات',
};

// ایجاد خودکار تمام routeها
Object.entries(simplePages).forEach(([route, title]) => {
    app.get(route, (req, res) => {
        res.send(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                body { 
                    font-family: 'Vazirmatn', sans-serif;
                    padding: 20px; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-align: center;
                }
                .container {
                    background: rgba(255,255,255,0.1);
                    padding: 40px;
                    border-radius: 20px;
                    margin: 20px auto;
                    max-width: 600px;
                    backdrop-filter: blur(10px);
                }
                .btn {
                    display: inline-block;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    padding: 15px 30px;
                    margin: 10px;
                    border-radius: 10px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }
                .btn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-2px);
                }
            </style>
            <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;700;900&display=swap" rel="stylesheet">
        </head>
        <body>
            <h1>${title}</h1>
            <div class="container">
                <h2>${title}</h2>
                <p>این صفحه به زودی با محتوای کامل راه‌اندازی خواهد شد</p>
                <div style="margin-top: 30px;">
                    <a href="/admin-dashboard" class="btn">🏠 بازگشت به صفحه اصلی</a>
                    <a href="/driver-dashboard" class="btn">🎯 داشبورد راننده</a>
                </div>
            </div>
        </body>
        </html>
        `);
    });
});

// =========================================
// 🔧 APIهای سرویس
// =========================================

// API آمار زنده
app.get('/api/live-stats', (req, res) => {
    const driver = database.drivers[0];
    const todayTrips = database.trips.filter(trip => trip.status === 'completed');
    
    res.json({
        onlineDrivers: database.drivers.filter(d => d.status === 'online').length,
        todayTrips: todayTrips.length,
        liveEarnings: todayTrips.reduce((sum, trip) => sum + trip.price, 0),
        timestamp: new Date().toISOString()
    });
});

// API وضعیت راننده
app.get('/api/driver/status', (req, res) => {
    const driver = database.drivers[0];
    res.json({
        status: driver.status,
        name: driver.name,
        rating: driver.rating,
        balance: driver.balance
    });
});

// =========================================
// 🚀 راه‌اندازی سرور
// =========================================

app.listen(port, () => {
    console.log('='.repeat(60));
    console.log('🚀 سرور هرمزگان درایور پرو - نسخه اصلاح شده اجرا شد');
    console.log('📱 http://localhost:8080/');
    console.log('='.repeat(60));
    console.log('🎯 بخش‌های اصلی:');
    console.log('   📍 http://localhost:8080/admin-dashboard     (دشبورد مدیریت)');
    console.log('   📍 http://localhost:8080/driver-dashboard    (داشبورد راننده)');
    console.log('   📍 http://localhost:8080/tourism             (گردشگری)');
    console.log('   📍 http://localhost:8080/index               (صفحه اصلی)');
    console.log('');
    console.log('🚗 سیستم رانندگی:');
    console.log('   📍 http://localhost:8080/driver-dashboard-advanced');
    console.log('   📍 http://localhost:8080/driver-dashboard/income');
    console.log('   📍 http://localhost:8080/driver-dashboard/calculator');
    console.log('');
    console.log('🏝️ بخش توریسم:');
    console.log('   📍 http://localhost:8080/festivals');
    console.log('   📍 http://localhost:8080/attractions');
    console.log('   📍 http://localhost:8080/cultural');
    console.log('');
    console.log('🎬 دمو و نمایش:');
    console.log('   📍 http://localhost:8080/video-demo');
    console.log('   📍 http://localhost:8080/demo');
    console.log('='.repeat(60));
    console.log('💾 دیتابیس شامل:');
    console.log('   👤 ' + database.drivers.length + ' راننده');
    console.log('   🚗 ' + database.trips.length + ' سفر');
    console.log('   💳 ' + database.payments.length + ' پرداخت');
    console.log('='.repeat(60));
});

