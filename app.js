// Hormozgan Driver Pro - نسخه هوشمند با قوانین رانندگی
const express = require('express');
const app = express();
const port = 8080;

// دیتابیس ساده
const database = {
    driver: {
        name: "رضا محمدی",
        balance: 2500000,
        car: "پژو 206",
        rating: 4.8,
        license: "B12345678",
        points: 12
    },
    rides: [
        { id: 1, passenger: "علی احمدی", from: "میدان آزادی", to: "فرودگاه", price: 120000, status: "completed" },
        { id: 2, passenger: "سارا کریمی", from: "خیابان امام", to: "پل زیبا", price: 85000, status: "active" }
    ]
};

// ماژول پخش موسیقی محلی
const musicPlayer = {
    name: "موريک پلیم خرفه‌ای",
    description: "پخش آهنگ‌های محلی هم‌رگان با اکوالینز پیش‌رفته، کنترل باس و محیط تاریک مدرن",
    status: "آماده پخش",
    currentSong: null,
    playlist: [
        { id: 1, title: "آهنگ محلی بندری ۱", artist: "هنرمند هرمزگانی", duration: "3:45" },
        { id: 2, title: "ترانه دریایی", artist: "خواننده محلی", duration: "4:20" },
        { id: 3, title: "موسیقی سنتی جنوب", artist: "گروه محلی", duration: "5:15" }
    ],
    
    play: function(songId = null) {
        if (songId) {
            this.currentSong = this.playlist.find(song => song.id === songId);
        } else if (!this.currentSong) {
            this.currentSong = this.playlist[0];
        }
        this.status = "در حال پخش: " + this.currentSong.title;
        return `🎵 در حال پخش: ${this.currentSong.title} - ${this.currentSong.artist}`;
    },
    
    pause: function() {
        this.status = "متوقف شده";
        return "⏸️ پخش موسیقی متوقف شد";
    },
    
    next: function() {
        const currentIndex = this.playlist.findIndex(song => song.id === this.currentSong.id);
        const nextIndex = (currentIndex + 1) % this.playlist.length;
        this.currentSong = this.playlist[nextIndex];
        return this.play();
    },
    
    setEqualizer: function(bass = 0, treble = 0) {
        return `🎛️ اکوالایزر تنظیم شد - باس: ${bass}dB, تریبل: ${treble}dB`;
    }
};

// ماژول سیستم تماس ویدیویی
const videoCallSystem = {
    name: "سیستم کاس ویذیتین",
    description: "کاس آنالین با مسافران و پشتیبانی، ارتباط تصویری با کیفیت بالا و رابط کاربری مدرن",
    status: "آماده برای برقراری تماس",
    activeCall: null,
    contacts: [
        { id: 1, name: "پشتیبانی فنی", type: "پشتیبانی", online: true },
        { id: 2, name: "مسافر فعلی", type: "مسافر", online: false },
        { id: 3, name: "مرکز کنترل ترافیک", type: "اداری", online: true }
    ],
    
    startCall: function(contactId) {
        const contact = this.contacts.find(c => c.id === contactId);
        if (!contact) return "❌ مخاطب یافت نشد";
        
        if (!contact.online) return `❌ ${contact.name} در دسترس نیست`;
        
        this.activeCall = {
            contact: contact,
            startTime: new Date(),
            status: "فعال"
        };
        this.status = `در حال تماس با ${contact.name}`;
        
        return `📞 تماس ویدیویی با ${contact.name} برقرار شد\n` +
               `⏰ زمان شروع: ${this.activeCall.startTime.toLocaleTimeString('fa-IR')}\n` +
               `🔊 کیفیت: HD 720p`;
    },
    
    endCall: function() {
        if (!this.activeCall) return "❌ هیچ تماس فعالی وجود ندارد";
        
        const endTime = new Date();
        const duration = Math.round((endTime - this.activeCall.startTime) / 1000 / 60);
        const contactName = this.activeCall.contact.name;
        
        this.activeCall = null;
        this.status = "آماده برای برقراری تماس";
        
        return `📞 تماس با ${contactName} پایان یافت\n` +
               `⏱️ مدت تماس: ${duration} دقیقه`;
    },
    
    toggleVideo: function() {
        return "📹 وضعیت دوربین تغییر کرد";
    },
    
    toggleMute: function() {
        return "🔇 وضعیت صدا تغییر کرد";
    }
};

