const fs = require('fs');
let content = fs.readFileSync('index.js', 'utf8');

// پاسخ‌های هوشمندتر
const smartResponses = `
// پاسخ‌های هوشمند چت‌بات
const chatResponses = {
    'greeting': [
        '👋 سلام! به HDP ONE خوش آمدید. چطور می‌توانم به شما کمک کنم؟',
        '🌊 سلام! در خدمت شما هستم. چه کمکی از دستم برمیاد؟',
        '💬 درود! آماده پاسخگویی به سوالات شما درباره هرمزگان هستم.'
    ],
    'farewell': [
        '👋 خداحافظ! امیدوارم باز هم از خدمات HDP ONE استفاده کنید.',
        '🌊 بدرود! سفر خوبی داشته باشید.',
        '💬 خدا نگهدار! هر سوالی داشتید در خدمتیم.'
    ],
    'traffic': [
        '🚦 وضعیت ترافیک بندرعباس:\n   • چهارراه غزی: سنگین ⚠️\n   • بلوار ساحلی: روان ✅\n   • میدان سپاه: نیمه سنگین ⚠️\n   • پل سفید: روان ✅',
        '🚗 گزارش ترافیک:\n   مسیرهای منتهی به غزی شلوغ است.\n   بلوار ساحلی آزاد است.\n   صبور باشید و با احتیاط رانندگی کنید.'
    ],
    'gold': [
        '💰 قیمت امروز طلا و ارز:\n   • طلای 18 عیار: 4,852,000 تومان\n   • سکه امامی: 52,000,000 تومان\n   • دلار آزاد: 62,500 تومان\n   • یورو: 67,800 تومان',
        '📊 آخرین نرخ‌ها:\n   طلا نسبت به دیروز +0.04% افزایش داشته.\n   پیش‌بینی: روند صعودی ملایم تا پایان هفته.'
    ],
    'dialect': [
        '🗣️ \"واویلا\" در گویش بندری یعنی \"چه قدر\" یا \"چقدر\".\n   مثال: واویلا چقد گرما! = چقدر هوا گرم است!',
        '📖 واژه‌های بندری:\n   • دلمی = عزیزم/جانم\n   • لچو = گرسنه\n   • چو هسّین = چطوری؟\n   • جانم = عزیزم'
    ],
    'medical': [
        '🏥 بیمارستان‌های بندرعباس:\n   • بیمارستان شهید محمدی - 33440000\n   • بیمارستان کودکان - 33450000\n   • بیمارستان تأمین اجتماعی - 33460000\n   • درمانگاه نفت - 33470000'
    ],
    'tourism': [
        '🏝️ جاهای دیدنی هرمزگان:\n   • جزیره قشم (دره ستارگان، جنگل حرا)\n   • جزیره هرمز (خاک سرخ)\n   • غار نمکدان\n   • معبد هندوها\n   • برکه‌های ماهیگیری میناب'
    ],
    'food': [
        '🍽️ غذاهای محلی هرمزگان:\n   • قلیه ماهی\n   • میگو پلاو\n   • هاواری (نان محلی)\n   • خوراک خرچنگ\n   • نان تومشی'
    ],
    'weather': [
        '🌤️ وضعیت آب و هوای بندرعباس:\n   • دما: 35°C\n   • رطوبت: 65%\n   • باد: 15 km/h\n   • وضعیت: کمی ابری'
    ],
    'emergency': [
        '🚨 شماره‌های ضروری:\n   • اورژانس: 115\n   • پلیس: 110\n   • آتش‌نشانی: 125\n   • هلال احمر: 112\n   • راهداری: 141'
    ],
    'general': [
        '💬 متوجه سوال شما نشدم.\n\n📌 سوالات متداول:\n   • \"ترافیک چطوره؟\"\n   • \"قیمت طلا چند است؟\"\n   • \"جزیره قشم کجاست؟\"\n   • \"واویلا یعنی چی؟\"'
    ]
};

// تابع دریافت پاسخ تصادفی
function getRandomResponse(intent) {
    const responses = chatResponses[intent] || chatResponses['general'];
    return responses[Math.floor(Math.random() * responses.length)];
}`;

// جایگزینی بخش chat-pro
const newChatPro = `
// Chat Pro with smart responses
app.post('/api/ai/chat-pro', (req, res) => {
    const { message, userId } = req.body;
    const result = classifier.classify(message, userId);
    const response = getRandomResponse(result.intent);
    
    res.json({ 
        ok: true, 
        intent: result.intent, 
        confidence: result.confidence,
        response: response,
        suggestions: getSuggestions(result.intent)
    });
});

// پیشنهادات مرتبط
function getSuggestions(intent) {
    const suggestions = {
        'greeting': ['ترافیک چطوره؟', 'قیمت طلا چند است؟', 'قشم کجاست؟'],
        'traffic': ['وضعیت ترافیک غزی', 'مسیر جایگزین', 'تصادف جدید'],
        'gold': ['قیمت سکه', 'قیمت دلار', 'پیش‌بینی طلا'],
        'dialect': ['معنی دلمی', 'لچو یعنی چی؟', 'گویش قشمی'],
        'default': ['کمک', 'راهنمایی', 'تماس با ما']
    };
    return suggestions[intent] || suggestions['default'];
}`;

// اضافه کردن به فایل
if (!content.includes('chatResponses')) {
    // پیدا کردن محل اضافه کردن
    content = content.replace('// Intent Classifier', smartResponses + '\n\n// Intent Classifier');
    content = content.replace(/app\.post\('\/api\/ai\/chat-pro',[\s\S]*?\}\);/s, newChatPro);
    fs.writeFileSync('index.js', content);
    console.log('✅ چت‌بات با پاسخ‌های هوشمند بهبود یافت');
} else {
    console.log('ℹ️ پاسخ‌های هوشمند قبلاً اضافه شده بودند');
}
