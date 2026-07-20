const http = require('http');
const url = require('url');

// ============================================
// 🚦 سیستم هوشمند ترافیک
// ============================================

// دیتابیس ترافیک
const trafficStatus = {
    'چهارراه غزی': { status: 'سنگین ⚠️', advice: 'از مسیر بلوار ساحلی استفاده کنید', waitTime: '15-20 دقیقه' },
    'غزی': { status: 'سنگین ⚠️', advice: 'از مسیر بلوار ساحلی استفاده کنید', waitTime: '15-20 دقیقه' },
    'بلوار ساحلی': { status: 'روان ✅', advice: 'مسیر آزاد است', waitTime: '5 دقیقه' },
    'ساحلی': { status: 'روان ✅', advice: 'مسیر آزاد است', waitTime: '5 دقیقه' },
    'میدان سپاه': { status: 'نیمه سنگین 🟡', advice: 'کمی صبر کنید', waitTime: '10-15 دقیقه' },
    'سپاه': { status: 'نیمه سنگین 🟡', advice: 'کمی صبر کنید', waitTime: '10-15 دقیقه' },
    'پل سفید': { status: 'روان ✅', advice: 'مسیر آزاد است', waitTime: '5 دقیقه' },
    'طاقی': { status: 'سنگین ⚠️', advice: 'از مسیر جایگزین استفاده کنید', waitTime: '15-20 دقیقه' }
};

// مسیرهای جایگزین
const alternativeRoutes = {
    'چهارراه غزی': { alternative: 'بلوار ساحلی', timeSaved: 10, distance: '2.5 km', traffic: 'روان' },
    'غزی': { alternative: 'بلوار ساحلی', timeSaved: 10, distance: '2.5 km', traffic: 'روان' },
    'میدان سپاه': { alternative: 'بلوار جمهوری', timeSaved: 12, distance: '3 km', traffic: 'روان' },
    'سه‌راه ایسین': { alternative: 'جاده قدیم میناب', timeSaved: 20, distance: '8 km', traffic: 'نیمه سنگین' }
};

// مناطق حادثه‌خیز
const hotspots = {
    'سه‌راه ایسین': { level: 'بحرانی', accidents: 45, message: 'تصادفات زنجیره‌ای', recommendation: 'با احتیاط کامل رانندگی کنید' },
    'هدیش': { level: 'بحرانی', accidents: 38, message: 'پیچ خطرناک', recommendation: 'سرعت را کاهش دهید' },
    'تنگ زاغ': { level: 'بحرانی', accidents: 32, message: 'تنگنا و کاهش ناگهانی سرعت', recommendation: 'فاصله طولی را رعایت کنید' },
    'چهارراه غزی': { level: 'پرخطر', accidents: 28, message: 'ترافیک سنگین', recommendation: 'از مسیر جایگزین استفاده کنید' },
    'میدان سپاه': { level: 'پرخطر', accidents: 25, message: 'تداخل مسیرها', recommendation: 'با احتیاط رانندگی کنید' }
};

// گزارش کامل
const fullReport = {
    cameras: { total: 18, speed: 8, redLight: 5, plateReader: 5 },
    hotspots: { total: 8, critical: 3, high: 2, medium: 3 },
    alternativeRoutes: 4,
    lastUpdate: new Date().toISOString()
};

// ============================================
// توابع کمکی
// ============================================
function getTrafficStatus(location) {
    if (!location) {
        return { location: 'بندرعباس', status: 'سنگین ⚠️', advice: 'از مسیر جایگزین استفاده کنید', waitTime: '15-20 دقیقه' };
    }
    
    // جستجوی دقیق
    if (trafficStatus[location]) {
        return { location, ...trafficStatus[location] };
    }
    
    // جستجوی جزئی
    for (const [key, value] of Object.entries(trafficStatus)) {
        if (location.includes(key) || key.includes(location)) {
            return { location: key, ...value };
        }
    }
    
    return { location, status: 'معمولی 🚦', advice: 'ترافیک عادی است', waitTime: '5-10 دقیقه' };
}

function getAlternativeRoute(location) {
    if (alternativeRoutes[location]) {
        return { ok: true, route: alternativeRoutes[location] };
    }
    for (const [key, value] of Object.entries(alternativeRoutes)) {
        if (location.includes(key) || key.includes(location)) {
            return { ok: true, route: value };
        }
    }
    return { ok: false, route: null, message: 'مسیر جایگزینی یافت نشد' };
}

function getSmartRoute(from, to) {
    const route = alternativeRoutes[from] || alternativeRoutes[to];
    if (route) {
        return {
            ok: true,
            from,
            to: route.alternative,
            timeSaved: `${route.timeSaved} دقیقه`,
            distance: route.distance,
            traffic: route.traffic,
            recommendation: `استفاده از ${route.alternative} به جای ${from} باعث صرفه‌جویی ${route.timeSaved} دقیقه‌ای می‌شود`
        };
    }
    return { ok: false, error: 'مسیری یافت نشد', recommendation: 'از مسیر اصلی استفاده کنید' };
}