// 📋 دیکتاتور قوانین رانندگی
const trafficDictator = {
    // آیین نامه رانندگی
    regulations: {
        speedLimits: {
            "شهری": "50 کیلومتر بر ساعت",
            "شهری اصلی": "60 کیلومتر بر ساعت", 
            "برون شهری": "80 کیلومتر بر ساعت",
            "آزادراه": "110 کیلومتر بر ساعت",
            "جاده های کوهستانی": "70 کیلومتر بر ساعت"
        },
        violations: {
            "عبور از چراغ قرمز": "جریمه 1,000,000 تومان - 3 امتیاز منفی",
            "سرعت غیرمجاز": "جریمه 500,000 تومان - 2 امتیاز منفی",
            "سبقت غیرمجاز": "جریمه 800,000 تومان - 3 امتیاز منفی",
            "استفاده از تلفن همراه": "جریمه 300,000 تومان - 1 امتیاز منفی",
            "نداشتن کمربند": "جریمه 200,000 تومان - 1 امتیاز منفی"
        },
        mandatory: [
            "کمربند ایمنی برای تمام سرنشینان اجباری است",
            "گواهینامه معتبر همراه راننده باشد",
            "کارت خودرو و بیمه نامه معتبر",
            "معاینه فنی خودرو هر سال تمدیر شود",
            "عدم مصرف مشروبات الکلی و مواد مخدر"
        ]
    },

    // 🚦 سیستم نظارتی هوشمند
    surveillance: {
        cameras: {
            "میدان آزادی": "دوربین ثبت سرعت فعال",
            "بلوار ساحلی": "دوربین چراغ قرمز فعال", 
            "فرودگاه": "دوربین ثبت خطای عبور",
            "پل خلیج فارس": "دوربین ثبت سبقت غیرمجاز",
            "بیمارستان": "دوربین منطقه طرح ترافیک"
        },
        trafficLights: {
            "قرمز": "توقف کامل - عبور ممنوع",
            "زرد": "آماده توقف - عبور ممنوع",
            "سبز": "عبور آزاد",
            "چشمک زن زرد": "احتیاط و کاهش سرعت",
            "چشمک زن قرمز": "توقف و سپس عبور"
        },
        warnings: {
            "دوربین سرعت": "⚠️ کاهش سرعت - دوربین فعال",
            "کنترل پلیس": "👮 توقف برای بازرسی",
            "جاده لغزنده": "💧 کاهش سرعت - فاصله زیاد",
            "تعمیرات جاده": "🚧 کاهش سرعت - تغییر مسیر",
            "عبور عابر پیاده": "🚶 توقف کامل - حق تقدم عابر"
        }
    },

    // 🗺️ مسیرهای هوشمند
    smartRoutes: {
        current: {
            "ترافیک": "میانگین",
            "زمان تخمینی": "25 دقیقه", 
            "مسافت": "18 کیلومتر",
            "هشدارها": ["دوربین سرعت در میدان آزادی", "طرح ترافیک مرکز شهر"]
        },
        alternatives: [
            {
                "نام": "مسیر ساحلی",
                "زمان": "28 دقیقه",
                "مزایا": ["ترافیک کم", "بدون طرح ترافیک"],
                "معایب": ["مسافت بیشتر"]
            },
            {
                "نام": "مسیر سریع", 
                "زمان": "22 دقیقه",
                "مزایا": ["کوتاهترین زمان"],
                "معایب": ["ترافیک سنگین", "دوربین های فعال"]
            }
        ]
    },

    // 🔍 تحلیل تخلفات
    analyzeViolation: (description) => {
        const desc = description.toLowerCase();
        let result = {
            violation: "",
            fine: 0,
            points: 0,
            warning: ""
        };

        if (desc.includes('سرعت') || desc.includes('تجاوز')) {
            result.violation = "سرعت غیرمجاز";
            result.fine = 500000;
            result.points = 2;
            result.warning = "⚠️ کنترل سرعت در مناطق مسکونی";
        }
        else if (desc.includes('چراغ') || desc.includes('قرمز')) {
            result.violation = "عبور از چراغ قرمز";
            result.fine = 1000000;
            result.points = 3;
            result.warning = "🚨 تخلف خطرناک - تعلیق گواهینامه احتمالی";
        }
        else if (desc.includes('سبقت') || desc.includes('خط')) {
            result.violation = "سبقت غیرمجاز";
            result.fine = 800000;
            result.points = 3;
            result.warning = "⚠️ سبقت فقط در راه های مستقیم و با دید کافی";
        }
        else if (desc.includes('تلفن') || desc.includes('موبایل')) {
            result.violation = "استفاده از تلفن همراه";
            result.fine = 300000;
            result.points = 1;
            result.warning = "📵 استفاده از هندزفری مجاز است";
        }

        return result;
    },

    // 🎯 سیستم امتیازدهی
    pointSystem: {
        checkStatus: (currentPoints) => {
            if (currentPoints <= 3) {
                return "🔴 وضعیت بحرانی - خطر تعلیق گواهینامه";
            } else if (currentPoints <= 6) {
                return "🟡 وضعیت هشدار - احتیاط در رانندگی";
            } else {
                return "🟢 وضعیت عادی - امتیاز کافی";
            }
        },
        calculatePoints: (violations) => {
            let totalPoints = 12;
            violations.forEach(violation => {
                totalPoints -= violation.points;
            });
            return Math.max(0, totalPoints);
        }
    }
};

