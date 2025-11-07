const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 8080;

// سرویس فایل‌های استاتیک
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// صفحه اصلی - اپ موبایل
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'mobile-app.html'));
});

// تمام صفحات با محتوای کامل
const pages = [
    'festivals', 'ai-chat', 'driver-dashboard', 'driver-registration',
    'payment', 'map', 'calls', 'music', 'login', 'register', 'security',
    'music-player', 'traffic-ai', 'smart-map'
];

pages.forEach(page => {
    app.get('/' + page, (req, res) => {
        const filePath = path.join(__dirname, 'public', 'pages', page + '.html');
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
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
                        <a href="/">← بازگشت به اپ اصلی</a>
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
        message: 'Hormozgan Driver Pro Mobile Server',
        version: '5.0',
        pages: pages.length,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log('=========================================');
    console.log('📱 اپ موبایل هرمزگان درایور پرو');
    console.log('🚀 http://localhost:8080/');
    console.log('=========================================');
    console.log('🎯 صفحات فعال:');
    pages.forEach(page => {
        console.log(`   📍 http://localhost:8080/${page}`);
    });
    console.log('=========================================');
});
