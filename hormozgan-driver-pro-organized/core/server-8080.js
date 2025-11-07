const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// سرویس فایل‌های استاتیک
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'index.html'));
});

app.get('/festivals', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'festivals.html'));
});

app.get('/ai-chat', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'ai-chat.html'));
});

app.get('/driver-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'driver-dashboard.html'));
});

// Route فالوبک
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const pagePath = path.join(__dirname, '..', 'public', 'pages', page + '.html');
    
    if (require('fs').existsSync(pagePath)) {
        res.sendFile(pagePath);
    } else {
        res.status(404).send('صفحه پیدا نشد');
    }
});

app.listen(PORT, () => {
    console.log('══════════════════════════════════════╗');
    console.log('║        🎊 Hormozgan Driver Pro       ║');
    console.log('╠════════════════════════════════════════╣');
    console.log('║   🚀 سرور روی پورت 8080 اجرا شد    ║');
    console.log('║                                        ║');
    console.log('║   📱 http://localhost:8080/           ║');
    console.log('║   🎉 http://localhost:8080/festivals  ║');
    console.log('║   🤖 http://localhost:8080/ai-chat    ║');
    console.log('║                                        ║');
    console.log('║   ✅ سرور فعال و آماده خدمات!        ║');
    console.log('╚════════════════════════════════════════╝');
});
