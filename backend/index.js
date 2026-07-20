const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 9090;

app.use(cors());
app.use(express.json());

// Intent Classifier
const IntentClassifier = require('./finalIntentClassifier_PRODUCTION.js');
const classifier = new IntentClassifier();

// Keyword Classifier v3.0
const KeywordClassifier = require('./keyword-classifier.js');
const keywordClassifier = new KeywordClassifier();

// ============================================
// پاسخ‌های هوشمند چت‌بات
// ============================================
const chatResponses = {
    'greeting': [
        'سلام! به HDP ONE خوش آمديد. چطور مي توانم به شما کمک کنم؟',
        'سلام! در خدمت شما هستم. چه کمکی از دستم برمياد؟',
        'درود! آماده پاسخگويي به سوالات شما درباره هرمزگان هستم.'
    ],
    'farewell': [
        'خداحافظ! اميدوارم باز هم از خدمات HDP ONE استفاده کنيد.',
        'بدرود! سفر خوبي داشته باشيد.',
        'خدا نگهدار! هر سوالی داشتيد در خدمتيم.'
    ],
    'traffic': [
        'وضعيت ترافيک بندرعباس: چهارراه غزي سنگين، بلوار ساحلي روان، ميدان سپاه نيمه سنگين',
        'گزارش ترافيک: مسيرهاي منتهي به غزي شلوغ است. بلوار ساحلي آزاد است.'
    ],
    'gold': [
        'قيمت امروز طلا: طلاي 18 عيار 4,852,000 تومان، سکه امامي 52,000,000 تومان',
        'آخرين نرخ‌ها: طلا نسبت به ديروز 0.04 درصد افزايش داشته است.'
    ],
    'dialect': [
        '"واويلا" در گويش بندري يعني "چه قدر" يا "چقدر". مثال: واویلا چقد گرما!',
        'واژه‌هاي بندري: دلمي=عزيزم، لچو=گرسنه، چو هسين=چطوري؟'
    ],
    'medical': [
        'بيمارستان‌هاي بندرعباس: بيمارستان شهيد محمدي، بيمارستان کودکان، بيمارستان تامين اجتماعي'
    ],
    'tourism': [
        'جاهاي ديدني هرمزگان: جزيره قشم (دره ستارگان، جنگل حرا)، جزيره هرمز (خاک سرخ)'
    ],
    'food': [
        'غذاهاي محلي هرمزگان: قليه ماهي، ميگو پلاو، هاواري (نان محلي)، خوراک خرچنگ'
    ],
    'weather': [
        'وضعيت آب و هواي بندرعباس: دما 35 درجه، رطوبت 65 درصد، باد 15 کيلومتر بر ساعت'
    ],
    'emergency': [
        'شماره‌هاي ضروري: اورژانس 115، پليس 110، آتش‌نشاني 125، هلال احمر 112'
    ],
    'general': [
        'متوجه سوال شما نشدم. سوالات متداول: ترافيک چطوره؟ قيمت طلا چند است؟ جزيره قشم کجاست؟ واویلا یعنی چی؟'
    ]
};

function getRandomResponse(intent) {
    const responses = chatResponses[intent] || chatResponses['general'];
    return responses[Math.floor(Math.random() * responses.length)];
}

function getSuggestions(intent) {
    const suggestions = {
        'greeting': ['ترافيک چطوره؟', 'قيمت طلا چند است؟', 'قشم کجاست؟'],
        'traffic': ['وضعيت ترافيک غزي', 'مسير جايگزين'],
        'gold': ['قيمت سکه', 'قيمت دلار'],
        'dialect': ['معني دلمي', 'لچو يعني چي؟'],
        'default': ['کمک', 'راهنمايي']
    };
    return suggestions[intent] || suggestions['default'];
}

