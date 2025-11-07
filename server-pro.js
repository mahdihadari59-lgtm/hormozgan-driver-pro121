const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 3000;

// ==================== CONFIGURATION ====================
const CONFIG = {
    name: "🚀 AI Sahel Pro Ultra",
    version: "5.0.0",
    support: "07635108",
    plate: "84 ایران 741 ط 98",
    author: "Hormozgan Driver Team",
    repository: "https://github.com/username/hormozgan-driver-pro"
};

// ==================== MIDDLEWARE ====================
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`📨 ${new Date().toLocaleString('fa-IR')} | ${req.method} ${req.path}`);
    next();
});

// ==================== SECURITY HEADERS ====================
app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'AI Sahel Pro');
    res.setHeader('X-Version', CONFIG.version);
    res.setHeader('X-Developer', 'Hormozgan Driver Team');
    next();
});

// ==================== ROUTES ====================
const routes = [
    '', 'driver-dashboard', 'driver-profile', 'calls', 
    'contact', 'driver-registration', 'ai-chat', 'ai-chat-pro',
    'traffic-map', 'weather-map', 'camera-live'
];

routes.forEach(route => {
    const routePath = route === '' ? '/' : `/${route}`;
    const fileName = route === '' ? 'index.html' : `${route}.html`;
    
    app.get(routePath, (req, res) => {
        const filePath = path.join(__dirname, 'public', fileName);
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).json({
                error: 'صفحه مورد نظر یافت نشد',
                available: routes.filter(r => r !== '')
            });
        }
    });
});

// ==================== AI INTELLIGENCE SYSTEM ====================
class AIIntelligence {
    constructor() {
        this.sessionHistory = new Map();
        this.responseCache = new Map();
    }

    analyzeIntent(message) {
        const intents = {
            traffic: /ترافیک|وضعیت|شلوغ|راه بندان|مسیر/i,
            weather: /آب و هوا|هوا|دما|گرما|سرما|باران/i,
            laws: /قانون|سرعت|سبقت|ایمنی|جریمه|پلیس/i,
            cameras: /دوربین|نظارت|کنترل|سرعت سنج/i,
            support: /پشتیبانی|تماس|کمک|مشکل/i,
            greeting: /سلام|درود|hello|hi/i
        };

        for (const [intent, pattern] of Object.entries(intents)) {
            if (pattern.test(message)) return intent;
        }
        return 'general';
    }

    generateResponse(message, sessionId) {
        const intent = this.analyzeIntent(message);
        const timestamp = new Date().toLocaleString('fa-IR');
        
        // ذخیره تاریخچه
        if (!this.sessionHistory.has(sessionId)) {
            this.sessionHistory.set(sessionId, []);
        }
        this.sessionHistory.get(sessionId).push({ message, intent, timestamp });

        switch (intent) {
            case 'traffic':
                return this.generateTrafficResponse();
            case 'weather':
                return this.generateWeatherResponse();
            case 'laws':
                return this.generateLawsResponse(message);
            case 'cameras':
                return this.generateCamerasResponse();
            case 'support':
                return this.generateSupportResponse();
            case 'greeting':
                return this.generateGreetingResponse();
            default:
                return this.generateGeneralResponse(message);
        }
    }

