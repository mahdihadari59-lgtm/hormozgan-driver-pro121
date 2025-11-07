const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// میدلورها
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routeهای اصلی
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
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

app.get('/driver-registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'driver-registration.html'));
});

// ==================== سیستم ترافیک و مسیریابی ====================

const trafficSystem = {
    title: "سیستم ترافیک و مسیریابی بندرعباس",
    
    liveTraffic: {
        "بندرعباس مرکز": {
            status: "شلوغ",
            level: "orange",
            speed: "15 km/h",
            updateTime: new Date().toLocaleTimeString('fa-IR'),
            routes: [
                "خیابان امام - میدان امام حسین: 🔴 شلوغ",
                "خیابان ساحلی - اسکله: 🟡 متوسط", 
                "بلوار طالقانی: 🟢 روان"
            ]
        },
        "بندرعباس شمال": {
            status: "روان",
            level: "green", 
            speed: "45 km/h",
            updateTime: new Date().toLocaleTimeString('fa-IR'),
            routes: [
                "جاده فرودگاه: 🟢 روان",
                "بلوار معلم: 🟡 متوسط",
                "کوی دانشگاه: 🟢 روان"
            ]
        }
    },

    peakHours: {
        morning: "۷:۰۰ - ۹:۰۰",
        evening: "۱۷:۰۰ - ۲۰:۰۰", 
        friday: "۱۴:۰۰ - ۱۸:۰۰"
    },

    optimizedRoutes: {
        "مرکز به فرودگاه": {
            route: "بلوار طالقانی → جاده فرودگاه",
            time: "۲۵ دقیقه",
            distance: "۱۸ کیلومتر",
            traffic: "🟢 روان"
        },
        "اسکله به مرکز": {
            route: "جاده ساحلی → خیابان امام",
            time: "۲۰ دقیقه", 
            distance: "۱۲ کیلومتر",
            traffic: "🟡 متوسط"
        }
    },

    mapApis: {
        googleMaps: "https://maps.google.com/?q=Bandar+Abbas",
        openStreetMap: "https://www.openstreetmap.org/#map=13/27.1865/56.2804"
    }
};

function generateTrafficResponse(userMessage) {
    let response = '';
    const alerts = [];

    if (userMessage.includes('ترافیک') || userMessage.includes('وضعیت')) {
        response = "🚦 **وضعیت ترافیک لحظه‌ای بندرعباس**\n\n";
        
        Object.entries(trafficSystem.liveTraffic).forEach(([area, data]) => {
            response += "**" + area + ":**\n";
            response += "• وضعیت: " + data.status + "\n";
            response += "• سرعت متوسط: " + data.speed + "\n";
            response += "• آخرین بروزرسانی: " + data.updateTime + "\n";
            response += "• مسیرها:\n";
            data.routes.forEach(route => {
                response += "  " + route + "\n";
            });
            response += "\n";
        });

        alerts.push("🕒 **ساعات شلوغی:** صبح ۷-۹ | عصر ۱۷-۲۰");
    }

    else if (userMessage.includes('مسیر') || userMessage.includes('راه')) {
        response = "🗺️ **مسیرهای بهینه بندرعباس**\n\n";
        
        Object.entries(trafficSystem.optimizedRoutes).forEach(([routeName, data]) => {
            response += "**" + routeName + ":**\n";
            response += "• مسیر: " + data.route + "\n";
            response += "• زمان: " + data.time + "\n";
            response += "• مسافت: " + data.distance + "\n";
            response += "• ترافیک: " + data.traffic + "\n\n";
        });

        alerts.push("📍 **نقشه:** " + trafficSystem.mapApis.googleMaps);
    }

    else if (userMessage.includes('شلوغ') || userMessage.includes('اوج')) {
        response = "🕒 **ساعات شلوغی ترافیک بندرعباس**\n\n";
        response += "• **صبحگاه:** " + trafficSystem.peakHours.morning + "\n";
        response += "• **عصرگاه:** " + trafficSystem.peakHours.evening + "\n";
        response += "• **جمعه‌ها:** " + trafficSystem.peakHours.friday + "\n\n";
        
        alerts.push("⏰ **توصیه:** برنامه‌ریزی سفر خارج از ساعات شلوغی");
    }

    return { response, alerts };
}