// 🤖 هوش مصنوعی پیشرفته
const aiAssistant = {
    analyzeQuestion: (question) => {
        const q = question.toLowerCase();
        
        // قوانین و آیین نامه
        if (q.includes('قانون') || q.includes('آیین نامه') || q.includes('مقررات')) {
            let response = "📋 قوانین راهنمایی و رانندگی:\n\n";
            response += "🚗 محدودیت های سرعت:\n";
            Object.entries(trafficDictator.regulations.speedLimits).forEach(([area, limit]) => {
                response += `• ${area}: ${limit}\n`;
            });
            
            response += "\n🚫 تخلفات مهم:\n";
            Object.entries(trafficDictator.regulations.violations).forEach(([violation, penalty]) => {
                response += `• ${violation}: ${penalty}\n`;
            });
            
            response += "\n✅ الزامات:\n";
            trafficDictator.regulations.mandatory.forEach(req => {
                response += `• ${req}\n`;
            });
            
            return response;
        }
        
        // سیستم نظارتی
        else if (q.includes('دوربین') || q.includes('نظارت') || q.includes('کنترل')) {
            let response = "👁️ سیستم نظارتی هوشمند:\n\n";
            response += "📹 دوربین های فعال:\n";
            Object.entries(trafficDictator.surveillance.cameras).forEach(([location, type]) => {
                response += `• ${location}: ${type}\n`;
            });
            
            response += "\n🚦 چراغ های راهنما:\n";
            Object.entries(trafficDictator.surveillance.trafficLights).forEach(([color, meaning]) => {
                response += `• ${color}: ${meaning}\n`;
            });
            
            response += "\n⚠️ هشدارهای لحظه ای:\n";
            Object.entries(trafficDictator.surveillance.warnings).forEach(([type, action]) => {
                response += `• ${type}: ${action}\n`;
            });
            
            return response;
        }
        
        // مسیرهای هوشمند
        else if (q.includes('مسیر') || q.includes('راه') || q.includes('مسیریابی')) {
            let response = "🗺️ مسیرهای هوشمند:\n\n";
            response += "📍 وضعیت فعلی:\n";
            Object.entries(trafficDictator.smartRoutes.current).forEach(([key, value]) => {
                response += `• ${key}: ${value}\n`;
            });
            
            response += "\n🔄 مسیرهای جایگزین:\n";
            trafficDictator.smartRoutes.alternatives.forEach(route => {
                response += `\n📌 ${route.name}:\n`;
                response += `⏱️ زمان: ${route.time}\n`;
                response += `✅ مزایا: ${route.madvantages.join('، ')}\n`;
                response += `❌ معایب: ${route.disadvantages.join('، ')}\n`;
            });
            
            return response;
        }
        
        // تحلیل تخلف
        else if (q.includes('تخلف') || q.includes('جریمه') || q.includes('امتیاز')) {
            const violation = trafficDictator.analyzeViolation(q);
            if (violation.violation) {
                return `🔍 تحلیل تخلف:\n\n` +
                       `🚫 تخلف: ${violation.violation}\n` +
                       `💰 جریمه: ${violation.fine.toLocaleString()} تومان\n` +
                       `📉 امتیاز منفی: ${violation.points} امتیاز\n` +
                       `⚠️ هشدار: ${violation.warning}\n\n` +
                       `📊 وضعیت امتیاز شما: ${trafficDictator.pointSystem.checkStatus(database.driver.points)}`;
            } else {
                return "لطفاً نوع تخلف را مشخص کنید (سرعت، چراغ قرمز، سبقت، ...)";
            }
        }
        
        // وضعیت امتیاز
        else if (q.includes('وضعیت') || q.includes('امتیاز من')) {
            return `📊 وضعیت گواهینامه:\n\n` +
                   `👤 راننده: ${database.driver.name}\n` +
                   `📜 گواهینامه: ${database.driver.license}\n` +
                   `⭐ امتیاز باقیمانده: ${database.driver.points} از 12\n` +
                   `🔍 وضعیت: ${trafficDictator.pointSystem.checkStatus(database.driver.points)}`;
        }
        
        // ترافیک
        else if (q.includes('ترافیک')) {
            return "🚦 وضعیت ترافیک:\n\n" +
                   "• میدان آزادی: 🟡 متوسط\n" +
                   "• بلوار ساحلی: 🟢 روان\n" + 
                   "• مرکز شهر: 🔴 سنگین\n" +
                   "• فرودگاه: 🟡 متوسط\n" +
                   "• پل زیبا: 🟢 روان\n\n" +
                   "⚠️ هشدار: دوربین سرعت در میدان آزادی فعال است";
        }

        // موسیقی و سرگرمی
        else if (q.includes('موسیقی') || q.includes('آهنگ') || q.includes('پخش')) {
            if (q.includes('توقف') || q.includes('پایان')) {
                return musicPlayer.pause();
            } else if (q.includes('بعدی')) {
                return musicPlayer.next();
            } else {
                return musicPlayer.play();
            }
        }

        // تماس ویدیویی
        else if (q.includes('تماس') || q.includes('کال') || q.includes('ویدیو')) {
            if (q.includes('پایان') || q.includes('قطع')) {
                return videoCallSystem.endCall();
            } else if (q.includes('پشتیبانی')) {
                return videoCallSystem.startCall(1);
            } else if (q.includes('ترافیک')) {
                return videoCallSystem.startCall(3);
            } else {
                return "📞 برای برقراری تماس ویدیویی:\n" +
                       "• 'تماس با پشتیبانی'\n" +
                       "• 'تماس با مرکز ترافیک'\n" +
                       "• 'پایان تماس'";
            }
        }
        
        else if (q.includes('سلام')) {
            return "👋 سلام! من دستیار هوشمند رانندگی شما هستم.\n\n" +
                   "می‌تونم در مورد:\n" +
                   "• 📋 قوانین و آیین نامه رانندگی\n" +
                   "• 👁️ سیستم نظارتی و دوربین ها\n" +
                   "• 🗺️ مسیرهای هوشمند و ترافیک\n" +
                   "• 🔍 تحلیل تخلفات و جرائم\n" +
                   "• 📊 وضعیت امتیاز گواهینامه\n" +
                   "• 🎵 پخش موسیقی محلی\n" +
                   "• 📞 تماس ویدیویی\n\n" +
                   "راهنماییتون کنم. چه سوالی دارید؟";
        }
        
        else {
            return "🤔 سوال خود را در یکی از زمینه های زیر مطرح کنید:\n\n" +
                   "• 'قوانین رانندگی' - 📋\n" +
                   "• 'دوربین ها کجا هستن؟' - 👁️\n" +
                   "• 'بهترین مسیر کدام است؟' - 🗺️\n" +
                   "• 'تخلف سرعت چه جریمه دارد؟' - 🔍\n" +
                   "• 'وضعیت امتیاز من' - 📊\n" +
                   "• 'وضعیت ترافیک' - 🚦\n" +
                   "• 'پخش موسیقی' - 🎵\n" +
                   "• 'تماس با پشتیبانی' - 📞";
        }
    }
};

