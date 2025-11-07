const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 8080;

// لیست صفحات اصلی
const mainPages = {
    '/': 'index.html',
    '/festivals': 'festivals.html', 
    '/ai-chat': 'ai-chat.html',
    '/driver-dashboard': 'driver-dashboard.html',
    '/map': 'map.html',
    '/payment': 'payment.html',
    '/login': 'login.html',
    '/register': 'register.html',
    '/music': 'music.html'
};

// Route برای صفحات اصلی
Object.entries(mainPages).forEach(([route, file]) => {
    app.get(route, (req, res) => {
        const filePath = path.join(__dirname, 'public', 'pages', file);
        if (fs.existsSync(filePath)) {
            console.log(`✅ نمایش صفحه: ${file}`);
            res.sendFile(filePath);
        } else {
            res.status(404).send(`فایل ${file} پیدا نشد!`);
        }
    });
});

// Route پیشفرض - لیست تمام صفحات
app.get('*', (req, res) => {
    const requestedPath = req.path;
    const allFiles = fs.readdirSync(path.join(__dirname, 'public', 'pages'));
    
    // اگر مسیر مستقیم به فایل HTML خواسته شد
    if (requestedPath.endsWith('.html')) {
        const fileName = requestedPath.split('/').pop();
        const filePath = path.join(__dirname, 'public', 'pages', fileName);
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        }
    }
    
    // نمایش لیست تمام صفحات
    res.send(`
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>🚗 تمام صفحات هرمزگان درایور</title>
            <style>
                body { font-family: system-ui; padding: 20px; background: #f0f8ff; }
                h1 { color: #2563eb; }
                ul { list-style: none; padding: 0; }
                li { margin: 10px 0; }
                a { 
                    display: block; 
                    padding: 12px; 
                    background: white; 
                    border-radius: 8px; 
                    text-decoration: none; 
                    color: #1e40af;
                    border: 2px solid #dbeafe;
                    transition: 0.3s;
                }
                a:hover { background: #dbeafe; }
            </style>
        </head>
        <body>
            <h1>🚗 Hormozgan Driver Pro - تمام صفحات</h1>
            <p>صفحه درخواستی: <code>${requestedPath}</code></p>
            
            <h2>🎯 صفحات اصلی:</h2>
            <ul>
                <li><a href="/">🏠 صفحه اصلی (index.html)</a></li>
                <li><a href="/festivals">🎉 جشن‌های بومی</a></li>
                <li><a href="/ai-chat">🤖 چت هوش مصنوعی</a></li>
                <li><a href="/driver-dashboard">👨‍💼 داشبورد راننده</a></li>
                <li><a href="/map">🗺️ نقشه</a></li>
                <li><a href="/payment">💳 پرداخت</a></li>
            </ul>
            
            <h2>📋 تمام صفحات موجود (${allFiles.length} صفحه):</h2>
            <ul>
                ${allFiles.map(file => `
                    <li>
                        <a href="/pages/${file}">📄 ${file}</a>
                        <small> | <a href="/${file.replace('.html', '')}">🚀 مسیر ساده</a></small>
                    </li>
                `).join('')}
            </ul>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log('=========================================');
    console.log('🚀 سرور تضمینی روی پورت 8080');
    console.log('📱 http://localhost:8080/');
    console.log('🎉 http://localhost:8080/festivals');
    console.log('🤖 http://localhost:8080/ai-chat');
    console.log('=========================================');
    console.log('✅ تمام فایل‌های HTML شناسایی شدند!');
});
