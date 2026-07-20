#!/usr/bin/env node
// ============================================
// الگوریتم مستقل مترجم بندری
// Bandari Translator Algorithm v1.0
// نویسنده: مهدی حیدری پوری
// ============================================

class BandariTranslator {
    constructor() {
        // دیکشنری اصلی (فارسی → بندری)
        this.dict = {
            // احوالپرسی
            'سلام': 'سَلام',
            'درود': 'سَلام',
            'صبح بخیر': 'صُبح بِخِیر',
            'عصر بخیر': 'مَسا بِخِیر',
            'شب بخیر': 'شو بِخِیر',
            'خداحافظ': 'خدا نِگَهدار',
            'خوبی': 'خوبی؟ چِ طوری؟',
            'خوبم': 'خُوبَم، سُوکور وَالله',
            'چطوری': 'چِ طوری؟',
            'چه خبر': 'چِ خَبَره؟',
            'هیچی': 'هیچی والا',
            
            // تشکر
            'ممنون': 'خواهش می‌کُنُم',
            'مرسی': 'دَستت طلا',
            'تشکر': 'دَستت طلا',
            'خواهش می‌کنم': 'قابِل نَداره',
            
            // احساسات
            'دلم گرفته': 'دِلَم خِیلی گِرِفتَه',
            'ناراحتم': 'دِلَم شِکَست',
            'خوشحالم': 'دِلَم وا شُد',
            'عصبانیم': 'اَعصابَم خُرَد شُد',
            'خسته‌ام': 'خَستَ شُدَم',
            'ناراحت نباش': 'ناراحت نَباش جانُم',
            'خوش باشی': 'خوش باشی داداش',
            
            // ترافیک
            'ترافیک': 'راه بَستِه',
            'ترافیک سنگین': 'راه بَستِه هَس',
            'ترافیک روان': 'راه باز هَس',
            'چهارراه غزی': 'چَهارراه غَزی',
            'بلوار ساحلی': 'بُلووار ساحِلی',
            'مسیر جایگزین': 'راهِ دیگَه',
            'میدان سپاه': 'میدون سِپاه',
            
            // مکان‌ها
            'بندرعباس': 'بَندَر',
            'قشم': 'قِشم',
            'کیش': 'کیش',
            'هرمز': 'هُرمُز',
            'میناب': 'میناب',
            'بازار': 'بازار',
            'خانه': 'خونِه',
            'مدرسه': 'مَدرِس',
            'بیمارستان': 'بیمارِس',
            'مسجد': 'مَسجِد',
            'ساحل': 'ساحِل',
            'اسکله': 'اِسکَلِه',
            
            // غذا
            'غذا': 'غَذا',
            'ماهی': 'ماهی',
            'نان': 'نون',
            'چای': 'چایی',
            'آب': 'آبم',
            'خرما': 'خُرما',
            'قلیه ماهی': 'قِلیه ماهی',
            'نان تومشی': 'نون تومشی',
            
            // زمان
            'الان': 'اَلان',
            'دیروز': 'دیروز',
            'فردا': 'فِردا',
            'امروز': 'اِمرُز',
            'ساعت': 'تایم',
            'دقیقه': 'پَرتَک',
            'بعداً': 'گَردَه',
            
            // خانواده
            'پدر': 'بابا',
            'مادر': 'مُم',
            'برادر': 'بَرار',
            'خواهر': 'خواهَر',
            'پدربزرگ': 'بایی',
            'مادربزرگ': 'بی‌بی',
            'دایی': 'خالو',
            'خاله': 'خالِه',
            
            // اصطلاحات خاص
            'واویلا': 'واویلا',
            'ای وای': 'وا چیزها',
            'عجب': 'چیزها',
            'به خدا': 'وَالله',
            'انشاءالله': 'اِنشاءالله',
            'ماشاءالله': 'ماشاءالله',
            'الحمدلله': 'اَلحَمْدُلِلّه',
            
            // فعل‌ها
            'می‌روم': 'می‌یَم',
            'می‌رود': 'می‌رَه',
            'می‌روند': 'می‌رُن',
            'دارم می‌روم': 'دارَم می‌یَم',
            'بیا': 'بیا',
            'بیایید': 'بیاین',
            'بشین': 'تَرسین',
            'بخور': 'بَخُر',
            'ببین': 'بَبین',
        };
        
        // دیکشنری معکوس (بندری → فارسی)
        this.reverseDict = {};
        for (let [persian, bandari] of Object.entries(this.dict)) {
            this.reverseDict[bandari] = persian;
        }
        
        // سیگنال‌های تشخیص گویش بندری
        this.bandariSignals = [
            'اَبی', 'چِش', 'خَری', 'واویلا', 'چیزها', 'دِلَم', 'وَالله', 
            'نَخو', 'گَردَه', 'مِردُم', 'خُبَه', 'جانُم', 'دِیگَه', 
            'هَنوزَم', 'پَرتَک', 'عِدِّل', 'سَرکاری', 'یِنی', 'تَرسین'
        ];
        
        // آمار
        this.stats = {
            totalWords: Object.keys(this.dict).length,
            totalSignals: this.bandariSignals.length,
            translationsCount: 0
        };
    }
    
