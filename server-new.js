const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 8080;

// میدلورها
app.use(express.static('public'));
app.use(express.json());

// لیست کامل تمام صفحات
const pages = [
    // صفحات اصلی
    'index', 'mobile-app', 'modern-ui', 'welcome',
    
    // هوش مصنوعی
    'ai-chat', 'traffic-ai',
    
    // مدیریت رانندگان
    'driver-dashboard', 'driver-registration', 'driver-profile',
    
    // مالی و پرداخت
    'payment', 'payment-receipt', 'payment-receipt-simple', 'payment-receipt-edit',
    'payment-success', 'payment-failed', 'fare-calculator',
    
    // نقشه و مسیریابی
    'smart-map', 'map',
    
    // سرگرمی و فرهنگ
    'music-player', 'music', 'festivals',
    
    // امنیت و ارتباطات
    'security', 'calls',
    
    // کاربری
    'login', 'register', 'dashboard',
    
    // سایر
    'passenger-request'
];

// Route اصلی - صفحه اصلی
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'pages', 'mobile-app.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.send(`
            <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>هورمزگان درایور پرو</title>
                <style>
                    body {
                        font-family: 'Vazirmatn', sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 40px;
                        text-align: center;
                    }
                    .container {
                        max-width: 500px;
                        margin: 100px auto;
                        background: rgba(255,255,255,0.1);
                        backdrop-filter: blur(10px);
                        padding: 40px;
                        border-radius: 20px;
                        border: 1px solid rgba(255,255,255,0.2);
                    }
                    .btn {
                        background: linear-gradient(45deg, #38bdf8, #2563eb);
                        color: white;
                        padding: 12px 24px;
                        border-radius: 10px;
                        text-decoration: none;
                        margin: 10px;
                        display: inline-block;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🚗 هرمزگان درایور پرو</h1>
                    <p>سرویس حرفه‌ای رانندگان استان هرمزگان</p>
                    <div style="margin: 30px 0;">
                        <a href="/mobile-app" class="btn">📱 منوی اصلی</a>
                        <a href="/modern-ui" class="btn">🎨 UI مدرن</a>
                    </div>
                </div>
            </body>
            </html>
        `);
    }
});

// Route برای تمام صفحات
pages.forEach(page => {
    app.get('/' + page, (req, res) => {
        const filePath = path.join(__dirname, 'public', 'pages', page + '.html');
        
        if (fs.existsSync(filePath)) {
            console.log(`✅ نمایش صفحه: ${page}`);
            res.sendFile(filePath);
        } else {
            console.log(`🚧 صفحه در حال ساخت: ${page}`);
            res.send(`
                <html dir="rtl">
                <head>
                    <meta charset="UTF-8">
                    <title>صفحه در حال ساخت</title>
                    <style>
                        body {
                            font-family: 'Vazirmatn', sans-serif;
                            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                            color: white;
                            padding: 40px;
                            text-align: center;
                        }
                        .container {
                            max-width: 500px;
                            margin: 100px auto;
                            background: rgba(255,255,255,0.1);
                            backdrop-filter: blur(10px);
                            padding: 40px;
                            border-radius: 20px;
                            border: 1px solid rgba(255,255,255,0.2);
                        }
                        a {
                            color: #38bdf8;
                            text-decoration: none;
                            display: inline-block;
                            margin-top: 20px;
                            padding: 10px 20px;
                            background: rgba(255,255,255,0.1);
                            border-radius: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🚧 صفحه در حال ساخت</h1>
                        <p>صفحه <strong>"${page}"</strong> به زودی آماده می‌شود</p>
                        <a href="/">🏠 بازگشت به صفحه اصلی</a>
                    </div>
                </body>
                </html>
            `);
        }
    });
});

// API سلامت سرور
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'Hormozgan Driver Pro - Complete Server',
        version: '5.0',
        pages: pages.length,
        active: true,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API اطلاعات سرور
app.get('/api/info', (req, res) => {
    res.json({
        project: 'Hormozgan Driver Pro',
        version: '5.0.0',
        description: 'سرویس حرفه‌ای رانندگان استان هرمزگان',
        author: 'Hormozgan Team',
        pages_count: pages.length,
        port: PORT,
        environment: 'development'
    });
});

// Route فالوبک برای آدرس‌های نامعتبر
app.get('*', (req, res) => {
    res.status(404).send(`
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>صفحه پیدا نشد</title>
            <style>
                body {
                    font-family: 'Vazirmatn', sans-serif;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: white;
                    padding: 40px;
                    text-align: center;
                }
                .container {
                    max-width: 600px;
                    margin: 50px auto;
                    background: rgba(255,255,255,0.1);
                    backdrop-filter: blur(10px);
                    padding: 40px;
                    border-radius: 20px;
                    border: 1px solid rgba(255,255,255,0.2);
                }
                .pages-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 10px;
                    margin: 20px 0;
                }
                .page-link {
                    background: rgba(255,255,255,0.1);
                    padding: 10px;
                    border-radius: 8px;
                    text-decoration: none;
                    color: white;
                    transition: 0.3s;
                }
                .page-link:hover {
                    background: rgba(255,255,255,0.2);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔍 صفحه پیدا نشد</h1>
                <p>آدرس درخواستی: <code>${req.path}</code></p>
                <p>صفحات موجود:</p>
                <div class="pages-grid">
                    ${pages.slice(0, 12).map(page => `
                        <a href="/${page}" class="page-link">${page}</a>
                    `).join('')}
                </div>
                <a href="/" style="color: #38bdf8; margin-top: 20px; display: inline-block;">
                    🏠 بازگشت به صفحه اصلی
                </a>
            </div>
        </body>
        </html>
    `);
});

// راه‌اندازی سرور
app.listen(PORT, () => {
    console.log('═══════════════════════════════════════════════');
    console.log('🚀 HORMOZGAN DRIVER PRO - SERVER v5.0');
    console.log('📱 http://localhost:' + PORT + '/');
    console.log('═══════════════════════════════════════════════');
    console.log('🎯 صفحات اصلی:');
    console.log('   📱 منوی اصلی    http://localhost:' + PORT + '/mobile-app');
    console.log('   🎨 UI مدرن      http://localhost:' + PORT + '/modern-ui');
    console.log('   🤖 چت هوش مصنوعی http://localhost:' + PORT + '/ai-chat');
    console.log('   🎵 موزیک پلیر   http://localhost:' + PORT + '/music-player');
    console.log('═══════════════════════════════════════════════');
    console.log('💡 دسترسی سریع:');
    console.log('   🗺️  نقشه هوشمند  http://localhost:' + PORT + '/smart-map');
    console.log('   💳 درگاه پرداخت http://localhost:' + PORT + '/payment');
    console.log('   🧾 ویرایش رسید  http://localhost:' + PORT + '/payment-receipt-edit');
    console.log('   🎉 جشن‌های بومی http://localhost:' + PORT + '/festivals');
    console.log('═══════════════════════════════════════════════');
    console.log('📊 وضعیت:');
    console.log('   📄 تعداد صفحات: ' + pages.length);
    console.log('   🟢 وضعیت: فعال');
    console.log('   🔄 پورت: ' + PORT);
    console.log('═══════════════════════════════════════════════');
    console.log('🌟 "سفر امن، درآمد مطمئن"');
    console.log('═══════════════════════════════════════════════');
});

// مدیریت graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 دریافت SIGINT - خاموش کردن سرور...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 دریافت SIGTERM - خاموش کردن سرور...');
    process.exit(0);
});

// اضافه کردن صفحات جدید به لیست
pages.push(
    'modern-ui',
    'welcome',
    'dashboard',
    'driver-profile',
    'fare-calculator',
    'passenger-request',
    'payment-success',
    'payment-failed'
);

// بعد از حلقه forEach صفحات، این رو اضافه کن
console.log('🎨 UI مدرن: http://localhost:8080/modern-ui');
console.log('👋 خوش آمدگویی: http://localhost:8080/welcome');
console.log('📊 داشبورد: http://localhost:8080/dashboard');
