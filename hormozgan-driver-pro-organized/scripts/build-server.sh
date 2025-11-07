#!/bin/bash

echo "🚀 در حال ساخت سرور حرفه‌ای AI Sahel..."

# ایجاد فایل سرور
cat > server-v7-complete.js << 'SERVER_EOF'
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// 🧠 کلاس هوش مصنوعی ساحل (AI Sahel) - نسخه پیشرفته
class AISahel {
    constructor() {
        this.conversationHistory = new Map();
        this.supportedCommands = new Set([
            'ترافیک', 'مسیریابی', 'درآمد', 'ایمنی', 'پیش‌بینی', 
            'گزارش', 'مسیر', 'درآمد هفته', 'قوانین', 'دوربین',
            'نظارت', 'تخلف', 'جریمه', 'پلاک', 'خودرو', 'تماس'
        ]);
        
        // 🗺️ پایگاه داده کامل مکان‌های ساحل
        this.locations = {
            "اسکله شهید رجایی": { 
                type: "اسکله تجاری", 
                zone: "بندری", 
                traffic: "سنگین",
                coordinates: "36.6786° N, 51.4190° E",
                facilities: ["پارکینگ", "گمرک", "امنیت"]
            },
            "اسکله شهید باهنر": { 
                type: "اسکله مسافربری", 
                zone: "بندری", 
                traffic: "متوسط",
                coordinates: "36.6812° N, 51.4215° E",
                facilities: ["انتظار", "بوفه", "اطلاعات"]
            },
            "اسکله حقانی": { 
                type: "اسکله خصوصی", 
                zone: "بندری", 
                traffic: "سبک",
                coordinates: "36.6750° N, 51.4168° E",
                facilities: ["دسترسی محدود", "امنیت بالا"]
            },
            "خیابان پیامبراعظم": { 
                type: "خیابان اصلی", 
                zone: "مرکزی", 
                traffic: "متوسط",
                coordinates: "36.6820° N, 51.4250° E",
                facilities: ["مراکز خرید", "ادارات"]
            },
            "هتل هرمز": { 
                type: "هتل", 
                zone: "ساحلی", 
                traffic: "متوسط",
                coordinates: "36.6845° N, 51.4280° E",
                facilities: ["پارکینگ", "رستوران", "اینترنت"]
            },
            "فرودگاه ساحل": { 
                type: "فرودگاه", 
                zone: "شرقی", 
                traffic: "سنگین",
                coordinates: "36.6650° N, 51.4450° E",
                facilities: ["ترمینال", "پارکینگ", "کافی‌شاپ"]
            }
        };

        // 🚗 اطلاعات خودروها
        this.vehicles = {
            "84 ایران 741 ط 98": {
                model: "پژو 206",
                year: 1400,
                color: "سفید",
                owner: "رضا محمدی",
                insurance: "بیمه ایران 1403123456",
                technicalExam: "1403/12/15"
            }
        };

        // 📞 اطلاعات تماس
        this.contacts = {
            "پشتیبانی": { number: "07635108", department: "فنی" },
            "امنیتی": { number: "09164321660", department: "امنیت" },
            "راننده": { number: "09179940272", department: "عملیات" },
            "مدیریت": { number: "07635109", department: "اداری" }
        };
    }

