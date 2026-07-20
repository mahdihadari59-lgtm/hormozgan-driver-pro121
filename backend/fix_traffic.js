const fs = require('fs');
const path = './index.js';

let content = fs.readFileSync(path, 'utf8');

// جایگزینی بخش ترافیک با نسخه کامل
const trafficSection = `// 20. Traffic
app.get('/api/traffic', (req, res) => {
    const { location } = req.query;
    const trafficData = {
        'چهارراه غزی': 'سنگین 🚦🚦🚦',
        'غزی': 'سنگین 🚦🚦🚦',
        'بلوار ساحلی': 'روان 🚦',
        'ساحلی': 'روان 🚦',
        'میدان سپاه': 'نیمه سنگین 🚦🚦',
        'سپاه': 'نیمه سنگین 🚦🚦',
        'پل سفید': 'روان 🚦',
        'طاقی': 'سنگین 🚦🚦🚦',
        'فرهنگ شهر': 'نیمه سنگین 🚦🚦'
    };
    
    let status = 'متوسط 🚦🚦';
    let locationName = location || 'بندرعباس';
    
    if (location && trafficData[location]) {
        status = trafficData[location];
    } else if (location) {
        // جستجوی جزئی
        for (const [key, value] of Object.entries(trafficData)) {
            if (location.includes(key) || key.includes(location)) {
                status = value;
                locationName = key;
                break;
            }
        }
    }
    
    res.json({ 
        location: locationName, 
        status: status, 
        updated: new Date().toISOString(),
        advice: getTrafficAdvice(status)
    });
});

function getTrafficAdvice(status) {
    if (status.includes('سنگین')) return '⚠️ از مسیر جایگزین استفاده کنید';
    if (status.includes('نیمه سنگین')) return '🚗 کمی صبر کنید';
    return '✅ مسیر آزاد است';
}`;

// پیدا کردن بخش قدیمی و جایگزینی
const oldSection = /\/\/ 20\. Traffic[\s\S]*?app\.get\(\'\/api\/traffic\',[\s\S]*?\}\);/;
content = content.replace(oldSection, trafficSection);

fs.writeFileSync(path, content);
console.log('✅ بخش ترافیک بهبود یافت');