// ============================================
// 🚦 TRAFFIC API
// ============================================
app.get('/api/traffic', (req, res) => {
    const { location } = req.query;
    const trafficDB = {
        "چهارراه غزي": "سنگين",
        "بلوار ساحلي": "روان",
        "ميدان سپاه": "نيمه سنگين"
    };
    if (location && trafficDB[location]) {
        res.json({ location: location, status: trafficDB[location], updated: new Date().toISOString() });
    } else {
        res.json({ location: "بندرعباس", status: "متوسط", updated: new Date().toISOString() });
    }
});

// ============================================
// 📡 MAIN APIs
// ============================================
app.get('/api/health', (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString(), version: "5.1.0" });
});

app.post('/api/intent', (req, res) => {
    const { text } = req.body;
    const result = classifier.classify(text);
    res.json(result);
});

app.post('/api/ai/chat-pro', (req, res) => {
    const { message, userId } = req.body;
    const result = classifier.classify(message, userId);
    const response = getRandomResponse(result.intent);
    res.json({ ok: true, intent: result.intent, confidence: result.confidence, response: response });
});

app.get('/api/stats', (req, res) => {
    res.json(classifier.getStats());
});

app.get('/api/bandari', (req, res) => {
    res.json({ name: "گويش بندري", region: "بندرعباس", sample: "سلام چطوری؟ خوبي دلمي؟" });
});

app.get('/api/gold/live', (req, res) => {
    res.json({ live: true, gold18: "4,852,000", change: "+0.04%" });
});

app.get('/api/fal', (req, res) => {
    res.json({ poem: "صبا به لطف بگو آن غزال رعنا را", interpretation: "روز خوبي در پيش داريد" });
});

app.get('/api/gold', (req, res) => res.json({ gold18: "4,850,000" }));
app.get('/api/time', (req, res) => res.json({ now: new Date().toISOString() }));
app.get('/api/news', (req, res) => res.json({ news: ["خبر 1"] }));
app.post('/api/feedback', (req, res) => res.json({ ok: true }));

// ============================================
// 🔑 KEYWORD CLASSIFIER APIs
// ============================================
app.post('/api/keyword/classify', (req, res) => {
    const { keyword } = req.body;
    if (!keyword) return res.json({ error: 'کلمه کليدي وارد نشده است' });
    const category = keywordClassifier.classifyKeyword(keyword);
    const decomposed = keywordClassifier.decomposeCompoundKeyword(keyword);
    res.json({ keyword, category, decomposed });
});

app.post('/api/keyword/classify-all', (req, res) => {
    const { keywords } = req.body;
    if (!keywords || !Array.isArray(keywords)) return res.json({ error: 'آرايه‌اي از کليدواژه‌ها وارد کنيد' });
    const classified = keywordClassifier.classifyAll(keywords);
    const stats = keywordClassifier.getStatistics(classified);
    res.json({ classified, stats });
});

app.post('/api/keyword/decompose', (req, res) => {
    const { keyword } = req.body;
    if (!keyword) return res.json({ error: 'کلمه کليدي وارد نشده است' });
    const decomposed = keywordClassifier.decomposeCompoundKeyword(keyword);
    res.json(decomposed);
});

app.post('/api/keyword/search', (req, res) => {
    const { keywords, searchTerm } = req.body;
    if (!keywords || !searchTerm) return res.json({ error: 'کليدواژه‌ها و عبارت جستجو وارد نشده است' });
    const results = keywordClassifier.search(keywords, searchTerm);
    res.json(results);
});

app.get('/api/keyword/categories', (req, res) => {
    res.json({
        totalCategories: Object.keys(keywordClassifier.categories).length,
        categories: Object.keys(keywordClassifier.categories)
    });
});

// ============================================
// 🌤️ NEW APIs
// ============================================
app.get('/api/weather', (req, res) => {
    const { city = 'بندرعباس' } = req.query;
    const weatherData = {
        'بندرعباس': { temp: 35, condition: 'نيمه ابري', humidity: 65, wind: 15 },
        'قشم': { temp: 34, condition: 'آفتابي', humidity: 60, wind: 12 },
        'کيش': { temp: 33, condition: 'آفتابي', humidity: 55, wind: 10 }
    };
    const data = weatherData[city] || weatherData['بندرعباس'];
    res.json({ city, ...data, updated: new Date().toISOString() });
});

