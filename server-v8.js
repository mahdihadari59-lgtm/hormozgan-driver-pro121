const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;  // تغییر به پورت 8080

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

// ==================== سیستم‌های هوشمند ====================

// سیستم ترافیک پیشرفته
const trafficSystem = {
    liveTraffic: {
        "بندرعباس مرکز": {
            status: "شلوغ 🟠",
            speed: "20 km/h",
            routes: [
                "خیابان امام: 🔴 شلوغ",
                "بلوار طالقانی: 🟢 روان", 
                "میدان امام حسین: 🔴 بسیار شلوغ"
            ],
            updateTime: new Date().toLocaleTimeString('fa-IR')
        },
        "بندرعباس شمال": {
            status: "روان 🟢",
            speed: "45 km/h",
            routes: [
                "جاده فرودگاه: 🟢 روان",
                "بلوار معلم: 🟡 متوسط",
                "کوی دانشگاه: 🟢 روان"
            ],
            updateTime: new Date().toLocaleTimeString('fa-IR')
        },
        "بندرعباس جنوب": {
            status: "بسیار شلوغ 🔴",
            speed: "10 km/h",
            routes: [
                "اسکله شهید حقانی: 🔴 قفل",
                "بازار ماهی فروشان: 🔴 شلوغ",
                "ترمینال مسافربری: 🟡 متوسط"
            ],
            updateTime: new Date().toLocaleTimeString('fa-IR')
        }
    },

    hotspots: [
        "میدان امام حسین: ترافیک سنگین 🔴",
        "پل خلیج فارس: ترافیک متوسط 🟠", 
        "اسکله شهید حقانی: ترافیک سنگین 🔴"
    ],

    suggestions: [
        "استفاده از بلوار طالقانی برای تردد مرکزی",
        "پرهیز از تردد غیرضروری در ساعات 17-20",
        "استفاده از مسیرهای جایگزین شمالی"
    ]
};

function generateTrafficResponse(userMessage) {
    let response = "🚦 **وضعیت ترافیک لحظه‌ای بندرعباس**\n\n";
    const alerts = [];

    Object.entries(trafficSystem.liveTraffic).forEach(([area, data]) => {
        response += `**${area}:**\n`;
        response += `• وضعیت: ${data.status}\n`;
        response += `• سرعت متوسط: ${data.speed}\n`;
        response += `• بروزرسانی: ${data.updateTime}\n`;
        response += `• مسیرها:\n`;
        data.routes.forEach(route => {
            response += `  ${route}\n`;
        });
        response += `\n`;
    });

    response += "📍 **نقاط حساس:**\n";
    trafficSystem.hotspots.forEach(hotspot => {
        response += `• ${hotspot}\n`;
    });

    response += "\n💡 **توصیه‌ها:**\n";
    trafficSystem.suggestions.forEach(suggestion => {
        response += `• ${suggestion}\n`;
    });

    alerts.push("🕒 ساعات شلوغی: ۷:۰۰-۹:۰۰ صبح | ۱۷:۰۰-۲۰:۰۰ عصر");
    alerts.push("📱 برای اطلاعات بیشتر: 07635108");

    return { response, alerts };
}

// سیستم آب و هوای پیشرفته
const weatherSystem = {
    currentWeather: {
        "بندرعباس": {
            temperature: "۳۲°C",
            condition: "آفتابی ☀️",
            humidity: "۶۵٪",
            wind: "۱۵ km/h",
            feelsLike: "۳۵°C",
            updateTime: new Date().toLocaleTimeString('fa-IR')
        },
        "قشم": {
            temperature: "۳۰°C", 
            condition: "نیمه ابری ⛅",
            humidity: "۷۰٪",
            wind: "۲۰ km/h",
            feelsLike: "۳۳°C",
            updateTime: new Date().toLocaleTimeString('fa-IR')
        },
        "میناب": {
            temperature: "۳۴°C",
            condition: "آفتابی 🌞",
            humidity: "۶۰٪",
            wind: "۱۲ km/h",
            feelsLike: "۳۷°C",
            updateTime: new Date().toLocaleTimeString('fa-IR')
        }
    },

    forecast: {
        "امروز": "۳۴°C - آفتابی",
        "فردا": "۳۳°C - نیمه ابری", 
        "پس‌فردا": "۳۲°C - ابری"
    },

    alerts: [
        "⚠️ هشدار گرمازدگی در ساعات ۱۱-۱۵",
        "💨 وزش باد نسبتاً شدید در مناطق ساحلی"
    ],

    roadConditions: {
        "جاده بندرعباس-قشم": "مناسب 🟢",
        "جاده بندرعباس-میناب": "احتیاط 🟡", 
        "جاده ساحلی": "مناسب 🟢"
    }
};

