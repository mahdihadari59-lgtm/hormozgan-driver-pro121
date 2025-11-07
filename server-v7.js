const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

const trafficSystem = {
    liveTraffic: {
        "بندرعباس مرکز": {
            status: "شلوغ",
            speed: "15 km/h",
            routes: ["خیابان امام: 🔴 شلوغ", "بلوار طالقانی: 🟢 روان"]
        }
    }
};

function generateTrafficResponse(userMessage) {
    let response = "🚦 **وضعیت ترافیک**\n\n";
    const alerts = [];
    
    Object.entries(trafficSystem.liveTraffic).forEach(([area, data]) => {
        response += `**${area}:**\n• وضعیت: ${data.status}\n• سرعت: ${data.speed}\n\n`;
    });

    return { response, alerts };
}

const weatherSystem = {
    currentWeather: {
        "بندرعباس": {
            temperature: "۳۲°C",
            condition: "آفتابی ☀️"
        }
    }
};

function generateWeatherResponse() {
    let response = "🌤️ **آب و هوا**\n\n";
    Object.entries(weatherSystem.currentWeather).forEach(([city, data]) => {
        response += `**${city}:**\n• دما: ${data.temperature}\n• وضعیت: ${data.condition}\n\n`;
    });
    return { response, alerts: [] };
}

app.get('/ai-chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'ai-chat-complete.html'));
});

app.post('/ai-chat-pro', (req, res) => {
    try {
        const { message } = req.body;
        console.log('🤖 AI سوال:', message);
        
        let response = '';
        const alerts = [];

        if (message.includes('ترافیک')) {
            const traffic = generateTrafficResponse(message);
            response = traffic.response;
        }
        else if (message.includes('آب و هوا')) {
            const weather = generateWeatherResponse();
            response = weather.response;
        }
        else if (message.includes('سلام')) {
            response = "👋 **سلام! AI Sahel Pro**\n\n🛠️ خدمات:\n• 🚦 ترافیک\n• 🌤️ آب و هوا\n• 📞 07635108";
        }
        else {
            response = "🤖 **AI Sahel**\n\nمن می‌توانم کمک کنم در:\n• ترافیک\n• آب و هوا";
        }

        res.json({
            response: response,
            alerts: alerts,
            status: 'success'
        });

    } catch (error) {
        res.json({ response: '⚠️ خطا', alerts: [], status: 'error' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', version: 'v3.0' });
});

app.get('/api/driver-info', (req, res) => {
    res.json({
        success: true,
        data: { plate: '84 ایران 741 ط 98', support: '07635108' }
    });
});

app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║                🚀 AI Sahel Pro v3.0                 ║');
    console.log('╠══════════════════════════════════════════════════════╣');
    console.log(`║   ✅ سرور روی پورت ${PORT} اجرا شد                    ║`);
    console.log('║   📞 پشتیبانی: 07635108                            ║');
    console.log('║   🚗 پلاک: 84 ایران 741 ط 98                       ║');
    console.log('║                                                      ║');
    console.log(`║   📱 http://localhost:${PORT}/                         ║`);
    console.log(`║   🤖 http://localhost:${PORT}/ai-chat                 ║`);
    console.log('║                                                      ║');
    console.log('║   🎯 آماده!                                         ║');
    console.log('╚══════════════════════════════════════════════════════╝\n');
});
// ==================== سیستم ترافیک و مسیریابی پیشرفته ====================

const trafficSystem = {
    title: "سیستم ترافیک و مسیریابی بندرعباس",
    
    // وضعیت ترافیک لحظه‌ای
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
        },
        "بندرعباس جنوب": {
            status: "خیلی شلوغ",
            level: "red",
            speed: "8 km/h", 
            updateTime: new Date().toLocaleTimeString('fa-IR'),
            routes: [
                "اسکله شهید حقانی: 🔴 قفل",
                "بازار ماهی فروشان: 🔴 شلوغ",
                "ترمینال مسافربری: 🟡 متوسط"
            ]
        }
    },

    // ساعات شلوغی
    peakHours: {
        morning: "۷:۰۰ - ۹:۰۰",
        evening: "۱۷:۰۰ - ۲۰:۰۰", 
        friday: "۱۴:۰۰ - ۱۸:۰۰",
        holidays: "۱۰:۰۰ - ۱۳:۰۰"
    },

    // مسیرهای بهینه
    optimizedRoutes: {
        "مرکز به فرودگاه": {
            route: "بلوار طالقانی → جاده فرودگاه",
            time: "۲۵ دقیقه",
            distance: "۱۸ کیلومتر",
            traffic: "🟢 روان",
            alternatives: [
                "مسیر اصلی: ۲۵ دقیقه",
                "مسیر جایگزین: ۳۰ دقیقه"
            ]
        },
        "اسکله به مرکز": {
            route: "جاده ساحلی → خیابان امام",
            time: "۲۰ دقیقه", 
            distance: "۱۲ کیلومتر",
            traffic: "🟡 متوسط",
            alternatives: [
                "مسیر ساحلی: ۲۰ دقیقه",
                "مسیر داخلی: ۲۵ دقیقه"
            ]
        },
        "شمال به جنوب": {
            route: "بلوار معلم → پل خلیج فارس → ساحلی",
            time: "۳۵ دقیقه",
            distance: "۲۲ کیلومتر", 
            traffic: "🟡 متوسط",
            alternatives: [
                "مسیر پل: ۳۵ دقیقه",
                "مسیر دوربری: ۴۵ دقیقه"
            ]
        }
    },

    // نقاط حساس ترافیکی
    hotspots: [
        {
            name: "میدان امام حسین",
            status: "🔴 شلوغ",
            reason: "ترافیک سنگین ورودی بازار",
            suggestion: "استفاده از بلوار طالقانی"
        },
        {
            name: "پل خلیج فارس",
            status: "🟡 متوسط", 
            reason: "ترافیک معمول",
            suggestion: "مسیر جایگزین موجود نیست"
        },
        {
            name: "اسکله شهید حقانی",
            status: "🔴 قفل",
            reason: "تخلیه و بارگیری کشتی",
            suggestion: "استفاده از اسکله جایگزین"
        }
    ],

    // APIهای نقشه
    mapApis: {
        googleMaps: "https://maps.google.com/?q=Bandar+Abbas",
        openStreetMap: "https://www.openstreetmap.org/#map=13/27.1865/56.2804",
        localMap: "https://bandarabbas.ir/traffic-map",
        navigation: "https://maps.app.goo.gl/bandarabbas"
    }
};

