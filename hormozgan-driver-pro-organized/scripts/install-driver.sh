#!/bin/bash
echo "🚀 نصب خودکار Hormozgan Driver Pro v8.0"
echo "========================================"

# حذف فایل قبلی اگر وجود دارد
if [ -f "app.js" ]; then
    echo "🗑️ حذف فایل قبلی..."
    rm app.js
fi

# ایجاد فایل جدید
echo "📝 ایجاد فایل جدید با هوش مصنوعی..."
cat > app.js << 'APPCODE'
// Hormozgan Driver Pro - Termux Version با هوش مصنوعی
const express = require('express');
const app = express();
const port = 8080;

// دیتابیس ساده
const database = {
    driver: {
        name: "رضا محمدی",
        balance: 2500000,
        car: "پژو 206",
        rating: 4.8
    },
    rides: [
        { id: 1, passenger: "علی احمدی", from: "میدان آزادی", to: "فرودگاه", price: 120000, status: "completed" },
        { id: 2, passenger: "سارا کریمی", from: "خیابان امام", to: "پل زیبا", price: 85000, status: "active" },
        { id: 3, passenger: "محمد رضایی", from: "ساحل سورو", to: "بیمارستان", price: 95000, status: "pending" }
    ]
};

// هوش مصنوعی
const aiAssistant = {
    analyzeQuestion: (question) => {
        const q = question.toLowerCase();
        
        if (q.includes('ترافیک')) {
            return "🚦 ترافیک فعلی: میدان آزادی شلوغ، بلوار ساحلی آزاد. پیشنهاد: از مسیرهای حاشیه شهر استفاده کنید.";
        }
        else if (q.includes('درآمد') || q.includes('پول')) {
            return "💰 راهکارهای افزایش درآمد:\\n• ساعات 7-9 صبح و 5-7 عصر\\n• مسیرهای فرودگاه و بیمارستان\\n• جمعه ها مناطق توریستی\\n• ارتباط خوب با مسافران";
        }
        else if (q.includes('مسیر') || q.includes('راه')) {
            return "🗺️ مسیرهای بهینه:\\n• مرکز به فرودگاه: بلوار ساحلی\\n• سورو به سیرو: جاده قدیم\\n• بندرعباس به قشم: پل خلیج فارس";
        }
        else if (q.includes('ایمنی')) {
            return "🛡️ نکات ایمنی:\\n• کمربند ایمنی\\n• فاصله مناسب\\n• سرعت مطمئنه\\n• عدم استفاده از موبایل";
        }
        else if (q.includes('سلام')) {
            return "👋 سلام! من دستیار هوش مصنوعی شما هستم. می‌تونم در مورد ترافیک، درآمد، مسیریابی و ایمنی راهنماییتون کنم.";
        }
        else {
            return "🤔 سوال خود را واضح‌تر بپرسید. می‌تونم در مورد:\\n• ترافیک\\n• درآمد\\n• مسیریابی\\n• ایمنی\\nکمکتون کنم.";
        }
    }
};