function generateWeatherResponse(userMessage) {
    let response = "🌤️ **وضعیت آب و هوای هرمزگان**\n\n";
    const alerts = [];

    Object.entries(weatherSystem.currentWeather).forEach(([city, data]) => {
        response += `**${city}:**\n`;
        response += `• دما: ${data.temperature}\n`;
        response += `• وضعیت: ${data.condition}\n`;
        response += `• رطوبت: ${data.humidity}\n`;
        response += `• باد: ${data.wind}\n`;
        response += `• احساس: ${data.feelsLike}\n`;
        response += `• بروزرسانی: ${data.updateTime}\n\n`;
    });

    if (userMessage.includes('پیش‌بینی') || userMessage.includes('فردا')) {
        response += "📅 **پیش‌بینی ۳ روزه:**\n";
        Object.entries(weatherSystem.forecast).forEach(([day, condition]) => {
            response += `• ${day}: ${condition}\n`;
        });
        response += `\n`;
    }

    if (userMessage.includes('جاده') || userMessage.includes('مسیر')) {
        response += "🛣️ **شرایط جاده‌ها:**\n";
        Object.entries(weatherSystem.roadConditions).forEach(([road, condition]) => {
            response += `• ${road}: ${condition}\n`;
        });
        response += `\n`;
    }

    response += "🚨 **هشدارها:**\n";
    weatherSystem.alerts.forEach(alert => {
        response += `• ${alert}\n`;
    });

    alerts.push("📡 منبع: سازمان هواشناسی هرمزگان");
    alerts.push("🚗 قبل از سفر شرایط جاده را بررسی کنید");

    return { response, alerts };
}

// سیستم قوانین رانندگی
const drivingLaws = {
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
    },
    safety: {
        seatbelt: "الزامی برای راننده و سرنشینان جلو",
        equipment: "جعبه کمک‌های اولیه، مثلث احتیاط",
        fine: "۲۰۰,۰۰۰ تومان"
    }
};

function generateLawsResponse(userMessage) {
    let response = "";
    const alerts = [];

    if (userMessage.includes('سرعت')) {
        response = "🚦 **قوانین سرعت:**\n\n" +
                  "🏙️ **شهری:**\n• خیابان اصلی: " + drivingLaws.speed.urban + "\n" +
                  "🛣️ **برون‌شهری:**\n• جاده اصلی: " + drivingLaws.speed.suburban + "\n" +
                  "• آزادراه: " + drivingLaws.speed.highway + "\n\n" +
                  "💰 **جرایم:**\n• تجاوز تا ۲۰ کیلومتر: " + drivingLaws.speed.fines["20km_over"] + "\n" +
                  "• تجاوز بیش از ۲۰ کیلومتر: " + drivingLaws.speed.fines["40km_over"];
        
        alerts.push("⚠️ رعایت سرعت مجاز الزامی است");
    }
    else if (userMessage.includes('سبقت')) {
        response = "🚗 **قوانین سبقت:**\n\n" +
                  "✅ **شرایط مجاز:**\n• " + drivingLaws.overtaking.rules + "\n\n" +
                  "❌ **مکان‌های ممنوع:**\n• " + drivingLaws.overtaking.prohibited + "\n\n" +
                  "💰 **جریمه:** " + drivingLaws.overtaking.fine;
        
        alerts.push("🚨 سبقت غیرمجاز بسیار خطرناک است");
    }
    else if (userMessage.includes('ایمنی')) {
        response = "🔒 **قوانین ایمنی:**\n\n" +
                  "🚗 **کمربند ایمنی:**\n• " + drivingLaws.safety.seatbelt + "\n\n" +
                  "🎒 **تجهیزات الزامی:**\n• " + drivingLaws.safety.equipment + "\n\n" +
                  "💰 **جریمه:** " + drivingLaws.safety.fine;
        
        alerts.push("🔒 کمربند ایمنی جان شما را نجات می‌دهد");
    }
    else {
        response = "📚 **قوانین رانندگی**\n\n" +
                  "• 🚦 **سرعت** - محدودیت‌ها و جرایم\n" +
                  "• 🚗 **سبقت** - شرایط و ممنوعیت‌ها\n" +
                  "• 🔒 **ایمنی** - تجهیزات الزامی\n\n" +
                  "💡 **لطفاً موضوع دقیق‌تری را انتخاب کنید.**";
    }

    return { response, alerts };
}

