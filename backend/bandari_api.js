const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 9091;

app.use(cors());
app.use(express.json());

// ============ دیکشنری گویش بندری ============
const bandariDict = {
    // احوالپرسی
    'سلام': 'سَلام خَری! چِطوری مِردُم؟',
    'صبح بخیر': 'صُبح بِخِیر داداش!',
    'عصر بخیر': 'مَسا بِخِیر',
    'شب بخیر': 'شو بِخِیر',
    'خداحافظ': 'خدا نِگَهدار بابا!',
    'خوبی': 'خوبی؟ چِ طوری؟',
    'چطوری': 'چِ طوری جانُم؟',
    'خوبم': 'خُوبَم، سُوکور وَالله',
    'ممنون': 'دَستت طلا',
    'مرسی': 'دَستت طلا',
    'خواهش می‌کنم': 'قابِل نَداره',
    
    // احساسات
    'دلم گرفته': 'دِلَم خِیلی گِرِفتَه',
    'ناراحتم': 'دِلَم شِکَست',
    'خوشحالم': 'دِلَم وا شُد',
    'عصبانیم': 'اَعصابَم خُرَد شُد',
    'خسته‌ام': 'خَستَ شُدَم',
    'نگرانم': 'دِلَم شُرُوع شُد',
    
    // ترافیک
    'ترافیک': 'راه بَستِه',
    'ترافیک سنگین': 'راه بَستِه هَس',
    'چهارراه غزی': 'چَهارراه غَزی',
    'بلوار ساحلی': 'بُلووار ساحِلی',
    
    // مکان‌ها
    'بندرعباس': 'بَندَر',
    'قشم': 'قِشم',
    'کیش': 'کیش',
    'هرمز': 'هُرمُز',
    'بازار': 'بازار',
    'خانه': 'خونِه',
    
    // غذا
    'ماهی': 'ماهی',
    'نان': 'نون',
    'چای': 'چایی',
    'خرما': 'خُرما',
    
    // اصطلاحات خاص
    'واویلا': 'واویلا (وای خدای من)',
    'چیزها': 'چیزها (عجب!)',
    'به خدا': 'وَالله',
    'انشاءالله': 'اِنشاءالله'
};

// دیکشنری معکوس (بندری → فارسی)
const reverseDict = {};
for (let [persian, bandari] of Object.entries(bandariDict)) {
    reverseDict[bandari] = persian;
}

// سیگنال‌های تشخیص گویش بندری
const bandariSignals = [
    'اَبی', 'چِش', 'خَری', 'واویلا', 'چیزها', 'دِلَم', 'وَالله',
    'نَخو', 'گَردَه', 'مِردُم', 'خُبَه', 'جانُم', 'تَرسین'
];

// ============ توابع ============

// تشخیص گویش
function detectBandari(text) {
    let score = 0;
    let detected = [];
    for (let signal of bandariSignals) {
        if (text.includes(signal)) {
            score++;
            detected.push(signal);
        }
    }
    const confidence = Math.min(0.95, score / 2);
    return {
        isBandari: score >= 1,
        confidence: confidence,
        signals: detected,
        score: score
    };
}

// ترجمه فارسی → بندری
function toBandari(text) {
    let result = text;
    let matches = 0;
    for (let [persian, bandari] of Object.entries(bandariDict)) {
        if (result.includes(persian)) {
            matches++;
            result = result.replace(new RegExp(persian, 'g'), bandari);
        }
    }
    return {
        original: text,
        translated: result,
        matches: matches,
        confidence: Math.min(0.95, matches / (text.split(/\s+/).length || 1))
    };
}

// ترجمه بندری → فارسی
function toPersian(text) {
    let result = text;
    let matches = 0;
    for (let [bandari, persian] of Object.entries(reverseDict)) {
        if (result.includes(bandari)) {
            matches++;
            result = result.replace(new RegExp(bandari, 'g'), persian);
        }
    }
    return {
        original: text,
        translated: result,
        matches: matches,
        confidence: Math.min(0.95, matches / (text.split(/\s+/).length || 1))
    };
}

// ترجمه هوشمند (تشخیص خودکار جهت)
function smartTranslate(text) {
    const detection = detectBandari(text);
    if (detection.isBandari) {
        return toPersian(text);
    } else {
        return toBandari(text);
    }
}

// ============ API ============

// تشخیص گویش
app.post('/api/bandari/detect', (req, res) => {
    const { text } = req.body;
    if (!text) return res.json({ error: 'متن خود را وارد کنید' });
    const result = detectBandari(text);
    res.json({ ok: true, ...result });
});

// ترجمه فارسی → بندری
app.post('/api/bandari/to-bandari', (req, res) => {
    const { text } = req.body;
    if (!text) return res.json({ error: 'متن خود را وارد کنید' });
    const result = toBandari(text);
    res.json({ ok: true, ...result });
});

// ترجمه بندری → فارسی
app.post('/api/bandari/to-persian', (req, res) => {
    const { text } = req.body;
    if (!text) return res.json({ error: 'متن خود را وارد کنید' });
    const result = toPersian(text);
    res.json({ ok: true, ...result });
});