app.get('/api/hospitals', (req, res) => {
    const hospitals = [
        { name: 'بيمارستان شهيد محمدي', address: 'بلوار امام خميني', phone: '076-33440000', emergency: true },
        { name: 'بيمارستان کودکان', address: 'خيابان طالقاني', phone: '076-33450000', emergency: true },
        { name: 'بيمارستان تامين اجتماعي', address: 'بلوار پاسداران', phone: '076-33460000', emergency: false }
    ];
    res.json({ hospitals, count: hospitals.length, updated: new Date().toISOString() });
});

app.get('/api/prayer-times', (req, res) => {
    res.json({
        date: new Date().toLocaleDateString('fa-IR'),
        city: 'بندرعباس',
        times: { fajr: '04:30', sunrise: '05:55', dhuhr: '12:45', asr: '16:15', maghrib: '19:35', isha: '20:55' },
        updated: new Date().toISOString()
    });
});

app.get('/api/atms', (req, res) => {
    const { neighborhood } = req.query;
    const atmsList = ['ATM بانک ملي - چهارراه غزي', 'ATM بانک صادرات - ميدان سپاه'];
    res.json({ neighborhood: neighborhood || 'همه مناطق', atms: atmsList, count: atmsList.length });
});

app.get('/api/suggestions', (req, res) => {
    const { q } = req.query;
    const allSuggestions = ['ترافيک چطوره؟', 'قيمت طلا چند است؟', 'واويلا يعني چي؟', 'جزيره قشم کجاست؟'];
    const suggestions = q ? allSuggestions.filter(s => s.includes(q)) : allSuggestions;
    res.json({ query: q || '', suggestions, count: suggestions.length });
});

