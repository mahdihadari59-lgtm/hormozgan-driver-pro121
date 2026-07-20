const http = require('http');
const url = require('url');

// ============================================
// 📚 دیتابیس کامل گویش بندری
// ============================================

// دیکشنری کامل (فارسی ←→ بندری)
const dictionary = {
    // کلمات پایه
    'سلام': 'سَلام',
    'خوبی': 'خوبی دلمی',
    'چطوری': 'چو هسّین',
    'عزیزم': 'دلمی',
    'جانم': 'جانم',
    'پدر': 'بابا',
    'مادر': 'ماما',
    'برادر': 'برار',
    'خواهر': 'خواهر',
    'پسر': 'پسر',
    'دختر': 'دختر',
    'گرسنه': 'لچو',
    'تشنه': 'تِشنه',
    'خسته': 'خَسته',
    'خوشحال': 'دل خنک',
    'ناراحت': 'دل تنگ',
    'عصبانی': 'آتیش هَل نَشو',
    'گرم': 'گرم',
    'سرد': 'سَرد',
    'زیبا': 'قشنگ',
    'بزرگ': 'گت',
    'کوچک': 'خورد',
    'سریع': 'تند',
    'آهسته': 'یواش',
    'رفتن': 'خَری',
    'آمدن': 'اومَدن',
    'خوردن': 'خَوردن',
    'نوشیدن': 'نوشیدن',
    'خوابیدن': 'خوابیدن',
    'دویدن': 'دویدن',
    'دیدن': 'دیدن',
    'شنیدن': 'شنیدن',
    'گفتن': 'گپ زدن',
    'کار': 'کار',
    'خانه': 'خونه',
    'مدرسه': 'مدرسه',
    'بازار': 'بازار',
    'بیمارستان': 'بیمارستان',
    'مسجد': 'مسجد',
    'دریا': 'دَریا',
    'کوه': 'کوه',
    'صحرا': 'صحرا',
    'نخل': 'نَخل',
    'خرما': 'خُرما',
    'ماهی': 'ماهی',
    'میگو': 'میگو',
    'نان': 'نان',
    'آب': 'آو',
    'چای': 'چایی',
    'غذا': 'غذا'
};

// اصطلاحات پرکاربرد
const phrases = {
    // احوالپرسی
    'سلام چطوری؟': 'سَلام چو هسّین؟',
    'خوبی عزیزم؟': 'خوبی دلمی؟',
    'حالت چطوره؟': 'چو هسّین؟',
    'چه خبر؟': 'چیزها؟',
    'خوش آمدید': 'خوش اومدید',
    
    // ابراز احساسات
    'چه قدر گرم است!': 'واویلا چقد گرما!',
    'چه قدر سرد است!': 'واویلا چقد سَردا!',
    'چه قدر زیبا!': 'واویلا چقد قشنگه!',
    'دلم برایت تنگ شده': 'دلم برات تنگ شده',
    'خسته نباشی': 'خسته نباشی',
    'دستت درد نکنه': 'دستت درد نکنه بابا',
    
    // نیازها
    'گرسنه شدم': 'لچو شدم',
    'تشنمه': 'تِشنه‌ام',
    'خوابم میاد': 'خوابم میاد',
    'کمکم کن': 'کمکم کن',
    
    // متفرقه
    'برو به بازار': 'خَری به بازار',
    'بیا اینجا': 'بیا اینجا',
    'چقدر؟': 'چقدر؟',
    'نمی‌دانم': 'نمدونم',
    'باشه': 'باشه',
    'خداحافظ': 'خدا نگهدار جانم'
};

// قوانین تشخیص گویش بندری
const bandariPatterns = [
    { pattern: /واویلا|دلمی|لچو|چو هسین|جانم|خری/, dialect: 'bandari', confidence: 0.95 },
    { pattern: /چَکری|لنج|بندر/, dialect: 'langari', confidence: 0.90 },
    { pattern: /کَیری|دَج/, dialect: 'qeshm', confidence: 0.90 },
    { pattern: /خُو|هَی/, dialect: 'khamiri', confidence: 0.85 },
    { pattern: /چَگوری|اَمره/, dialect: 'minabi', confidence: 0.88 }
];

// ============================================
// 📚 توابع گویش بندری
// ============================================