// تابع تولید پاسخ ترافیک
function generateTrafficResponse(userMessage) {
    let response = '';
    const alerts = [];

    if (userMessage.includes('ترافیک') || userMessage.includes('وضعیت')) {
        response = `🚦 **وضعیت ترافیک لحظه‌ای بندرعباس**\\n\\n`;
        
        Object.entries(trafficSystem.liveTraffic).forEach(([area, data]) => {
            response += `**${area}:**\\n`;
            response += `• وضعیت: ${data.status}\\n`;
            response += `• سرعت متوسط: ${data.speed}\\n`;
            response += `• آخرین بروزرسانی: ${data.updateTime}\\n`;
            response += `• مسیرها:\\n`;
            data.routes.forEach(route => {
                response += `  ${route}\\n`;
            });
            response += `\\n`;
        });

        alerts.push("🕒 **ساعات شلوغی:** صبح ۷-۹ | عصر ۱۷-۲۰");
        alerts.push("📱 **نقشه زنده:** https://bandarabbas.ir/traffic-map");
    }

    else if (userMessage.includes('مسیر') || userMessage.includes('راه')) {
        response = `🗺️ **مسیرهای بهینه بندرعباس**\\n\\n`;
        
        Object.entries(trafficSystem.optimizedRoutes).forEach(([routeName, data]) => {
            response += `**${routeName}:**\\n`;
            response += `• مسیر: ${data.route}\\n`;
            response += `• زمان: ${data.time}\\n`;
            response += `• مسافت: ${data.distance}\\n`;
            response += `• ترافیک: ${data.traffic}\\n`;
            response += `• مسیرهای جایگزین:\\n`;
            data.alternatives.forEach(alt => {
                response += `  ${alt}\\n`;
            });
            response += `\\n`;
        });

        alerts.push("📍 **نقشه:** https://maps.google.com/?q=Bandar+Abbas");
        alerts.push("🚗 **پیشنهاد:** در ساعات شلوغی از مسیرهای جایگزین استفاده کنید");
    }

    else if (userMessage.includes('شلوغ') || userMessage.includes('اوج')) {
        response = `🕒 **ساعات شلوغی ترافیک بندرعباس**\\n\\n`;
        response += `• **صبحگاه:** ${trafficSystem.peakHours.morning}\\n`;
        response += `• **عصرگاه:** ${trafficSystem.peakHours.evening}\\n`;
        response += `• **جمعه‌ها:** ${trafficSystem.peakHours.friday}\\n`;
        response += `• **تعطیلات:** ${trafficSystem.peakHours.holidays}\\n\\n`;
        
        response += `📍 **نقاط حساس:**\\n`;
        trafficSystem.hotspots.forEach(hotspot => {
            response += `• **${hotspot.name}:** ${hotspot.status} - ${hotspot.reason}\\n`;
            response += `  💡 ${hotspot.suggestion}\\n`;
        });

        alerts.push("⏰ **توصیه:** برنامه‌ریزی سفر خارج از ساعات شلوغی");
        alerts.push("🗺️ **مسیریابی:** https://maps.app.goo.gl/bandarabbas");
    }

    else if (userMessage.includes('نقشه') || userMessage.includes('map')) {
        response = `🗾 **سرویس‌های نقشه و مسیریابی**\\n\\n`;
        response += `• **Google Maps:** ${trafficSystem.mapApis.googleMaps}\\n`;
        response += `• **OpenStreetMap:** ${trafficSystem.mapApis.openStreetMap}\\n`;
        response += `• **نقشه محلی:** ${trafficSystem.mapApis.localMap}\\n`;
        response += `• **مسیریاب:** ${trafficSystem.mapApis.navigation}\\n\\n`;
        
        response += `🎯 **امکانات:**\\n`;
        response += `• مشاهده ترافیک لحظه‌ای\\n`;
        response += `• مسیریابی بهینه\\n`;
        response += `• اطلاع از ساعات شلوغی\\n`;
        response += `• نقاط حساس ترافیکی\\n`;

        alerts.push("📱 **اپلیکیشن:** Waze | Google Maps | نقشه محلی");
        alerts.push("🚗 **مسیریابی هوشمند:** فعال در همه اپلیکیشن‌ها");
    }

    return { response, alerts };
}

