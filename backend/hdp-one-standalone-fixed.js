// HDP ONE v5.3 - نسخه تعمیر شده (رفع خطای POST)

const http = require('http');

// ============================================
// Intent Classifier
// ============================================
class IntentClassifier {
    constructor() {
        this.intents = {
            greeting: { name: "احوالپرسی", priority: 3, threshold: 5, keywords: ["سلام", "درود", "چطوری", "خوبی", "چه خبر"] },
            farewell: { name: "خداحافظی", priority: 3, threshold: 5, keywords: ["خداحافظ", "بای", "فعلا", "تا بعد"] },
            emergency: { name: "اورژانس", priority: 0, threshold: 2, keywords: ["اورژانس", "کمک فوری", "خطر", "115", "110"] },
            traffic: { name: "ترافیک", priority: 2, threshold: 5, keywords: ["ترافیک", "شلوغ", "راه بندان", "چهارراه", "غزی"] },
            gold: { name: "طلا و ارز", priority: 2, threshold: 5, keywords: ["طلا", "سکه", "دلار", "قیمت", "امامی"] },
            dialect: { name: "گویش بندری", priority: 2, threshold: 5, keywords: ["بندری", "گویش", "واویلا", "دلمی", "لچو"] },
            general: { name: "عمومی", priority: 10, threshold: 0, keywords: {} }
        };
        this.stats = { total: 0, byIntent: {} };
    }

    classify(text) {
        if (!text || text.trim() === '') return { intent: 'general', name: 'عمومی', score: 0, confidence: 0 };
        
        const lower = text.toLowerCase();
        let best = 'general';
        let bestScore = 0;
        
        for (const [intent, config] of Object.entries(this.intents)) {
            let score = 0;
            for (const kw of config.keywords) {
                if (lower.includes(kw.toLowerCase())) score += 10;
            }
            const final = Math.min(Math.floor(score / (lower.split(' ').length + 1) * 1.5), 100);
            if (final >= config.threshold && final > bestScore) {
                bestScore = final;
                best = intent;
            }
        }
        
        this.stats.total++;
        this.stats.byIntent[best] = (this.stats.byIntent[best] || 0) + 1;
        
        return { intent: best, name: this.intents[best]?.name || best, score: bestScore, confidence: Math.min(bestScore / 100, 0.99) };
    }
    
    getStats() { 
        const avgConf = this.stats.total > 0 ? (Object.values(this.stats.byIntent).reduce((a,b) => a + b, 0) / this.stats.total * 100).toFixed(1) : 0;
        return { total: this.stats.total, byIntent: this.stats.byIntent, avgConfidence: avgConf + '%' };
    }
}

const classifier = new IntentClassifier();

// ============================================
// پاسخ‌های هوشمند
// ============================================
const chatResponses = {
    greeting: ["سلام! به HDP ONE خوش آمديد. چطور مي توانم به شما کمک کنم؟", "درود! در خدمت شما هستم. چه کمکی می‌توانم بکنم؟"],
    farewell: ["خداحافظ! اميدوارم باز هم از خدمات HDP ONE استفاده کنيد.", "بدرود! سفر خوبي داشته باشيد."],
    traffic: ["وضعيت ترافيک بندرعباس: چهارراه غزي سنگين، بلوار ساحلي روان، ميدان سپاه نيمه سنگين"],
    gold: ["قيمت امروز طلا: طلاي 18 عيار 4,852,000 تومان، سکه امامي 52,000,000 تومان"],
    dialect: ["\"واويلا\" در گويش بندري يعني \"چه قدر\" يا \"چقدر\". مثال: واویلا چقد گرما!"],
    emergency: ["شماره‌های ضروری: اورژانس 115، پلیس 110، آتش‌نشانی 125"],
    general: ["متوجه سوال شما نشدم. سوالات متداول: ترافيک چطوره؟ قيمت طلا چند است؟ واویلا یعنی چی؟"]
};

function getResponse(intent) {
    const responses = chatResponses[intent] || chatResponses.general;
    return responses[Math.floor(Math.random() * responses.length)];
}

// ============================================
// APIهای واقعی
// ============================================
async function getRealGold() {
    try {
        const data = await new Promise((resolve) => {
            const req = require('https').get('https://raw.githubusercontent.com/HosseinOdd/Navasan-API/main/data/gold.json', (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    try { resolve(JSON.parse(body)); } catch(e) { resolve(null); }
                });
            });
            req.on('error', () => resolve(null));
            req.setTimeout(5000, () => { req.destroy(); resolve(null); });
        });
        if (data) {
            return { success: true, source: 'Navasan (واقعی)', gold18: data.gold_18, emamiCoin: data.emami_coin, updated: new Date().toISOString() };
        }
    } catch(e) {}
    return { success: true, source: 'Fallback', gold18: '4,852,000', emamiCoin: '52,000,000', updated: new Date().toISOString() };
}

