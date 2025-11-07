const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 8080;

// سرویس فایل‌های استاتیک
app.use(express.static('public'));

// لیست تمام صفحات
const pages = [
    'index', 'mobile-app', 'festivals', 'ai-chat', 'driver-dashboard', 
    'driver-registration', 'payment', 'map', 'calls', 'music', 'login', 
    'register', 'security', 'music-player', 'traffic-ai', 'smart-map',
    'payment-receipt'
];

// Route برای صفحه اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'mobile-app.html'));
});

// Route برای تمام صفحات
pages.forEach(page => {
    app.get('/' + page, (req, res) => {
        const filePath = path.join(__dirname, 'public', 'pages', page + '.html');
        if (fs.existsSync(filePath)) {
            console.log(`✅ نمایش صفحه: ${page}`);
            res.sendFile(filePath);
        } else {
            console.log(`❌ صفحه پیدا نشد: ${page}`);
            res.send(`
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
                        <h1>❌ صفحه پیدا نشد</h1>
                        <p>صفحه "${page}" وجود ندارد</p>
                        <a href="/">← بازگشت به صفحه اصلی</a>
                    </div>
                </body>
                </html>
            `);
        }
    });
});

// Route برای سلامت سرور
app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'Hormozgan Driver Pro Server',
        version: '5.0',
        pages: pages.length,
        timestamp: new Date().toISOString()
    });
});

// Route فالوبک برای هر آدرس
app.get('*', (req, res) => {
    res.send(`
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>آدرس پیدا نشد</title>
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
                .pages-list {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
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
                <h1>🔍 آدرس پیدا نشد</h1>
                <p>آدرس درخواستی: <code>${req.path}</code></p>
                <p>صفحات موجود:</p>
                <div class="pages-list">
                    ${pages.map(page => `
                        <a href="/${page}" class="page-link">${page}</a>
                    `).join('')}
                </div>
                <a href="/" style="color: #38bdf8; margin-top: 20px; display: inline-block;">
                    ← بازگشت به صفحه اصلی
                </a>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log('=========================================');
    console.log('🚀 سرور هرمزگان درایور پرو اجرا شد');
    console.log('📱 http://localhost:8080/');
    console.log('=========================================');
    console.log('🎯 صفحات فعال:');
    pages.forEach(page => {
        console.log(`   📍 http://localhost:8080/${page}`);
    });
    console.log('=========================================');
    console.log('🧾 رسید پرداخت: http://localhost:8080/payment-receipt');
    console.log('💳 درگاه پرداخت: http://localhost:8080/payment');
    console.log('=========================================');
});