// endpoint ترافیک
app.get('/api/traffic/status', (req, res) => {
    const result = generateTrafficResponse('ترافیک');
    res.json(result);
});

app.get('/api/traffic/routes', (req, res) => {
    const result = generateTrafficResponse('مسیر');
    res.json(result);
});

app.get('/api/traffic/peak-hours', (req, res) => {
    const result = generateTrafficResponse('شلوغی');
    res.json(result);
});

console.log('✅ سیستم ترافیک و مسیریابی بارگذاری شد');
// ==================== سیستم آب و هوای پیشرفته ====================

const weatherSystem = {
    title: "سیستم آب و هوای بندرعباس و هرمزگان",
    
    // اطلاعات آب و هوای فعلی
    currentWeather: {
        "بندرعباس": {
            temperature: "۳۲°C",
            condition: "آفتابی ☀️",
            humidity: "۶۵٪",
            wind: "۱۵ km/h",
            pressure: "۱۰۱۳ hPa",
            visibility: "۱۰ km",
            feelsLike: "۳۵°C",
            updateTime: new Date().toLocaleTimeString('fa-IR')
        },
        "قشم": {
            temperature: "۳۰°C", 
            condition: "نیمه ابری ⛅",
            humidity: "۷۰٪",
            wind: "۲۰ km/h",
            pressure: "۱۰۱۲ hPa",
            visibility: "۸ km",
            feelsLike: "۳۳°C",
            updateTime: new Date().toLocaleTimeString('fa-IR')
        },
        "میناب": {
            temperature: "۳۴°C",
            condition: "آفتابی 🌞",
            humidity: "۶۰٪",
            wind: "۱۲ km/h", 
            pressure: "۱۰۱۱ hPa",
            visibility: "۱۲ km",
            feelsLike: "۳۷°C",
            updateTime: new Date().toLocaleTimeString('fa-IR')
        },
        "بندرلنگه": {
            temperature: "۳۱°C",
            condition: "مرطوب 💧",
            humidity: "۷۵٪",
            wind: "۱۸ km/h",
            pressure: "۱۰۱۴ hPa",
            visibility: "۶ km", 
            feelsLike: "۳۴°C",
            updateTime: new Date().toLocaleTimeString('fa-IR')
        }
    },

    // پیش‌بینی ۳ روزه
    forecast: {
        "امروز": {
            high: "۳۴°C",
            low: "۲۶°C", 
            condition: "آفتابی",
            rain: "۰٪",
            wind: "۱۵ km/h"
        },
        "فردا": {
            high: "۳۳°C",
            low: "۲۵°C",
            condition: "نیمه ابری",
            rain: "۱۰٪", 
            wind: "۱۸ km/h"
        },
        "پس‌فردا": {
            high: "۳۲°C",
            low: "۲۴°C",
            condition: "ابری",
            rain: "۲۰٪",
            wind: "۲۰ km/h"
        }
    },

    // هشدارهای آب و هوایی
    alerts: [
        {
            type: "گرمازدگی",
            level: "زرد",
            areas: ["بندرعباس", "میناب"],
            message: "دمای بالا - مراقب گرمازدگی باشید",
            recommendation: "آب کافی بنوشید و در سایه حرکت کنید"
        },
        {
            type: "وزش باد",
            level: "نارنجی", 
            areas: ["قشم", "بندرلنگه"],
            message: "وزش باد شدید در سواحل",
            recommendation: "مراقب رانندگی در جاده‌های ساحلی باشید"
        }
    ],

    // شرایط جاده‌ها
    roadConditions: {
        "جاده بندرعباس-قشم": {
            condition: "مناسب 🟢",
            visibility: "خوب",
            wind: "ملایم",
            warning: "ندارد"
        },
        "جاده بندرعباس-میناب": {
            condition: "احتیاط 🟡",
            visibility: "متوسط", 
            wind: "متوسط",
            warning: "گرمای شدید"
        },
        "جاده بندرعباس-بندرلنگه": {
            condition: "مناسب 🟢",
            visibility: "خوب",
            wind: "ملایم", 
            warning: "ندارد"
        },
        "جاده ساحلی": {
            condition: "احتیاط 🟡",
            visibility: "کاهش یافته",
            wind: "شدید",
            warning: "وزش باد شدید"
        }
    },

    // APIهای آب و هوا
    weatherApis: {
        openWeather: "https://api.openweathermap.org/data/2.5/weather?q=BandarAbbas,ir&appid=API_KEY&lang=fa",
        weatherAPI: "https://api.weatherapi.com/v1/current.json?key=API_KEY&q=BandarAbbas&lang=fa",
        localAPI: "https://api.irimo.ir/far/weather",
        marineWeather: "https://marine.weather.gov/MapClick.php?lat=27.18&lon=56.28"
    },

    // نکات ایمنی آب و هوایی
    safetyTips: {
        "گرمای شدید": [
            "آب کافی به همراه داشته باشید",
            "از رانندگی طولانی در ساعت اوج گرما خودداری کنید",
            "کولر خودرو را چک کنید",
            "مراقب فشار لاستیک‌ها باشید"
        ],
        "وزش باد": [
            "سرعت خود را کاهش دهید",
            "فاصله ایمنی را افزایش دهید", 
            "مراقب وانت‌ها و کامیون‌ها باشید",
            "از سبقت غیرضروری خودداری کنید"
        ],
        "کاهش دید": [
            "چراغ‌های خودرو را روشن کنید",
            "سرعت را کاهش دهید",
            "فاصله ایمنی را حفظ کنید",
            "از خطوط راهنما پیروی کنید"
        ]
    }
};