function getSafetyAlert(location) {
    for (const [key, value] of Object.entries(hotspots)) {
        if (location.includes(key) || key.includes(location)) {
            const levelColor = value.level === 'بحرانی' ? 'قرمز' : (value.level === 'پرخطر' ? 'نارنجی' : 'زرد');
            return {
                ok: true,
                alert: {
                    level: `${levelColor} (${value.level})`,
                    message: `⚠️ منطقه ${value.level}: ${value.message}`,
                    accidents: `${value.accidents} تصادف در سال`,
                    recommendation: value.recommendation
                }
            };
        }
    }
    return {
        ok: true,
        alert: {
            level: 'سبز (ایمن)',
            message: 'منطقه ایمن',
            recommendation: 'با خیال راحت رانندگی کنید'
        }
    };
}

function getFullReport() {
    return { ok: true, report: { ...fullReport, lastUpdate: new Date().toISOString() } };
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
    
    // ========== TRAFFIC APIs ==========
    
    // 1. وضعیت ترافیک
    if (pathname === '/api/traffic') {
        const location = parsedUrl.query.location || '';
        const result = getTrafficStatus(location);
        res.end(JSON.stringify({ ...result, updated: new Date().toISOString() }));
        return;
    }
    
    // 2. مسیر جایگزین
    if (pathname === '/api/traffic/alternative') {
        const location = parsedUrl.query.location;
        if (!location) {
            res.end(JSON.stringify({ ok: false, error: 'موقعیت را وارد کنید' }));
            return;
        }
        const result = getAlternativeRoute(location);
        res.end(JSON.stringify(result));
        return;
    }
    
    // 3. مسیر هوشمند
    if (pathname === '/api/traffic/smart-route') {
        const { from, to } = parsedUrl.query;
        if (!from || !to) {
            res.end(JSON.stringify({ ok: false, error: 'مبدا و مقصد را وارد کنید' }));
            return;
        }
        const result = getSmartRoute(from, to);
        res.end(JSON.stringify(result));
        return;
    }
    
    // 4. هشدار ایمنی
    if (pathname === '/api/traffic/alert') {
        const location = parsedUrl.query.location;
        if (!location) {
            res.end(JSON.stringify({ ok: false, error: 'موقعیت را وارد کنید' }));
            return;
        }
        const result = getSafetyAlert(location);
        res.end(JSON.stringify(result));
        return;
    }
    
    // 5. گزارش کامل
    if (pathname === '/api/traffic/report-full') {
        const result = getFullReport();
        res.end(JSON.stringify(result));
        return;
    }
    
    // 6. دوربین‌ها
    if (pathname === '/api/traffic/cameras') {
        const type = parsedUrl.query.type;
        const cameras = {
            speed: 8, redLight: 5, plateReader: 5, total: 18
        };
        res.end(JSON.stringify({ ok: true, cameras, count: cameras.total }));
        return;
    }
    
    // 7. مناطق حادثه‌خیز
    if (pathname === '/api/traffic/hotspots') {
        const level = parsedUrl.query.level;
        const hotspotsList = {
            critical: ['سه‌راه ایسین', 'هدیش', 'تنگ زاغ'],
            high: ['چهارراه غزی', 'میدان سپاه'],
            medium: ['بلوار ساحلی', 'جاده میناب']
        };
        const result = level ? hotspotsList[level] : [...hotspotsList.critical, ...hotspotsList.high, ...hotspotsList.medium];
        res.end(JSON.stringify({ ok: true, hotspots: result }));
        return;
    }
    
    // ========== OTHER APIs ==========
    
    // Health
    if (pathname === '/api/health') {
        res.end(JSON.stringify({ status: 'healthy', version: '10.0', time: new Date().toISOString() }));
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
        res.end(JSON.stringify({ city, temperature: '35°C', condition: 'آفتابی', humidity: '60%' }));
        return;
    }
    
    // 404
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found', path: pathname }));
});

const PORT = 9090;
server.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║      🚦 HDP ONE v10.0 - سیستم هوشمند ترافیک کامل                ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log(`✅ http://localhost:${PORT}`);
    console.log('');
    console.log('📡 APIهای ترافیک:');
    console.log(`   GET /api/traffic?location=چهارراه غزی`);
    console.log(`   GET /api/traffic/alternative?location=چهارراه غزی`);
    console.log(`   GET /api/traffic/smart-route?from=غزی&to=ساحلی`);
    console.log(`   GET /api/traffic/alert?location=سه‌راه ایسین`);
    console.log(`   GET /api/traffic/report-full`);
    console.log('');
});

module.exports = server;