    // ============ 1. ترجمه فارسی → بندری ============
    toBandari(text) {
        let result = text;
        let matches = 0;
        
        // مرتب‌سازی کلیدها بر اساس طول (اولویت با عبارات بلندتر)
        const sortedKeys = Object.keys(this.dict).sort((a, b) => b.length - a.length);
        
        for (let persian of sortedKeys) {
            const regex = new RegExp(persian, 'g');
            if (regex.test(result)) {
                matches++;
                result = result.replace(regex, this.dict[persian]);
            }
        }
        
        this.stats.translationsCount++;
        return { 
            original: text, 
            translated: result, 
            matches, 
            confidence: Math.min(0.95, matches / (text.split(/\s+/).length || 1))
        };
    }
    
    // ============ 2. ترجمه بندری → فارسی ============
    toPersian(text) {
        let result = text;
        let matches = 0;
        
        const sortedKeys = Object.keys(this.reverseDict).sort((a, b) => b.length - a.length);
        
        for (let bandari of sortedKeys) {
            const regex = new RegExp(bandari, 'g');
            if (regex.test(result)) {
                matches++;
                result = result.replace(regex, this.reverseDict[bandari]);
            }
        }
        
        this.stats.translationsCount++;
        return { 
            original: text, 
            translated: result, 
            matches, 
            confidence: Math.min(0.95, matches / (text.split(/\s+/).length || 1))
        };
    }
    
    // ============ 3. تشخیص گویش ============
    detect(text) {
        let score = 0;
        let detectedSignals = [];
        
        for (let signal of this.bandariSignals) {
            if (text.includes(signal)) {
                score++;
                detectedSignals.push(signal);
            }
        }
        
        const confidence = Math.min(0.95, score / 3);
        const isBandari = score >= 2;
        
        return {
            text: text,
            dialect: isBandari ? 'بندری' : 'فارسی معیار',
            confidence: confidence,
            signals: detectedSignals,
            score: score
        };
    }
    
    // ============ 4. ترجمه هوشمند (تشخیص خودکار جهت) ============
    smartTranslate(text) {
        const detection = this.detect(text);
        
        if (detection.dialect === 'بندری') {
            return this.toPersian(text);
        } else {
            return this.toBandari(text);
        }
    }
    
    // ============ 5. افزودن واژه جدید به دیکشنری ============
    addWord(persian, bandari, overwrite = false) {
        if (!overwrite && this.dict[persian]) {
            return { success: false, error: 'واژه قبلاً وجود دارد' };
        }
        this.dict[persian] = bandari;
        this.reverseDict[bandari] = persian;
        this.stats.totalWords++;
        return { success: true, added: { persian, bandari } };
    }
    
    // ============ 6. حذف واژه از دیکشنری ============
    removeWord(persian) {
        const bandari = this.dict[persian];
        if (!bandari) return { success: false, error: 'واژه یافت نشد' };
        
        delete this.dict[persian];
        delete this.reverseDict[bandari];
        this.stats.totalWords--;
        return { success: true, removed: { persian, bandari } };
    }
    
    // ============ 7. جستجو در دیکشنری ============
    search(word) {
        const results = [];
        
        for (let [persian, bandari] of Object.entries(this.dict)) {
            if (persian.includes(word) || bandari.includes(word)) {
                results.push({ persian, bandari });
            }
        }
        
        return results;
    }
    
    // ============ 8. دریافت آمار ============
    getStats() {
        return {
            totalWords: this.stats.totalWords,
            totalSignals: this.stats.totalSignals,
            translationsCount: this.stats.translationsCount,
            sampleWords: Object.keys(this.dict).slice(0, 20)
        };
    }
    
    // ============ 9. نمایش راهنما ============
    help() {
        return {
            commands: [
                'toBandari(text) - ترجمه فارسی به بندری',
                'toPersian(text) - ترجمه بندری به فارسی',
                'detect(text) - تشخیص گویش متن',
                'smartTranslate(text) - ترجمه هوشمند',
                'addWord(persian, bandari) - افزودن واژه جدید',
                'removeWord(persian) - حذف واژه',
                'search(word) - جستجو در دیکشنری',
                'getStats() - آمار دیکشنری'
            ],
            example: 'مثال: translator.toBandari("سلام چطوری؟")'
        };
    }
}

// ============ اجرای مستقل ============
if (require.main === module) {
    const translator = new BandariTranslator();
    
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     🗣️ الگوریتم مستقل مترجم بندری v1.0                       ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log(`║  📚 واژگان: ${translator.stats.totalWords}                           ║`);
    console.log(`║  🔔 سیگنال‌های تشخیص: ${translator.stats.totalSignals}                           ║`);
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    
    // تست
    console.log('📋 تست 1: تشخیص گویش');
    console.log(translator.detect('سَلام خَری! چِ طوری؟ واویلا!'));
    console.log('');
    
    console.log('📋 تست 2: ترجمه فارسی → بندری');
    console.log(translator.toBandari('سلام چطوری؟ ممنون. خداحافظ'));
    console.log('');
    
    console.log('📋 تست 3: ترجمه بندری → فارسی');
    console.log(translator.toPersian('سَلام خَری! دَستت طلا. خدا نِگَهدار'));
    console.log('');
    
    console.log('📋 تست 4: ترجمه هوشمند');
    console.log(translator.smartTranslate('دِلَم خِیلی گِرِفتَه'));
    console.log('');
    
    console.log('📋 تست 5: جستجو');
    console.log(translator.search('سلام'));
    console.log('');
    
    console.log('📊 آمار نهایی:');
    console.log(translator.getStats());
}

module.exports = BandariTranslator;
