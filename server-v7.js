const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Routes - صفحات اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/ai-chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ai-chat-complete.html'));
});

app.get('/driver-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'driver-dashboard.html'));
});

app.get('/driver-profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'driver-profile.html'));
});

app.get('/calls', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'calls.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API Endpoints
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        version: 'v5.0',
        timestamp: new Date().toISOString(),
        server: 'AI Sahel Hormozgan Driver Pro'
    });
});

app.post('/api/ai-chat', (req, res) => {
    const { message, tab } = req.body;
    
    // پاسخ‌های هوشمند بر اساس تب
    const responses = {
        traffic: [
            '🚦 ترافیک در مسیر بندرعباس - میناب نیمه‌سنگین است',
            '✅ جاده بندرعباس - کیش صاف و روان است',
            '⚠️ توصیه می‌شود از مسیر جایگزین استفاده کنید'
        ],
        info: [
            '🚗 پلاک: ۸۴ ایران ۷۴۱ ط ۹۸',
            '📞 پشتیبانی: ۰۷۶۳۵۱۰۸',
            'ℹ️ اطلاعات خودرو شما به‌روز است'
        ],
        route: [
            '🗺️ بهترین مسیر: بندرعباس → جاسک → چابهار',
            '⏱️ زمان تقریبی: ۴ ساعت',
            '⛽ توصیه: یک باک کامل سوخت'
        ],
        general: [
            '✅ خوشحالم که کمکتان می‌کنم',
            '🎯 سوال دیگری دارید؟',
            '📱 برای پشتیبانی: ۰۷۶۳۵۱۰۸'
        ]
    };
    
    const tabResponses = responses[tab] || responses.general;
    const randomResponse = tabResponses[Math.floor(Math.random() * tabResponses.length)];
    
    res.json({
        success: true,
        response: randomResponse,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/driver-info', (req, res) => {
    res.json({
        success: true,
        data: {
            plate: '84 ایران 741 ط 98',
            support: '07635108',
            status: 'active',
            piers: ['اسکله 1', 'اسکله 2', 'اسکله 3']
        }
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'خطای سرور'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'صفحه مورد نظر یافت نشد'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║                🤖 AI Sahel v7.0                     ║');
    console.log('╠══════════════════════════════════════════════════════╣');
    console.log(`║   🚀 سرور کامل روی پورت ${PORT} اجرا شد             ║`);
    console.log('║   📞 پشتیبانی: 07635108                            ║');
    console.log('║   🚗 پلاک: 84 ایران 741 ط 98                       ║');
    console.log('║   🗺️ ۳ اسکله جدید تحت پوشش                        ║');
    console.log('║   🔥 هوش مصنوعی مسیریابی فعال                      ║');
    console.log('║                                                      ║');
    console.log(`║   📱 http://localhost:${PORT}/                         ║`);
    console.log(`║   🤖 http://localhost:${PORT}/ai-chat                 ║`);
    console.log('║                                                      ║');
    console.log('║   ✅ AI Sahel آماده خدمات‌رسانی!                   ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');
});

module.exports = app;
