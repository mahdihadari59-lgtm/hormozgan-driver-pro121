// سیستم هوشمند ترافیک HDP ONE v1.0

class TrafficIntelligenceSystem {
    constructor() {
        // دوربین‌های ثبت تخلف
        this.cameras = {
            speed: [
                { id: 1, name: 'دوربین بلوار ساحلی', location: 'بلوار ساحلی', limit: 70, type: 'سرعت' },
                { id: 2, name: 'دوربین جاده میناب', location: 'جاده میناب', limit: 80, type: 'سرعت' },
                { id: 3, name: 'دوربین چهارراه غزی', location: 'چهارراه غزی', limit: 50, type: 'سرعت' },
                { id: 4, name: 'دوربین میدان سپاه', location: 'میدان سپاه', limit: 60, type: 'سرعت' },
                { id: 5, name: 'دوربین بلوار امام خمینی', location: 'بلوار امام خمینی', limit: 70, type: 'سرعت' },
                { id: 6, name: 'دوربین جاده قشم', location: 'جاده قشم', limit: 80, type: 'سرعت' },
                { id: 7, name: 'دوربین سه‌راه ایسین', location: 'سه‌راه ایسین', limit: 60, type: 'سرعت' },
                { id: 8, name: 'دوربین بلوار رسالت', location: 'بلوار رسالت', limit: 70, type: 'سرعت' }
            ],
            redLight: [
                { id: 9, name: 'چهارراه غزی', location: 'چهارراه غزی', type: 'چراغ قرمز' },
                { id: 10, name: 'میدان سپاه', location: 'میدان سپاه', type: 'چراغ قرمز' },
                { id: 11, name: 'چهارراه فلسطین', location: 'چهارراه فلسطین', type: 'چراغ قرمز' },
                { id: 12, name: 'میدان ولیعصر', location: 'میدان ولیعصر', type: 'چراغ قرمز' },
                { id: 13, name: 'چهارراه طاقی', location: 'چهارراه طاقی', type: 'چراغ قرمز' }
            ],
            plateReader: [
                { id: 14, name: 'ورودی شهر', location: 'ورودی بندرعباس', type: 'پلاک خوان' },
                { id: 15, name: 'خروجی شهر', location: 'خروجی بندرعباس', type: 'پلاک خوان' },
                { id: 16, name: 'بلوار ساحلی', location: 'بلوار ساحلی', type: 'پلاک خوان' },
                { id: 17, name: 'جاده قشم', location: 'جاده قشم', type: 'پلاک خوان' },
                { id: 18, name: 'جاده میناب', location: 'جاده میناب', type: 'پلاک خوان' }
            ]
        };

        // مناطق حادثه‌خیز
        this.hotspots = {
            critical: [
                { name: 'سه‌راه ایسین', location: 'سه‌راه ایسین', accidents: 45, risk: 'بحرانی', reason: 'تصادفات زنجیره‌ای' },
                { name: 'هدیش', location: 'منطقه هدیش', accidents: 38, risk: 'بحرانی', reason: 'پیچ خطرناک' },
                { name: 'تنگ زاغ', location: 'تنگ زاغ', accidents: 32, risk: 'بحرانی', reason: 'تنگنا و کاهش ناگهانی سرعت' }
            ],
            high: [
                { name: 'چهارراه غزی', location: 'چهارراه غزی', accidents: 28, risk: 'پرخطر', reason: 'ترافیک سنگین' },
                { name: 'میدان سپاه', location: 'میدان سپاه', accidents: 25, risk: 'پرخطر', reason: 'تداخل مسیرها' },
                { name: 'چهارراه فلسطین', location: 'چهارراه فلسطین', accidents: 22, risk: 'پرخطر', reason: 'تخلفات رانندگی' }
            ],
            medium: [
                { name: 'بلوار ساحلی', location: 'بلوار ساحلی', accidents: 15, risk: 'متوسط', reason: 'سرعت بالا' },
                { name: 'جاده میناب', location: 'جاده میناب', accidents: 12, risk: 'متوسط', reason: 'سبقت غیرمجاز' },
                { name: 'بلوار رسالت', location: 'بلوار رسالت', accidents: 10, risk: 'متوسط', reason: 'تردد عابر پیاده' }
            ]
        };

        // مسیرهای میانبر
        this.alternativeRoutes = {
            'چهارراه غزی': { alternative: 'بلوار ساحلی', timeSaved: 10, distance: '2.5 km', traffic: 'روان' },
            'میدان سپاه': { alternative: 'بلوار جمهوری', timeSaved: 12, distance: '3 km', traffic: 'روان' },
            'سه‌راه ایسین': { alternative: 'جاده قدیم میناب', timeSaved: 20, distance: '8 km', traffic: 'نیمه سنگین' },
            'چهارراه فلسطین': { alternative: 'خیابان طالقانی', timeSaved: 8, distance: '1.8 km', traffic: 'روان' },
            'میدان ولیعصر': { alternative: 'بلوار پاسداران', timeSaved: 15, distance: '2.5 km', traffic: 'روان' }
        };
    }

