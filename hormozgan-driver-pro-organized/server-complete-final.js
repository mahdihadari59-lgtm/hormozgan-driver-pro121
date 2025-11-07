// =========================================
// 🚀 سرور هرمزگان درایور پرو + توریسم - نسخه نهایی
// =========================================
const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// میدلورهای ضروری
app.use(express.static('.'));
app.use(express.json());

// =========================================
// 🎯 ROUTEهای اصلی
// =========================================

app.get('/', (req, res) => {
    res.redirect('/index');
});

app.get('/index', (req, res) => {
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
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            body { 
                padding: 20px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
                min-height: 100vh;
            }
            .header {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 40px;
                margin: 20px auto;
                max-width: 1000px;
                border: 1px solid rgba(255,255,255,0.2);
            }
            .sections-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin: 30px auto;
                max-width: 1000px;
            }
            .section-card {
                background: rgba(255,255,255,0.1);
                padding: 30px;
                border-radius: 15px;
                border: 1px solid rgba(255,255,255,0.2);
                transition: all 0.3s ease;
            }
            .section-card:hover {
                background: rgba(255,255,255,0.15);
                transform: translateY(-5px);
            }
            .section-icon {
                font-size: 3rem;
                margin-bottom: 15px;
            }
            .btn-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 10px;
                margin-top: 15px;
            }
            .btn {
                background: rgba(255,255,255,0.2);
                color: white;
                padding: 12px;
                border-radius: 10px;
                text-decoration: none;
                transition: all 0.3s ease;
                display: block;
            }
            .btn:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚗 هم‌راز - سامانه هوشمند رانندگی و توریسم</h1>
            <p>پلتفرم جامع مدیریت رانندگی، گردشگری و خدمات هوشمند</p>
        </div>

        <div class="sections-grid">
            <!-- بخش رانندگی -->
            <div class="section-card">
                <div class="section-icon">🚗</div>
                <h3>سیستم رانندگی</h3>
                <p>مدیریت حرفه‌ای سفرها و درآمد</p>
                <div class="btn-grid">
                    <a href="/driver-dashboard" class="btn">🎯 داشبورد راننده</a>
                    <a href="/driver-dashboard-advanced" class="btn">🚀 داشبورد پیشرفته</a>
                    <a href="/driver-registration" class="btn">📝 ثبت‌نام راننده</a>
                    <a href="/map" class="btn">🗺️ نقشه هوشمند</a>
                </div>
            </div>

            <!-- بخش توریسم و گردشگری -->
            <div class="section-card">
                <div class="section-icon">🏝️</div>
                <h3>گردشگری هرمزگان</h3>
                <p>جاذبه‌های گردشگری و خدمات توریستی</p>
                <div class="btn-grid">
                    <a href="/tourism" class="btn">🏝️ گردشگری هرمزگان</a>
                    <a href="/festivals" class="btn">🎉 فستیوال‌ها</a>
                    <a href="/attractions" class="btn">📸 جاذبه‌ها</a>
                    <a href="/cultural" class="btn">🎎 فرهنگی</a>
                </div>
            </div>

            <!-- بخش خدمات -->
            <div class="section-card">
                <div class="section-icon">🛠️</div>
                <h3>خدمات و امکانات</h3>
                <p>ابزارها و خدمات هوشمند</p>
                <div class="btn-grid">
                    <a href="/payment" class="btn">💳 درگاه پرداخت</a>
                    <a href="/music-player" class="btn">🎵 پخش موسیقی</a>
                    <a href="/ai-chat" class="btn">🤖 چت هوشمند</a>
                    <a href="/security" class="btn">🛡️ امنیت</a>
                </div>
            </div>

            <!-- بخش مالی و تحلیل -->
            <div class="section-card">
                <div class="section-icon">📊</div>
                <h3>ابزارهای مالی</h3>
                <p>تحلیل و مدیریت مالی پیشرفته</p>
                <div class="btn-grid">
                    <a href="/driver-dashboard/income" class="btn">📊 تحلیل درآمد</a>
                    <a href="/driver-dashboard/calculator" class="btn">🧮 ماشین حساب</a>
                    <a href="/driver-dashboard/savings" class="btn">💰 پس‌انداز</a>
                    <a href="/payment-receipt" class="btn">🧾 رسید پرداخت</a>
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
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            :root {
                --primary: #667eea;
                --secondary: #764ba2;
                --success: #10b981;
                --warning: #f59e0b;
                --danger: #ef4444;
                --dark: #1f2937;
                --light: #f8fafc;
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
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
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
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="glass-card user-header">
                <div class="user-avatar">
                    <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem;">👤</div>
                </div>
                <div class="user-info">
                    <h1>علی محمدی، خوش آمدید!</h1>
                    <p>امروز: ${new Date().toLocaleDateString('fa-IR')} | وضعیت: فعال</p>
                </div>
                <div class="user-actions">
                    <button class="btn-primary" onclick="startNewTrip()">🚗 شروع سفر جدید</button>
                </div>
                
                <div class="user-stats">
                    <div class="stat-box">
                        <span class="stat-value">۱۲</span>
                        <span class="stat-label">سفر امروز</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-value">۴.۹M</span>
                        <span class="stat-label">درآمد امروز</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-value">۴.۹/۵</span>
                        <span class="stat-label">امتیاز شما</span>
                    </div>
                    <div class="stat-box">
                        <span class="stat-value">۳۲.۵M</span>
                        <span class="stat-label">درآمد هفته</span>
                    </div>
                </div>
            </div>

            <div class="glass-card">
                <h3 class="section-title">⚡ دسترسی سریع</h3>
                <div class="quick-access-buttons">
                    <a href="/driver-dashboard-advanced" class="quick-btn"><span class="quick-btn-icon">🚀</span><div>داشبورد پیشرفته</div></a>
                    <a href="/driver-dashboard/income" class="quick-btn"><span class="quick-btn-icon">📊</span><div>تحلیل درآمد</div></a>
                    <a href="/driver-dashboard/calculator" class="quick-btn"><span class="quick-btn-icon">🧮</span><div>ماشین حساب</div></a>
                    <a href="/driver-dashboard/savings" class="quick-btn"><span class="quick-btn-icon">💰</span><div>پس‌انداز</div></a>
                    <a href="/driver-dashboard/schedule" class="quick-btn"><span class="quick-btn-icon">🕒</span><div>برنامه‌ریزی</div></a>
                    <a href="/driver-dashboard/reviews" class="quick-btn"><span class="quick-btn-icon">⭐</span><div>نظرات</div></a>
                    <a href="/driver-dashboard/support" class="quick-btn"><span class="quick-btn-icon">🛠</span><div>پشتیبانی</div></a>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="glass-card">
                    <h3 class="section-title">📊 تحلیل درآمد هفتگی</h3>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin: 10px 0;">
                        <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                            <span>میانگین روزانه:</span><strong>۴,۶۴۲,۸۵۷ تومان</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                            <span>رشد هفتگی:</span><strong style="color: var(--success);">↑ ۱۲٪</strong>
                        </div>
                    </div>
                    <button class="btn-primary" style="width: 100%; margin-top: 10px;" onclick="showIncomeDetails()">مشاهده جزئیات</button>
                </div>

                <div class="glass-card">
                    <h3 class="section-title">🧮 ماشین حساب هوشمند</h3>
                    <div style="margin: 15px 0;">
                        <input type="number" placeholder="مبلغ سفر (تومان)" style="width: 100%; padding: 12px; border: none; border-radius: 8px; margin: 5px 0;" id="tripAmount">
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
                            <span>پس‌انداز ماهانه:</span><strong>۶۵٪</strong>
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
                alert('🚗 سیستم شروع سفر فعال شد!');
                window.location.href = '/map';
            }
            
            function calculateTrip() {
                const amount = document.getElementById('tripAmount').value;
                if (amount) {
                    const net = amount * 0.76;
                    document.getElementById('calcResult').innerHTML = '<div>درآمد خالص: <strong>' + parseInt(net).toLocaleString() + ' تومان</strong></div>';
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
            body { 
                font-family: Arial, sans-serif; 
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
    </head>
    <body>
        <h1>🏝️ گردشگری هرمزگان</h1>
        <div class="container">
            <h2>جاذبه‌های گردشگری استان هرمزگان</h2>
            <p>کشف زیبایی‌های منحصر به فرد جنوب ایران</p>
            <div style="margin-top: 30px;">
                <a href="/festivals" class="btn">🎉 فستیوال‌ها و جشنواره‌ها</a>
                <a href="/attractions" class="btn">📸 جاذبه‌های طبیعی</a>
                <a href="/cultural" class="btn">🎎 آثار فرهنگی</a>
                <a href="/index" class="btn">🏠 بازگشت به صفحه اصلی</a>
            </div>
        </div>
    </body>
    </html>
    `);
});

app.get('/festivals', (req, res) => {
    res.send('🎉 صفحه فستیوال‌ها و جشنواره‌های هرمزگان');
});

app.get('/attractions', (req, res) => {
    res.send('📸 صفحه جاذبه‌های طبیعی و گردشگری');
});

app.get('/cultural', (req, res) => {
    res.send('🎎 صفحه آثار فرهنگی و تاریخی');
});

// =========================================
// 🚀 بخش‌های جدید و پیشرفته رانندگی
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
                font-family: Arial, sans-serif; 
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
        </style>
    </head>
    <body>
        <h1>🚀 داشبورد پیشرفته راننده</h1>
        <div class="container">
            <h2>مدیریت حرفه‌ای درآمد و زمان</h2>
            <p>دسترسی به ابزارهای پیشرفته تحلیل و برنامه‌ریزی</p>
            
            <div class="feature-grid">
                <div class="feature-card"><div class="feature-icon">📊</div><h3>تحلیل درآمد</h3><p>نمودارها و آمار پیشرفته درآمدی</p></div>
                <div class="feature-card"><div class="feature-icon">🧮</div><h3>ماشین حساب</h3><p>محاسبه سود و زیان سفرها</p></div>
                <div class="feature-card"><div class="feature-icon">💰</div><h3>پس‌انداز</h3><p>برنامه‌ریزی مالی هوشمند</p></div>
                <div class="feature-card"><div class="feature-icon">🕒</div><h3>برنامه‌ریزی</h3><p>مدیریت زمان کاری</p></div>
                <div class="feature-card"><div class="feature-icon">⭐</div><h3>نظرات</h3><p>بازخورد مسافران</p></div>
                <div class="feature-card"><div class="feature-icon">🛠</div><h3>پشتیبانی</h3><p>مشاوره و راهنمایی</p></div>
            </div>
            
            <div style="margin-top: 30px;">
                <a href="/driver-dashboard" style="background: rgba(255,255,255,0.2); color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none; margin: 10px;">بازگشت به داشبورد اصلی</a>
            </div>
        </div>
    </body>
    </html>
    `);
});

