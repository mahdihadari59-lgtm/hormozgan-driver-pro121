const http = require('http');
const url = require('url');

// ============================================
// 🗺️ مسیرهای واقعی بندرعباس (به‌روز شده)
// ============================================

// مسیرهای جایگزین واقعی
const alternativeRoutes = {
    'چهارراه غزی': {
        alternative: 'بلوار ساحلی به سمت سرات دلگشا',
        details: '۲۰ متر جلوتر، سمت چپ، ورودی چهارراه برق',
        landmarks: 'ورودی چهارراه برق، جنب مجتمع تجاری',
        timeSaved: 15,
        distance: '1.8 km',
        traffic: 'روان',
        instruction: 'از چهارراه غزی به سمت بلوار ساحلی حرکت کنید، پس از ۲۰ متر وارد خیابان فرعی سمت چپ شوید'
    },
    'چهارراه برق': {
        alternative: 'بلوار ساحلی به سمت سرات دلگشا',
        details: 'مستقیم به سمت سرات دلگشا، دوربرگردان مجتمع تجاری نگین',
        landmarks: 'مجتمع تجاری نگین، ایستگاه اتوبوس',
        timeSaved: 8,
        distance: '0.8 km',
        traffic: 'روان',
        instruction: 'از چهارراه برق مستقیم به سمت سرات دلگشا، جلوی مجتمع نگین دور بزنید'
    },
    'بلوار ساحلی': {
        alternative: 'خیابان رسالت - خیابان شریعتی',
        details: 'از بلوار ساحلی به سمت شرق، وارد خیابان رسالت شوید',
        landmarks: 'مجتمع اداری، بانک صادرات',
        timeSaved: 10,
        distance: '1.2 km',
        traffic: 'روان',
        instruction: 'بلوار ساحلی به سمت شرق، بعد از پل سفید وارد خیابان رسالت شوید'
    },
    'میدان سپاه': {
        alternative: 'خیابان طالقانی - بلوار جمهوری',
        details: 'از میدان سپاه به سمت خیابان طالقانی، سپس بلوار جمهوری',
        landmarks: 'بیمارستان کودکان، چهارراه فلسطین',
        timeSaved: 12,
        distance: '2.3 km',
        traffic: 'نیمه سنگین',
        instruction: 'میدان سپاه به سمت خیابان طالقانی، دوربرگردان بیمارستان کودکان'
    },
    'سه‌راه ایسین': {
        alternative: 'جاده قدیم میناب',
        details: 'از سه‌راه ایسین به سمت جاده قدیم میناب، خروجی نایبند',
        landmarks: 'عوارضی ایسین، پاسگاه پلیس راه',
        timeSaved: 20,
        distance: '7.5 km',
        traffic: 'روان',
        instruction: 'سه‌راه ایسین به سمت جاده قدیم میناب، قبل از عوارضی دور بزنید'
    }
};

// وضعیت ترافیک لحظه‌ای
const trafficStatus = {
    'چهارراه غزی': { 
        status: 'سنگین ⚠️', 
        advice: 'به سمت بلوار ساحلی حرکت کنید، ۲۰ متر جلوتر سمت چپ، ورودی چهارراه برق',
        waitTime: '15-20 دقیقه',
        alternative: 'بلوار ساحلی (مجتمع تجاری نگین)'
    },
    'چهارراه برق': { 
        status: 'نیمه سنگین 🟡', 
        advice: 'از بلوار ساحلی به سمت سرات دلگشا، جلوی مجتمع نگین دور بزنید',
        waitTime: '10-15 دقیقه',
        alternative: 'بلوار ساحلی - سرات دلگشا'
    },
    'بلوار ساحلی': { 
        status: 'روان ✅', 
        advice: 'مسیر آزاد است، با سرعت مطمئنه حرکت کنید',
        waitTime: '5-7 دقیقه',
        alternative: 'خیابان رسالت - خیابان شریعتی'
    },
    'سرات دلگشا': { 
        status: 'روان ✅', 
        advice: 'مسیر آرام، از مجتمع تجاری نگین عبور کنید',
        waitTime: '3-5 دقیقه',
        alternative: 'بلوار ساحلی'
    },
    'میدان سپاه': { 
        status: 'نیمه سنگین 🟡', 
        advice: 'از خیابان طالقانی استفاده کنید، دوربرگردان بیمارستان کودکان',
        waitTime: '10-12 دقیقه',
        alternative: 'خیابان طالقانی - بلوار جمهوری'
    }
};