// صفحه اصلی با سیستم نظارتی
app.get('/', (req, res) => {
    res.send(`
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>سیستم رانندگی هوشمند هرمزگان</title>
            <style>
                body { font-family: sans-serif; background: #1a1a1a; color: white; padding: 20px; }
                .container { max-width: 800px; margin: 0 auto; }
                .header { background: linear-gradient(135deg, #ff6b6b, #ee5a24); padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px; }
                .card { background: #2d3436; padding: 15px; margin: 10px 0; border-radius: 10px; border-left: 4px solid #ff6b6b; }
                .status-card { background: linear-gradient(135deg, #00b894, #00a085); border-left-color: #00b894; }
                .warning-card { background: linear-gradient(135deg, #fdcb6e, #e17055); border-left-color: #fdcb6e; }
                .ai-card { background: linear-gradient(135deg, #6c5ce7, #a29bfe); border-left-color: #6c5ce7; }
                .entertainment-card { background: linear-gradient(135deg, #fd79a8, #e84393); border-left-color: #fd79a8; }
                .btn { display: block; width: 100%; padding: 12px; margin: 8px 0; background: #0984e3; color: white; border: none; border-radius: 8px; text-decoration: none; text-align: center; font-weight: bold; }
                .music-btn { background: #fd79a8; }
                .call-btn { background: #00b894; }
                .chat-box { height: 200px; background: rgba(255,255,255,0.1); border-radius: 8px; padding: 10px; margin: 10px 0; overflow-y: auto; }
                .message { margin: 8px 0; padding: 10px; border-radius: 8px; max-width: 90%; }
                .bot { background: rgba(255,255,255,0.2); text-align: right; }
                .user { background: #0984e3; margin-left: auto; }
                .input-group { display: flex; gap: 10px; }
                .ai-input { flex: 1; padding: 12px; border: none; border-radius: 25px; background: rgba(255,255,255,0.1); color: white; }
                .ai-btn { background: #00b894; color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer; font-weight: bold; }
                .quick-btn { background: rgba(255,255,255,0.2); color: white; border: 1px solid #ddd; padding: 8px 12px; margin: 4px; border-radius: 20px; cursor: pointer; font-size: 0.8em; }
                .camera-alert { color: #ff7675; font-weight: bold; animation: blink 2s infinite; }
                .entertainment-section { display: flex; gap: 10px; margin: 15px 0; }
                .entertainment-btn { flex: 1; padding: 10px; background: rgba(255,255,255,0.1); border: none; border-radius: 8px; color: white; cursor: pointer; text-align: center; }
                @keyframes blink { 50% { opacity: 0.5; } }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚗 سیستم رانندگی هوشمند هرمزگان</h1>
                    <p>🤖 همراه دیکتاتور قوانین رانندگی + سیستم سرگرمی</p>
                </div>

                <div class="card status-card">
                    <h2>📊 وضعیت نظارتی</h2>
                    <p><strong>👤 راننده:</strong> ${database.driver.name}</p>
                    <p><strong>📜 گواهینامه:</strong> ${database.driver.license}</p>
                    <p><strong>⭐ امتیاز:</strong> ${database.driver.points} از 12</p>
                    <p><strong>🔍 وضعیت:</strong> ${trafficDictator.pointSystem.checkStatus(database.driver.points)}</p>
                </div>

                <div class="card warning-card">
                    <h2>⚠️ هشدارهای لحظه‌ای</h2>
                    <p class="camera-alert">📹 دوربین سرعت فعال: میدان آزادی</p>
                    <p class="camera-alert">🚦 دوربین چراغ قرمز: بلوار ساحلی</p>
                    <p>👮 کنترل پلیس: خیابان امام</p>
                    <p>🚧 تعمیرات: جاده فرودگاه</p>
                </div>

                <div class="card entertainment-card">
                    <h2>🎵 سیستم سرگرمی و ارتباطی</h2>
                    <div class="entertainment-section">
                        <button class="entertainment-btn" onclick="controlMusic('play')">
                            🎵 پخش موسیقی
                        </button>
                        <button class="entertainment-btn" onclick="startCall(1)">
                            📞 تماس پشتیبانی
                        </button>
                        <button class="entertainment-btn" onclick="startCall(3)">
                            🚦 تماس ترافیک
                        </button>
                    </div>
                    <p><strong>موسیقی:</strong> ${musicPlayer.status}</p>
                    <p><strong>تماس:</strong> ${videoCallSystem.status}</p>
                </div>
                  <div class="card entertainment-card">
    <h2>🎵 سیستم سرگرمی و ارتباطی</h2>

    <div class="entertainment-section">
        <button class="entertainment-btn" onclick="controlMusic('play')">
            🎵 پخش موسیقی
        </button>

        <button class="entertainment-btn" onclick="startCall(1)">
            📞 تماس پشتیبانی
        </button>

        <button class="entertainment-btn" onclick="startCall(3)">
            🚦 تماس ترافیک
        </button>
    </div>

    <p><strong>موسیقی:</strong> ${musicPlayer.status}</p>
    <p><strong>تماس:</strong> ${videoCallSystem.status}</p>
</div>

<div class="card ai-card">
    <h2>🤖 دیتاکتور قوانین رانندگی</h2>