// تشخیص گویش متن
function detectDialect(text) {
    const lowerText = text.toLowerCase();
    let detected = { dialect: 'persian', confidence: 0.5, reason: 'مشخص نشد' };
    
    for (const bp of bandariPatterns) {
        if (bp.pattern.test(lowerText)) {
            detected = { dialect: bp.dialect, confidence: bp.confidence, reason: `کلمات کلیدی ${bp.pattern.source} یافت شد` };
            break;
        }
    }
    
    // بررسی کلمات بندری
    const bandariWords = ['واویلا', 'دلمی', 'لچو', 'چو', 'هسین', 'جانم', 'خری', 'گپ'];
    let bandariCount = 0;
    for (const word of bandariWords) {
        if (lowerText.includes(word)) bandariCount++;
    }
    if (bandariCount > 0 && detected.confidence < 0.7) {
        detected = { dialect: 'bandari', confidence: 0.6 + (bandariCount * 0.05), reason: `${bandariCount} کلمه بندری یافت شد` };
    }
    
    return detected;
}

// ترجمه فارسی به بندری
function toBandari(text) {
    let result = text;
    // جایگزینی کلمات
    for (const [persian, bandari] of Object.entries(dictionary)) {
        const regex = new RegExp(persian, 'gi');
        result = result.replace(regex, bandari);
    }
    return result;
}

// ترجمه بندری به فارسی
function toPersian(text) {
    let result = text;
    // ایجاد نقشه معکوس
    const reverseDict = {};
    for (const [persian, bandari] of Object.entries(dictionary)) {
        reverseDict[bandari] = persian;
    }
    for (const [bandari, persian] of Object.entries(reverseDict)) {
        const regex = new RegExp(bandari, 'gi');
        result = result.replace(regex, persian);
    }
    return result;
}

// ترجمه هوشمند (تشخیص خودکار)
function smartTranslate(text) {
    const detected = detectDialect(text);
    if (detected.dialect === 'persian' || detected.dialect === 'minabi') {
        return { from: 'persian', to: 'bandari', translation: toBandari(text), confidence: detected.confidence };
    } else {
        return { from: 'bandari', to: 'persian', translation: toPersian(text), confidence: detected.confidence };
    }
}