// ==================== AI CHAT PRO ====================

// صفحه AI Chat Pro
app.get('/ai-chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ai-chat-pro.html'));
});

app.get('/ai-chat-pro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ai-chat-pro.html'));
});

// endpoint اصلی AI
app.post('/ai-chat-pro', express.json(), (req, res) => {
    try {
        const { message } = req.body;
        console.log('🤖 AI سوال:', message);
        
        if (!message || message.trim() === '') {
            return res.json({ 
                response: 'لطفاً سوال خود را وارد کنید',
                alerts: []
            });
        }

        let response = '';
        const alerts = [];

        if (message.includes('سرعت')) {
            response = "🚦 **قوانین سرعت:**\n\n" +
                      "🏙️ **شهری:**\n" +
                      "• خیابان اصلی: ۵۰ کیلومتر\n" +
                      "• خیابان فرعی: ۳۰ کیلومتر\n" +
                      "• منطقه مسکونی: ۲۰ کیلومتر\n\n" +
                      "🛣️ **برون‌شهری:**\n" +
                      "• جاده اصلی: ۱۱۰ کیلومتر\n" +
                      "• آزادراه: ۱۲۰ کیلومتر\n\n" +
                      "💰 **جرایم:**\n" +
                      "• تجاوز تا ۲۰ کیلومتر: ۳۰۰,۰۰۰ تومان\n" +
                      "• تجاوز بیش از ۴۰ کیلومتر: ۱,۰۰۰,۰۰۰ تومان";
            
            alerts.push("⚠️ رعایت سرعت مجاز الزامی است");
        }
        else if (message.includes('سبقت')) {
            response = "🚗 **قوانین سبقت:**\n\n" +
                      "✅ **شرایط مجاز:**\n" +
                      "• خط سبقت آزاد باشد\n" +
                      "• دید کافی (۲۰۰ متر)\n" +
                      "• فاصله ایمنی رعایت شود\n\n" +
                      "❌ **مکان‌های ممنوع:**\n" +
                      "• پیچ‌ها و سربالایی‌ها\n" +
                      "• تقاطع‌ها و میدان‌ها\n" +
                      "• گذرگاه عابر پیاده\n\n" +
                      "💰 **جرایم:**\n" +
                      "• سبقت غیرمجاز: ۷۵۰,۰۰۰ تومان";
            
            alerts.push("🚨 سبقت غیرمجاز خطرناک است");
        }
        else if (message.includes('عابر')) {
            response = "🚸 **قوانین عابران پیاده:**\n\n" +
                      "🎯 **گذرگاه عابر:**\n" +
                      "• توقف کامل در ۵ متری\n" +
                      "• اولویت با عابران\n" +
                      "• عدم بوق زدن\n\n" +
                      "💰 **جرایم:**\n" +
                      "• عدم توقف: ۵۰۰,۰۰۰ تومان";
            
            alerts.push("👣 مراقب عابران باشید");
        }
        else if (message.includes('چراغ')) {
            response = "🚥 **قوانین چراغ‌ها:**\n\n" +
                      "🔴 **چراغ قرمز:**\n" +
                      "• توقف کامل قبل از خط\n" +
                      "• انتظار برای سبز شدن\n\n" +
                      "🟡 **چراغ زرد:**\n" +
                      "• آماده برای توقف\n" +
                      "• کاهش سرعت\n\n" +
                      "💰 **جرایم:**\n" +
                      "• عبور از قرمز: ۱,۰۰۰,۰۰۰ تومان";
            
            alerts.push("🚥 مراقب چراغ راهنما باشید");
        }
        else if (message.includes('ایمنی')) {
            response = "🔒 **قوانین ایمنی:**\n\n" +
                      "🚗 **کمربند ایمنی:**\n" +
                      "• الزامی برای همه سرنشینان\n" +
                      "• بستن قبل از حرکت\n\n" +
                      "🎒 **تجهیزات:**\n" +
                      "• جعبه کمک‌های اولیه\n" +
                      "• مثلث احتیاط\n\n" +
                      "💰 **جرایم:**\n" +
                      "• عدم بستن کمربند: ۲۰۰,۰۰۰ تومان";
            
            alerts.push("🔒 کمربند ایمنی جان شما را نجات می‌دهد");
        }
        else if (message.includes('ترافیک') || message.includes('وضعیت') || message.includes('مسیر')) {
            const traffic = generateTrafficResponse(message);
            response = traffic.response;
            alerts.push(...traffic.alerts);
        }
        else if (message.includes('سلام')) {
            response = "🌟 **سلام! به AI Sahel Pro خوش آمدید!** 👋\n\n" +
                      "من دستیار هوشمند شما برای امور رانندگی هستم.\n\n" +
                      "🛠️ **خدمات قابل ارائه:**\n" +
                      "• 🚦 قوانین سرعت و محدودیت‌ها\n" +
                      "• 🚗 قوانین سبقت و شرایط\n" +
                      "• 🚸 قوانین عابران پیاده\n" +
                      "• 🚥 قوانین چراغ‌ها و علائم\n" +
                      "• 🔒 قوانین ایمنی و تجهیزات\n" +
                      "• 🗺️ وضعیت ترافیک و مسیریابی\n\n" +
                      "✨ **چگونه می‌توانم کمک کنم؟**";
        }
        else {
            response = "🤖 **AI Sahel Pro**\n\n" +
                      "سوال شما: \"" + message + "\"\n\n" +
                      "من می‌توانم در زمینه‌های زیر کمک کنم:\n\n" +
                      "• قوانین سرعت و محدودیت‌ها\n" +
                      "• قوانین سبقت و شرایط\n" +
                      "• قوانین عابران پیاده\n" +
                      "• قوانین چراغ‌ها و علائم\n" +
                      "• قوانین ایمنی و تجهیزات\n" +
                      "• وضعیت ترافیک و مسیریابی\n\n" +
                      "💡 **لطفاً سوال خود را در یکی از این دسته‌ها مطرح کنید.**";
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

// endpoint قدیمی برای سازگاری
app.post('/ai-chat', express.json(), (req, res) => {
    res.redirect(307, '/ai-chat-pro');
});

// endpoint سلامت
app.get('/api/ai/health', (req, res) => {
    res.json({
        status: 'active',
        service: 'AI Sahel Pro',
        version: '2.0',
        timestamp: new Date().toISOString()
    });
});

// endpoint ترافیک
app.get('/api/traffic/status', (req, res) => {
    const result = generateTrafficResponse('ترافیک');
    res.json(result);
});

// راه‌اندازی سرور
app.listen(PORT, "0.0.0.0", () => {
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║                🚀 AI Sahel Pro v2.0                 ║');
    console.log('╠══════════════════════════════════════════════════════╣');
    console.log('║   ✅ سرور روی پورت ' + PORT + ' اجرا شد                    ║');
    console.log('║   📞 پشتیبانی: 07635108                            ║');
    console.log('║   🤖 هوش مصنوعی + ترافیک فعال                      ║');
    console.log('║                                                      ║');
    console.log('║   📱 http://localhost:' + PORT + '/                         ║');
    console.log('║   🤖 http://localhost:' + PORT + '/ai-chat-pro             ║');
    console.log('║                                                      ║');
    console.log('║   🎯 سیستم آماده خدمات‌رسانی!                      ║');
    console.log('╚══════════════════════════════════════════════════════╝');
});
