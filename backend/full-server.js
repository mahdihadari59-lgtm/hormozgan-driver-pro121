const http = require('http');
const url = require('url');

// ============================================
// 📊 Intent Detection
// ============================================
function detectIntent(text) {
    const lower = text.toLowerCase();
    if (lower.includes('سلام') || lower.includes('درود') || lower.includes('چطوری')) {
        return { intent: 'greeting', confidence: 0.92, name: 'احوالپرسی' };
    }
    if (lower.includes('طلا') || lower.includes('سکه') || (lower.includes('قیمت') && lower.includes('طلا'))) {
        return { intent: 'gold', confidence: 0.88, name: 'طلا و ارز' };
    }
    if (lower.includes('ترافیک') || lower.includes('شلوغ') || lower.includes('راه')) {
        return { intent: 'traffic', confidence: 0.85, name: 'ترافیک' };
    }
    if (lower.includes('واویلا') || lower.includes('بندری') || lower.includes('گویش')) {
        return { intent: 'dialect', confidence: 0.87, name: 'گویش بندری' };
    }
    if (lower.includes('خداحافظ') || lower.includes('بای')) {
        return { intent: 'farewell', confidence: 0.90, name: 'خداحافظی' };
    }
    if (lower.includes('آب') && lower.includes('هوا')) {
        return { intent: 'weather', confidence: 0.86, name: 'آب و هوا' };
    }
    return { intent: 'general', confidence: 0.5, name: 'عمومی' };
}

// ============================================
// 💬 پاسخ‌های چت
// ============================================
const chatResponses = {
    greeting: '👋 سلام! به HDP ONE خوش آمدید. چطور می‌توانم کمک کنم؟',
    farewell: '👋 خداحافظ! امیدوارم باز هم استفاده کنید.',
    gold: '💰 قیمت طلا: 4,852,000 تومان | سکه امامی: 52,000,000 تومان',
    traffic: '🚦 ترافیک چهارراه غزی سنگین است. از مسیر بلوار ساحلی استفاده کنید.',
    dialect: '🗣️ واویلا یعنی "چه قدر" در گویش بندری. دلمی یعنی "عزیزم".',
    weather: '🌤️ هوای بندرعباس: 35 درجه، آفتابی. رطوبت: 60%',
    general: '💬 سوال خود را بپرسید: قیمت طلا؟ آب و هوا؟ ترافیک؟ واویلا؟'
};

// ============================================
// 📊 داده‌ها
// ============================================
const goldData = { gold18: '4,852,000', emamiCoin: '52,000,000', updated: new Date().toISOString() };
const weatherData = {
    'بندرعباس': { temp: 35, condition: 'آفتابی', humidity: 60 },
    'قشم': { temp: 34, condition: 'آفتابی', humidity: 55 },
    'کیش': { temp: 33, condition: 'آفتابی', humidity: 50 }
};
const trafficData = {
    'چهارراه غزی': { status: 'سنگین ⚠️', advice: 'از مسیر بلوار ساحلی استفاده کنید' },
    'بلوار ساحلی': { status: 'روان ✅', advice: 'مسیر آزاد است' },
    'میدان سپاه': { status: 'نیمه سنگین 🟡', advice: 'کمی صبر کنید' }
};
const bandariWords = {
    'واویلا': 'چه قدر / چقدر',
    'دلمی': 'عزیزم / جانم',
    'لچو': 'گرسنه',
    'چو هسّین': 'چطوری؟',
    'جانم': 'عزیزم'
};

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
    
    // ========== GET endpoints ==========
    
    if (pathname === '/api/health') {
        res.end(JSON.stringify({ status: 'healthy', version: '7.0', time: new Date().toISOString() }));
        return;
    }
    
    if (pathname === '/api/gold') {
        res.end(JSON.stringify(goldData));
        return;
    }
    
    if (pathname === '/api/weather') {
        const city = parsedUrl.query.city || 'بندرعباس';
        const data = weatherData[city] || weatherData['بندرعباس'];
        res.end(JSON.stringify({
            city, temperature: data.temp + '°C', condition: data.condition,
            humidity: data.humidity + '%', updated: new Date().toISOString()
        }));
        return;
    }
    
    if (pathname === '/api/traffic') {
        const location = parsedUrl.query.location || '';
        let result = trafficData[location] || { status: 'معمولی 🚦', advice: 'ترافیک عادی است' };
        for (const [key, val] of Object.entries(trafficData)) {
            if (location.includes(key) || key.includes(location)) {
                result = val;
                break;
            }
        }
        res.end(JSON.stringify({ location: location || 'بندرعباس', ...result, updated: new Date().toISOString() }));
        return;
    }
    
    if (pathname === '/api/bandari') {
        const word = parsedUrl.query.word || '';
        if (word && bandariWords[word]) {
            res.end(JSON.stringify({ word, meaning: bandariWords[word] }));
        } else {
            res.end(JSON.stringify({ words: bandariWords, sample: 'سَلام چطوری؟ خوبی دلمی؟' }));
        }
        return;
    }
    
    if (pathname === '/api/calendar') {
        const now = new Date();
        res.end(JSON.stringify({
            persian: '۱۴۰۳/۰۳/۲۰',
            weekday: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'][now.getDay()],
            time: now.toLocaleTimeString('fa-IR')
        }));
        return;
    }
    
    if (pathname === '/api/fal') {
        const falList = [
            'صبا به لطف بگو آن غزال رعنا را',
            'دوش دیدم که ملائک در میخانه زدند',
            'اگر آن ترک شیرازی به دست آرد دل ما را'
        ];
        res.end(JSON.stringify({ poem: falList[Math.floor(Math.random() * falList.length)], interpretation: 'روز خوبی در پیش دارید' }));
        return;
    }
    
    if (pathname === '/api/stats') {
        res.end(JSON.stringify({ uptime: process.uptime(), version: '7.0', apis: ['gold', 'weather', 'traffic', 'bandari', 'calendar', 'fal', 'intent', 'chat'] }));
        return;
    }
    
    // ========== POST endpoints ==========
    
    if (pathname === '/api/intent' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const text = data.text || data.message || '';
                const result = detectIntent(text);
                res.end(JSON.stringify(result));
            } catch(e) {
                res.end(JSON.stringify({ error: 'Invalid JSON', intent: 'general' }));
            }
        });
        return;
    }
    
    if (pathname === '/api/ai/chat-pro' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const message = data.message || data.text || '';
                const intent = detectIntent(message);
                const response = chatResponses[intent.intent] || chatResponses.general;
                res.end(JSON.stringify({ ok: true, intent: intent.intent, confidence: intent.confidence, response: response }));
            } catch(e) {
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found', path: pathname }));
});

const PORT = 9090;
server.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║         🚀 HDP ONE v7.0 - سرور کامل و پایدار                    ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log(`✅ http://localhost:${PORT}`);
    console.log('');
    console.log('📡 APIهای فعال:');
    console.log('   GET  /api/health, /api/gold, /api/weather, /api/traffic');
    console.log('   GET  /api/bandari, /api/calendar, /api/fal, /api/stats');
    console.log('   POST /api/intent, /api/ai/chat-pro');
    console.log('');
});

module.exports = server;
