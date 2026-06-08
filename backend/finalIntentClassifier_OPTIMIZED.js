// finalIntentClassifier_OPTIMIZED.js
// نسخه بهینه‌سازی شده برای Termux با دقت بالا

const fs = require('fs');
const path = require('path');

class FinalIntentClassifier {
    constructor(configPath = './intent_weights_enhanced.json') {
        this.configPath = configPath;
        this.config = null;
        this.cache = new Map();
        this.stats = { total: 0, byIntent: {}, avgConfidence: 0 };
        
        this.loadConfig();
        if (!this.config) this.loadDefaultConfig();
        
        console.log(`✅ Classifier آماده شد | Intents: ${this.config.total_intents}`);
    }

    loadConfig() {
        try {
            const fullPath = path.join(__dirname, this.configPath);
            if (fs.existsSync(fullPath)) {
                this.config = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                return true;
            }
        } catch(e) {}
        return false;
    }

    loadDefaultConfig() {
        this.config = {
            version: '3.0',
            total_intents: 12,
            intents: {
                greeting: {
                    name: "احوالپرسی",
                    priority: 3,
                    threshold: 5,
                    keywords: { "سلام": 25, "درود": 20, "چطوری": 20, "خوبی": 18, "چه خبر": 15, "حالت چطوره": 18, "خوش آمدید": 15 }
                },
                farewell: {
                    name: "خداحافظی",
                    priority: 3,
                    threshold: 5,
                    keywords: { "خداحافظ": 25, "بای": 20, "خدانگهدار": 22, "فعلا": 15, "تا بعد": 15, "خدا نگهدار": 20 }
                },
                emergency: {
                    name: "اورژانس",
                    priority: 0,
                    threshold: 3,
                    keywords: { "اورژانس": 30, "کمک": 25, "خطر": 25, "فوری": 20, "تصادف": 25, "آتش": 25, "115": 30, "110": 30, "125": 30 },
                    exactMatch: ["115", "110", "125", "اورژانس"]
                },
                traffic: {
                    name: "ترافیک",
                    priority: 2,
                    threshold: 6,
                    keywords: { "ترافیک": 25, "شلوغ": 20, "راه بندان": 22, "چهارراه": 18, "غزی": 18, "سپاه": 15, "ایسین": 15, "راه": 10 },
                    mustNotContain: ["تور", "گردشگری", "رستوران", "قشم", "کیش"]
                },
                tourism: {
                    name: "گردشگری",
                    priority: 2,
                    threshold: 6,
                    keywords: { "قشم": 25, "کیش": 25, "هرمز": 22, "جزیره": 18, "تور": 20, "جاهای دیدنی": 22, "گردشگری": 18, "تفریح": 15, "سفر": 15, "کجا برم": 18 },
                    excludeKeywords: ["ترجمه", "بندری", "ترافیک"]
                },
                gold: {
                    name: "طلا و ارز",
                    priority: 2,
                    threshold: 6,
                    keywords: { "طلا": 25, "سکه": 22, "دلار": 20, "یورو": 20, "درهم": 18, "قیمت": 15, "امامی": 22, "بهار آزادی": 20 }
                },
                food: {
                    name: "غذا و رستوران",
                    priority: 2,
                    threshold: 6,
                    keywords: { "رستوران": 25, "غذا": 20, "قلیه": 22, "کباب": 20, "میگو": 18, "ماهی": 18, "ناهار": 15, "شام": 15, "کافه": 15 }
                },
                medical: {
                    name: "پزشکی",
                    priority: 1,
                    threshold: 6,
                    keywords: { "دکتر": 25, "پزشک": 20, "بیمارستان": 22, "درمانگاه": 18, "داروخانه": 18, "قلب": 18, "اطفال": 18 }
                },
                help: {
                    name: "راهنمایی",
                    priority: 1,
                    threshold: 5,
                    keywords: { "راهنمایی": 25, "راهنما": 20, "چیکار کنم": 20, "نمیدونم": 15, "پشتیبانی": 18 }
                },
                dialect: {
                    name: "گویش بندری",
                    priority: 2,
                    threshold: 6,
                    keywords: { "بندری": 25, "گویش": 20, "واویلا": 22, "دلمی": 18, "جانم": 15, "لچو": 18, "قشمی": 18, "مینابی": 18 }
                },
                translation: {
                    name: "ترجمه",
                    priority: 2,
                    threshold: 6,
                    keywords: { "ترجمه": 25, "معنی": 20, "برگردون": 22, "به بندری": 20, "چی میشه": 18 }
                },
                general: {
                    name: "عمومی",
                    priority: 4,
                    threshold: 0,
                    keywords: {}
                }
            }
        };
    }

