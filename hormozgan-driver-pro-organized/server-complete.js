// سرور کامل با ماژول گردشگری
const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

// middlewareها
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

// Routes اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/mobile-app.html'));
});

app.get('/tourism', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/tourism.html'));
});

// API Routes
const tourismRoutes = require('./routes/tourism');
app.use('/api/tourism', tourismRoutes);

// Routes اضافی برای سازگاری
app.get('/mobile-app', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/mobile-app.html'));
});

app.get('/modern-ui', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/modern-ui.html'));
});

// Route پیش‌فرض برای صفحات
app.get('/pages/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, `public/pages/${page}.html`));
});

// Route سلامت سرور
app.get('/health', (req, res) => {
    res.json({ 
        status: 'active', 
        service: 'Hormozgan Tourism Server',
        timestamp: new Date().toISOString(),
        version: '2.0.0'
    });
});

// راه‌اندازی سرور
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 سرور گردشگری هرمزگان در حال اجرا...`);
    console.log(`📍 پورت: ${PORT}`);
    console.log(`🌐 آدرس: http://localhost:${PORT}`);
    console.log(`🎯 گردشگری: http://localhost:${PORT}/tourism`);
    console.log(`📱 اپ موبایل: http://localhost:${PORT}/mobile-app`);
    console.log(`⚡ UI مدرن: http://localhost:${PORT}/modern-ui`);
    console.log(`❤️  سلامت: http://localhost:${PORT}/health`);
});

// مدیریت خطا
process.on('uncaughtException', (error) => {
    console.error('❌ خطای غیرمنتظره:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ خطای promise:', reason);
});