    generateTrafficResponse() {
        const trafficData = {
            zones: {
                "مرکز بندرعباس": { status: "شلوغ 🟠", speed: "20 km/h", time: "45+ min" },
                "شمال بندرعباس": { status: "روان 🟢", speed: "50 km/h", time: "25 min" },
                "جنوب بندرعباس": { status: "بسیار شلوغ 🔴", speed: "10 km/h", time: "60+ min" }
            },
            hotspots: [
                "میدان امام حسین: ترافیک سنگین 🔴",
                "پل خلیج فارس: ترافیک متوسط 🟠",
                "اسکله شهید حقانی: ترافیک سنگین 🔴"
            ],
            suggestions: [
                "استفاده از بلوار طالقانی",
                "پرهیز از تردد غیرضروری در مرکز",
                "برنامه‌ریزی سفر خارج از ساعات اوج"
            ]
        };

        let response = "🚦 **وضعیت ترافیک زنده بندرعباس**\n\n";
        
        Object.entries(trafficData.zones).forEach(([zone, data]) => {
            response += `**${zone}:**\n`;
            response += `• وضعیت: ${data.status}\n`;
            response += `• سرعت متوسط: ${data.speed}\n`;
            response += `• زمان تقریبی: ${data.time}\n\n`;
        });

        response += "📍 **کوریدورهای بحرانی:**\n";
        trafficData.hotspots.forEach(hotspot => {
            response += `• ${hotspot}\n`;
        });

        response += "\n💡 **توصیه‌های مسیریابی:**\n";
        trafficData.suggestions.forEach(suggestion => {
            response += `• ${suggestion}\n`;
        });

        return {
            response,
            alerts: [
                "🕒 ساعات اوج: ۷-۹ صبح | ۱۷-۲۰ عصر",
                "📱 نقشه زنده: https://bandarabbas.ir/live-traffic"
            ],
            data: trafficData
        };
    }

    generateWeatherResponse() {
        const weatherData = {
            current: {
                "بندرعباس": { temp: "۳۲°C", condition: "آفتابی ☀️", humidity: "۶۵%", wind: "۱۵ km/h" },
                "قشم": { temp: "۳۰°C", condition: "نیمه ابری ⛅", humidity: "۷۰%", wind: "۲۰ km/h" },
                "میناب": { temp: "۳۴°C", condition: "آفتابی 🌞", humidity: "۶۰%", wind: "۱۲ km/h" }
            },
            forecast: [
                { day: "امروز", high: "۳۴°C", low: "۲۶°C", condition: "آفتابی" },
                { day: "فردا", high: "۳۳°C", low: "۲۵°C", condition: "نیمه ابری" },
                { day: "پس‌فردا", high: "۳۲°C", low: "۲۴°C", condition: "ابری" }
            ],
            warnings: [
                "⚠️ هشدار گرمازدگی در ساعات ۱۱-۱۵",
                "💨 وزش باد نسبتاً شدید در مناطق ساحلی"
            ]
        };

        let response = "🌤️ **وضعیت جوی هرمزگان**\n\n";
        
        response += "🌡️ **دمای فعلی:**\n";
        Object.entries(weatherData.current).forEach(([city, data]) => {
            response += `• **${city}:** ${data.temp} | ${data.condition} | رطوبت: ${data.humidity} | باد: ${data.wind}\n`;
        });

        response += "\n📅 **پیش‌بینی ۳ روزه:**\n";
        weatherData.forecast.forEach(day => {
            response += `• **${day.day}:** ${day.high}/${day.low} | ${day.condition}\n`;
        });

        response += "\n🚨 **هشدارها:**\n";
        weatherData.warnings.forEach(warning => {
            response += `• ${warning}\n`;
        });

        return {
            response,
            alerts: [
                "📡 منبع: سازمان هواشناسی هرمزگان",
                "🚗 شرایط جاده را قبل از حرکت بررسی کنید"
            ],
            data: weatherData
        };
    }