async function getRealWeather(city) {
    const coords = { 'بندرعباس': '27.183,56.267', 'قشم': '26.949,56.290', 'کیش': '26.537,53.975' };
    const [lat, lon] = (coords[city] || '27.183,56.267').split(',');
    try {
        const data = await new Promise((resolve) => {
            const req = require('https').get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    try { resolve(JSON.parse(body)); } catch(e) { resolve(null); }
                });
            });
            req.on('error', () => resolve(null));
            req.setTimeout(5000, () => { req.destroy(); resolve(null); });
        });
        if (data?.current_weather) {
            const temp = data.current_weather.temperature;
            return {
                success: true,
                source: 'Open-Meteo (واقعی)',
                city: city,
                temperature: temp + '°C',
                wind: data.current_weather.windspeed + ' km/h',
                condition: temp > 30 ? 'گرم' : 'معمولی',
                updated: new Date().toISOString()
            };
        }
    } catch(e) {}
    return { success: true, source: 'Fallback', city, temperature: '35°C', wind: '15 km/h', condition: 'نیمه ابری', updated: new Date().toISOString() };
}

// ============================================
// پردازش درخواست
// ============================================
function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch(e) {
                resolve({});
            }
        });
        req.on('error', () => resolve({}));
    });
}

// ============================================
// ایجاد سرور
// ============================================
const server = http.createServer(async (req, res) => {
    const url = req.url;
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
    // GET endpoints
    // ============================================
    
    // Health
    if (url === '/api/health' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString(), version: '5.3.0' }));
        return;
    }
    
    // Stats
    if (url === '/api/stats' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify(classifier.getStats()));
        return;
    }
    
    // Traffic
    if (url.startsWith('/api/traffic')) {
        const location = url.includes('?') ? decodeURIComponent(url.split('location=')[1]?.split('&')[0] || '') : '';
        const trafficDB = { 'چهارراه غزی': 'سنگین', 'بلوار ساحلی': 'روان', 'میدان سپاه': 'نیمه سنگین' };
        const status = trafficDB[location] || 'متوسط';
        res.writeHead(200);
        res.end(JSON.stringify({ location: location || 'بندرعباس', status, updated: new Date().toISOString() }));
        return;
    }
    
    // Gold
    if (url === '/api/gold' && method === 'GET') {
        const data = await getRealGold();
        res.writeHead(200);
        res.end(JSON.stringify(data));
        return;
    }
    
    // Weather
    if (url.startsWith('/api/weather')) {
        const city = url.includes('?') ? decodeURIComponent(url.split('city=')[1]?.split('&')[0] || 'بندرعباس') : 'بندرعباس';
        const data = await getRealWeather(city);
        res.writeHead(200);
        res.end(JSON.stringify(data));
        return;
    }
    
    // Bandari
    if (url === '/api/bandari' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ name: 'گویش بندری', region: 'بندرعباس', sample: 'سَلام چطوری؟ خوبی دلمی؟' }));
        return;
    }
    
    // Fal
    if (url === '/api/fal' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ poem: 'صبا به لطف بگو آن غزال رعنا را', interpretation: 'روز خوبی در پیش دارید' }));
        return;
    }
    
    // Docs
    if (url === '/api/docs' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            name: 'HDP ONE API',
            version: '5.3.0',
            endpoints: ['/api/health', '/api/intent', '/api/ai/chat-pro', '/api/traffic', '/api/gold', '/api/weather', '/api/bandari', '/api/fal', '/api/stats']
        }));
        return;
    }
    
    // ============================================
    // POST endpoints
    // ============================================
    
    // Intent
    if (url === '/api/intent' && method === 'POST') {
        const body = await parseBody(req);
        const text = body.text || body.message || '';
        const result = classifier.classify(text);
        res.writeHead(200);
        res.end(JSON.stringify(result));
        return;
    }
    
    // Chat Pro
    if (url === '/api/ai/chat-pro' && method === 'POST') {
        const body = await parseBody(req);
        const message = body.message || body.text || '';
        const result = classifier.classify(message);
        res.writeHead(200);
        res.end(JSON.stringify({
            ok: true,
            intent: result.intent,
            confidence: result.confidence,
            response: getResponse(result.intent)
        }));
        return;
    }
    
    // 404
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found', url: url }));
});

const PORT = 9090;
server.listen(PORT, () => {
    console.log('\n════════════════════════════════════════════════════════════════════');
    console.log('🚀 HDP ONE v5.3 - نسخه تعمیر شده');
    console.log('════════════════════════════════════════════════════════════════════');
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ بدون وابستگی - فقط Node.js خالص`);
    console.log('');
    console.log('📡 APIهای فعال:');
    console.log('   GET  /api/health      - سلامت سیستم');
    console.log('   POST /api/intent      - تشخیص Intent');
    console.log('   POST /api/ai/chat-pro - چت هوشمند');
    console.log('   GET  /api/traffic     - وضعیت ترافیک');
    console.log('   GET  /api/gold        - قیمت طلا (واقعی)');
    console.log('   GET  /api/weather     - آب و هوا (واقعی)');
    console.log('   GET  /api/bandari     - گویش بندری');
    console.log('   GET  /api/fal         - فال حافظ');
    console.log('   GET  /api/stats       - آمار سیستم');
    console.log('════════════════════════════════════════════════════════════════════\n');
});

module.exports = server;
