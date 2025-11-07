const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 8080;

// سرویس فایل‌های استاتیک
app.use(express.static('public'));

// لیست تمام صفحات
const pages = [
    'modern-ui',
    'index', 'mobile-app', 'festivals', 'ai-chat', 'driver-dashboard', 
    'driver-registration', 'payment', 'map', 'calls', 'music', 'login', 
    'register', 'security', 'music-player', 'traffic-ai', 'smart-map',
    'payment-receipt', 'payment-receipt-simple', 'payment-receipt-edit'
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
    console.log('📝 ویرایش رسید: http://localhost:8080/payment-receipt-edit');
    console.log('🧾 رسید ساده: http://localhost:8080/payment-receipt-simple');
    console.log('💳 درگاه پرداخت: http://localhost:8080/payment');
    console.log('=========================================');
});