// Routeهای بخش‌های مختلف
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

// =========================================
// 📍 ROUTEهای موجود دیگر
// =========================================

app.get('/modern-ui', (req, res) => {
    res.send('🎨 صفحه مدرن - موجود');
});

app.get('/mobile-app', (req, res) => {
    res.send('📱 اپلیکیشن موبایل - موجود');
});

app.get('/ai-chat', (req, res) => {
    res.send('🤖 چت هوشمند - موجود');
});

app.get('/driver-registration', (req, res) => {
    res.send('📝 ثبت‌نام راننده - موجود');
});

app.get('/payment', (req, res) => {
    res.send('💳 درگاه پرداخت - موجود');
});

app.get('/map', (req, res) => {
    res.send('🗺️ نقشه هوشمند - موجود');
});

app.get('/calls', (req, res) => {
    res.send('📞 تماس‌ها - موجود');
});

app.get('/music', (req, res) => {
    res.send('🎵 موسیقی - موجود');
});

app.get('/login', (req, res) => {
    res.send('🔐 ورود - موجود');
});

app.get('/register', (req, res) => {
    res.send('📝 ثبت‌نام - موجود');
});

app.get('/security', (req, res) => {
    res.send('🛡️ امنیت - موجود');
});

app.get('/music-player', (req, res) => {
    res.send('🎵 پخش کننده موسیقی - موجود');
});