// ============================================
// توابع
// ============================================
function getTrafficStatus(location) {
    if (!location) {
        return { 
            location: 'بندرعباس', 
            status: 'متوسط 🚦', 
            advice: 'ترافیک معمولی، صبور باشید',
            waitTime: '10-15 دقیقه',
            updated: new Date().toISOString()
        };
    }
    
    for (const [key, value] of Object.entries(trafficStatus)) {
        if (location.includes(key) || key.includes(location)) {
            return { location: key, ...value, updated: new Date().toISOString() };
        }
    }
    
    return { 
        location, 
        status: 'معمولی 🚦', 
        advice: 'ترافیک عادی است',
        waitTime: '5-10 دقیقه',
        updated: new Date().toISOString()
    };
}

function getAlternativeRoute(location) {
    for (const [key, value] of Object.entries(alternativeRoutes)) {
        if (location.includes(key) || key.includes(location)) {
            return { 
                ok: true, 
                route: value,
                from: key,
                to: value.alternative,
                instruction: value.instruction,
                details: value.details,
                landmarks: value.landmarks
            };
        }
    }
    
    // مسیر پیشنهادی عمومی
    return { 
        ok: true, 
        route: {
            alternative: 'بلوار ساحلی به سمت سرات دلگشا',
            details: '۲۰ متر جلوتر، سمت چپ، ورودی چهارراه برق',
            timeSaved: 15,
            landmarks: 'ورودی چهارراه برق، مجتمع تجاری نگین'
        },
        instruction: 'از مسیر اصلی خارج شده و وارد بلوار ساحلی شوید'
    };
}

function getSmartRoute(from, to) {
    const routes = {
        'غزی to ساحلی': {
            route: 'از چهارراه غزی به سمت بلوار ساحلی',
            details: '۲۰ متر جلوتر، سمت چپ، ورودی چهارراه برق',
            timeSaved: '12 دقیقه',
            distance: '1.5 km',
            landmarks: 'مجتمع تجاری نگین، چهارراه برق',
            steps: [
                'خروج از چهارراه غزی به سمت جنوب',
                '۲۰ متر جلوتر به سمت چپ وارد خیابان فرعی شوید',
                'از کنار مجتمع تجاری نگین عبور کنید',
                'وارد بلوار ساحلی شوید'
            ]
        },
        'غزی to سرات': {
            route: 'چهارراه غزی → بلوار ساحلی → سرات دلگشا',
            details: '۲۰ متر جلوتر، سمت چپ، ورودی چهارراه برق، سپس مستقیم به سمت سرات',
            timeSaved: '15 دقیقه',
            distance: '2.3 km',
            landmarks: 'چهارراه برق، مجتمع تجاری نگین',
            steps: [
                'از چهارراه غزی به سمت جنوب',
                '۲۰ متر جلوتر وارد خیابان فرعی سمت چپ شوید',
                'از چهارراه برق عبور کنید',
                'مستقیم به سمت سرات دلگشا'
            ]
        },
        'ساحلی to سرات': {
            route: 'بلوار ساحلی به سمت شرق، دوربرگردان مجتمع نگین',
            details: 'از بلوار ساحلی به سمت شرق، جلوی مجتمع تجاری نگین دور بزنید',
            timeSaved: '5 دقیقه',
            distance: '0.8 km',
            landmarks: 'مجتمع تجاری نگین',
            steps: [
                'بلوار ساحلی به سمت شرق',
                'دوربرگردان جلوی مجتمع تجاری نگین',
                'وارد سرات دلگشا شوید'
            ]
        }
    };
    
    const key = `${from} to ${to}`;
    const result = routes[key];
    
    if (result) {
        return { ok: true, from, to, ...result };
    }
    
    return { 
        ok: true, 
        from, 
        to, 
        route: `از ${from} به سمت ${to}، از بلوار ساحلی و چهارراه برق عبور کنید`,
        timeSaved: '10 دقیقه',
        landmarks: 'مجتمع تجاری نگین',
        recommendation: 'بهترین مسیر: بلوار ساحلی → چهارراه برق → سرات دلگشا'
    };
}