// ==================== AI CHAT SYSTEM ====================

// endpoint اصلی AI Chat
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
            const traffic = generateTrafficResponse(message);
            response = traffic.response;
            alerts.push(...traffic.alerts);
        }
        else if (message.includes('آب و هوا') || message.includes('هوا') || message.includes('دما')) {
            const weather = generateWeatherResponse(message);
            response = weather.response;
            alerts.push(...weather.alerts);
        }
        else if (message.includes('قانون') || message.includes('سرعت') || message.includes('سبقت') || message.includes('ایمنی')) {
            const laws = generateLawsResponse(message);
            response = laws.response;
            alerts.push(...laws.alerts);
        }
        else if (message.includes('سلام') || message.includes('درود')) {
            response = "🌟 **سلام! به AI Sahel Pro خوش آمدید!** 👋\n\n" +
                      "من دستیار هوشمند شما برای امور رانندگی هستم.\n\n" +
                      "🛠️ **خدمات قابل ارائه:**\n" +
                      "• 🚦 قوانین سرعت و محدودیت‌ها\n" +
                      "• 🚗 قوانین سبقت و شرایط\n" +
                      "• 🔒 قوانین ایمنی و تجهیزات\n" +
                      "• 🗺️ وضعیت ترافیک و مسیریابی\n" +
                      "• 🌤️ آب و هوا و شرایط جوی\n\n" +
                      "✨ **چگونه می‌توانم کمک کنم؟**";
            
            alerts.push("📞 پشتیبانی: 07635108");
            alerts.push("🚗 پلاک: 84 ایران 741 ط 98");
        }
        else if (message.includes('پشتیبانی') || message.includes('تماس') || message.includes('کمک')) {
            response = "📞 **اطلاعات پشتیبانی**\n\n" +
                      "• **شماره پشتیبانی:** ۰۷۶۳۵۱۰۸\n" +
                      "• **پلاک:** ۸۴ ایران ۷۴۱ ط ۹۸\n" +
                      "• **ساعات کاری:** ۲۴/۷\n" +
                      "• **خدمات:** راهنمایی فنی، اطلاعات ترافیک، آب و هوا\n\n" +
                      "💡 **برای دریافت کمک فوری تماس بگیرید.**";
            
            alerts.push("⏰ پاسخگویی ۲۴ ساعته");
        }
        else {
            response = "🤖 **AI Sahel Pro**\n\n" +
                      `سوال شما: "${message}"\n\n` +
                      "💡 **من می‌توانم در زمینه‌های زیر کمک کنم:**\n\n" +
                      "• 🚦 **وضعیت ترافیک** و مسیریابی\n" +
                      "• 🌤️ **آب و هوا** و پیش‌بینی\n" +
                      "• ⚖️ **قوانین رانندگی** و جرایم\n" +
                      "• 📞 **پشتیبانی فنی** و راهنمایی\n\n" +
                      "🎯 **لطفاً سوال خود را دقیق‌تر فرمایید.**";
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
            alerts: ['سیستم مشکل موقت دارد، لطفاً مجدد تلاش کنید'],
            status: 'error'
        });
    }
});

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
            traffic: 'درخواست از طریق AI'
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

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: Date.now(),
        version: '5.0',
        port: PORT
    });
});

// Route برای مدیریت خطای 404
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
    
    console.log('🔍 نمونه سوالات برای AI:');
    console.log('   🤖 "سلام" - خوشامدگویی');
    console.log('   🤖 "وضعیت ترافیک" - اطلاعات ترافیک');
    console.log('   🤖 "آب و هوای بندرعباس" - وضعیت جوی');
    console.log('   🤖 "قوانین سرعت" - مقررات سرعت');
    console.log('   🤖 "پشتیبانی" - اطلاعات تماس\n');
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
