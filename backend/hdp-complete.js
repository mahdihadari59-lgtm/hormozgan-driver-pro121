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
    if (lower.includes('طلا') || lower.includes('سکه')) {
        return { intent: 'gold', confidence: 0.88, name: 'طلا و ارز' };
    }
    if (lower.includes('ترافیک') || lower.includes('شلوغ')) {
        return { intent: 'traffic', confidence: 0.85, name: 'ترافیک' };
    }
    if (lower.includes('واویلا') || lower.includes('بندری')) {
        return { intent: 'dialect', confidence: 0.87, name: 'گویش بندری' };
    }
    if (lower.includes('آب') && lower.includes('هوا')) {
        return { intent: 'weather', confidence: 0.86, name: 'آب و هوا' };
    }
    return { intent: 'general', confidence: 0.5, name: 'عمومی' };
}

// ============================================
// 📚 دیکشنری گویش بندری
// ============================================
const dictionary = {
    'سلام': 'سَلام', 'خوبی': 'خوبی دلمی', 'چطوری': 'چو هسّین',
    'عزیزم': 'دلمی', 'پدر': 'بابا', 'مادر': 'ماما',
    'گرسنه': 'لچو', 'خداحافظ': 'خدا نگهدار جانم'
};

const phrases = {
    'سلام چطوری؟': 'سَلام چو هسّین؟',
    'خوبی عزیزم؟': 'خوبی دلمی؟',
    'چه قدر گرم است!': 'واویلا چقد گرما!',
    'گرسنه شدم': 'لچو شدم'
};

function toBandari(text) {
    let result = text;
    for (const [persian, bandari] of Object.entries(dictionary)) {
        result = result.replace(new RegExp(persian, 'g'), bandari);
    }
    return result;
}

function toPersian(text) {
    const reverseDict = {};
    for (const [persian, bandari] of Object.entries(dictionary)) {
        reverseDict[bandari] = persian;
    }
    let result = text;
    for (const [bandari, persian] of Object.entries(reverseDict)) {
        result = result.replace(new RegExp(bandari, 'g'), persian);
    }
    return result;
}

function detectDialect(text) {
    const lower = text.toLowerCase();
    if (lower.includes('واویلا') || lower.includes('دلمی') || lower.includes('لچو')) {
        return { dialect: 'bandari', confidence: 0.95, reason: 'کلمات بندری detected' };
    }
    return { dialect: 'persian', confidence: 0.8, reason: 'متن فارسی' };
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
    
    // ========== GET endpoints ==========
    
    if (pathname === '/api/health') {
        res.end(JSON.stringify({ status: 'healthy', version: '9.0', time: new Date().toISOString() }));
        return;
    }
    
    if (pathname === '/api/gold') {
        res.end(JSON.stringify({ gold18: '4,852,000', emamiCoin: '52,000,000', updated: new Date().toISOString() }));
        return;
    }
    
    if (pathname === '/api/weather') {
        const city = parsedUrl.query.city || 'بندرعباس';
        res.end(JSON.stringify({ city, temperature: '35°C', condition: 'آفتابی', humidity: '60%' }));
        return;
    }
    
    if (pathname === '/api/traffic') {
        const location = parsedUrl.query.location || 'بندرعباس';
        res.end(JSON.stringify({ location, status: 'سنگین', advice: 'از مسیر جایگزین استفاده کنید', updated: new Date().toISOString() }));
        return;
    }
    
    if (pathname === '/api/calendar') {
        res.end(JSON.stringify({ persian: '۱۴۰۳/۰۳/۲۰', weekday: 'سه‌شنبه' }));
        return;
    }
    
    if (pathname === '/api/fal') {
        res.end(JSON.stringify({ poem: 'صبا به لطف بگو آن غزال رعنا را', interpretation: 'روز خوبی در پیش دارید' }));
        return;
    }
    
    // ========== BANDARI APIs ==========
    
    if (pathname === '/api/bandari/dictionary' && method === 'GET') {
        res.end(JSON.stringify({ success: true, dictionary, total: Object.keys(dictionary).length }));
        return;
    }
    
    if (pathname === '/api/bandari/phrases' && method === 'GET') {
        res.end(JSON.stringify({ success: true, phrases, total: Object.keys(phrases).length }));
        return;
    }
    
    // ========== POST endpoints ==========
    
    if (pathname === '/api/intent' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const result = detectIntent(data.text || data.message || '');
                res.end(JSON.stringify(result));
            } catch(e) {
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
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
                const msg = data.message || '';
                const intent = detectIntent(msg);
                let response = '💬 سوال خود را بپرسید';
                if (intent.intent === 'gold') response = '💰 قیمت طلا: 4,852,000 تومان';
                else if (intent.intent === 'greeting') response = '👋 سلام! خوش آمدید';
                else if (intent.intent === 'traffic') response = '🚦 ترافیک چهارراه غزی سنگین است';
                else if (intent.intent === 'dialect') response = '🗣️ واویلا یعنی "چه قدر" در گویش بندری';
                res.end(JSON.stringify({ ok: true, response }));
            } catch(e) {
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    if (pathname === '/api/bandari/detect' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const result = detectDialect(data.text || '');
                res.end(JSON.stringify({ success: true, ...result }));
            } catch(e) {
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    if (pathname === '/api/bandari/to-bandari' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const translation = toBandari(data.text || '');
                res.end(JSON.stringify({ success: true, original: data.text, translation }));
            } catch(e) {
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    if (pathname === '/api/bandari/to-persian' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const translation = toPersian(data.text || '');
                res.end(JSON.stringify({ success: true, original: data.text, translation }));
            } catch(e) {
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    if (pathname === '/api/bandari/translate' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const text = data.text || '';
                const detected = detectDialect(text);
                let translation;
                if (detected.dialect === 'bandari') {
                    translation = toPersian(text);
                } else {
                    translation = toBandari(text);
                }
                res.end(JSON.stringify({ success: true, original: text, translation, from: detected.dialect, to: detected.dialect === 'bandari' ? 'persian' : 'bandari' }));
            } catch(e) {
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        return;
    }
    
    // 404
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found', path: pathname }));
});

const PORT = 9090;
server.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║      🚀 HDP ONE v9.0 - سرور کامل یکپارچه                         ║');
    console.log('╠══════════════════════════════════════════════════════════════════╣');
    console.log('║  📚 دیکشنری: ' + Object.keys(dictionary).length + ' کلمه                           ║');
    console.log('║  📖 اصطلاحات: ' + Object.keys(phrases).length + ' عبارت                          ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log(`✅ http://localhost:${PORT}`);
    console.log('');
    console.log('📡 تست APIها:');
    console.log(`   curl http://localhost:${PORT}/api/health`);
    console.log(`   curl -X POST http://localhost:${PORT}/api/bandari/detect -H "Content-Type: application/json" -d '{"text":"واویلا چقد گرما!"}'`);
    console.log(`   curl -X POST http://localhost:${PORT}/api/bandari/to-bandari -H "Content-Type: application/json" -d '{"text":"سلام چطوری؟"}'`);
    console.log(`   curl http://localhost:${PORT}/api/bandari/dictionary`);
    console.log('');
});

module.exports = server;