// تابع تولید پاسخ آب و هوا
function generateWeatherResponse(userMessage) {
    let response = '';
    const alerts = [];

    if (userMessage.includes('آب و هوا') || userMessage.includes('هوا')) {
        response = "🌤️ **وضعیت آب و هوای هرمزگان**\\n\\n";
        
        Object.entries(weatherSystem.currentWeather).forEach(([city, data]) => {
            response += "**" + city + ":**\\n";
            response += "• دما: " + data.temperature + "\\n";
            response += "• وضعیت: " + data.condition + "\\n";
            response += "• رطوبت: " + data.humidity + "\\n";
            response += "• باد: " + data.wind + "\\n";
            response += "• احساس: " + data.feelsLike + "\\n";
            response += "• بروزرسانی: " + data.updateTime + "\\n\\n";
        });

        alerts.push("📡 **منبع:** سازمان هواشناسی هرمزگان");
    }

    else if (userMessage.includes('پیش‌بینی') || userMessage.includes('فردا')) {
        response = "📅 **پیش‌بینی آب و هوای ۳ روزه بندرعباس**\\n\\n";
        
        Object.entries(weatherSystem.forecast).forEach(([day, data]) => {
            response += "**" + day + ":**\\n";
            response += "• بیشینه: " + data.high + "\\n";
            response += "• کمینه: " + data.low + "\\n";
            response += "• وضعیت: " + data.condition + "\\n";
            response += "• بارش: " + data.rain + "\\n";
            response += "• باد: " + data.wind + "\\n\\n";
        });

        alerts.push("⏰ **توصیه:** برای سفرهای طولانی برنامه‌ریزی کنید");
    }

    else if (userMessage.includes('هشدار') || userMessage.includes('اخطار')) {
        response = "⚠️ **هشدارهای آب و هوایی هرمزگان**\\n\\n";
        
        weatherSystem.alerts.forEach(alert => {
            response += "**" + alert.type + "** (" + alert.level + ")\\n";
            response += "• مناطق: " + alert.areas.join(", ") + "\\n";
            response += "• پیام: " + alert.message + "\\n";
            response += "• توصیه: " + alert.recommendation + "\\n\\n";
        });

        alerts.push("🚨 **اورژانس:** در شرایط اضطراری با ۱۱۰ تماس بگیرید");
    }

    else if (userMessage.includes('جاده') || userMessage.includes('مسیر')) {
        response = "🛣️ **شرایط جاده‌های هرمزگان**\\n\\n";
        
        Object.entries(weatherSystem.roadConditions).forEach(([road, data]) => {
            response += "**" + road + ":**\\n";
            response += "• وضعیت: " + data.condition + "\\n";
            response += "• دید: " + data.visibility + "\\n";
            response += "• باد: " + data.wind + "\\n";
            if (data.warning !== "ندارد") {
                response += "• هشدار: " + data.warning + "\\n";
            }
            response += "\\n";
        });

        alerts.push("🎯 **توصیه:** قبل از سفر شرایط جاده را بررسی کنید");
    }

    else if (userMessage.includes('ایمنی') || userMessage.includes('توصیه')) {
        response = "🔰 **نکات ایمنی آب و هوایی**\\n\\n";
        
        Object.entries(weatherSystem.safetyTips).forEach(([condition, tips]) => {
            response += "**" + condition + ":**\\n";
            tips.forEach(tip => {
                response += "• " + tip + "\\n";
            });
            response += "\\n";
        });

        alerts.push("💡 **یادآوری:** همیشه شرایط جوی را در نظر بگیرید");
    }

    return { response, alerts };
}

// endpoint آب و هوا
app.get('/api/weather/current', (req, res) => {
    const result = generateWeatherResponse('آب و هوا');
    res.json(result);
});

app.get('/api/weather/forecast', (req, res) => {
    const result = generateWeatherResponse('پیش‌بینی');
    res.json(result);
});

app.get('/api/weather/alerts', (req, res) => {
    const result = generateWeatherResponse('هشدار');
    res.json(result);
});

console.log('✅ سیستم آب و هوای پیشرفته بارگذاری شد');