// ============================================
// 🚀 START SERVER
// ============================================
app.listen(PORT, () => {
    console.log(`HDP ONE v5.1 Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log(`${Object.keys(keywordClassifier.categories).length}+ Categories Active`);
});

module.exports = app;

// ============================================
// 🚦 سیستم هوشمند ترافیک HDP ONE
// ============================================

const TrafficIntelligenceSystem = require('./traffic_cameras');
const trafficAI = new TrafficIntelligenceSystem();

// دریافت دوربین‌ها
app.get('/api/traffic/cameras', (req, res) => {
    const type = req.query.type;
    const cameras = trafficAI.getCameraStatus(type);
    res.json({ ok: true, cameras, count: cameras.length });
});

// دریافت مناطق حادثه‌خیز
app.get('/api/traffic/hotspots', (req, res) => {
    const level = req.query.level;
    const hotspots = trafficAI.getHotspots(level);
    res.json({ ok: true, hotspots });
});

// دریافت مسیر جایگزین
app.get('/api/traffic/alternative', (req, res) => {
    const location = req.query.location;
    if (!location) return res.json({ ok: false, error: 'موقعیت را وارد کنید' });
    const route = trafficAI.getAlternativeRoute(location);
    res.json({ ok: true, route });
});

// دریافت مسیر هوشمند
app.get('/api/traffic/smart-route', (req, res) => {
    const { from, to } = req.query;
    if (!from || !to) return res.json({ ok: false, error: 'مبدا و مقصد را وارد کنید' });
    const smartRoute = trafficAI.getSmartRoute(from, to);
    res.json({ ok: true, ...smartRoute });
});

// دریافت هشدار ایمنی
app.get('/api/traffic/alert', (req, res) => {
    const location = req.query.location;
    if (!location) return res.json({ ok: false, error: 'موقعیت را وارد کنید' });
    const alert = trafficAI.getSafetyAlert(location);
    res.json({ ok: true, alert });
});

// دریافت جریمه تخلف
app.get('/api/traffic/fine', (req, res) => {
    const { violation, speed } = req.query;
    const fine = trafficAI.getFine(violation, parseInt(speed));
    res.json({ ok: true, fine });
});

// گزارش کامل ترافیک
app.get('/api/traffic/report-full', (req, res) => {
    const report = trafficAI.getFullReport();
    res.json({ ok: true, report });
});

console.log('🚦 Traffic Intelligence System added to HDP ONE');

// ============================================
// 🗺️ سرویس نقشه و مسیریابی نشان (Neshan)
// ============================================

const neshanRoute = require('./services/neshan-route');
const neshanConfig = require('./config/neshan.config');

// دریافت مسیر بین دو نقطه
app.post('/api/neshan/route', async (req, res) => {
    const { origin, destination, options } = req.body;
    
    if (!origin || !destination) {
        return res.json({ ok: false, error: 'مبدا و مقصد را وارد کنید' });
    }
    
    try {
        const route = await neshanRoute.getRoute(origin, destination, options);
        res.json({ ok: true, route });
    } catch (error) {
        res.json({ ok: false, error: error.message });
    }
});

// دریافت ترافیک لحظه‌ای مسیر
app.post('/api/neshan/traffic', async (req, res) => {
    const { origin, destination } = req.body;
    
    if (!origin || !destination) {
        return res.json({ ok: false, error: 'مبدا و مقصد را وارد کنید' });
    }
    
    try {
        const traffic = await neshanRoute.getTrafficInfo(origin, destination);
        res.json({ ok: true, traffic });
    } catch (error) {
        res.json({ ok: false, error: error.message });
    }
});

// دریافت مسیرهای جایگزین
app.post('/api/neshan/alternatives', async (req, res) => {
    const { origin, destination } = req.body;
    
    if (!origin || !destination) {
        return res.json({ ok: false, error: 'مبدا و مقصد را وارد کنید' });
    }
    
    try {
        const routes = await neshanRoute.getAlternativeRoutes(origin, destination);
        res.json({ ok: true, routes });
    } catch (error) {
        res.json({ ok: false, error: error.message });
    }
});

// دریافت آمار سرویس نشان
app.get('/api/neshan/stats', (req, res) => {
    res.json({ ok: true, stats: neshanRoute.getStats(), config: neshanConfig });
});

// دریافت مختصات مراکز استان
app.get('/api/neshan/centers', (req, res) => {
    res.json({ ok: true, centers: neshanConfig.centers });
});

console.log('🗺️ Neshan Route Service added to HDP ONE');

app.get('/api/neshan/centers', (req, res) => {
    const config = require('./config/neshan.config');
    res.json({ ok: true, centers: config.centers });
});

app.post('/api/neshan/route', async (req, res) => {
    const { origin, destination } = req.body;
    if (!origin || !destination) {
        return res.json({ ok: false, error: 'مبدا و مقصد را وارد کنید' });
    }
    const neshan = require('./services/neshan-route');
    const result = await neshan.getRoute(origin, destination);
    res.json(result);
});

console.log('🗺️ Neshan API added');

// ============================================
// 🗺️ مسیریابی درون شهری محلات بندرعباس
// ============================================

const neighborhoodRoutes = require('./services/neighborhood-routes');

// دریافت لیست محلات
app.get('/api/neighborhoods', (req, res) => {
    const neighborhoods = neighborhoodRoutes.getNeighborhoods();
    res.json({ ok: true, neighborhoods, count: neighborhoods.length });
});

// محاسبه مسیر بین دو محله
app.post('/api/neighborhoods/route', async (req, res) => {
    const { from, to } = req.body;
    
    if (!from || !to) {
        return res.json({ ok: false, error: 'مبدا و مقصد را وارد کنید' });
    }
    
    const route = await neighborhoodRoutes.getRoute(from, to);
    res.json(route);
});

// دریافت مختصات یک محله
app.get('/api/neighborhoods/:name', (req, res) => {
    const { name } = req.params;
    const coords = neighborhoodRoutes.getCoordinates(name);
    
    if (coords) {
        res.json({ ok: true, neighborhood: coords });
    } else {
        res.json({ ok: false, error: 'محله یافت نشد' });
    }
});

console.log('🗺️ Neighborhood routing API added');
