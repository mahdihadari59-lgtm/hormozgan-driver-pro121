const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 8080;

// سرویس فایل‌های استاتیک
app.use(express.static('public'));

// لیست کامل تمام صفحات
const pages = [
    'index', 'mobile-app', 'festivals', 'ai-chat', 'driver-dashboard', 
    'driver-registration', 'payment', 'map', 'calls', 'music', 'login', 
    'register', 'security', 'music-player', 'traffic-ai', 'smart-map',
    'payment-receipt', 'payment-receipt-simple', 'payment-receipt-edit',
    'welcome', 'dashboard', 'driver-profile', 'fare-calculator',
    'passenger-request', 'payment-success', 'payment-failed'
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
                        <p>صفحه "${page}" به زودی آماده می‌شود</p>
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
        message: 'Hormozgan Driver Pro - Complete Server',
        version: '5.0',
        pages: pages.length,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log('=========================================');
    console.log('🚀 سرور کامل هرمزگان درایور پرو');
    console.log('📱 http://localhost:8080/');
    console.log('=========================================');
    console.log('🎵 موزیک پلیر: http://localhost:8080/music-player');
    console.log('🎉 جشن‌های بومی: http://localhost:8080/festivals');
    console.log('👋 خوش آمدگویی: http://localhost:8080/welcome');
    console.log('📝 ویرایش رسید: http://localhost:8080/payment-receipt-edit');
    console.log('🤖 چت هوش مصنوعی: http://localhost:8080/ai-chat');
    console.log('🗺️ نقشه هوشمند: http://localhost:8080/smart-map');
    console.log('=========================================');
    console.log(`📄 تعداد صفحات: ${pages.length} صفحه`);
    console.log('=========================================');
});