// صفحه اصلی با هوش مصنوعی
app.get('/', (req, res) => {
    res.send(\`
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>راننده حرفه ای هرمزگان</title>
            <style>
                body { font-family: sans-serif; background: #f0f0f0; padding: 20px; }
                .card { background: white; padding: 15px; margin: 10px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                .btn { display: block; width: 100%; padding: 10px; margin: 5px 0; background: #007bff; color: white; border: none; border-radius: 5px; text-decoration: none; text-align: center; }
                .ai-card { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }
                .chat-box { height: 150px; background: rgba(255,255,255,0.2); border-radius: 8px; padding: 10px; margin: 10px 0; overflow-y: auto; }
                .message { margin: 5px 0; padding: 8px; border-radius: 5px; max-width: 90%; }
                .bot { background: rgba(255,255,255,0.3); text-align: right; }
                .user { background: rgba(255,255,255,0.5); margin-left: auto; }
                .ai-input { width: 70%; padding: 8px; border: none; border-radius: 20px; margin-right: 5px; }
                .ai-btn { background: white; color: #4facfe; border: none; padding: 8px 15px; border-radius: 20px; cursor: pointer; }
                .quick-btn { background: rgba(255,255,255,0.3); color: white; border: 1px solid white; padding: 5px; margin: 2px; border-radius: 5px; cursor: pointer; font-size: 0.8em; }
            </style>
        </head>
        <body>
            <h1>🚗 راننده حرفه ای هرمزگان</h1>

            <div class="card">
                <h2>👤 اطلاعات راننده</h2>
                <p><strong>نام:</strong> \${database.driver.name}</p>
                <p><strong>خودرو:</strong> \${database.driver.car}</p>
                <p><strong>امتیاز:</strong> ⭐ \${database.driver.rating}</p>
                <p><strong>موجودی:</strong> \${database.driver.balance.toLocaleString()} تومان</p>
            </div>

            <div class="card ai-card">
                <h2>🤖 دستیار هوش مصنوعی</h2>
                <div class="chat-box" id="chatBox">
                    <div class="message bot">
                        <strong>AI:</strong> سلام! برای راهنمایی روی دکمه‌های زیر کلیک کنید.
                    </div>
                </div>
                
                <div style="text-align: center; margin: 10px 0;">
                    <button class="quick-btn" onclick="quickQuestion('وضعیت ترافیک')">🚦 ترافیک</button>
                    <button class="quick-btn" onclick="quickQuestion('افزایش درآمد')">💰 درآمد</button>
                    <button class="quick-btn" onclick="quickQuestion('مسیرهای کوتاه')">🗺️ مسیرها</button>
                    <button class="quick-btn" onclick="quickQuestion('نکات ایمنی')">🛡️ ایمنی</button>
                </div>
                
                <div style="display: flex;">
                    <input type="text" class="ai-input" id="aiInput" placeholder="سوال خود را بپرسید...">
                    <button class="ai-btn" onclick="askAI()">ارسال</button>
                </div>
            </div>

            <a href="/rides" class="btn">📋 مدیریت سفرها</a>
            <a href="/wallet" class="btn">💰 کیف پول</a>
            <a href="/ai-chat" class="btn">🤖 چت کامل هوش مصنوعی</a>

            <script>
                const chatBox = document.getElementById('chatBox');
                const aiInput = document.getElementById('aiInput');

                function addMessage(text, isUser = false) {
                    const messageDiv = document.createElement('div');
                    messageDiv.className = isUser ? 'message user' : 'message bot';
                    messageDiv.innerHTML = isUser ? '<strong>شما:</strong> ' + text : '<strong>AI:</strong> ' + text;
                    chatBox.appendChild(messageDiv);
                    chatBox.scrollTop = chatBox.scrollHeight;
                }

                function quickQuestion(type) {
                    const questions = {
                        'وضعیت ترافیک': 'وضعیت ترافیک صبحگاهی چطوره؟',
                        'افزایش درآمد': 'چطور درآمدم رو افزایش بدم؟',
                        'مسیرهای کوتاه': 'مسیرهای کوتاه به فرودگاه چیا هستن؟',
                        'نکات ایمنی': 'نکات ایمنی مهم برای رانندگی چیا هستن؟'
                    };
                    aiInput.value = questions[type];
                    askAI();
                }

                async function askAI() {
                    const question = aiInput.value.trim();
                    if (!question) return;

                    addMessage(question, true);
                    aiInput.value = '';

                    try {
                        const response = await fetch('/api/ai/ask', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ question: question })
                        });
                        
                        const data = await response.json();
                        addMessage(data.answer);
                    } catch (error) {
                        addMessage('⚠️ خطا در ارتباط با سرور');
                    }
                }

                aiInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        askAI();
                    }
                });
            </script>
        </body>
        </html>
    \`);
});

// API هوش مصنوعی
app.post('/api/ai/ask', express.json(), (req, res) => {
    const { question } = req.body;
    const answer = aiAssistant.analyzeQuestion(question);
    res.json({ answer: answer.replace(/\\\\n/g, '<br>') });
});

// راه اندازی سرور
app.listen(port, () => {
    console.log(\`🚀 برنامه در حال اجرا است: http://localhost:\${port}\`);
    console.log(\`🤖 هوش مصنوعی فعال شد!\`);
});
APPCODE

echo "✅ نصب کامل شد!"
echo "🎯 برای اجرا: node app.js"
echo "🌐 آدرس: http://localhost:8080"