    // دریافت دوربین‌ها
    getCameraStatus(type) {
        if (type && this.cameras[type]) return this.cameras[type];
        return [...this.cameras.speed, ...this.cameras.redLight, ...this.cameras.plateReader];
    }

    // دریافت مناطق حادثه‌خیز
    getHotspots(level) {
        if (level && this.hotspots[level]) return this.hotspots[level];
        return [...this.hotspots.critical, ...this.hotspots.high, ...this.hotspots.medium];
    }

    // دریافت مسیر جایگزین
    getAlternativeRoute(location) {
        if (this.alternativeRoutes[location]) {
            return this.alternativeRoutes[location];
        }
        return { alternative: 'مسیر جایگزین یافت نشد', timeSaved: 0 };
    }

    // دریافت مسیر هوشمند
    getSmartRoute(from, to) {
        const route = this.alternativeRoutes[from];
        if (route) {
            return {
                from,
                to: route.alternative,
                timeSaved: `${route.timeSaved} دقیقه`,
                distance: route.distance,
                traffic: route.traffic,
                recommendation: `استفاده از ${route.alternative} به جای ${from} باعث صرفه‌جویی ${route.timeSaved} دقیقه‌ای می‌شود`
            };
        }
        return { error: 'مسیری یافت نشد', recommendation: 'از مسیر اصلی استفاده کنید' };
    }

    // دریافت هشدار ایمنی
    getSafetyAlert(location) {
        for (const [level, hotspots] of Object.entries(this.hotspots)) {
            for (const spot of hotspots) {
                if (spot.location === location || spot.name === location) {
                    return {
                        level: level === 'critical' ? 'قرمز (بحرانی)' : level === 'high' ? 'نارنجی (پرخطر)' : 'زرد (متوسط)',
                        message: `⚠️ منطقه ${spot.risk}: ${spot.reason}`,
                        accidents: `${spot.accidents} تصادف در سال`,
                        recommendation: level === 'critical' ? '⚠️ با احتیاط کامل رانندگی کنید' : '🚗 سرعت مجاز را رعایت کنید'
                    };
                }
            }
        }
        return { level: 'سبز (ایمن)', message: 'منطقه ایمن', recommendation: 'با خیال راحت رانندگی کنید' };
    }

    // محاسبه جریمه
    getFine(violation, speed = 0) {
        const fines = {
            speed: [
                { min: 1, max: 30, amount: 200000, name: 'سرعت غیرمجاز سبک' },
                { min: 31, max: 50, amount: 300000, name: 'سرعت غیرمجاز متوسط' },
                { min: 51, max: 999, amount: 500000, name: 'سرعت غیرمجاز سنگین' }
            ],
            redLight: { amount: 400000, name: 'عبور از چراغ قرمز' },
            noSeatbelt: { amount: 150000, name: 'نبستن کمربند ایمنی' },
            phone: { amount: 200000, name: 'استفاده از تلفن همراه' }
        };

        if (violation === 'speed' && speed > 0) {
            const overSpeed = speed - 70;
            for (const fine of fines.speed) {
                if (overSpeed >= fine.min && overSpeed <= fine.max) {
                    return { fine: fine, amount: fine.amount.toLocaleString() };
                }
            }
        }

        return { fine: fines[violation] || { amount: 500000, name: 'تخلف رانندگی' }, amount: (fines[violation]?.amount || 500000).toLocaleString() };
    }

    // گزارش کامل ترافیک
    getFullReport() {
        return {
            cameras: {
                total: Object.values(this.cameras).flat().length,
                speed: this.cameras.speed.length,
                redLight: this.cameras.redLight.length,
                plateReader: this.cameras.plateReader.length
            },
            hotspots: {
                total: Object.values(this.hotspots).flat().length,
                critical: this.hotspots.critical.length,
                high: this.hotspots.high.length,
                medium: this.hotspots.medium.length
            },
            alternativeRoutes: Object.keys(this.alternativeRoutes).length,
            lastUpdate: new Date().toISOString()
        };
    }
}

module.exports = TrafficIntelligenceSystem;