// ============================================
// 🚀 سرور
// ============================================
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    
    console.log(`📡 ${method} ${pathname}`);
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // ========== BANDARI APIs ==========
    
    // 1. تشخیص گویش متن
    if (pathname === '/api/bandari/detect' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const text = data.text || data.message || '';
                const result = detectDialect(text);
                res.end(JSON.stringify({ success: true, text, ...result }));
            } catch(e) {
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    // 2. ترجمه فارسی → بندری
    if (pathname === '/api/bandari/to-bandari' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const text = data.text || data.message || '';
                const translation = toBandari(text);
                res.end(JSON.stringify({ success: true, original: text, translation, from: 'persian', to: 'bandari' }));
            } catch(e) {
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    // 3. ترجمه بندری → فارسی
    if (pathname === '/api/bandari/to-persian' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const text = data.text || data.message || '';
                const translation = toPersian(text);
                res.end(JSON.stringify({ success: true, original: text, translation, from: 'bandari', to: 'persian' }));
            } catch(e) {
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    // 4. ترجمه هوشمند (تشخیص خودکار)
    if (pathname === '/api/bandari/translate' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const text = data.text || data.message || '';
                const result = smartTranslate(text);
                res.end(JSON.stringify({ success: true, original: text, ...result }));
            } catch(e) {
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    // 5. دیکشنری کامل
    if (pathname === '/api/bandari/dictionary' && method === 'GET') {
        const limit = parseInt(parsedUrl.query.limit) || 50;
        const word = parsedUrl.query.word || '';
        
        let result = dictionary;
        if (word) {
            result = {};
            for (const [key, value] of Object.entries(dictionary)) {
                if (key.includes(word) || value.includes(word)) {
                    result[key] = value;
                }
            }
        }
        
        const entries = Object.entries(result).slice(0, limit);
        res.end(JSON.stringify({
            success: true,
            total: Object.keys(dictionary).length,
            shown: entries.length,
            dictionary: Object.fromEntries(entries),
            wordCount: Object.keys(dictionary).length
        }));
        return;
    }
    
    // 6. اصطلاحات پرکاربرد
    if (pathname === '/api/bandari/phrases' && method === 'GET') {
        const limit = parseInt(parsedUrl.query.limit) || 20;
        const entries = Object.entries(phrases).slice(0, limit);
        res.end(JSON.stringify({
            success: true,
            total: Object.keys(phrases).length,
            shown: entries.length,
            phrases: Object.fromEntries(entries),
            categories: ['احوالپرسی', 'ابراز احساسات', 'نیازها', 'متفرقه']
        }));
        return;
    }
    
    // ========== OTHER APIs ==========
    
    // Health
    if (pathname === '/api/health') {
        res.end(JSON.stringify({ status: 'healthy', version: '8.0', time: new Date().toISOString() }));
        return;
    }
    
    // Gold
    if (pathname === '/api/gold') {
        res.end(JSON.stringify({ gold18: '4,852,000', emamiCoin: '52,000,000', updated: new Date().toISOString() }));
        return;
    }
    
    // Weather
    if (pathname === '/api/weather') {
        const city = parsedUrl.query.city || 'بندرعباس';
        res.end(JSON.stringify({ city, temperature: '35°C', condition: 'آفتابی', humidity: '60%', updated: new Date().toISOString() }));
        return;
    }
    
    // Traffic
    if (pathname === '/api/traffic') {
        const location = parsedUrl.query.location || 'بندرعباس';
        res.end(JSON.stringify({ location, status: 'معمولی', advice: 'ترافیک عادی است', updated: new Date().toISOString() }));
        return;
    }
    
    // Calendar
    if (pathname === '/api/calendar') {
        const now = new Date();
        res.end(JSON.stringify({ persian: '۱۴۰۳/۰۳/۲۰', weekday: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'][now.getDay()] }));
        return;
    }
    
    // Fal
    if (pathname === '/api/fal') {
        res.end(JSON.stringify({ poem: 'صبا به لطف بگو آن غزال رعنا را', interpretation: 'روز خوبی در پیش دارید' }));
        return;
    }
    
    // Stats
    if (pathname === '/api/stats') {
        res.end(JSON.stringify({
            uptime: process.uptime(),
            version: '8.0',
            bandari: {
                dictionarySize: Object.keys(dictionary).length,
                phrasesSize: Object.keys(phrases).length,
                dialectsSupported: ['bandari', 'langari', 'qeshm', 'khamiri', 'minabi']
            }
        }));
        return;
    }
    
    // Intent
    if (pathname === '/api/intent' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const text = data.text || '';
                let intent = 'general';
                if (text.includes('طلا')) intent = 'gold';
                else if (text.includes('آب و هوا')) intent = 'weather';
                else if (text.includes('ترافیک')) intent = 'traffic';
                else if (text.includes('سلام')) intent = 'greeting';
                res.end(JSON.stringify({ intent, confidence: 0.85 }));
            } catch(e) {
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    // Chat
    if (pathname === '/api/ai/chat-pro' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const message = data.message || '';
                let response = '💬 سوال خود را بپرسید';
                if (message.includes('طلا')) response = '💰 قیمت طلا: 4,852,000 تومان';
                else if (message.includes('سلام')) response = '👋 سلام! خوش آمدید';
                res.end(JSON.stringify({ ok: true, response }));
            } catch(e) {
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    // Docs
    if (pathname === '/api/docs') {
        res.end(JSON.stringify({
            name: 'HDP ONE API - گویش بندری',
            version: '8.0',
            endpoints: {
                bandari: [
                    'POST /api/bandari/detect - تشخیص گویش متن',
                    'POST /api/bandari/to-bandari - ترجمه فارسی → بندری',
                    'POST /api/bandari/to-persian - ترجمه بندری → فارسی',
                    'POST /api/bandari/translate - ترجمه هوشمند (تشخیص خودکار)',
                    'GET /api/bandari/dictionary - دیکشنری کامل',
                    'GET /api/bandari/phrases - اصطلاحات پرکاربرد'
                ],
                other: [
                    'GET /api/health', 'GET /api/gold', 'GET /api/weather',
                    'GET /api/traffic', 'GET /api/calendar', 'GET /api/fal',
                    'POST /api/intent', 'POST /api/ai/chat-pro'
                ]
            }
        }));
        return;
    }
    
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found', path: pathname }));
});

const PORT = 9090;
server.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║      🚀 HDP ONE v8.0 - APIهای کامل گویش بندری                   ║');
    console.log('╠══════════════════════════════════════════════════════════════════╣');
    console.log('║  📚 دیکشنری: ' + Object.keys(dictionary).length + ' کلمه                          ║');
    console.log('║  📖 اصطلاحات: ' + Object.keys(phrases).length + ' عبارت                         ║');
    console.log('║  🗣️ گویش‌ها: بندری، لنگه‌ای، قشمی، خمیری، مینابی                ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log(`✅ http://localhost:${PORT}`);
    console.log('');
    console.log('📡 تست APIهای گویش بندری:');
    console.log(`   curl -X POST http://localhost:${PORT}/api/bandari/detect -H "Content-Type: application/json" -d '{"text":"واویلا چقد گرما!"}'`);
    console.log(`   curl -X POST http://localhost:${PORT}/api/bandari/to-bandari -H "Content-Type: application/json" -d '{"text":"سلام چطوری؟"}'`);
    console.log(`   curl -X POST http://localhost:${PORT}/api/bandari/translate -H "Content-Type: application/json" -d '{"text":"واویلا چقد گرما!"}'`);
    console.log(`   curl "http://localhost:${PORT}/api/bandari/dictionary?word=سلام"`);
    console.log(`   curl "http://localhost:${PORT}/api/bandari/phrases"`);
    console.log('');
});

module.exports = server;