app.get('/traffic-ai', (req, res) => {
    res.send('🚦 هوش مصنوعی ترافیک - موجود');
});

app.get('/smart-map', (req, res) => {
    res.send('🗺️ نقشه هوشمند - موجود');
});

app.get('/payment-receipt', (req, res) => {
    res.send('🧾 رسید پرداخت - موجود');
});

app.get('/payment-receipt-simple', (req, res) => {
    res.send('🧾 رسید ساده - موجود');
});

app.get('/payment-receipt-edit', (req, res) => {
    res.send('📝 ویرایش رسید - موجود');
});

// =========================================
// 🚀 راه‌اندازی سرور
// =========================================

app.listen(port, () => {
    console.log('=========================================');
    console.log('🚀 سرور هرمزگان درایور پرو + توریسم اجرا شد');
    console.log('📱 http://localhost:8080/');
    console.log('=========================================');
    console.log('🎯 بخش رانندگی:');
    console.log('   📍 http://localhost:8080/driver-dashboard');
    console.log('   📍 http://localhost:8080/driver-dashboard-advanced');
    console.log('   📍 http://localhost:8080/driver-dashboard/income');
    console.log('   📍 http://localhost:8080/driver-dashboard/calculator');
    console.log('   📍 http://localhost:8080/driver-dashboard/savings');
    console.log('   📍 http://localhost:8080/driver-dashboard/schedule');
    console.log('   📍 http://localhost:8080/driver-dashboard/reviews');
    console.log('   📍 http://localhost:8080/driver-dashboard/support');
    console.log('   📍 http://localhost:8080/driver-registration');
    console.log('');
    console.log('🏝️ بخش توریسم:');
    console.log('   📍 http://localhost:8080/tourism');
    console.log('   📍 http://localhost:8080/festivals');
    console.log('   📍 http://localhost:8080/attractions');
    console.log('   📍 http://localhost:8080/cultural');
    console.log('');
    console.log('🛠️ خدمات و امکانات:');
    console.log('   📍 http://localhost:8080/payment');
    console.log('   📍 http://localhost:8080/map');
    console.log('   📍 http://localhost:8080/music-player');
    console.log('   📍 http://localhost:8080/ai-chat');
    console.log('   📍 و سایر خدمات...');
    console.log('=========================================');
});

