// complete-server-v2.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const BackupManager = require('./backup-manager');

const app = express();
const PORT = 8080;
const backupManager = new BackupManager();

app.use(express.static('public'));
app.use(express.json());

const pages = [
    'index', 'mobile-app', 'festivals', 'ai-chat', 'driver-dashboard',
    'driver-registration', 'payment', 'map', 'calls', 'music', 'login',
    'register', 'security', 'music-player', 'traffic-ai', 'smart-map',
    'payment-receipt', 'payment-receipt-simple', 'payment-receipt-edit',
    'welcome', 'dashboard', 'driver-profile', 'fare-calculator',
    'passenger-request', 'payment-success', 'payment-failed'
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'mobile-app.html'));
});

pages.forEach(page => {
    app.get('/' + page, (req, res) => {
        const filePath = path.join(__dirname, 'public', 'pages', page + '.html');
        if (fs.existsSync(filePath)) {
            console.log(`✅ نمایش صفحه: ${page}`);
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
                            margin: 10px;
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
                        <a href="/">← صفحه اصلی</a>
                    </div>
                </body>
                </html>
            `);
        }
    });
});

app.get('/api/health', (req, res) => {
    const backups = backupManager.listBackups();
    
    res.json({
        status: 'success',
        message: 'Hormozgan Driver Pro - Complete Server v2',
        version: '6.0',
        features: {
            pages: pages.length,
            backupSystem: true,
            totalBackups: backups.length
        },
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log('=========================================');
    console.log('🚀 Hormozgan Driver Pro - Server v6.0');
    console.log('📍 Port:', PORT);
    console.log('💾 Backup System: Active');
    console.log('📄 Pages:', pages.length);
    console.log('=========================================');
});