    // ✅ اعتبارسنجی پیشرفته ورودی
    validateInput(input) {
        if (typeof input !== 'string' || input.length === 0) {
            throw new Error('ورودی نمی‌تواند خالی باشد');
        }
        if (input.length > 500) {
            throw new Error('طول پیام نباید بیش از ۵۰۰ کاراکتر باشد');
        }
        
        const dangerousPatterns = /[<>{}[\]$`\\]|script|javascript|onload/gi;
        if (dangerousPatterns.test(input)) {
            throw new Error('ورودی شامل کدهای خطرناک است');
        }
        
        return true;
    }

    // 🔍 تشخیص قصد کاربر با الگوریتم پیشرفته
    detectIntent(userInput) {
        const input = userInput.toLowerCase().trim();
        
        const intents = {
            greeting: /(سلام|سلامتی|درود|hello|hi)/,
            traffic: /(ترافیک|شلوغ|توقف|انتظار)/,
            navigation: /(مسیر|راه|نقشه|مسیریابی|برو به|ناوبری)/,
            contact: /(تماس|شماره|تلفن|زنگ|call|phone)/,
            vehicle: /(پلاک|خودرو|ماشین|vehicle|car)/,
            income: /(درآمد|حقوق|پول|دریافتی|income|money)/,
            safety: /(ایمنی|خطر|حوادث|safe|security)/,
            regulations: /(قانون|مقررات|آیین نامه|تخلف|جریمه)/,
            location: /(کجاست|کجا|موقعیت|location|where)/,
            help: /(کمک|راهنما|help|راهنمایی)/
        };

        for (const [intent, pattern] of Object.entries(intents)) {
            if (pattern.test(input)) {
                return intent;
            }
        }
        
        return 'general';
    }

    // 🚗 پردازش هوشمند درخواست‌ها
    async processRequest(userInput, sessionId = 'default') {
        try {
            this.validateInput(userInput);
            
            // ذخیره تاریخچه مکالمه
            if (!this.conversationHistory.has(sessionId)) {
                this.conversationHistory.set(sessionId, []);
            }
            
            const history = this.conversationHistory.get(sessionId);
            history.push({ role: 'user', content: userInput, timestamp: new Date() });
            
            // تشخیص قصد کاربر
            const intent = this.detectIntent(userInput);
            
            let response;
            switch (intent) {
                case 'greeting':
                    response = this.handleGreeting(userInput);
                    break;
                case 'traffic':
                    response = this.handleTrafficRequest(userInput);
                    break;
                case 'navigation':
                    response = this.handleNavigationRequest(userInput);
                    break;
                case 'contact':
                    response = this.handleContactRequest(userInput);
                    break;
                case 'vehicle':
                    response = this.handleVehicleRequest(userInput);
                    break;
                case 'income':
                    response = this.handleIncomeRequest(userInput);
                    break;
                case 'safety':
                    response = this.handleSafetyRequest(userInput);
                    break;
                case 'regulations':
                    response = this.handleRegulationsRequest(userInput);
                    break;
                case 'location':
                    response = this.handleLocationRequest(userInput);
                    break;
                case 'help':
                    response = this.handleHelpRequest(userInput);
                    break;
                default:
                    response = this.handleGeneralRequest(userInput);
            }
            
            // ذخیره پاسخ در تاریخچه
            history.push({ role: 'assistant', content: response, timestamp: new Date() });
            
            // محدود کردن سایز تاریخچه
            if (history.length > 10) {
                this.conversationHistory.set(sessionId, history.slice(-10));
            }
            
            return response;
            
        } catch (error) {
            console.error('خطا در پردازش درخواست:', error);
            return `⚠️ خطا: ${error.message}\n\nلطفاً پیام خود را مجدداً ارسال کنید.`;
        }
    }

    // 👋 مدیریت سلام و احوالپرسی
    handleGreeting(input) {
        const greetings = [
            "👋 سلام! من AI Sahel هستم - دستیار هوشمند رانندگی شما 🌊",
            "🌅 درود! به سیستم هوشمند ساحل خوش آمدید",
            "🚗 سلام راننده عزیز! چطور می‌تونم خدمتتون باشم؟"
        ];
        
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        
        return `${randomGreeting}

📋 **خدمات موجود**:
• 🗺️ مسیریابی هوشمند و ترافیک
• 📞 مدیریت تماس و مخاطبین  
• 🚗 اطلاعات خودرو و پلاک
• 💰 گزارش درآمد و مالی
• 🛡️ نکات ایمنی و امنیتی
• 📋 قوانین و مقررات رانندگی

💡 **برای شروع، یکی از خدمات بالا رو انتخاب کنید**`;
    }

    // 🚦 مدیریت درخواست‌های ترافیکی
    handleTrafficRequest(input) {
        const trafficData = this.analyzeTrafficPatterns();
        
        return `🚦 **گزارش لحظه‌ای ترافیک ساحل**\n\n${trafficData.report}\n\n🕒 به‌روزرسانی: ${new Date().toLocaleTimeString('fa-IR')}`;
    }

    // 🗺️ مدیریت درخواست‌های مسیریابی
    handleNavigationRequest(input) {
        const routes = this.calculateOptimalRoutes(input);
        return `🗺️ **پیشنهاد مسیر بهینه**\n\n${routes.primary}\n\n🎯 **مسیر جایگزین**: ${routes.alternative}`;
    }

    // 📞 مدیریت درخواست‌های تماس
    handleContactRequest(input) {
        const contact = this.findContact(input);
        return `📞 **اطلاعات تماس**\n\n${contact.details}\n\n⏰ **ساعات کاری**: ${contact.hours}`;
    }

    // 🚗 مدیریت درخواست‌های خودرو
    handleVehicleRequest(input) {
        const vehicleInfo = this.getVehicleDetails(input);
        return `🚗 **اطلاعات کامل خودرو**\n\n${vehicleInfo}`;
    }

    // 💰 مدیریت درخواست‌های درآمد
    handleIncomeRequest(input) {
        const incomeReport = this.generateIncomeReport();
        return `💰 **گزارش مالی**\n\n${incomeReport}`;
    }

    // 🛡️ مدیریت درخواست‌های ایمنی
    handleSafetyRequest(input) {
        const safetyTips = this.getSafetyRecommendations();
        return `🛡️ **توصیه‌های ایمنی**\n\n${safetyTips}`;
    }

    // 📋 مدیریت درخواست‌های قوانین
    handleRegulationsRequest(input) {
        const regulations = this.getTrafficRegulations();
        return `📋 **قوانین راهنمایی و رانندگی**\n\n${regulations}`;
    }

    // 📍 مدیریت درخواست‌های موقعیت
    handleLocationRequest(input) {
        const location = this.findLocation(input);
        return `📍 **اطلاعات موقعیت**\n\n${location}`;
    }

    // ❓ مدیریت درخواست‌های راهنما
    handleHelpRequest(input) {
        return this.getHelpGuide();
    }

    // 🔄 مدیریت درخواست‌های عمومی
    handleGeneralRequest(input) {
        return `🤔 **AI Sahel**\n\nمتوجه منظورتون نشدم! می‌تونم در مورد این موضوعات کمک کنم:\n\n${this.getAvailableServices()}\n\n💡 **مثال**: "وضعیت ترافیک اسکله رجایی چطوره؟"`;
    }

    // 📊 آنالیز الگوهای ترافیکی
    analyzeTrafficPatterns() {
        const currentHour = new Date().getHours();
        let trafficLevel = "متوسط";
        
        if ((currentHour >= 7 && currentHour <= 9) || (currentHour >= 16 && currentHour <= 18)) {
            trafficLevel = "سنگین";
        } else if (currentHour >= 22 || currentHour <= 5) {
            trafficLevel = "سبک";
        }

        const report = `🕒 **ساعت فعلی**: ${currentHour}:00
🚦 **وضعیت کلی**: ${this.getTrafficIcon(trafficLevel)} ${trafficLevel}

📍 **مناطق پرترافیک**:
• اسکله شهید رجایی: 🔴 سنگین
• فرودگاه ساحل: 🔴 سنگین  
• خیابان پیامبراعظم: 🟡 متوسط

📍 **مناطق کم‌ترافیک**:
• اسکله حقانی: 🟢 سبک
• هتل هرمز: 🟢 سبک

⚠️ **هشدارها**:
• تعمیرات جاده‌ای در بلوار ساحلی
• دوربین سرعت فعال در مرکز شهر`;

        return { report, level: trafficLevel };
    }

    // 🗺️ محاسبه مسیرهای بهینه
    calculateOptimalRoutes(input) {
        const routes = {
            "هتل هرمز به فرودگاه": {
                primary: "⏱️ ۲۵ دقیقه - ۱۸ کیلومتر\n📍 مسیر اصلی: بلوار ساحلی → جاده کمربندی",
                alternative: "⏱️ ۳۰ دقیقه - ۲۰ کیلومتر\n📍 مسیر جایگزین: خیابان فرهنگ → پل زیبا"
            },
            "اسکله رجایی به هتل هرمز": {
                primary: "⏱️ ۱۵ دقیقه - ۸ کیلومتر\n📍 مسیر اصلی: جاده بندری → بلوار ساحلی",
                alternative: "⏱️ ۲۰ دقیقه - ۱۰ کیلومتر\n📍 مسیر جایگزین: خیابان صنعت → میدان مرکزی"
            }
        };

        for (const [route, info] of Object.entries(routes)) {
            if (input.toLowerCase().includes(route.toLowerCase())) {
                return info;
            }
        }

        return {
            primary: "⏱️ ۲۰ دقیقه - ۱۲ کیلومتر\n📍 مسیر پیشفرض: مسیر بهینه بر اساس ترافیک",
            alternative: "⏱️ ۲۵ دقیقه - ۱۴ کیلومتر\n📍 مسیر جایگزین: دوری از مناطق شلوغ"
        };
    }

    // 🔍 پیدا کردن مخاطب
    findContact(input) {
        for (const [name, info] of Object.entries(this.contacts)) {
            if (input.toLowerCase().includes(name.toLowerCase())) {
                return {
                    details: `**${name}**: ${info.number}\n📋 بخش: ${info.department}`,
                    hours: "۲۴ ساعته - ۷ روز هفته"
                };
            }
        }

        return {
            details: `📞 **همه مخاطبین**:\n${Object.entries(this.contacts).map(([name, info]) => `• ${name}: ${info.number}`).join('\n')}`,
            hours: "۸:۰۰ تا ۲۰:۰۰"
        };
    }

    // 🚗 دریافت اطلاعات خودرو
    getVehicleDetails(input) {
        const vehicle = this.vehicles["84 ایران 741 ط 98"];
        return `🔢 **پلاک**: 84 ایران 741 ط 98
🏷️ **مدل**: ${vehicle.model}
🎨 **رنگ**: ${vehicle.color}
📅 **سال ساخت**: ${vehicle.year}
👤 **مالک**: ${vehicle.owner}
📜 **بیمه**: ${vehicle.insurance}
🔧 **معاینه فنی**: ${vehicle.technicalExam}

⭐ **امتیاز راننده**: ۴.۸/۵
💰 **درآمد ماهانه**: ۱۴,۸۸۰,۰۰۰ تومان
📊 **سفرهای موفق**: ۹۸٪`;
    }

    // 💰 تولید گزارش درآمد
    generateIncomeReport() {
        const weeklyIncome = {
            "شنبه": 450000,
            "یکشنبه": 520000,
            "دوشنبه": 380000,
            "سه‌شنبه": 610000,
            "چهارشنبه": 490000,
            "پنجشنبه": 550000,
            "جمعه": 720000
        };

        const total = Object.values(weeklyIncome).reduce((sum, income) => sum + income, 0);
        const average = Math.round(total / 7);

        return `📅 **هفته جاری**:
${Object.entries(weeklyIncome).map(([day, amount]) => `• ${day}: ${amount.toLocaleString()} تومان`).join('\n')}

💰 **جمع کل**: ${total.toLocaleString()} تومان
📈 **میانگین روزانه**: ${average.toLocaleString()} تومان
🎯 **پیش‌بینی ماه**: ۱۶,۰۰۰,۰۰۰ تومان

💡 **نکات افزایش درآمد**:
• فعالیت در ساعات ۷-۹ صبح و ۴-۶ عصر
• تمرکز بر مناطق اسکله رجایی و فرودگاه
• ارائه خدمات ویژه به مسافران هتل هرمز`;
    }

    // 🛡️ دریافت توصیه‌های ایمنی
    getSafetyRecommendations() {
        return `🚗 **ایمنی خودرو**:
• بررسی فشار باد لاستیک‌ها هفتگی
• تست ترمز در مسیرهای امن
• کنترل چراغ‌ها و راهنماها

🛣️ **ایمنی مسیر**:
• سرعت مطمئنه در جاده‌های کوهستانی: ۶۰ کیلومتر
• فاصله ایمنی در آزادراه: ۳ ثانیه
• احتیاط در پیچ‌های تند

👤 **ایمنی شخصی**:
• کمربند ایمنی همیشه
• عدم استفاده از تلفن هنگام رانندگی
• استراحت هر ۲ ساعت

📞 **تماس‌های اضطراری**:
• پشتیبانی: 07635108
• امنیت: 09164321660
• اورژانس: 115`;
    }

    // 📋 دریافت قوانین رانندگی
    getTrafficRegulations() {
        return `🚦 **محدودیت‌های سرعت**:
• مناطق مسکونی: ۵۰ کیلومتر
• خیابان‌های اصلی: ۶۰ کیلومتر  
• آزادراه: ۱۱۰ کیلومتر
• جاده‌های کوهستانی: ۷۰ کیلومتر

🚫 **تخلفات گران**:
• عبور از چراغ قرمز: ۱,۰۰۰,۰۰۰ تومان
• سرعت غیرمجاز: ۵۰۰,۰۰۰ تومان
• سبقت غیرمجاز: ۸۰۰,۰۰۰ تومان
• استفاده از تلفن: ۳۰۰,۰۰۰ تومان

✅ **الزامات**:
• گواهینامه معتبر
• کارت خودرو و بیمه
• معاینه فنی سالیانه
• کمربند ایمنی برای همه

⚠️ **سیستم نظارتی ساحل**:
• دوربین سرعت در ۱۰ نقطه
• کنترل پلیس در مناطق مرکزی
• مانورهای غافلگیرانه`;
    }

    // 📍 پیدا کردن موقعیت
    findLocation(input) {
        for (const [name, info] of Object.entries(this.locations)) {
            if (input.toLowerCase().includes(name.toLowerCase())) {
                return `**${name}**
🏷️ نوع: ${info.type}
🗺️ منطقه: ${info.zone}  
🚦 ترافیک: ${this.getTrafficIcon(info.traffic)} ${info.traffic}
📍 مختصات: ${info.coordinates}
🎯 امکانات: ${info.facilities.join('، ')}`;
            }
        }

        return "📍 موقعیت مورد نظر یافت نشد. لطفاً نام دقیق‌تر ارائه دهید.";
    }

    // ❓ دریافت راهنمای کمک
    getHelpGuide() {
        return `📚 **راهنمای استفاده از AI Sahel**\n\n${this.getAvailableServices()}\n\n💡 **نکات مهم**:
• پیام‌های خود را به فارسی ساده بنویسید
• برای مسیریابی، مبدأ و مقصد را مشخص کنید
• شماره تماس‌ها همیشه در دسترس هستند
• گزارش ترافیک هر ۱۵ دقیقه به‌روز می‌شود

📞 **پشتیبانی**: 07635108
🛠️ **نسخه**: ۷.۰.۰ حرفه‌ای`;
    }

    // 🎯 دریافت خدمات موجود
    getAvailableServices() {
        return `• 🗺️ **مسیریابی**: "مسیر از هتل هرمز به فرودگاه"
• 📞 **تماس**: "شماره پشتیبانی" یا "تماس با امنیت"
• 🚗 **خودرو**: "اطلاعات پلاک" یا "مشخصات خودرو"
• 💰 **درآمد**: "گزارش درآمد" یا "حقوق هفته"
• 🛡️ **ایمنی**: "توصیه ایمنی" یا "قوانین رانندگی"
• 📍 **موقعیت**: "اسکله رجایی کجاست؟"
• 🚦 **ترافیک**: "وضعیت ترافیک" یا "ترافیک اسکله"`;
    }

    // 🚦 آیکون ترافیک
    getTrafficIcon(traffic) {
        const icons = {
            "سبک": "🟢",
            "متوسط": "🟡",
            "سنگین": "🔴"
        };
        return icons[traffic] || "🟡";
    }

    // 💾 دریافت تاریخچه مکالمه
    getConversationHistory(sessionId) {
        return this.conversationHistory.get(sessionId) || [];
    }

    // 🗑️ پاک کردن تاریخچه
    clearConversationHistory(sessionId) {
        this.conversationHistory.delete(sessionId);
    }
}

// 🤖 ایجاد نمونه AI Sahel
const aiSahel = new AISahel();

// 📊 دیتابیس پیشرفته
const database = {
    driver: {
        name: "رضا محمدی",
        balance: 14880000,
        car: "پژو 206",
        plate: "84 ایران 741 ط 98",
        rating: 4.8,
        license: "B12345678",
        points: 12,
        phone: "09179940272",
        totalRides: 347,
        successRate: 98.2
    },
    contacts: {
        support: { number: "07635108", department: "فنی", available: true },
        security: { number: "09164321660", department: "امنیت", available: true },
        driver: { number: "09179940272", department: "عملیات", available: true },
        management: { number: "07635109", department: "اداری", available: false }
    },
    rides: [
        { 
            id: 1, 
            passenger: "علی احمدی", 
            from: "هتل هرمز", 
            to: "فرودگاه ساحل", 
            price: 120000, 
            status: "completed",
            rating: 5,
            duration: "25 دقیقه"
        },
        { 
            id: 2, 
            passenger: "سارا کریمی", 
            from: "اسکله شهید رجایی", 
            to: "هتل هرمز", 
            price: 85000, 
            status: "active",
            rating: null,
            duration: "15 دقیقه"
        }
    ]
};

// 🎯 روت‌های اصلی سرور

// 🏠 صفحه اصلی
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Sahel - سرور حرفه‌ای</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0;
                    padding: 20px;
                    color: #333;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .logo {
                    font-size: 3em;
                    margin-bottom: 10px;
                }
                .title {
