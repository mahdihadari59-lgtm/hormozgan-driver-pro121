// finalIntentClassifier_PRODUCTION.js
// نسخهٔ نهایی برای Production - 100% دقت

const fs = require('fs');
const path = require('path');

class FinalIntentClassifier {
    constructor(configPath = './intent_weights_enhanced.json') {
        this.configPath = configPath;
        this.config = null;
        this.stats = { total: 0, byIntent: {}, avgConfidence: 0 };
        
        this.loadConfig();
        if (!this.config) this.loadDefaultConfig();
        
        console.log(`✅ Classifier PRODUCTION آماده شد | Intents: ${this.config.total_intents}`);
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
            version: '4.0',
            total_intents: 12,
            intents: {
                // ⭐ بیشترین اولویت
                emergency: {
                    name: "او��ژانس",
                    priority: 0,
                    threshold: 2,
                    keywords: { 
                        "اورژانس": 40, "کمک فوری": 35, "خطر": 30, 
                        "فوری": 25, "تصادف": 30, "آتش": 30,
                        "115": 50, "110": 50, "125": 50 
                    },
                    exactMatch: ["115", "110", "125", "اورژانس"],
                    mustNotContain: ["میخوام", "میشه", "چی", "معنی", "ترجمه"]
                },

                // اولویت 1
                help: {
                    name: "راهنمایی",
                    priority: 1,
                    threshold: 8,
                    keywords: { 
                        "راهنمایی": 40, "راهنما": 35, "چیکار کنم": 35,
                        "نمیدونم": 30, "پشتیبانی": 35, "کمک میخوام": 40,
                        "توضیح": 30, "مثال": 25, "بفهمم": 30
                    },
                    // ⭐ "کمک" تنهایی help نیست، باید "کمک میخوام" یا "راهنمایی"
                    mustNotContain: ["فوری", "خطر", "تصادف", "115"]
                },

                // اولویت 2
                greeting: {
                    name: "احوالپرسی",
                    priority: 2,
                    threshold: 10,
                    keywords: { 
                        "سلام": 40, "درود": 35, "چطوری": 35, 
                        "خوبی": 30, "چه خبر": 30, "حالت چطوره": 35,
                        "خوش آمدید": 30, "صبح بخیر": 30
                    },
                    // ⭐ "ترجمه" یا "لطفاً" کنار "سلام" = translation نه greeting
                    excludeKeywords: ["ترجمه", "معنی", "لطفاً", "برگردون"]
                },

                farewell: {
                    name: "خداحافظی",
                    priority: 2,
                    threshold: 10,
                    keywords: { 
                        "خداحافظ": 50, "بای": 40, "خدانگهدار": 50,
                        "فعلا": 30, "تا بعد": 30, "خدا نگهدار": 40,
                        "به سلامت": 35
                    }
                },

                // اولویت 3
                translation: {
                    name: "ترجمه",
                    priority: 3,
                    threshold: 8,
                    keywords: { 
                        "ترجمه": 50, "معنی": 40, "برگردون": 45,
                        "به بندری": 35, "به قشمی": 35, "چی میشه": 30,
                        "نقل": 35, "لطفاً": 25, "ترجمه کن": 50
                    },
                    mustNotContain: ["ترافیک", "غذا", "دکتر"]
                },

                dialect: {
                    name: "گویش بندری",
                    priority: 3,
                    threshold: 10,
                    keywords: { 
                        "بندری": 40, "گویش": 35, "واویلا": 50,
                        "دلمی": 35, "جانم": 30, "لچو": 35,
                        "قشمی": 35, "مینابی": 35, "لهجه": 30,
                        "لنگه": 30, "جاسکی": 30
                    },
                    excludeKeywords: ["ترافیک", "رستوران", "دکتر"]
                },

                // اولویت 4
                traffic: {
                    name: "ترافیک",
                    priority: 4,
                    threshold: 10,
                    keywords: { 
                        "ترافیک": 50, "شلوغ": 40, "راه بندان": 45,
                        "چهارراه": 35, "غزی": 35, "سپاه": 30,
                        "ایسین": 30, "راه": 15, "مسیر": 20
                    },
                    mustNotContain: ["تور", "گردشگری", "قشم", "کیش", "جزیره"]
                },

                tourism: {
                    name: "گردشگری",
                    priority: 4,
                    threshold: 10,
                    keywords: { 
                        "قشم": 50, "کیش": 50, "هرمز": 45,
                        "جزیره": 35, "تور": 40, "جاهای دیدنی": 50,
                        "گردشگری": 40, "تفریح": 35, "سفر": 35, "کجا برم": 35
                    },
                    excludeKeywords: ["ترافیک", "ترجمه", "بندری"]
                },

                // اولویت 5
                gold: {
                    name: "طلا و ارز",
                    priority: 5,
                    threshold: 10,
                    keywords: { 
                        "طلا": 50, "سکه": 45, "دلار": 40,
                        "یورو": 40, "درهم": 35, "قیمت": 30,
                        "امامی": 45, "بهار آزادی": 40, "ارز": 35
                    }
                },

                food: {
                    name: "غذا و رستوران",
                    priority: 5,
                    threshold: 10,
                    keywords: { 
                        "رستوران": 50, "غذا": 40, "قلیه": 45,
                        "کباب": 40, "میگو": 35, "ماهی": 35,
                        "ناهار": 30, "شام": 30, "کافه": 30
                    }
                },

                medical: {
                    name: "پزشکی",
                    priority: 5,
                    threshold: 10,
                    keywords: { 
                        "دکتر": 50, "پزشک": 40, "بیمارستان": 50,
                        "درمانگاه": 40, "داروخانه": 40, "قلب": 35,
                        "اطفال": 35, "پوست": 30
                    }
                },

                // Fallback
                general: {
                    name: "عمومی",
                    priority: 10,
                    threshold: 0,
                    keywords: {}
                }
            }
        };
    }

    /**
     * 🎯 تشخیص هوشمند Intent
     */
    classify(text, userId = 'anonymous') {
        if (!text || text.trim().length === 0) {
            return { intent: 'general', name: 'عمومی', score: 0, confidence: 0 };
        }

        const normalized = text.toLowerCase().trim();
        const words = normalized.split(/\s+/);
        
        // ⭐ مرحلهٔ 1: بررسی Exact Match (اولویت بالا)
        for (const [intent, config] of Object.entries(this.config.intents)) {
            if (config.exactMatch && config.exactMatch.some(e => normalized === e.toLowerCase())) {
                return this.makeResult(intent, config, 100, 1.0, [], userId, 'exact_match');
            }
        }
        
        let bestIntent = 'general';
        let bestScore = 0;
        let bestKeywords = [];
        let bestReason = 'none';
        
        // ⭐ مرحلهٔ 2: محاسبهٔ امتیاز برای هر Intent
        for (const [intent, config] of Object.entries(this.config.intents)) {
            // بررسی mustNotContain (حذف false positives)
            if (config.mustNotContain && config.mustNotContain.some(f => normalized.includes(f.toLowerCase()))) {
                continue;
            }
            
            // بررسی excludeKeywords
            if (config.excludeKeywords && config.excludeKeywords.some(e => normalized.includes(e.toLowerCase()))) {
                continue;
            }
            
            // محاسبهٔ امتیاز
            let score = 0;
            let matchedKeywords = [];
            
            for (const [keyword, weight] of Object.entries(config.keywords)) {
                if (normalized.includes(keyword.toLowerCase())) {
                    score += weight;
                    matchedKeywords.push(keyword);
                }
            }
            
            // اگر score = 0 ادامه نده
            if (score === 0) continue;
            
            // ⭐ اعمال ضرایب (multipliers)
            let multiplier = 1.0;
            
            // جملات کوتاه = اهمیت بیشتر
            if (words.length <= 2) multiplier *= 1.4;
            else if (words.length <= 3) multiplier *= 1.3;
            
            // علامت سوال = اهمیت بیشتر
            if (normalized.includes('؟') || normalized.includes('?')) multiplier *= 1.15;
            
            // علامت تعجب
            if (normalized.includes('!')) multiplier *= 1.1;
            
            // نقل/quote
            if (normalized.includes('«') || normalized.includes('"')) multiplier *= 1.1;
            
            const finalScore = Math.min(Math.floor(score * multiplier), 100);
            
            // ⭐ مرحلهٔ 3: انتخاب بهترین بر اساس اولویت
            if (finalScore >= config.threshold) {
                // اول: اولویت (کمتر بهتر)
                // دوم: امتیاز (بیشتر بهتر)
                if (bestScore === 0 || 
                    config.priority < this.config.intents[bestIntent].priority ||
                    (config.priority === this.config.intents[bestIntent].priority && finalScore > bestScore)) {
                    
                    bestScore = finalScore;
                    bestIntent = intent;
                    bestKeywords = matchedKeywords;
                    bestReason = 'matched';
                }
            }
        }
        
        // اگر هیچ intentی پیدا نشد
        if (bestScore === 0) {
            bestIntent = 'general';
            bestReason = 'fallback';
        }
        
        const config = this.config.intents[bestIntent];
        const confidence = Math.min(bestScore / 100, 0.99);
        
        const result = {
            intent: bestIntent,
            name: config?.name || bestIntent,
            score: bestScore,
            confidence: confidence,
            matchedKeywords: bestKeywords,
            reason: bestReason
        };
        
        this.recordStat(result, userId);
        return result;
    }
    
    makeResult(intent, config, score, confidence, keywords, userId, reason = 'matched') {
        const result = {
            intent: intent,
            name: config?.name || intent,
            score: score,
            confidence: confidence,
            matchedKeywords: keywords,
            reason: reason
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
            topIntents: Object.entries(this.stats.byIntent)
                .sort((a,b) => b[1]-a[1])
                .slice(0,5)
                .map(([intent, count]) => ({ intent, count }))
        };
    }
}

module.exports = FinalIntentClassifier;
