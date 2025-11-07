const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routeهای اصلی - مطابق با منوی index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/calls', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'calls.html'));
});

app.get('/ai-chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ai-chat.html'));
});

app.get('/driver-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'driver-dashboard.html'));
});

app.get('/driver-profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'driver-profile.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ==================== داده‌های سیستم ====================

// داده‌های ترافیک
const trafficData = {
    "بندرعباس مرکز": {
        status: "شلوغ 🟠",
        speed: "20 km/h",
        routes: ["خیابان امام: 🔴 شلوغ", "بلوار طالقانی: 🟢 روان"]
    },
    "بندرعباس شمال": {
        status: "روان 🟢",
        speed: "45 km/h", 
        routes: ["جاده فرودگاه: 🟢 روان", "بلوار معلم: 🟡 متوسط"]
    },
    "بندرعباس جنوب": {
        status: "بسیار شلوغ 🔴",
        speed: "10 km/h",
        routes: ["اسکله شهید حقانی: 🔴 قفل", "بازار ماهی: 🔴 شلوغ"]
    }
};

// داده‌های آب و هوا
const weatherData = {
    "بندرعباس": {
        temperature: "۳۲°C",
        condition: "آفتابی ☀️",
        humidity: "۶۵٪",
        wind: "۱۵ km/h"
    },
    "قشم": {
        temperature: "۳۰°C",
        condition: "نیمه ابری ⛅",
        humidity: "۷۰٪", 
        wind: "۲۰ km/h"
    },
    "میناب": {
        temperature: "۳۴°C",
        condition: "آفتابی 🌞",
        humidity: "۶۰٪",
        wind: "۱۲ km/h"
    }
};

// داده‌های قوانین
const lawsData = {
    speed: {
        urban: "۵۰ کیلومتر بر ساعت",
        suburban: "۱۱۰ کیلومتر بر ساعت",
        highway: "۱۲۰ کیلومتر بر ساعت",
        fines: {
            "20km_over": "۳۰۰,۰۰۰ تومان",
            "40km_over": "۱,۰۰۰,۰۰۰ تومان"
        }
    },
    overtaking: {
        rules: "سبقت فقط از چپ، در خط مجاز، با دید کافی",
        prohibited: "پیچ‌ها، سربالایی‌ها، تقاطع‌ها، گذرگاه عابر",
        fine: "۷۵۰,۰۰۰ تومان"
    }
};

// ==================== AI CHAT SYSTEM ====================

app.post('/ai-chat-pro', express.json(), (req, res) => {
    try {
        const { message } = req.body;
        console.log('🤖 AI سوال:', message);
        
        if (!message || message.trim() === '') {
            return res.json({ 
                response: 'لطفاً سوال خود را وارد کنید',
                alerts: ['ورودی نمی‌تواند خالی باشد']
            });
        }

        let response = '';
        const alerts = [];

        if (message.includes('ترافیک') || message.includes('وضعیت') || message.includes('شلوغ')) {
            response = "🚦 **وضعیت ترافیک لحظه‌ای بندرعباس**\n\n";
            Object.entries(trafficData).forEach(([area, data]) => {
                response += `**${area}:**\n`;
                response += `• وضعیت: ${data.status}\n`;
                response += `• سرعت: ${data.speed}\n`;
                response += `• مسیرها:\n`;
                data.routes.forEach(route => {
                    response += `  ${route}\n`;
                });
                response += `\n`;
            });
            alerts.push("🕒 ساعات شلوغی: ۷-۹ صبح | ۱۷-۲۰ عصر");
        }
        else if (message.includes('آب و هوا') || message.includes('هوا') || message.includes('دما')) {
            response = "🌤️ **وضعیت آب و هوای هرمزگان**\n\n";
            Object.entries(weatherData).forEach(([city, data]) => {
                response += `**${city}:**\n`;
                response += `• دما: ${data.temperature}\n`;
                response += `• وضعیت: ${data.condition}\n`;
                response += `• رطوبت: ${data.humidity}\n`;
                response += `• باد: ${data.wind}\n\n`;
            });
            alerts.push("📡 منبع: سازمان هواشناسی");
        }
        else if (message.includes('قانون') || message.includes('سرعت') || message.includes('سبقت')) {
            response = "🚦 **قوانین سرعت:**\n\n";
            response += `🏙️ **شهری:** ${lawsData.speed.urban}\n`;
            response += `🛣️ **برون‌شهری:** ${lawsData.speed.suburban}\n`;
            response += `🛣️ **آزادراه:** ${lawsData.speed.highway}\n\n`;
            response += "💰 **جرایم:**\n";
            response += `• تجاوز تا ۲۰ کیلومتر: ${lawsData.speed.fines["20km_over"]}\n`;
            response += `• تجاوز بیش از ۲۰ کیلومتر: ${lawsData.speed.fines["40km_over"]}\n`;
            alerts.push("⚠️ رعایت سرعت مجاز الزامی است");
        }
        else if (message.includes('سلام') || message.includes('درود')) {
            response = "🌟 **سلام! به AI Sahel Pro خوش آمدید!** 👋\n\n";
            response += "من دستیار هوشمند شما برای امور رانندگی هستم.\n\n";
            response += "🛠️ **خدمات قابل ارائه:**\n";
            response += "• 🚦 قوانین سرعت و محدودیت‌ها\n";
            response += "• 🚗 قوانین سبقت و شرایط\n";
            response += "• 🗺️ وضعیت ترافیک و مسیریابی\n";
            response += "• 🌤️ آب و هوا و شرایط جوی\n\n";
            response += "✨ **چگونه می‌توانم کمک کنم؟**";
            alerts.push("📞 پشتیبانی: 07635108");
        }
        else if (message.includes('پشتیبانی') || message.includes('تماس')) {
            response = "📞 **اطلاعات پشتیبانی**\n\n";
            response += "• **شماره پشتیبانی:** ۰۷۶۳۵۱۰۸\n";
            response += "• **پلاک:** ۸۴ ایران ۷۴۱ ط ۹۸\n";
            response += "• **ساعات کاری:** ۲۴/۷\n";
            response += "• **خدمات:** راهنمایی فنی، اطلاعات ترافیک\n\n";
            response += "💡 **برای دریافت کمک فوری تماس بگیرید.**";
            alerts.push("⏰ پاسخگویی ۲۴ ساعته");
        }
        else {
            response = "🤖 **AI Sahel Pro**\n\n";
            response += `سوال شما: "${message}"\n\n`;
            response += "💡 **من می‌توانم در زمینه‌های زیر کمک کنم:**\n\n";
            response += "• 🚦 **وضعیت ترافیک** و مسیریابی\n";
            response += "• 🌤️ **آب و هوا** و پیش‌بینی\n";
            response += "• ⚖️ **قوانین رانندگی** و جرایم\n";
            response += "• 📞 **پشتیبانی فنی** و راهنمایی\n\n";
            response += "🎯 **لطفاً سوال خود را دقیق‌تر فرمایید.**";
        }

        res.json({
            response: response,
            alerts: alerts,
            timestamp: new Date().toLocaleString('fa-IR'),
            status: 'success'
        });

    } catch (error) {
        console.error('❌ خطا در AI:', error);
        res.json({
            response: '⚠️ خطا در پردازش سوال',
            alerts: ['سیستم مشکل موقت دارد'],
            status: 'error'
        });
    }
});

// ==================== API ENDPOINTS ====================

// endpoint سلامت
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'active', 
        service: 'AI Sahel Pro',
        version: '5.0',
        port: PORT,
        timestamp: new Date().toLocaleString('fa-IR'),
        endpoints: {
            ai_chat: '/ai-chat-pro',
            health: '/api/health',
            driver_info: '/api/driver-info'
        }
    });
});

