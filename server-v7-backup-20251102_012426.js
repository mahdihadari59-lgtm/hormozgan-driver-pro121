const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 8080;

// 🔒 میدلورهای امنیتی
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    }
}));

// 📈 محدودیت نرخ درخواست
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'تعداد درخواست‌های شما بیش از حد مجاز است'
});
app.use(limiter);

// 🌐 CORS امن
app.use(cors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    credentials: true
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// 🧠 کلاس هوش مصنوعی ساحل (AI Sahel)
class AISahel {
    constructor() {
        this.supportedCommands = new Set([
            'ترافیک', 'مسیریابی', 'درآمد', 'ایمنی', 
            'پیش‌بینی', 'گزارش', 'مسیر', 'درآمد هفته',
            'قوانین', 'دوربین', 'نظارت', 'تخلف', 'جریمه'
        ]);
        
        // 🗺️ پایگاه داده مکان‌های ساحل با اسکله‌های جدید
        this.locations = {
            "اسکله شهید رجایی": { type: "اسکله تجاری", zone: "بندری", traffic: "سنگین" },
            "اسکله شهید باهنر": { type: "اسکله مسافربری", zone: "بندری", traffic: "متوسط" },
            "اسکله حقانی": { type: "اسکله خصوصی", zone: "بندری", traffic: "سبک" },
            "خیابان پیامبراعظم": { type: "خیابان اصلی", zone: "مرکزی", traffic: "متوسط" },
            "خیابان پل خواجو": { type: "خیابان فرعی", zone: "شمالی", traffic: "سبک" },
            "مسیر درخت سبز": { type: "جاده", zone: "شرقی", traffic: "متوسط" },
            "کوه ملت": { type: "منطقه کوهستانی", zone: "شمالی", traffic: "سبک" },
            "خیابان الهیه جنوبی": { type: "خیابان اصلی", zone: "جنوبی", traffic: "سنگین" },
            "بلوار ساحلی": { type: "بلوار", zone: "ساحلی", traffic: "متوسط" },
            "بلوار امام رضا": { type: "بلوار", zone: "شرقی", traffic: "سنگین" },
            "شهرک سجادیه": { type: "شهرک", zone: "غربی", traffic: "سبک" },
            "شهرک توحید": { type: "شهرک", zone: "شرقی", traffic: "متوسط" },
            "دانشگاه پیام‌نور": { type: "مرکز آموزشی", zone: "شمالی", traffic: "متوسط" },
            "دانشگاه آزاد": { type: "مرکز آموزشی", zone: "مرکزی", traffic: "سنگین" },
            "کوه فرهنگیان": { type: "منطقه کوهستانی", zone: "شمالی", traffic: "سبک" },
            "سیدجمال‌الدین": { type: "خیابان", zone: "مرکزی", traffic: "سنگین" },
            "چهارراه بلوکی": { type: "چهارراه", zone: "مرکزی", traffic: "خیلی سنگین" },
            "چهارراه فاطمیه": { type: "چهارراه", zone: "جنوبی", traffic: "سنگین" },
            "سه راه پلنگ صورتی": { type: "سه راه", zone: "شرقی", traffic: "متوسط" },
            "سه راه سازمان": { type: "سه راه", zone: "غربی", traffic: "سبک" }
        };
    }

    // ✅ اعتبارسنجی ورودی کاربر
    validateInput(input) {
        if (typeof input !== 'string') return false;
        if (input.length > 500) return false;
        const dangerousPatterns = /[<>{}[\]$`\\]/;
        if (dangerousPatterns.test(input)) return false;
        return true;
    }

    // 🚗 پردازش هوشمند درخواست‌های رانندگی
    async processRequest(userInput) {
        if (!this.validateInput(userInput)) {
            throw new Error('ورودی نامعتبر است');
        }

        const normalizedInput = userInput.trim().toLowerCase();
        
        // بررسی تماس‌ها
        if (normalizedInput.includes('تماس') || normalizedInput.includes('شماره') || normalizedInput.includes('تلفن')) {
            return this.handleContactRequest(normalizedInput);
        }

        // بررسی اطلاعات خودرو
        if (normalizedInput.includes('پلاک') || normalizedInput.includes('خودرو') || normalizedInput.includes('ماشین')) {
            return this.getVehicleInfo();
        }

        // بررسی قوانین رانندگی
        if (normalizedInput.includes('قانون') || normalizedInput.includes('آیین نامه') || normalizedInput.includes('مقررات')) {
            return this.getTrafficRegulations();
        }

        // بررسی مسیرهای خاص
        const specificRoutes = [
            "خیابان شهید مطهری حد فاصله ات‌وتاج",
            "هتل هرمز تا پارک شهر", 
            "پل رسالت تا فرودگاه",
            "فرودگاه تا سه شهرک نوبت"
        ];

        for (const route of specificRoutes) {
            if (normalizedInput.includes(route.toLowerCase())) {
                return this.getRouteSuggestion(normalizedInput);
            }
        }
        
        // بررسی درخواست‌های مربوط به مکان‌های خاص
        for (const [location, info] of Object.entries(this.locations)) {
            if (normalizedInput.includes(location.toLowerCase())) {
                return this.getLocationInfo(location, info);
            }
        }
        
        // بررسی عمومی‌تر
        if (normalizedInput.includes('ترافیک')) {
            return this.getTrafficInfo(normalizedInput);
        } else if (normalizedInput.includes('مسیریابی') || normalizedInput.includes('مسیر')) {
            return this.getRouteSuggestion(normalizedInput);
        } else if (normalizedInput.includes('درآمد')) {
            return this.getIncomeReport();
        } else if (normalizedInput.includes('ایمنی')) {
            return this.getSafetyTips();
        } else if (normalizedInput.includes('مکان') || normalizedInput.includes('خیابان') || normalizedInput.includes('بلوار') || normalizedInput.includes('اسکله')) {
            return this.getAllLocations();
        } else {
            return this.getGeneralResponse(normalizedInput);
        }
    }

    // 🗺️ اطلاعات مکان خاص
    getLocationInfo(locationName, locationInfo) {
        const trafficIcons = {
            "سبک": "🟢",
            "متوسط": "🟡", 
            "سنگین": "🔴",
            "خیلی سنگین": "🔴⚠️"
        };
        
        return `📍 **${locationName}**:\n\n` +
               `🏷️ نوع: ${locationInfo.type}\n` +
               `🗺️ منطقه: ${locationInfo.zone}\n` +
               `🚦 ترافیک: ${trafficIcons[locationInfo.traffic]} ${locationInfo.traffic}\n` +
               `⏱️ زمان تخمینی عبور: ${this.getCrossingTime(locationInfo.traffic)}\n` +
               `💡 توصیه: ${this.getLocationAdvice(locationName)}`;
    }

    // 🚦 اطلاعات ترافیک کلی
    getTrafficInfo(input) {
        let response = "🚦 **وضعیت ترافیک مناطق ساحل**:\n\n";
        
        // مناطق با ترافیک سنگین
        const heavyTraffic = Object.entries(this.locations)
            .filter(([_, info]) => info.traffic === "سنگین" || info.traffic === "خیلی سنگین")
            .map(([name, _]) => name);
        
        if (heavyTraffic.length > 0) {
            response += "🔴 **ترافیک سنگین**:\n";
            heavyTraffic.forEach(location => {
                response += `• ${location}\n`;
            });
            response += "\n";
        }
        
        // مناطق با ترافیک متوسط
        const mediumTraffic = Object.entries(this.locations)
            .filter(([_, info]) => info.traffic === "متوسط")
            .map(([name, _]) => name);
        
        if (mediumTraffic.length > 0) {
            response += "🟡 **ترافیک متوسط**:\n";
            mediumTraffic.forEach(location => {
                response += `• ${location}\n`;
            });
            response += "\n";
        }
        
        response += "⚠️ **هشدارها**:\n";
        response += "• دوربین سرعت فعال در چهارراه بلوکی\n";
        response += "• طرح ترافیک در مرکز شهر فعال است\n";
        response += "• جاده درخت سبز در حال تعمیر\n";
        
        return response;
    }

    // 🗺️ پیشنهاد مسیر
    getRouteSuggestion(input) {
        // 🗺️ پایگاه داده مسیرهای به‌روزرسانی شده ساحل
        const routesDatabase = {
            "خیابان شهید مطهری حد فاصله ات‌وتاج": {
                name: "خیابان شهید مطهری - ات‌وتاج",
                time: "8 دقیقه",
                distance: "3.2 کیلومتر",
                traffic: "سبک",
                tips: ["خیابان اصلی", "دوربین سرعت فعال", "پارکینگ عمومی"],
                directions: ["شروع از میدان مرکزی", "حرکت به سمت شمال در مطهری", "پیچ به راست به ات‌وتاج"]
            },
            "هتل هرمز تا پارک شهر": {
                name: "هتل هرمز → پارک شهر", 
                time: "12 دقیقه",
                distance: "5.1 کیلومتر",
                traffic: "متوسط",
                tips: ["منطقه توریستی", "ترافیک ساعتی", "پارکینگ رایگان در پارک"],
                directions: ["خروج از هتل هرمز", "بلوار ساحلی", "پیچ به چپ به خیابان فرهنگ", "ورودی پارک شهر"]
            },
            "پل رسالت تا فرودگاه": {
                name: "پل رسالت → فرودگاه",
                time: "25 دقیقه", 
                distance: "18.7 کیلومتر",
                traffic: "سنگین",
                tips: ["استفاده از خطوط اختصاصی", "پرهیز از ساعات پیک", "کنترل اسناد در فرودگاه"],
                directions: ["شروع از پل رسالت", "جاده کمربندی", "پل زیبا", "ورودی فرودگاه"]
            },
            "فرودگاه تا سه شهرک نوبت": {
                name: "فرودگاه → سه شهرک نوبت",
                time: "35 دقیقه",
                distance: "22.3 کیلومتر",
                traffic: "متوسط",
                tips: ["مسیر جایگزین از جاده قدیم", "مناطق صنعتی", "سرعت مطمئنه 70 کیلومتر"],
                directions: ["خروج از فرودگاه", "جاده جدید", "سه راه صنعتی", "ورودی شهرک نوبت"]
            }
        };

        // جستجوی مسیر در پایگاه داده
        for (const [routeKey, routeInfo] of Object.entries(routesDatabase)) {
            if (input.includes(routeKey.toLowerCase())) {
                return this.formatRouteResponse(routeInfo);
            }
        }

        // اگر مسیر خاصی پیدا نشد، پیشنهادات عمومی
        return this.getGeneralRouteSuggestions();
    }

    // 🗺️ فرمت پاسخ مسیر
    formatRouteResponse(routeInfo) {
        const trafficIcons = {
            "سبک": "🟢",
            "متوسط": "🟡",
            "سنگین": "🔴"
        };

        let response = `🗺️ **${routeInfo.name}**:\n\n`;
        response += `⏱️ **زمان تخمینی:** ${routeInfo.time}\n`;
        response += `📏 **مسافت:** ${routeInfo.distance}\n`;
        response += `🚦 **ترافیک:** ${trafficIcons[routeInfo.traffic]} ${routeInfo.traffic}\n\n`;
        
        response += `💡 **توصیه‌های ساحل:**\n`;
        routeInfo.tips.forEach(tip => {
            response += `• ${tip}\n`;
        });

        response += `\n📍 **مسیر حرکت:**\n`;
        routeInfo.directions.forEach((direction, index) => {
            response += `${index + 1}. ${direction}\n`;
        });

        response += `\n📞 **پشتیبانی:** 07635108`;
        
        return response;
    }

    // 🗺️ پیشنهادات مسیر عمومی
    getGeneralRouteSuggestions() {
        return `🗺️ **پیشنهادهای مسیریابی ساحل**:\n\n
📍 **مسیرهای پرطرفدار**:
• خیابان شهید مطهری ← ات‌وتاج (۸ دقیقه)
• هتل هرمز ← پارک شهر (۱۲ دقیقه)
• پل رسالت ← فرودگاه (۲۵ دقیقه)
• فرودگاه ← سه شهرک نوبت (۳۵ دقیقه)

🚦 **وضعیت ترافیک**:
• مناطق مرکزی: 🔴 سنگین
• بلوار ساحلی: 🟡 متوسط  
• جاده فرودگاه: 🟢 سبک

💡 **برای مسیریابی دقیق، نام مسیر را بگویید**:
"مسیر از هتل هرمز به پارک شهر"
"مسیر پل رسالت تا فرودگاه"`;
    }

    // 📞 مدیریت تماس‌ها
    handleContactRequest(input) {
        const contactInfo = {
            "پشتیبانی": "07635108",
            "بخش امنیتی": "09164321660", 
            "راننده": "09179940272",
            "تماس اضطراری": "07635108"
        };

        for (const [contact, number] of Object.entries(contactInfo)) {
            if (input.includes(contact.toLowerCase())) {
                return this.formatContactResponse(contact, number);
            }
        }

        return this.getAllContacts();
    }

    // 📞 فرمت پاسخ تماس
    formatContactResponse(contactName, number) {
        return `📞 **${contactName}**:\n\n` +
               `🔢 **شماره تماس:** ${number}\n` +
               `⏰ **ساعات پاسخگویی:** 24 ساعته\n` +
               `💬 **نوع خدمات:** ${this.getServiceType(contactName)}\n\n` +
               `برای تماس فوری، شماره را شماره‌گیری کنید.`;
    }

    // 📞 نوع خدمات
    getServiceType(contactName) {
        const services = {
            "پشتیبانی": "پشتیبانی فنی و مسیریابی",
            "بخش امنیتی": "امنیت و موارد اضطراری", 
            "راننده": "هماهنگی سفر و موقعیت‌یابی",
            "تماس اضطراری": "پشتیبانی فوری"
        };
        return services[contactName] || "خدمات عمومی";
    }

    // 📞 تمام مخاطبین
    getAllContacts() {
        return `📞 **مخاطبین ساحل**:\n\n
• **پشتیبانی فنی**: 07635108
• **بخش امنیتی**: 09164321660
• **راننده**: 09179940272

🚗 **اطلاعات خودرو**:
• پلاک: 84 ایران 741 ط 98
• نوع: پژو 206
• گواهینامه: B12345678

💡 **برای تماس، نام مخاطب را بگویید**:
"تماس با پشتیبانی"
"شماره بخش امنیتی"`;
    }

    // 🚗 اطلاعات پلاک و خودرو
    getVehicleInfo() {
        return `🚗 **اطلاعات خودرو - AI Sahel**:\n\n
🔢 **پلاک:** 84 ایران 741 ط 98
🏷️ **نوع خودرو:** پژو 206
📜 **گواهینامه:** B12345678
⭐ **امتیاز راننده:** 4.8/5
💰 **درآمد ماهانه:** 14,880,000 تومان

📞 **تماس‌ها**:
• پشتیبانی: 07635108
• امنیتی: 09164321660
• راننده: 09179940272

📍 **مسیرهای فعال**:
• خیابان شهید مطهری - ات‌وتاج
• هتل هرمز - پارک شهر
• پل رسالت - فرودگاه`;
    }

    // 📋 قوانین رانندگی
    getTrafficRegulations() {
        return `📋 **قوانین راهنمایی و رانندگی - AI Sahel**:\n\n
🚗 **محدودیت‌های سرعت**:
• شهری: 50 کیلومتر بر ساعت
• شهری اصلی: 60 کیلومتر بر ساعت
• برون شهری: 80 کیلومتر بر ساعت
• آزادراه: 110 کیلومتر بر ساعت
• جاده‌های کوهستانی: 70 کیلومتر بر ساعت

🚫 **تخلفات مهم**:
• عبور از چراغ قرمز: جریمه 1,000,000 تومان - 3 امتیاز منفی
• سرعت غیرمجاز: جریمه 500,000 تومان - 2 امتیاز منفی
• سبقت غیرمجاز: جریمه 800,000 تومان - 3 امتیاز منفی
• استفاده از تلفن همراه: جریمه 300,000 تومان - 1 امتیاز منفی
• نداشتن کمربند: جریمه 200,000 تومان - 1 امتیاز منفی

✅ **الزامات**:
• کمربند ایمنی برای تمام سرنشینان اجباری است
• گواهینامه معتبر همراه راننده باشد
• کارت خودرو و بیمه نامه معتبر
• معاینه فنی خودرو هر سال تمدید شود
• عدم مصرف مشروبات الکلی و مواد مخدر

⚠️ **سیستم نظارتی**:
• دوربین ثبت سرعت در اسکله شهید رجایی
• دوربین چراغ قرمز در بلوار ساحلی
• کنترل پلیس در مناطق مرکزی`;
    }

    // 💰 گزارش درآمد
    getIncomeReport() {
        return `💰 **گزارش درآمد هفته - AI Sahel**:\n\n
• شنبه: ۴۵۰,۰۰۰ تومان
• یکشنبه: ۵۲۰,۰۰۰ تومان  
• دوشنبه: ۳۸۰,۰۰۰ تومان
• سه‌شنبه: ۶۱۰,۰۰۰ تومان
• چهارشنبه: ۴۹۰,۰۰۰ تومان
• پنجشنبه: ۵۵۰,۰۰۰ تومان
• جمعه: ۷۲۰,۰۰۰ تومان

📊 **جمع کل**: ۳,۷۲۰,۰۰۰ تومان
📈 **میانگین روزانه**: ۵۳۱,۴۲۸ تومان
🎯 **پیش‌بینی هفته آینده**: ۴,۰۰۰,۰۰۰ تومان

💡 **نکات افزایش درآمد**:
• ساعات پیک (۷-۹ صبح و ۴-۶ عصر)
• مناطق پردرآمد: اسکله شهید رجایی، دانشگاه آزاد
• ساعات خلوت: مناطق مسکونی مانند شهرک سجادیه`;
    }

    // 🛡️ نکات ایمنی
    getSafetyTips() {
        return `🛡️ **نکات ایمنی رانندگی - AI Sahel**:\n\n
🚗 **اطلاعات تماس اضطراری**:
• پشتیبانی: 07635108
• امنیتی: 09164321660  
• راننده: 09179940272

📋 **اطلاعات خودرو**:
• پلاک: 84 ایران 741 ط 98
• نوع: پژو 206
• گواهینامه: B12345678

🚗 **ایمنی وسیله نقلیه**:
• بررسی باد لاستیک‌ها هفتگی
• تست ترمزها در مسیرهای کم‌ترافیک
• چراغ‌ها و راهنماها را چک کنید

🛣️ **ایمنی مسیر**:
• سرعت مطمئنه در مسیر درخت سبز: ۶۰ کیلومتر
• احتیاط در پیچ‌های کوه ملت
• فاصله ایمنی در بلوار امام رضا

👤 **ایمنی شخصی**:
• همیشه کمربند ایمنی
• عدم استفاده از تلفن همراه
• استراحت هر ۲ ساعت رانندگی

⚠️ **مناطق پرخطر**:
• چهارراه بلوکی (ترافیک سنگین)
• اسکله شهید رجایی (ترافیک سنگین)
• دانشگاه آزاد (خروجی‌های ناگهانی)`;
    }

    // 🗺️ لیست تمام مکان‌ها
    getAllLocations() {
        let response = "🗺️ **تمام مکان‌های تحت پوشش AI Sahel**:\n\n";
        
        const zones = {};
        Object.entries(this.locations).forEach(([name, info]) => {
            if (!zones[info.zone]) zones[info.zone] = [];
            zones[info.zone].push(`${name} (${info.type})`);
        });
        
        Object.entries(zones).forEach(([zone, locations]) => {
            response += `**${zone}**:\n`;
            locations.forEach(location => {
                response += `• ${location}\n`;
            });
            response += "\n";
        });
        
        response += "💡 **برای اطلاعات هر مکان، نام آن را بپرسید**";
        return response;
    }

    // 👋 پاسخ عمومی
    getGeneralResponse(input) {
        if (input.includes('سلام') || input.includes('سلامتی')) {
            return `👋 **سلام! من AI Sahel هستم - دستیار هوشمند رانندگی شما**\n\n
🚗 **خدمات من**:
• 🗺️ مسیریابی هوشمند (اسکله‌ها، هتل هرمز، پل رسالت، فرودگاه)
• 📞 مدیریت تماس‌ها (پشتیبانی: 07635108)
• 💰 گزارش درآمد و مالی
• 🛡️ نکات ایمنی و اطلاعات خودرو
• 📍 اطلاعات ترافیک لحظه‌ای
• 📋 قوانین رانندگی

📋 **اطلاعات خودرو شما**:
پلاک: 84 ایران 741 ط 98 | پشتیبانی: 07635108

**چه کاری می‌توانم برایتان انجام دهم؟**`;
        }
        
        return `🤔 **AI Sahel**: می‌توانم در مورد این موضوعات کمک کنم:\n\n
• 🗺️ **مسیریابی** - مسیرهای اسکله‌ها، هتل هرمز، پل رسالت
• 📞 **تماس‌ها** - پشتیبانی: 07635108
• 💰 **درآمد** - گزارش درآمد و مالی  
• 🛡️ **ایمنی** - نکات ایمنی و اطلاعات خودرو
• 📍 **ترافیک** - وضعیت ترافیک مناطق
• 📋 **قوانین** - قوانین راهنمایی و رانندگی

💡 **مثال‌ها**:
"مسیر از هتل هرمز به پارک شهر"
"شماره پشتیبانی"
"اطلاعات خودرو من"
"گزارش درآمد هفته"
"قوانین سرعت"`;
    }

    // ⏱️ زمان تخمینی عبور
    getCrossingTime(traffic) {
        const times = {
            "سبک": "2-5 دقیقه",
            "متوسط": "5-10 دقیقه", 
            "سنگین": "10-20 دقیقه",
            "خیلی سنگین": "20-30 دقیقه"
        };
        return times[traffic] || "5-10 دقیقه";
    }

    // 💡 توصیه‌های مکان‌ها
    getLocationAdvice(locationName) {
        const advice = {
            "اسکله شهید رجایی": "اسکله تجاری - ترافیک سنگین در ساعات کاری",
            "اسکله شهید باهنر": "اسکله مسافربری - پارکینگ محدود",
            "اسکله حقانی": "اسکله خصوصی - دسترسی محدود",
            "خیابان پیامبراعظم": "پارکینگ عمومی در نزدیکی میدان موجود است",
            "خیابان پل خواجو": "منطقه مسکونی - سرعت مجاز 50 کیلومتر",
            "مسیر درخت سبز": "جاده کوهستانی - احتیاط در پیچ‌ها",
            "کوه ملت": "منطقه تفریحی - پارکینگ گسترده",
            "خیابان الهیه جنوبی": "مرکز خرید - ترافیک سنگین در ساعات عصر",
            "بلوار ساحلی": "منطقه توریستی - پارکینگ محدود",
            "بلوار امام رضا": "منطقه اداری - طرح ترافیک فعال",
            "شهرک سجادیه": "منطقه مسکونی - آرامش ترافیکی",
            "شهرک توحید": "شهرک جدید - جاده‌های عریض",
            "دانشگاه پیام‌نور": "منطقه دانشجویی - ترافیک در ساعات کلاس",
            "دانشگاه آزاد": "مرکز شهر - ترافیک بسیار سنگین",
            "کوه فرهنگیان": "منطقه کوهپایه - دید زیبا",
            "سیدجمال‌الدین": "منطقه تجاری - پارکینگ مشکل",
            "چهارراه بلوکی": "مرکز شهر - دوربین فعال",
            "چهارراه فاطمیه": "میدان اصلی - چراغ راهنما طولانی",
            "سه راه پلنگ صورتی": "منطقه در حال توسعه - جاده نو",
            "سه راه سازمان": "منطقه اداری - ترافیک ساعت کار"
        };
        
        return advice[locationName] || "رعایت قوانین راهنمایی و رانندگی";
    }
}

// 📊 دیتابیس به‌روزرسانی شده
const database = {
    driver: {
        name: "رضا محمدی",
        balance: 2500000,
        car: "پژو 206",
        plate: "84 ایران 741 ط 98",
        rating: 4.8,
        license: "B12345678",
        points: 12,
        phone: "09179940272"
    },
    contacts: {
        support: "07635108",
        security: "09164321660",
        driver: "09179940272"
    },
    rides: [
        { id: 1, passenger: "علی احمدی", from: "هتل هرمز", to: "فرودگاه", price: 120000, status: "completed" },
        { id: 2, passenger: "سارا کریمی", from: "اسکله شهید رجایی", to: "پارک شهر", price: 85000, status: "active" }
    ]
};

// 🤖 ایجاد نمونه AI Sahel
const aiSahel = new AISahel();

// 📱 API هوش مصنوعی ساحل
app.post('/api/ai/sahel-chat', express.json(), async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'پیام نامعتبر است'
            });
        }

        const response = await aiSahel.processRequest(message);
        
        res.json({
            success: true,
            response: response,
            timestamp: new Date().toISOString(),
            assistant: "AI Sahel"
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'خطا در پردازش درخواست'
        });
    }
});

// 🏠 صفحه اصلی به‌روزرسانی شده
app.get('/', (req, res) => {
    res.send(`
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>AI Sahel - دستیار هوشمند رانندگی</title>
            <style>
                body { 
                    font-family: sans-serif; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white; 
                    padding: 20px;
                    margin: 0;
                    min-height: 100vh;
                }
                .container { 
                    max-width: 800px; 
                    margin: 0 auto; 
                    background: rgba(255,255,255,0.1);
                    padding: 30px;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                }
                .header { 
                    background: linear-gradient(135deg, #2c3e50, #3498db); 
                    padding: 30px; 
                    border-radius: 15px; 
                    text-align: center; 
                    margin-bottom: 20px; 
                }
                .info-card {
                    background: rgba(255,255,255,0.2);
                    padding: 20px;
                    margin: 15px 0;
                    border-radius: 10px;
                    border-left: 4px solid #3498db;
                }
                .contact-card {
                    background: rgba(255,255,255,0.2);
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 8px;
                }
                .btn {
                    display: block;
                    width: 100%;
                    padding: 15px;
                    margin: 10px 0;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    text-decoration: none;
                    text-align: center;
                    font-weight: bold;
                    font-size: 16px;
                    cursor: pointer;
                }
                .route-item {
                    background: rgba(255,255,255,0.1);
                    padding: 10px;
                    margin: 5px 0;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🤖 AI Sahel - دستیار هوشمند رانندگی</h1>
                    <p>مسیریابی هوشمند • مدیریت تماس • اطلاعات خودرو</p>
                </div>
                
                <div class="info-card">
                    <h2>🚗 اطلاعات خودرو</h2>
                    <p><strong>پلاک:</strong> 84 ایران 741 ط 98</p>
                    <p><strong>راننده:</strong> ${database.driver.name}</p>
                    <p><strong>گواهینامه:</strong> ${database.driver.license}</p>
                    <p><strong>امتیاز:</strong> ⭐ ${database.driver.rating}/5</p>
                </div>

                <div class="info-card">
                    <h2>📞 مخاطبین ضروری</h2>
                    <div class="contact-card">
                        <strong>پشتیبانی فنی:</strong> 07635108
                    </div>
                    <div class="contact-card">
                        <strong>بخش امنیتی:</strong> 09164321660
                    </div>
                    <div class="contact-card">
                        <strong>راننده:</strong> 09179940272
                    </div>
                </div>

                <div class="info-card">
                    <h2>🗺️ مناطق تحت پوشش</h2>
                    <div class="route-item">
                        <strong>اسکله شهید رجایی</strong><br>
                        <small>اسکله تجاری - منطقه بندری</small>
                    </div>
                    <div class="route-item">
                        <strong>اسکله شهید باهنر</strong><br>
                        <small>اسکله مسافربری - منطقه بندری</small>
                    </div>
                    <div class="route-item">
                        <strong>اسکله حقانی</strong><br>
                        <small>اسکله خصوصی - منطقه بندری</small>
                    </div>
                </div>

                <a href="/ai-chat" class="btn">
                    💬 شروع چت با AI Sahel
                </a>

                <div style="text-align: center; margin: 20px 0; color: #00b894;">
                    <h3>✅ AI Sahel با موفقیت راه‌اندازی شد</h3>
                    <p>همین حالا با دستیار هوشمند ما چت کنید!</p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// 🚀 راه‌اندازی سرور
app.listen(port, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║                🤖 AI Sahel v7.0                     ║
╠══════════════════════════════════════════════════════╣
║   🚀 سرور کامل روی پورت ${port} اجرا شد             ║
║   📞 پشتیبانی: 07635108                            ║
║   🚗 پلاک: 84 ایران 741 ط 98                       ║
║   🗺️ ۳ اسکله جدید تحت پوشش                        ║
║   🔥 هوش مصنوعی مسیریابی فعال                      ║
║                                                      ║
║   📱 http://localhost:${port}/                         ║
║   🤖 http://localhost:${port}/ai-chat                 ║
║                                                      ║
║   ✅ AI Sahel آماده خدمات‌رسانی!                   ║
╚══════════════════════════════════════════════════════╝
    `);
});

// 💬 صفحه چت هوش مصنوعی
app.get('/ai-chat', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>چت با AI Sahel - دستیار هوشمند رانندگی</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                body {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    padding: 20px;
                }

                .chat-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    overflow: hidden;
                }

                .chat-header {
                    background: linear-gradient(135deg, #2c3e50, #3498db);
                    color: white;
                    padding: 20px;
                    text-align: center;
                }

                .chat-header h1 {
                    font-size: 24px;
                    margin-bottom: 5px;
                }

                .chat-header p {
                    opacity: 0.9;
                    font-size: 14px;
                }

                .quick-actions {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 10px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-bottom: 1px solid #eee;
                }

                .quick-btn {
                    background: white;
                    border: 2px solid #3498db;
                    border-radius: 10px;
                    padding: 12px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: bold;
                    color: #2c3e50;
                }

                .quick-btn:hover {
                    background: #3498db;
                    color: white;
                    transform: translateY(-2px);
                }

                .chat-messages {
                    height: 400px;
                    overflow-y: auto;
                    padding: 20px;
                    background: #f8f9fa;
                }

                .message {
                    margin-bottom: 15px;
                    padding: 12px 16px;
                    border-radius: 15px;
                    max-width: 80%;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .user-message {
                    background: #3498db;
                    color: white;
                    margin-left: auto;
                    border-bottom-right-radius: 5px;
                }

                .bot-message {
                    background: white;
                    color: #2c3e50;
                    border: 1px solid #ddd;
                    margin-right: auto;
                    border-bottom-left-radius: 5px;
                }

                .chat-input-container {
                    padding: 20px;
                    background: white;
                    border-top: 1px solid #eee;
                }

                .chat-input-wrapper {
                    display: flex;
                    gap: 10px;
                }

                #chatInput {
                    flex: 1;
                    padding: 12px 16px;
                    border: 2px solid #ddd;
                    border-radius: 25px;
                    outline: none;
                    font-size: 16px;
                }

                #chatInput:focus {
                    border-color: #3498db;
                }

                #sendButton {
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background 0.3s ease;
                }

                #sendButton:hover {
                    background: #2980b9;
                }

                .typing-indicator {
                    display: none;
                    padding: 10px;
                    color: #7f8c8d;
                    font-style: italic;
                }

                .security-badge {
                    position: fixed;
                    bottom: 10px;
                    right: 10px;
                    background: #27ae60;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 15px;
                    font-size: 12px;
                }

                .back-btn {
                    display: inline-block;
                    margin: 10px;
                    padding: 10px 20px;
                    background: #6c5ce7;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <a href="/" class="back-btn">🔙 بازگشت به صفحه اصلی</a>
            
            <div class="chat-container">
                <div class="chat-header">
                    <h1>🤖 چت با AI Sahel</h1>
                    <p>دستیار هوشمند رانندگی • مسیریابی • اطلاعات ترافیک</p>
                </div>

                <div class="quick-actions">
                    <div class="quick-btn" onclick="sendQuickMessage('وضعیت ترافیک')">🚦 ترافیک</div>
                    <div class="quick-btn" onclick="sendQuickMessage('مسیر از هتل هرمز به پارک شهر')">🗺️ مسیریابی</div>
                    <div class="quick-btn" onclick="sendQuickMessage('اطلاعات خودرو من')">🚗 اطلاعات خودرو</div>
                    <div class="quick-btn" onclick="sendQuickMessage('شماره پشتیبانی')">📞 تماس</div>
                </div>

                <div class="chat-messages" id="chatMessages">
                    <div class="message bot-message">
                        <strong>AI Sahel:</strong> سلام! 👋 من دستیار هوشمند رانندگی شما هستم. می‌توانم در مورد ترافیک، مسیریابی، درآمد و ایمنی راهنماییتان کنم.
                    </div>
                </div>

                <div class="typing-indicator" id="typingIndicator">
                    AI Sahel در حال تایپ است...
                </div>

                <div class="chat-input-container">
                    <div class="chat-input-wrapper">
                        <input type="text" id="chatInput" placeholder="سوال خود را بنویسید..." onkeypress="handleKeyPress(event)">
                        <button id="sendButton" onclick="sendMessage()">ارسال</button>
                    </div>
                </div>
            </div>

            <div class="security-badge">
                🔒 امنیت فعال
            </div>

            <script>
                const chatMessages = document.getElementById('chatMessages');
                const chatInput = document.getElementById('chatInput');
                const sendButton = document.getElementById('sendButton');
                const typingIndicator = document.getElementById('typingIndicator');

                function addMessage(text, isUser = false) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
                    messageDiv.innerHTML = isUser ? 
                        '<strong>شما:</strong> ' + text : 
                        '<strong>AI Sahel:</strong> ' + text;
                    
                    chatMessages.appendChild(messageDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }

                function showTypingIndicator() {
                    typingIndicator.style.display = 'block';
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }

                function hideTypingIndicator() {
                    typingIndicator.style.display = 'none';
                }

                async function sendMessage() {
                    const message = chatInput.value.trim();
                    if (!message) return;

                    // اضافه کردن پیام کاربر
                    addMessage(message, true);
                    chatInput.value = '';

                    // نشان دادن تایپینگ
                    showTypingIndicator();

                    try {
                        const response = await fetch('/api/ai/sahel-chat', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ 
                                message: message,
                                timestamp: new Date().toISOString()
                            })
                        });
                        
                        const data = await response.json();
                        
                        // مخفی کردن تایپینگ
                        hideTypingIndicator();
                        
                        if (data.success) {
                            // جایگزینی \n با <br> برای نمایش صحیح خطوط
                            const formattedResponse = data.response.replace(/\n/g, '<br>');
                            addMessage(formattedResponse);
                        } else {
                            addMessage('⚠️ خطا در پردازش درخواست. لطفاً مجدد تلاش کنید.');
                        }
                    } catch (error) {
                        hideTypingIndicator();
                        addMessage('⚠️ خطا در ارتباط با سرور. لطفاً اتصال اینترنت را بررسی کنید.');
                    }
                }

                function sendQuickMessage(message) {
                    chatInput.value = message;
                    sendMessage();
                }

                function handleKeyPress(event) {
                    if (event.key === 'Enter') {
                        sendMessage();
                    }
                }

                // فعال کردن اینپوت هنگام لود صفحه
                window.onload = function() {
                    chatInput.focus();
                }
            </script>
        </body>
        </html>
    `);
});

// 💬 صفحه چت هوش مصنوعی
app.get('/ai-chat', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>چت با AI Sahel - دستیار هوشمند رانندگی</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }

                body {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    padding: 20px;
                }

                .chat-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    overflow: hidden;
                }

                .chat-header {
                    background: linear-gradient(135deg, #2c3e50, #3498db);
                    color: white;
                    padding: 20px;
                    text-align: center;
                }

                .chat-header h1 {
                    font-size: 24px;
                    margin-bottom: 5px;
                }

                .chat-header p {
                    opacity: 0.9;
                    font-size: 14px;
                }

                .quick-actions {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 10px;
                    padding: 15px;
                    background: #f8f9fa;
                    border-bottom: 1px solid #eee;
                }

                .quick-btn {
                    background: white;
                    border: 2px solid #3498db;
                    border-radius: 10px;
                    padding: 12px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: bold;
                    color: #2c3e50;
                }

                .quick-btn:hover {
                    background: #3498db;
                    color: white;
                    transform: translateY(-2px);
                }

                .chat-messages {
                    height: 400px;
                    overflow-y: auto;
                    padding: 20px;
                    background: #f8f9fa;
                }

                .message {
                    margin-bottom: 15px;
                    padding: 12px 16px;
                    border-radius: 15px;
                    max-width: 80%;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .user-message {
                    background: #3498db;
                    color: white;
                    margin-left: auto;
                    border-bottom-right-radius: 5px;
                }

                .bot-message {
                    background: white;
                    color: #2c3e50;
                    border: 1px solid #ddd;
                    margin-right: auto;
                    border-bottom-left-radius: 5px;
                }

                .chat-input-container {
                    padding: 20px;
                    background: white;
                    border-top: 1px solid #eee;
                }

                .chat-input-wrapper {
                    display: flex;
                    gap: 10px;
                }

                #chatInput {
                    flex: 1;
                    padding: 12px 16px;
                    border: 2px solid #ddd;
                    border-radius: 25px;
                    outline: none;
                    font-size: 16px;
                }

                #chatInput:focus {
                    border-color: #3498db;
                }

                #sendButton {
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background 0.3s ease;
                }

                #sendButton:hover {
                    background: #2980b9;
                }

                .typing-indicator {
                    display: none;
                    padding: 10px;
                    color: #7f8c8d;
                    font-style: italic;
                }

                .security-badge {
                    position: fixed;
                    bottom: 10px;
                    right: 10px;
                    background: #27ae60;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 15px;
                    font-size: 12px;
                }

                .back-btn {
                    display: inline-block;
                    margin: 10px;
                    padding: 10px 20px;
                    background: #6c5ce7;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <a href="/" class="back-btn">🔙 بازگشت به صفحه اصلی</a>
            
            <div class="chat-container">
                <div class="chat-header">
                    <h1>🤖 چت با AI Sahel</h1>
                    <p>دستیار هوشمند رانندگی • مسیریابی • اطلاعات ترافیک</p>
                </div>

                <div class="quick-actions">
                    <div class="quick-btn" onclick="sendQuickMessage('وضعیت ترافیک')">🚦 ترافیک</div>
                    <div class="quick-btn" onclick="sendQuickMessage('مسیر از هتل هرمز به پارک شهر')">🗺️ مسیریابی</div>
                    <div class="quick-btn" onclick="sendQuickMessage('اطلاعات خودرو من')">🚗 اطلاعات خودرو</div>
                    <div class="quick-btn" onclick="sendQuickMessage('شماره پشتیبانی')">📞 تماس</div>
                </div>

                <div class="chat-messages" id="chatMessages">
                    <div class="message bot-message">
                        <strong>AI Sahel:</strong> سلام! 👋 من دستیار هوشمند رانندگی شما هستم. می‌توانم در مورد ترافیک، مسیریابی، درآمد و ایمنی راهنماییتان کنم.
                    </div>
                </div>

                <div class="typing-indicator" id="typingIndicator">
                    AI Sahel در حال تایپ است...
                </div>

                <div class="chat-input-container">
                    <div class="chat-input-wrapper">
                        <input type="text" id="chatInput" placeholder="سوال خود را بنویسید..." onkeypress="handleKeyPress(event)">
                        <button id="sendButton" onclick="sendMessage()">ارسال</button>
                    </div>
                </div>
            </div>

            <div class="security-badge">
                🔒 امنیت فعال
            </div>

            <script>
                const chatMessages = document.getElementById('chatMessages');
                const chatInput = document.getElementById('chatInput');
                const sendButton = document.getElementById('sendButton');
                const typingIndicator = document.getElementById('typingIndicator');

                function addMessage(text, isUser = false) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
                    messageDiv.innerHTML = isUser ? 
                        '<strong>شما:</strong> ' + text : 
                        '<strong>AI Sahel:</strong> ' + text;
                    
                    chatMessages.appendChild(messageDiv);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }

                function showTypingIndicator() {
                    typingIndicator.style.display = 'block';
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }

                function hideTypingIndicator() {
                    typingIndicator.style.display = 'none';
                }

                async function sendMessage() {
                    const message = chatInput.value.trim();
                    if (!message) return;

                    // اضافه کردن پیام کاربر
                    addMessage(message, true);
                    chatInput.value = '';

                    // نشان دادن تایپینگ
                    showTypingIndicator();

                    try {
                        const response = await fetch('/api/ai/sahel-chat', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ 
                                message: message,
                                timestamp: new Date().toISOString()
                            })
                        });
                        
                        const data = await response.json();
                        
                        // مخفی کردن تایپینگ
                        hideTypingIndicator();
                        
                        if (data.success) {
                            // جایگزینی \n با <br> برای نمایش صحیح خطوط
                            const formattedResponse = data.response.replace(/\n/g, '<br>');
                            addMessage(formattedResponse);
                        } else {
                            addMessage('⚠️ خطا در پردازش درخواست. لطفاً مجدد تلاش کنید.');
                        }
                    } catch (error) {
                        hideTypingIndicator();
                        addMessage('⚠️ خطا در ارتباط با سرور. لطفاً اتصال اینترنت را بررسی کنید.');
                    }
                }

                function sendQuickMessage(message) {
                    chatInput.value = message;
                    sendMessage();
                }

                function handleKeyPress(event) {
                    if (event.key === 'Enter') {
                        sendMessage();
                    }
                }

                // فعال کردن اینپوت هنگام لود صفحه
                window.onload = function() {
                    chatInput.focus();
                }
            </script>
        </body>
        </html>
    `);
});

// 🤖 روت چت هوش مصنوعی
app.post('/ai-chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'پیام معتبر ارسال کنید'
            });
        }

        console.log(`📨 دریافت پیام: ${message}`);
        
        // پردازش پیام توسط هوش مصنوعی
        const response = await aiSahel.processRequest(message);
        
        res.json({
            success: true,
            response: response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ خطا در پردازش:', error);
        res.status(500).json({
            success: false,
            error: 'خطا در پردازش درخواست',
            message: error.message
        });
    }
});