    generateLawsResponse(message) {
        const laws = {
            speed: {
                title: "🚦 محدودیت‌های سرعت",
                urban: "۵۰ کیلومتر بر ساعت",
                suburban: "۱۱۰ کیلومتر بر ساعت", 
                highway: "۱۲۰ کیلومتر بر ساعت",
                fines: {
                    "20km_over": "۳۰۰,۰۰۰ تومان",
                    "40km_over": "۱,۰۰۰,۰۰۰ تومان",
                    "60km_over": "۲,۰۰۰,۰۰۰ تومان + تعلیق گواهینامه"
                }
            },
            overtaking: {
                title: "🚗 قوانین سبقت",
                allowed: "• خط سبقت آزاد\n• دید کافی (۲۰۰ متر)\n• فاصله ایمنی مناسب",
                prohibited: "• پیچ‌ها و سربالایی‌ها\n• تقاطع‌ها و میدان‌ها\n• گذرگاه عابر پیاده",
                fine: "۷۵۰,۰۰۰ تومان"
            },
            safety: {
                title: "🔒 تجهیزات ایمنی",
                requirements: "• کمربند ایمنی برای همه\n• جعبه کمک‌های اولیه\n• مثلث احتیاط\n• کپسول آتش‌نشانی",
                fine: "۲۰۰,۰۰۰ تومان"
            }
        };

        let response = "";
        let selectedLaw = null;

        if (message.includes('سرعت')) selectedLaw = laws.speed;
        else if (message.includes('سبقت')) selectedLaw = laws.overtaking;
        else if (message.includes('ایمنی')) selectedLaw = laws.safety;

        if (selectedLaw) {
            response = `${selectedLaw.title}\n\n`;
            Object.entries(selectedLaw).forEach(([key, value]) => {
                if (key !== 'title') {
                    response += `**${key.toUpperCase()}:**\n${value}\n\n`;
                }
            });
        } else {
            response = "📚 **قوانین رانندگی**\n\n";
            response += "• 🚦 **سرعت** - محدودیت‌ها و جرایم\n";
            response += "• 🚗 **سبقت** - شرایط و ممنوعیت‌ها\n";
            response += "• 🔒 **ایمنی** - تجهیزات الزامی\n\n";
            response += "💡 **لطفاً موضوع دقیق‌تری را انتخاب کنید.**";
        }

        return {
            response,
            alerts: ["⚖️ رعایت قوانین راهنمایی و رانندگی الزامی است"],
            data: laws
        };
    }

    generateGreetingResponse() {
        return {
            response: `🌟 **${CONFIG.name} v${CONFIG.version}**\n\n` +
                     "👋 **سلام! به هوشمندترین دستیار رانندگی خوش آمدید!**\n\n" +
                     "🛠️ **خدمات پیشرفته:**\n" +
                     "• 🚦 **ترافیک هوشمند** - وضعیت زنده و مسیریابی\n" +
                     "• 🌤️ **هواشناسی** - پیش‌بینی و هشدارها\n" +
                     "• ⚖️ **قوانین** - سرعت، سبقت، ایمنی\n" +
                     "• 📷 **دوربین‌ها** - موقعیت و وضعیت\n" +
                     "• 🚨 **پشتیبانی** - تماس و راهنمایی\n\n" +
                     "💬 **لطفاً سوال خود را بپرسید...**",
            alerts: [
                `📞 ${CONFIG.support} | 🚗 ${CONFIG.plate}`,
                "🔧 توسعه داده شده توسط تیم هرمزگان"
            ]
        };
    }

    generateGeneralResponse(message) {
        return {
            response: `🤖 **${CONFIG.name}**\n\n` +
                     `سوال: "${message}"\n\n` +
                     "💡 **من می‌توانم در زمینه‌های زیر کمک کنم:**\n\n" +
                     "• 🚦 **وضعیت ترافیک** و مسیریابی\n" +
                     "• 🌤️ **آب و هوا** و پیش‌بینی\n" +
                     "• ⚖️ **قوانین رانندگی** و جرایم\n" +
                     "• 📷 **دوربین‌های نظارتی**\n" +
                     "• 🚨 **پشتیبانی فنی**\n\n" +
                     "🎯 **لطفاً سوال خود را دقیق‌تر فرمایید.**",
            alerts: ["✨ از هوش مصنوعی پیشرفته استفاده می‌کنم"]
        };
    }
}

// ==================== INITIALIZE AI ====================
const aiEngine = new AIIntelligence();

// ==================== API ENDPOINTS ====================