    classify(text, userId = 'anonymous') {
        if (!text || text.trim().length === 0) {
            return { intent: 'general', name: 'عمومی', score: 0, confidence: 0 };
        }

        const normalized = text.toLowerCase().trim();
        const words = normalized.split(/\s+/);
        
        // بررسی exact match
        for (const [intent, config] of Object.entries(this.config.intents)) {
            if (config.exactMatch && config.exactMatch.some(e => normalized === e.toLowerCase())) {
                return this.makeResult(intent, config, 100, 1.0, [], userId);
            }
        }
        
        let bestIntent = 'general';
        let bestScore = 0;
        let bestKeywords = [];
        
        for (const [intent, config] of Object.entries(this.config.intents)) {
            // بررسی mustNotContain
            if (config.mustNotContain && config.mustNotContain.some(f => normalized.includes(f))) {
                continue;
            }
            
            // بررسی excludeKeywords
            if (config.excludeKeywords && config.excludeKeywords.some(e => normalized.includes(e))) {
                continue;
            }
            
            let score = 0;
            let matchedKeywords = [];
            
            for (const [keyword, weight] of Object.entries(config.keywords)) {
                if (normalized.includes(keyword)) {
                    score += weight;
                    matchedKeywords.push(keyword);
                }
            }
            
            // اعمال ضریب برای جملات کوتاه
            let multiplier = 1.0;
            if (words.length <= 3) multiplier = 1.3;  // جملات کوتاه
            if (text.includes('؟') || text.includes('?')) multiplier *= 1.1;
            if (text.includes('!')) multiplier *= 1.1;
            
            const finalScore = Math.min(Math.floor(score * multiplier), 100);
            
            // اولویت: امتیاز >= threshold
            if (finalScore >= config.threshold && finalScore > bestScore) {
                bestScore = finalScore;
                bestIntent = intent;
                bestKeywords = matchedKeywords;
            }
        }
        
        // اگر هیچ intentی پیدا نشد، سراغ general برو
        if (bestScore === 0) {
            bestIntent = 'general';
        }
        
        const config = this.config.intents[bestIntent];
        const confidence = Math.min(bestScore / 100, 0.98);
        
        const result = {
            intent: bestIntent,
            name: config?.name || bestIntent,
            score: bestScore,
            confidence: confidence,
            matchedKeywords: bestKeywords
        };
        
        this.recordStat(result, userId);
        return result;
    }
    
    makeResult(intent, config, score, confidence, keywords, userId) {
        const result = {
            intent: intent,
            name: config?.name || intent,
            score: score,
            confidence: confidence,
            matchedKeywords: keywords
        };
        this.recordStat(result, userId);
        return result;
    }
    
    recordStat(result, userId) {
        this.stats.total++;
        this.stats.byIntent[result.intent] = (this.stats.byIntent[result.intent] || 0) + 1;
        this.stats.avgConfidence = (this.stats.avgConfidence * (this.stats.total - 1) + result.confidence) / this.stats.total;
    }
    
    getStats() {
        return {
            total: this.stats.total,
            byIntent: this.stats.byIntent,
            avgConfidence: (this.stats.avgConfidence * 100).toFixed(1) + '%',
            topIntents: Object.entries(this.stats.byIntent).sort((a,b) => b[1]-a[1]).slice(0,5)
        };
    }
}

module.exports = FinalIntentClassifier;
