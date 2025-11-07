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

// سایر صفحات
const pages = [
    'festivals', 'ai-chat', 'driver-dashboard', 'driver-registration',
    'payment', 'map', 'calls', 'music', 'login', 'register'
];

pages.forEach(page => {
    app.get('/' + page, (req, res) => {
        const filePath = path.join(__dirname, 'public', 'pages', page + '.html');
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.send(`
                <html dir="rtl">
                <body style="font-family: Vazirmatn; padding: 20px; text-align: center;">
                    <h1>🚧 صفحه در حال ساخت</h1>
                    <p>صفحه "${page}" به زودی آماده می‌شود</p>
                    <a href="/" style="color: #38bdf8;">← بازگشت به اپ اصلی</a>
                </body>
                </html>
            `);
        }
    });
});

app.listen(PORT, () => {
    console.log('=========================================');
    console.log('📱 اپ موبایل شیشه‌ای اجرا شد');
    console.log('🚀 http://localhost:8080/');
    console.log('=========================================');
});