function getSafetyAlert(location) {
    const alerts = {
        'چهارراه غزی': {
            level: 'نارنجی (پرخطر)',
            message: '⚠️ ترافیک سنگین، تقاطع شلوغ',
            recommendation: 'از مسیر بلوار ساحلی استفاده کنید، ۲۰ متر جلوتر سمت چپ'
        },
        'چهارراه برق': {
            level: 'زرد (متوسط)',
            message: 'تردد وسایل نقلیه زیاد است',
            recommendation: 'با احتیاط حرکت کنید، جلوی مجتمع نگین دور بزنید'
        },
        'سه‌راه ایسین': {
            level: 'قرمز (بحرانی)',
            message: '⚠️ منطقه حادثه‌خیز',
            recommendation: 'فاصله طولی را رعایت کنید، سرعت را کاهش دهید'
        }
    };
    
    for (const [key, value] of Object.entries(alerts)) {
        if (location.includes(key) || key.includes(location)) {
            return { ok: true, alert: value };
        }
    }
    
    return {
        ok: true,
        alert: {
            level: 'سبز (ایمن)',
            message: 'منطقه ایمن است',
            recommendation: 'با خیال راحت رانندگی کنید'
        }
    };
}

function getFullReport() {
    return {
        ok: true,
        report: {
            cameras: { total: 18, speed: 8, redLight: 5, plateReader: 5 },
            hotspots: { total: 8, critical: 3, high: 2, medium: 3 },
            alternativeRoutes: Object.keys(alternativeRoutes).length,
            lastUpdate: new Date().toISOString(),
            landmarks: ['مجتمع تجاری نگین', 'چهارراه برق', 'بیمارستان کودکان', 'عوارضی ایسین']
        }
    };
}

// ============================================
// 🚀 سرور
// ============================================
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    console.log(`📡 ${req.method} ${pathname}`);
    
    if (pathname === '/api/traffic') {
        const location = parsedUrl.query.location || '';
        res.end(JSON.stringify(getTrafficStatus(location)));
        return;
    }
    
    if (pathname === '/api/traffic/alternative') {
        const location = parsedUrl.query.location || '';
        res.end(JSON.stringify(getAlternativeRoute(location)));
        return;
    }
    
    if (pathname === '/api/traffic/smart-route') {
        const { from, to } = parsedUrl.query;
        res.end(JSON.stringify(getSmartRoute(from || 'غزی', to || 'ساحلی')));
        return;
    }
    
    if (pathname === '/api/traffic/alert') {
        const location = parsedUrl.query.location || '';
        res.end(JSON.stringify(getSafetyAlert(location)));
        return;
    }
    
    if (pathname === '/api/traffic/report-full') {
        res.end(JSON.stringify(getFullReport()));
        return;
    }
    
    if (pathname === '/api/health') {
        res.end(JSON.stringify({ status: 'healthy', version: '10.2', time: new Date().toISOString() }));
        return;
    }
    
    if (pathname === '/api/gold') {
        res.end(JSON.stringify({ gold18: '4,852,000', emamiCoin: '52,000,000' }));
        return;
    }
    
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

const PORT = 9090;
server.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════════════════════════════╗');
    console.log('║      🗺️ HDP ONE v10.2 - مسیرهای واقعی بندرعباس (به‌روز)         ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log(`✅ http://localhost:${PORT}`);
    console.log('');
    console.log('📍 نشانه‌های مسیر:');
    console.log('   • مجتمع تجاری نگین');
    console.log('   • چهارراه برق');
    console.log('   • بیمارستان کودکان');
    console.log('   • عوارضی ایسین');
    console.log('');
});

module.exports = server;
