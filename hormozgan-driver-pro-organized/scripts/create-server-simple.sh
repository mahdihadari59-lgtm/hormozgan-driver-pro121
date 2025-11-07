#!/bin/bash
echo "🚀 شروع ساخت سرور حرفه‌ای..."

# ایجاد فایل سرور اصلی
cat > server-final.js << 'SCRIPT_EOF'
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 8080;

// میدلورهای امنیتی
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// کلاس هوش مصنوعی پیشرفته
class AISahel {
    constructor() {
        this.conversationHistory = new Map();
        this.locations = {
            "اسکله شهید رجایی": { type: "اسکله تجاری", traffic: "سنگین" },
            "اسکله شهید باهنر": { type: "اسکله مسافربری", traffic: "متوسط" },
            "هتل هرمز": { type: "هتل", traffic: "متوسط" },
            "فرودگاه ساحل": { type: "فرودگاه", traffic: "سنگین" }
        };
    }

    async processRequest(userInput, sessionId = 'default') {
        try {
            const input = userInput.toLowerCase().trim();
            
            // ذخیره تاریخچه
            if (!this.conversationHistory.has(sessionId)) {
                this.conversationHistory.set(sessionId, []);
            }
            const history = this.conversationHistory.get(sessionId);
            history.push({ user: input, time: new Date() });
            
            let response;
            
            if (input.includes('سلام')) {
                response = this.getGreeting();
            } else if (input.includes('تماس') || input.includes('شماره')) {
                response = this.getContacts();
            } else if (input.includes('پلاک') || input.includes('خودرو')) {
                response = this.getVehicleInfo();
            } else if (input.includes('ترافیک')) {
                response = this.getTrafficInfo();
            } else if (input.includes('مسیر') || input.includes('راه')) {
                response = this.getRouteSuggestion(input);
            } else if (input.includes('درآمد')) {
                response = this.getIncomeReport();
            } else if (input.includes('قانون') || input.includes('مقررات')) {
                response = this.getRegulations();
            } else {
                response = this.getHelp();
            }
            
            history.push({ assistant: response, time: new Date() });
            return response;
            
        } catch (error) {
            return "⚠️ خطا در پردازش درخواست. لطفاً مجدد تلاش کنید.";
        }
    }

    getGreeting() {
        return `👋 سلام! من AI Sahel هستم - دستیار هوشمند رانندگی شما

📋 خدمات موجود:
• 🗺️ مسیریابی و ترافیک
• 📞 اطلاعات تماس
• 🚗 اطلاعات خودرو  
• 💰 گزارش درآمد
• 📋 قوانین رانندگی

چه کاری می‌تونم براتون انجام بدم؟`;
    }

    getContacts() {
        return `📞 **اطلاعات تماس**:

• پشتیبانی فنی: 07635108
• بخش امنیتی: 09164321660  
• راننده: 09179940272
• مدیریت: 07635109

⏰ ساعات پاسخگویی: 24 ساعته`;
    }

    getVehicleInfo() {
        return `🚗 **اطلاعات خودرو**:

🔢 پلاک: 84 ایران 741 ط 98
🏷️ مدل: پژو 206
🎨 رنگ: سفید
👤 مالک: رضا محمدی
📜 بیمه: بیمه ایران 1403123456
🔧 معاینه فنی: 1403/12/15

⭐ امتیاز راننده: 4.8/5
💰 درآمد ماهانه: 14,880,000 تومان`;
    }

    getTrafficInfo() {
        return `🚦 **وضعیت ترافیک ساحل**:

🕒 به‌روزرسانی: ${new Date().toLocaleTimeString('fa-IR')}

🔴 ترافیک سنگین:
• اسکله شهید رجایی
• فرودگاه ساحل

🟡 ترافیک متوسط: 
• هتل هرمز
• اسکله شهید باهنر

⚠️ هشدارها:
• تعمیرات جاده‌ای در بلوار ساحلی
• دوربین سرعت فعال در مرکز شهر`;
    }

    getRouteSuggestion(input) {
        return `🗺️ **پیشنهاد مسیر**:

📍 مسیرهای پرطرفدار:
• هتل هرمز → فرودگاه: 25 دقیقه - 18 کیلومتر
• اسکله رجایی → هتل هرمز: 15 دقیقه - 8 کیلومتر

💡 برای مسیریابی دقیق، مبدأ و مقصد رو مشخص کنید.`;
    }