// ترجمه هوشمند (تشخیص خودکار)
app.post('/api/bandari/translate', (req, res) => {
    const { text } = req.body;
    if (!text) return res.json({ error: 'متن خود را وارد کنید' });
    const result = smartTranslate(text);
    res.json({ ok: true, ...result });
});

// دیکشنری کامل
app.get('/api/bandari/dictionary', (req, res) => {
    res.json({ ok: true, dictionary: bandariDict, count: Object.keys(bandariDict).length });
});

// اصطلاحات پرکاربرد
app.get('/api/bandari/phrases', (req, res) => {
    const phrases = [
        { bandari: 'سَلام خَری', persian: 'سلام رفیق' },
        { bandari: 'واویلا', persian: 'وای خدای من' },
        { bandari: 'چِشات دَر نَکُن', persian: 'چشمت درنیاد' },
        { bandari: 'دَستت طلا', persian: 'دستت طلا' },
        { bandari: 'خدا نِگَهدار', persian: 'خدا نگهدار' },
        { bandari: 'دِلَم وا شُد', persian: 'خوشحال شدم' },
        { bandari: 'اَعصابَم خُرَد شُد', persian: 'عصبانیم' }
    ];
    res.json({ ok: true, phrases });
});

// صفحه اصلی
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html dir="rtl">
<head><meta charset="UTF-8"><title>Bandari Translator API</title>
<style>
body{font-family:Tahoma;background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);min-height:100vh;padding:20px;color:white}
.container{max-width:800px;margin:0 auto}
h1{text-align:center;margin-bottom:30px}
.card{background:rgba(255,255,255,0.1);border-radius:20px;padding:20px;margin-bottom:20px}
textarea{width:100%;padding:12px;border-radius:10px;border:none;margin:10px 0}
button{padding:10px 20px;background:#667eea;border:none;border-radius:10px;color:white;cursor:pointer}
.result{background:rgba(0,0,0,0.3);padding:15px;border-radius:10px;margin-top:15px}
pre{background:#1a1a2e;padding:10px;border-radius:10px;overflow-x:auto}
</style>
</head>
<body>
<div class="container">
<h1>🗣️ Bandari Translator API</h1>
<div class="card">
<h3>📝 ترجمه فارسی → بندری</h3>
<textarea id="persianInput" rows="3" placeholder="متن فارسی..."></textarea>
<button onclick="toBandari()">ترجمه به بندری</button>
<div id="bandariResult" class="result"></div>
</div>
<div class="card">
<h3>🗣️ ترجمه بندری → فارسی</h3>
<textarea id="bandariInput" rows="3" placeholder="متن بندری..."></textarea>
<button onclick="toPersian()">ترجمه به فارسی</button>
<button onclick="detect()" style="background:#e94560">🔍 تشخیص گویش</button>
<div id="persianResult" class="result"></div>
</div>
<div class="card">
<h3>📚 دیکشنری (${Object.keys(bandariDict).length} واژه)</h3>
<pre id="dictPreview">${JSON.stringify(bandariDict, null, 2).substring(0, 500)}...</pre>
</div>
</div>
<script>
async function toBandari(){
    const text=document.getElementById('persianInput').value;
    if(!text)return;
    const res=await fetch('/api/bandari/to-bandari',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});
    const data=await res.json();
    document.getElementById('bandariResult').innerHTML='<strong>🗣️ بندری:</strong><br>'+data.translated;
}
async function toPersian(){
    const text=document.getElementById('bandariInput').value;
    if(!text)return;
    const res=await fetch('/api/bandari/to-persian',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});
    const data=await res.json();
    document.getElementById('persianResult').innerHTML='<strong>📖 فارسی:</strong><br>'+data.translated;
}
async function detect(){
    const text=document.getElementById('bandariInput').value;
    if(!text)return;
    const res=await fetch('/api/bandari/detect',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});
    const data=await res.json();
    document.getElementById('persianResult').innerHTML='<strong>🔍 نتیجه تشخیص:</strong><br>گویش: '+(data.isBandari?'بندری':'فارسی')+'<br>اطمینان: '+(data.confidence*100).toFixed(0)+'%<br>سیگنال‌ها: '+(data.signals||[]).join(', ');
}
</script>
</body>
</html>
    `);
});

app.listen(PORT, () => {
    console.log(`╔══════════════════════════════════════════════════════════════╗`);
    console.log(`║         🗣️ Bandari API - گویش بندری                         ║`);
    console.log(`╠══════════════════════════════════════════════════════════════╣`);
    console.log(`║  🌐 http://localhost:${PORT}                                    ║`);
    console.log(`║  📚 ${Object.keys(bandariDict).length} واژه در دیکشنری                      ║`);
    console.log(`║  🔄 ترجمه دوطرفه (فارسی ↔ بندری)                           ║`);
    console.log(`║  🎯 تشخیص خودکار گویش                                       ║`);
    console.log(`╚══════════════════════════════════════════════════════════════╝`);
});

module.exports = app;