// endpoint اطلاعات راننده
app.get('/api/driver-info', (req, res) => {
    res.json({
        success: true,
        data: { 
            plate: '84 ایران 741 ط 98', 
            support: '07635108',
            city: 'بندرعباس',
            province: 'هرمزگان',
            system: 'Hormozgan Driver Pro v5.0'
        }
    });
});

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: Date.now(),
        version: '5.0'
    });
});

// مدیریت خطای 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'صفحه مورد نظر یافت نشد',
        available_routes: [
            '/',
            '/calls', 
            '/ai-chat',
            '/driver-dashboard',
            '/driver-profile',
            '/contact',
            '/dashboard'
        ],
        support: '07635108'
    });
});

// راه‌اندازی سرور
app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║              🚀 Hormozgan Driver Pro v5.0           ║');
    console.log('╠══════════════════════════════════════════════════════╣');
    console.log(`║   ✅ سرور روی پورت ${PORT} اجرا شد                    ║`);
    console.log('║   📞 پشتیبانی: 07635108                            ║');
    console.log('║   🚗 پلاک: 84 ایران 741 ط 98                       ║');
    console.log('║                                                      ║');
    console.log(`║   📱 http://localhost:${PORT}/                         ║`);
    console.log(`║   🤖 http://localhost:${PORT}/ai-chat                 ║`);
    console.log(`║   🩺 http://localhost:${PORT}/api/health              ║`);
    console.log('║                                                      ║');
    console.log('║   🎯 سرویس‌های فعال:                                ║');
    console.log('║   • 🤖 چت هوشمند AI                                 ║');
    console.log('║   • 🚦 سیستم ترافیک هوشمند                         ║');
    console.log('║   • 🌤️ سرویس آب و هوایی                            ║');
    console.log('║   • ⚖️ پایگاه قوانین رانندگی                       ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');
});

// مدیریت graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 دریافت SIGTERM، خروج...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 دریافت SIGINT، خروج...');
    process.exit(0);
});