    getIncomeReport() {
        return `💰 **گزارش درآمد هفته**:

• شنبه: ۴۵۰,۰۰۰ تومان
• یکشنبه: ۵۲۰,۰۰۰ تومان
• دوشنبه: ۳۸۰,۰۰۰ تومان
• سه‌شنبه: ۶۱۰,۰۰۰ تومان
• چهارشنبه: ۴۹۰,۰۰۰ تومان
• پنجشنبه: ۵۵۰,۰۰۰ تومان
• جمعه: ۷۲۰,۰۰۰ تومان

💰 جمع کل: ۳,۷۲۰,۰۰۰ تومان
📈 میانگین روزانه: ۵۳۱,۴۲۸ تومان`;
    }

    getRegulations() {
        return `📋 **قوانین رانندگی**:

🚦 محدودیت سرعت:
• شهری: 50 کیلومتر
• اصلی: 60 کیلومتر  
• آزادراه: 110 کیلومتر

🚫 تخلفات مهم:
• عبور چراغ قرمز: 1,000,000 تومان
• سرعت غیرمجاز: 500,000 تومان
• سبقت غیرمجاز: 800,000 تومان

✅ الزامات:
• کمربند ایمنی اجباری
• گواهینامه معتبر
• بیمه نامه`;
    }

    getHelp() {
        return `🤔 **AI Sahel**

می‌تونم در مورد این موضوعات کمک کنم:

• "وضعیت ترافیک" - اطلاعات ترافیک لحظه‌ای
• "شماره پشتیبانی" - اطلاعات تماس
• "اطلاعات خودرو" - مشخصات پلاک و خودرو  
• "گزارش درآمد" - وضعیت مالی
• "مسیر به فرودگاه" - مسیریابی
• "قوانین رانندگی" - مقررات

📞 پشتیبانی: 07635108`;
    }
}

// ایجاد نمونه هوش مصنوعی
const aiSahel = new AISahel();

// روت‌های اصلی
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>AI Sahel - سرور فعال</title>
            <style>
                body { 
                    font-family: Tahoma; 
                    background: #f0f2f5; 
                    margin: 0; 
                    padding: 20px; 
                }
                .container { 
                    max-width: 800px; 
                    margin: 0 auto; 
                    background: white; 
                    padding: 30px; 
                    border-radius: 10px; 
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 30px; 
                }
                .status { 
                    background: #d4edda; 
                    color: #155724; 
                    padding: 15px; 
                    border-radius: 5px; 
                    margin: 20px 0; 
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🤖 AI Sahel</h1>
                    <p>سرور هوش مصنوعی حرفه‌ای برای مدیریت رانندگی</p>
                </div>
                
                <div class="status">
                    <h3>✅ سرور فعال و آماده</h3>
                    <p>پورت: 8080 | نسخه: ۷.۰.۰</p>
                </div>
                
                <h3>🔗 Endpoint های فعال:</h3>
                <ul>
                    <li><code>POST /ai-chat</code> - چت با هوش مصنوعی</li>
                    <li><code>GET /api/contacts</code> - اطلاعات تماس</li>
                    <li><code>GET /api/traffic</code> - وضعیت ترافیک</li>
                </ul>
                
                <h3>📞 پشتیبانی:</h3>
                <p>شماره: <strong>07635108</strong></p>
            </div>
        </body>
        </html>
    `);
});

// روت چت هوش مصنوعی
app.post('/ai-chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'پیام ارسال کنید'
            });
        }

        const response = await aiSahel.processRequest(message, sessionId);
        
        res.json({
            success: true,
            response: response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'خطا در پردازش'
        });
    }
});

// API اطلاعات تماس
app.get('/api/contacts', (req, res) => {
    res.json({
        success: true,
        data: {
            support: "07635108",
            security: "09164321660", 
            driver: "09179940272"
        }
    });
});

// API وضعیت ترافیک
app.get('/api/traffic', (req, res) => {
    res.json({
        success: true,
        data: aiSahel.getTrafficInfo()
    });
});

// راه‌اندازی سرور
app.listen(port, () => {
    console.log(`
╔══════════════════════════════════╗
║         🚀 AI Sahel Server      ║
║         🤖 سرور فعال شد         ║
╠══════════════════════════════════╣
║ 📍 http://localhost:${port}      ║
║ 📞 پشتیبانی: 07635108          ║
╚══════════════════════════════════╝
    `);
});
SCRIPT_EOF

echo "✅ سرور ساخته شد: server-final.js"
echo "📦 نصب dependencies:"
npm install express helmet cors express-rate-limit

echo "🚀 اجرای سرور:"
echo "node server-final.js"
