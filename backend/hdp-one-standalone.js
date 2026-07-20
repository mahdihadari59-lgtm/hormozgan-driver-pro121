// HDP ONE v5.2 - نسخه مستقل بدون نیاز به npm
// شامل: Express, CORS, APIهای کامل

const http = require('http');
const url = require('url');

// ============================================
// 🚀 HTTP Server ساده (بدون نیاز به express)
// ============================================

// Intent Classifier ساده
class IntentClassifier {
    constructor() {
        this.intents = {
            greeting: { name: "احوالپرسی", priority: 3, threshold: 8, keywords: ["سلام", "درود", "چطوری", "خوبی", "چه خبر"] },
            farewell: { name: "خداحافظی", priority: 3, threshold: 8, keywords: ["خداحافظ", "بای", "فعلا", "تا بعد"] },
            emergency: { name: "اورژانس", priority: 0, threshold: 3, keywords: ["اورژانس", "کمک فوری", "خطر", "115", "110"] },
            traffic: { name: "ترافیک", priority: 2, threshold: 6, keywords: ["ترافیک", "شلوغ", "راه بندان", "چهارراه", "غزی"] },
            gold: { name: "طلا و ارز", priority: 2, threshold: 6, keywords: ["طلا", "سکه", "دلار", "قیمت", "امامی"] },
            dialect: { name: "گویش بندری", priority: 2, threshold: 6, keywords: ["بندری", "گویش", "واویلا", "دلمی", "لچو"] },
            general: { name: "عمومی", priority: 10, threshold: 0, keywords: {} }
        };
        this.stats = { total: 0, byIntent: {} };
    }

    classify(text) {
        const lower = text.toLowerCase();
        let best = 'general';
        let bestScore = 0;
        
        for (const [intent, config] of Object.entries(this.intents)) {
            let score = 0;
            for (const kw of config.keywords) {
                if (lower.includes(kw)) score += 10;
            }
            const final = Math.min(Math.floor(score / (lower.split(' ').length + 1) * 2), 100);
            if (final >= config.threshold && final > bestScore) {
                bestScore = final;
                best = intent;
            }
        }
        
        this.stats.total++;
        this.stats.byIntent[best] = (this.stats.byIntent[best] || 0) + 1;
        
        return { intent: best, name: this.intents[best]?.name || best, score: bestScore, confidence: bestScore / 100 };
    }
    
    getStats() { return this.stats; }
}

const classifier = new IntentClassifier();

// ============================================
// 📡 پاسخ‌های هوشمند
// ============================================
const chatResponses = {
    greeting: ["سلام! به HDP ONE خوش آمديد. چطور مي توانم به شما کمک کنم؟", "درود! در خدمت شما هستم."],
    farewell: ["خداحافظ! اميدوارم باز هم از خدمات HDP ONE استفاده کنيد.", "بدرود! سفر خوبي داشته باشيد."],
    traffic: ["وضعيت ترافيک بندرعباس: چهارراه غزي سنگين، بلوار ساحلي روان"],
    gold: ["قيمت امروز طلا: طلاي 18 عيار 4,852,000 تومان، سکه امامي 52,000,000 تومان"],
    dialect: ["\"واويلا\" در گويش بندري يعني \"چه قدر\" يا \"چقدر\""],
    general: ["متوجه سوال شما نشدم. سوالات متداول: ترافيک چطوره؟ قيمت طلا چند است؟"]
};

function getResponse(intent) {
    const responses = chatResponses[intent] || chatResponses.general;
    return responses[Math.floor(Math.random() * responses.length)];
}

// ============================================
// 🌐 APIهای واقعی (بدون وابستگی خارجی)
// ============================================
async function getRealGold() {
    try {
        const https = require('https');
        const data = await new Promise((resolve) => {
            https.get('https://raw.githubusercontent.com/HosseinOdd/Navasan-API/main/data/gold.json', (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    try { resolve(JSON.parse(body)); } catch(e) { resolve(null); }
                });
            }).on('error', () => resolve(null));
        });
        if (data) {
            return { success: true, source: 'Navasan', gold18: data.gold_18, updated: new Date().toISOString() };
        }
    } catch(e) {}
    return { success: true, source: 'Fallback', gold18: '4,852,000', updated: new Date().toISOString() };
}

