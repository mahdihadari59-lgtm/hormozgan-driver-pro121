const express = require('express');
const router = express.Router();

// ============ زون‌های ترافیکی ============
const trafficZones = {
    'چهارراه غزی': { status: 'سنگین', delay: 25, speed: 8, alternative: 'بلوار ساحلی' },
    'میدان سپاه': { status: 'سنگین', delay: 20, speed: 10, alternative: 'بلوار امام خمینی' },
    'بلوار ساحلی': { status: 'روان', delay: 5, speed: 35, alternative: null },
    'سه‌راه ایسین': { status: 'نیمه سنگین', delay: 15, speed: 15, alternative: 'جاده قدیم' }
};

// ============ نقاط حادثه‌خیز ============
const accidentHotspots = [
    { rank: 1, name: 'بلوار امام خمینی - تقاطع فلسطین', severity: 'بحرانی', accidents: 30 },
    { rank: 2, name: 'جاده بندررجایی - سه‌راه ایسین', severity: 'بحرانی', accidents: 26 },
    { rank: 3, name: 'میدان سپاه', severity: 'بالا', accidents: 20 }
];

// ============ دوربین‌ها ============
const cameras = {
    speed: [{ id: 1, location: 'بلوار امام خمینی', type: 'سرعت' }],
    red_light: [{ id: 2, location: 'چهارراه غزی', type: 'چراغ قرمز' }]
};

// ============ API ============
router.get('/zones', (req, res) => {
    res.json({ ok: true, zones: trafficZones });
});

router.get('/hotspots', (req, res) => {
    res.json({ ok: true, hotspots: accidentHotspots });
});

router.get('/cameras', (req, res) => {
    res.json({ ok: true, cameras: cameras });
});

router.get('/accidents', (req, res) => {
    res.json({ ok: true, accidents: [] });
});

router.get('/alerts', (req, res) => {
    res.json({ ok: true, alerts: [] });
});

router.get('/summary', (req, res) => {
    res.json({ ok: true, summary: 'گزارش ترافیک', zones: trafficZones });
});

module.exports = router;