// endpoint اصلی AI
app.post('/api/ai/chat', express.json(), (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message || message.trim() === '') {
            return res.json({
                success: false,
                error: 'پیام نمی‌تواند خالی باشد',
                tips: ['سلام', 'ترافیک', 'آب و هوا', 'قوانین']
            });
        }

        console.log(`🤖 AI Query: ${message} | Session: ${sessionId}`);
        
        const aiResponse = aiEngine.generateResponse(message.trim(), sessionId);
        
        res.json({
            success: true,
            ...aiResponse,
            sessionId,
            timestamp: new Date().toLocaleString('fa-IR'),
            version: CONFIG.version
        });

    } catch (error) {
        console.error('❌ AI Error:', error);
        res.status(500).json({
            success: false,
            error: 'خطای داخلی سرور',
            response: '⚠️ سیستم موقتاً با مشکل مواجه شده است',
            alerts: ['لطفاً چند لحظه دیگر تلاش کنید']
        });
    }
});

// endpoint سلامت پیشرفته
app.get('/api/health', (req, res) => {
    const health = {
        status: 'healthy',
        service: CONFIG.name,
        version: CONFIG.version,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development',
        endpoints: {
            ai: '/api/ai/chat',
            traffic: '/api/traffic',
            weather: '/api/weather',
            cameras: '/api/cameras'
        }
    };
    res.json(health);
});

// endpoint اطلاعات ترافیک
app.get('/api/traffic', (req, res) => {
    const response = aiEngine.generateTrafficResponse();
    res.json(response);
});

// endpoint اطلاعات آب و هوا
app.get('/api/weather', (req, res) => {
    const response = aiEngine.generateWeatherResponse();
    res.json(response);
});

// ==================== ERROR HANDLING ====================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'مسیر یافت نشد',
        available: routes.filter(r => r !== ''),
        support: CONFIG.support
    });
});

app.use((error, req, res, next) => {
    console.error('🔥 Server Error:', error);
    res.status(500).json({
        success: false,
        error: 'خطای سرور',
        message: 'سیستم با مشکل مواجه شد',
        support: CONFIG.support
    });
});

// ==================== SERVER STARTUP ====================
function startServer() {
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log('\n' + '='.repeat(60));
        console.log(`🚀 ${CONFIG.name} v${CONFIG.version}`);
        console.log('='.repeat(60));
        console.log(`✅ سرور روی پورت ${PORT} اجرا شد`);
        console.log(`📞 پشتیبانی: ${CONFIG.support}`);
        console.log(`🚗 پلاک: ${CONFIG.plate}`);
        console.log(`👨‍💻 توسعه‌دهنده: ${CONFIG.author}`);
        console.log('='.repeat(60));
        console.log(`🌐 آدرس‌های اصلی:`);
        console.log(`   📱 http://localhost:${PORT}/`);
        console.log(`   🤖 http://localhost:${PORT}/ai-chat`);
        console.log(`   🩺 http://localhost:${PORT}/api/health`);
        console.log('='.repeat(60));
        console.log('🎯 سرویس‌های فعال:');
        console.log('   • 🤖 هوش مصنوعی پیشرفته');
        console.log('   • 🚦 سیستم ترافیک هوشمند');
        console.log('   • 🌤️ سرویس آب و هوایی');
        console.log('   • ⚖️ پایگاه قوانین رانندگی');
        console.log('='.repeat(60) + '\n');
        
        // نمایش وضعیت‌های نمونه
        console.log('🔍 نمونه سوالات:');
        console.log('   🤖 "سلام" - خوشامدگویی');
        console.log('   🤖 "ترافیک مرکز" - وضعیت ترافیک');
        console.log('   🤖 "آب و هوای قشم" - وضعیت جوی');
        console.log('   🤖 "قوانین سرعت" - مقررات سرعت\n');
    });

    return server;
}

// شروع سرور
const server = startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 دریافت SIGTERM، خروج graceful...');
    server.close(() => {
        console.log('✅ سرور بسته شد');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 دریافت SIGINT، خروج...');
    server.close(() => {
        console.log('✅ سرور بسته شد');
        process.exit(0);
    });
});

module.exports = app;