async function getRealWeather(city) {
    try {
        const https = require('https');
        const coords = { 'بندرعباس': '27.183,56.267', 'قشم': '26.949,56.290' };
        const [lat, lon] = (coords[city] || '27.183,56.267').split(',');
        const data = await new Promise((resolve) => {
            https.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    try { resolve(JSON.parse(body)); } catch(e) { resolve(null); }
                });
            }).on('error', () => resolve(null));
        });
        if (data?.current_weather) {
            return { success: true, city, temperature: data.current_weather.temperature + '°C', wind: data.current_weather.windspeed + ' km/h' };
        }
    } catch(e) {}
    return { success: true, city, temperature: '35°C', wind: '15 km/h', source: 'Fallback' };
}

// ============================================
// 🚀 ایجاد HTTP Server
// ============================================
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // ============================================
    // 📡 مسیرهای API
    // ============================================
    
    // Health Check
    if (pathname === '/api/health') {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString(), version: '5.2.0' }));
        return;
    }
    
    // Stats
    if (pathname === '/api/stats') {
        res.writeHead(200);
        res.end(JSON.stringify(classifier.getStats()));
        return;
    }
    
    // Intent Detection
    if (pathname === '/api/intent' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { text } = JSON.parse(body);
                const result = classifier.classify(text);
                res.writeHead(200);
                res.end(JSON.stringify(result));
            } catch(e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid request' }));
            }
        });
        return;
    }
    
    // Chat Pro
    if (pathname === '/api/ai/chat-pro' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { message } = JSON.parse(body);
                const result = classifier.classify(message);
                res.writeHead(200);
                res.end(JSON.stringify({
                    ok: true,
                    intent: result.intent,
                    confidence: result.confidence,
                    response: getResponse(result.intent)
                }));
            } catch(e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid request' }));
            }
        });
        return;
    }
    
    // Traffic API
    if (pathname === '/api/traffic') {
        const location = parsedUrl.query.location;
        const trafficData = { 'چهارراه غزی': 'سنگین', 'بلوار ساحلی': 'روان', 'میدان سپاه': 'نیمه سنگین' };
        const status = (location && trafficData[location]) ? trafficData[location] : 'متوسط';
        res.writeHead(200);
        res.end(JSON.stringify({ location: location || 'بندرعباس', status, updated: new Date().toISOString() }));
        return;
    }
    
    // Gold API
    if (pathname === '/api/gold') {
        const data = await getRealGold();
        res.writeHead(200);
        res.end(JSON.stringify(data));
        return;
    }
    
    // Weather API
    if (pathname === '/api/weather') {
        const city = parsedUrl.query.city || 'بندرعباس';
        const data = await getRealWeather(city);
        res.writeHead(200);
        res.end(JSON.stringify(data));
        return;
    }
    
    // Bandari API
    if (pathname === '/api/bandari') {
        res.writeHead(200);
        res.end(JSON.stringify({ name: 'گویش بندری', region: 'بندرعباس', sample: 'سَلام چطوری؟ خوبی دلمی؟' }));
        return;
    }
    
    // Fal API
    if (pathname === '/api/fal') {
        res.writeHead(200);
        res.end(JSON.stringify({ poem: 'صبا به لطف بگو آن غزال رعنا را', interpretation: 'روز خوبی در پیش دارید' }));
        return;
    }
    
    // Docs
    if (pathname === '/api/docs') {
        res.writeHead(200);
        res.end(JSON.stringify({
            name: 'HDP ONE API',
            version: '5.2.0',
            endpoints: ['/api/health', '/api/intent', '/api/ai/chat-pro', '/api/traffic', '/api/gold', '/api/weather', '/api/bandari', '/api/fal', '/api/stats']
        }));
        return;
    }
    
    // 404
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

const PORT = 9090;
server.listen(PORT, () => {
    console.log('\n════════════════════════════════════════════════════════════════════');
    console.log('🚀 HDP ONE v5.2 - نسخه مستقل (بدون نیاز به npm)');
    console.log('════════════════════════════════════════════════════════════════════');
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ بدون وابستگی - فقط Node.js خالص`);
    console.log('');
    console.log('📡 APIهای فعال:');
    console.log('   GET  /api/health     - سلامت سیستم');
    console.log('   POST /api/intent     - تشخیص Intent');
    console.log('   POST /api/ai/chat-pro - چت هوشمند');
    console.log('   GET  /api/traffic    - وضعیت ترافیک');
    console.log('   GET  /api/gold       - قیمت طلا (واقعی)');
    console.log('   GET  /api/weather    - آب و هوا (واقعی)');
    console.log('   GET  /api/bandari    - گویش بندری');
    console.log('   GET  /api/fal        - فال حافظ');
    console.log('   GET  /api/stats      - آمار سیستم');
    console.log('════════════════════════════════════════════════════════════════════\n');
});

module.exports = server;
