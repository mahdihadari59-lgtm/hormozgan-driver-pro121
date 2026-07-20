// ============================================
// HDP ONE - Core Module v5.0
// ماژول اصلی سیستم هوشمند هرمزگان
// نویسنده: مهدی حیدری پوری
// ============================================

class HDPCore {
    constructor(config = {}) {
        this.config = {
            apiKey: config.apiKey || null,
            debug: config.debug || false,
            cacheEnabled: config.cacheEnabled !== false,
            ...config
        };
        
        this.cache = new Map();
        this.stats = {
            startTime: Date.now(),
            requests: 0,
            errors: 0
        };
        
        // بارگذاری زیرماژول‌ها
        this.modules = {
            translator: null,
            traffic: null,
            gold: null,
            tourism: null,
            weather: null,
            knowledge: null
        };
        
        this.initModules();
        
        console.log(`🧠 HDP Core initialized v5.0`);
        console.log(`   📚 Cache: ${this.config.cacheEnabled ? 'Enabled' : 'Disabled'}`);
        console.log(`   🐛 Debug: ${this.config.debug ? 'ON' : 'OFF'}`);
    }
    
    initModules() {
        // مترجم بندری
        try {
            const BandariTranslator = require('./modules/translator');
            this.modules.translator = new BandariTranslator();
            console.log(`   ✅ Translator module loaded`);
        } catch(e) { console.log(`   ⚠️ Translator: ${e.message}`); }
        
        // تحلیل ترافیک
        try {
            const TrafficAnalyzer = require('./modules/traffic');
            this.modules.traffic = new TrafficAnalyzer();
            console.log(`   ✅ Traffic module loaded`);
        } catch(e) { console.log(`   ⚠️ Traffic: ${e.message}`); }
        
        // پیش‌بینی طلا
        try {
            const GoldPredictor = require('./modules/gold');
            this.modules.gold = new GoldPredictor();
            console.log(`   ✅ Gold module loaded`);
        } catch(e) { console.log(`   ⚠️ Gold: ${e.message}`); }
        
        // گردشگری
        try {
            const TourismService = require('./modules/tourism');
            this.modules.tourism = new TourismService();
            console.log(`   ✅ Tourism module loaded`);
        } catch(e) { console.log(`   ⚠️ Tourism: ${e.message}`); }
    }
    
    // ============ متدهای عمومی ============
    
    log(message, type = 'info') {
        if (!this.config.debug) return;
        const prefix = type === 'error' ? '❌' : (type === 'warn' ? '⚠️' : '📌');
        console.log(`${prefix} [HDP] ${message}`);
    }
    
    getCache(key) {
        if (!this.config.cacheEnabled) return null;
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < 3600000) {
            return cached.data;
        }
        return null;
    }
    
    setCache(key, data) {
        if (!this.config.cacheEnabled) return;
        this.cache.set(key, { data, timestamp: Date.now() });
        if (this.cache.size > 1000) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }
    
    // ============ API اصلی ============
    
    async process(message, sessionId = null) {
        this.stats.requests++;
        this.log(`Processing: "${message.substring(0, 50)}..."`);
        
        // تشخیص نوع درخواست
        const intent = this.detectIntent(message);
        
        let response = null;
        
        switch(intent) {
            case 'translation':
                response = await this.translate(message);
                break;
            case 'traffic':
                response = await this.getTraffic(message);
                break;
            case 'gold':
                response = await this.getGoldPrice();
                break;
            case 'tourism':
                response = await this.getTourism(message);
                break;
            case 'greeting':
                response = this.getGreeting();
                break;
            default:
                response = await this.searchKnowledge(message);
        }
        
        return {
            intent,
            response,
            sessionId,
            timestamp: new Date().toISOString(),
            module: intent
        };
    }
    
    detectIntent(message) {
        const m = message.toLowerCase();
        
        if (m.includes('ترجمه') || m.includes('معنی') || m.includes('چی میشه')) return 'translation';
        if (m.includes('ترافیک') || m.includes('راهبندان')) return 'traffic';
        if (m.includes('طلا') || m.includes('قیمت') || m.includes('سکه')) return 'gold';
        if (m.includes('سفر') || m.includes('جزیره') || m.includes('قشم')) return 'tourism';
        if (m.includes('سلام') || m.includes('درود') || m.includes('چطوری')) return 'greeting';
        
        return 'knowledge';
    }
    
    // ============ متدهای ماژول‌ها ============
    
    async translate(message) {
        if (this.modules.translator) {
            const result = this.modules.translator.smartTranslate(message);
            return result.translated || result.response;
        }
        return this.getFallbackResponse('translation');
    }
    
    async getTraffic(message) {
        if (this.modules.traffic) {
            const result = this.modules.traffic.getFullReport();
            return result.message || 'وضعیت ترافیک عادی است';
        }
        return this.getFallbackResponse('traffic');
    }
    
    async getGoldPrice() {
        if (this.modules.gold) {
            const result = this.modules.gold.getPrediction();
            return `💰 قیمت طلا: ${result.currentPrice} تومان | پیش‌بینی: ${result.predictedPrice}`;
        }
        return this.getFallbackResponse('gold');
    }
    
    async getTourism(message) {
        if (this.modules.tourism) {
            const result = this.modules.tourism.recommend(message);
            return result.response || 'مقصد گردشگری: جزیره قشم، هرمز، کیش';
        }
        return this.getFallbackResponse('tourism');
    }
    
    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return '🌅 صبح بخیر! به HDP ONE خوش آمدید.';
        if (hour < 18) return '🌤️ ظهر بخیر! چطور می‌توانم کمک کنم؟';
        return '🌙 شب بخیر! خدا قوت.';
    }
    
    async searchKnowledge(message) {
        // جستجو در دانشنامه
        return this.getFallbackResponse('knowledge');
    }
    
    getFallbackResponse(type) {
        const fallbacks = {
            translation: 'در حال ترجمه... لطفاً صبر کنید.',
            traffic: 'وضعیت ترافیک: چهارراه غزی سنگین، بلوار ساحلی روان',
            gold: 'قیمت طلا: 4,850,000 تومان | دلار: 78,000 تومان',
            tourism: 'جاذبه‌های هرمزگان: جزیره قشم، جزیره هرمز، جزیره کیش',
            knowledge: '🤔 متوجه نشدم. سوال خود را واضح‌تر بپرسید.'
        };
        return fallbacks[type] || 'در حال پردازش...';
    }
    
    // ============ آمار ============
    
    getStats() {
        return {
            uptime: ((Date.now() - this.stats.startTime) / 1000).toFixed(0),
            requests: this.stats.requests,
            errors: this.stats.errors,
            cacheSize: this.cache.size,
            modules: Object.keys(this.modules).filter(k => this.modules[k] !== null)
        };
    }
    
    // ============ خاموشی ============
    
    shutdown() {
        this.log('Shutting down...');
        this.cache.clear();
        return { ok: true, message: 'HDP Core stopped' };
    }
}

module.exports = HDPCore;
