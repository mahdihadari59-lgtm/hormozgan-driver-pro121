// ============ Vector Database for Bandari Dialect ============
const fs = require('fs');
const path = require('path');

class BandariVectorDB {
    constructor() {
        this.vectors = [];
        this.index = new Map();
        this.dimension = 384; // بعد بردار (SBERT)
        this.loadData();
    }
    
    // بارگذاری داده‌های گویش بندری
    loadData() {
        try {
            const data = JSON.parse(fs.readFileSync('./data/bandari_dialect_corpus.json', 'utf8'));
            this.corpus = data.data || [];
            console.log(`✅ ${this.corpus.length} نمونه گویش بندری بارگذاری شد`);
        } catch(e) {
            console.log('⚠️ استفاده از داده‌های نمونه');
            this.corpus = this.getSampleData();
        }
    }
    
    // داده‌های نمونه (در صورت عدم وجود فایل)
    getSampleData() {
        return [
            { type: "phrase", bandari: "صُبح بِخِیر، چِ طوری؟", persian: "صبح بخیر، چطوری؟", tags: ["greeting", "casual"] },
            { type: "phrase", bandari: "خُوبَم، سُوکور وَالله، تو چِ طوری؟", persian: "خوبم، شکر خدا، تو چطوری؟", tags: ["greeting", "casual"] },
            { type: "phrase", bandari: "ابی چش داداش؟", persian: "حالت چطوره داداش؟", tags: ["greeting", "slang"] },
            { type: "phrase", bandari: "واویلا چیزها!", persian: "وای خدای من!", tags: ["exclamation", "slang"] },
            { type: "phrase", bandari: "دستت طلا", persian: "دستت طلا", tags: ["praise", "casual"] },
            { type: "phrase", bandari: "چشات در نکون!", persian: "چشمت درنیاد!", tags: ["warning", "slang"] },
            { type: "phrase", bandari: "بمیرم از دردت", persian: "از دستت می‌میرم", tags: ["affection", "intimate"] },
            { type: "word", bandari: "دِیگَه", persian: "دیگر", tags: ["adverb"] },
            { type: "word", bandari: "گَردَه", persian: "بعداً", tags: ["adverb", "time"] },
            { type: "word", bandari: "پَرتَک", persian: "دقیقه", tags: ["time"] },
            { type: "dialogue", bandari: "آ: سلام چطوری؟\nب: خوبم تو چطوری؟", persian: "سلام چطوری؟\nخوبم تو چطوری؟", tags: ["dialogue", "greeting"] }
        ];
    }
    
    // شبیه‌سازی embedding ساده (در عمل از یک مدل واقعی استفاده کنید)
    simpleEmbedding(text, seed = 0) {
        const vec = new Array(this.dimension).fill(0);
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = ((hash << 5) - hash) + text.charCodeAt(i);
            hash |= 0;
        }
        for (let i = 0; i < this.dimension; i++) {
            vec[i] = Math.sin(hash + i * 0.01) * 0.5 + 0.5;
        }
        return vec;
    }
    
    // ایجاد بردار برای هر نمونه
    createVectors() {
        for (let i = 0; i < this.corpus.length; i++) {
            const item = this.corpus[i];
            const text = item.bandari || item.persian || '';
            const vector = this.simpleEmbedding(text, i);
            
            this.vectors.push({
                id: i,
                vector: vector,
                metadata: {
                    bandari: item.bandari || '',
                    persian: item.persian || '',
                    type: item.type || 'phrase',
                    tags: item.tags || []
                }
            });
            
            // ایجاد ایندکس برای جستجوی سریع
            this.index.set(i, this.vectors[i]);
        }
        console.log(`✅ ${this.vectors.length} بردار ایجاد شد`);
        return this.vectors;
    }
    
    // محاسبه شباهت کسینوسی
    cosineSimilarity(a, b) {
        let dot = 0, normA = 0, normB = 0;
        for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
    
    // جستجوی برداری
    search(query, topK = 5, filterTags = null) {
        const queryVec = this.simpleEmbedding(query);
        const results = [];
        
        for (let item of this.vectors) {
            // فیلتر بر اساس برچسب‌ها
            if (filterTags && item.metadata.tags) {
                const hasTag = filterTags.some(tag => item.metadata.tags.includes(tag));
                if (!hasTag) continue;
            }
            
            const similarity = this.cosineSimilarity(queryVec, item.vector);
            results.push({
                id: item.id,
                similarity: similarity,
                bandari: item.metadata.bandari,
                persian: item.metadata.persian,
                type: item.metadata.type,
                tags: item.metadata.tags
            });
        }
        
        results.sort((a, b) => b.similarity - a.similarity);
        return results.slice(0, topK);
    }
    
    // جستجو با فیلتر موقعیت (situation)
    searchBySituation(situation, topK = 5) {
        const filtered = this.vectors.filter(v => 
            v.metadata.tags && v.metadata.tags.includes(situation)
        );
        
        const results = filtered.map(v => ({
            id: v.id,
            bandari: v.metadata.bandari,
            persian: v.metadata.persian,
            type: v.metadata.type
        }));
        
        return results.slice(0, topK);
    }
    
    // جستجوی ترکیبی (برداری + فیلتر)
    hybridSearch(query, filters = {}, topK = 5) {
        let results = this.search(query, this.vectors.length);
        
        if (filters.type) {
            results = results.filter(r => r.type === filters.type);
        }
        if (filters.tags) {
            results = results.filter(r => r.tags && filters.tags.some(t => r.tags.includes(t)));
        }
        
        return results.slice(0, topK);
    }
    
    // دریافت آمار
    getStats() {
        const types = {};
        const tags = {};
        
        for (let item of this.corpus) {
            const type = item.type || 'phrase';
            types[type] = (types[type] || 0) + 1;
            
            if (item.tags) {
                for (let tag of item.tags) {
                    tags[tag] = (tags[tag] || 0) + 1;
                }
            }
        }
        
        return {
            totalVectors: this.vectors.length,
            dimensions: this.dimension,
            types: types,
            tags: tags
        };
    }
    
    // ذخیره بردارها در فایل
    saveToFile(filepath = './data/bandari_vectors.json') {
        const data = {
            version: "1.0",
            created: new Date().toISOString(),
            dimension: this.dimension,
            vectors: this.vectors.map(v => ({
                id: v.id,
                vector: v.vector.slice(0, 10), // فقط 10 بعد اول برای ذخیره
                metadata: v.metadata
            }))
        };
        
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
        console.log(`✅ بردارها در ${filepath} ذخیره شدند`);
    }
    
    // بازیابی از فایل
    loadFromFile(filepath = './data/bandari_vectors.json') {
        try {
            const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
            this.dimension = data.dimension;
            this.vectors = data.vectors;
            console.log(`✅ ${this.vectors.length} بردار از فایل بارگذاری شد`);
            return true;
        } catch(e) {
            console.log('⚠️ فایل بردارها یافت نشد');
            return false;
        }
    }
}

// ============ API Express برای Vector DB ============
const express = require('express');
const app = express();
const PORT = 9093;

app.use(express.json());
app.use(express.static('public'));

const vectorDB = new BandariVectorDB();
vectorDB.createVectors();

// API جستجوی برداری
app.post('/api/vector/search', (req, res) => {
    const { query, topK = 5, tags } = req.body;
    if (!query) {
        return res.json({ ok: false, error: 'لطفاً عبارت جستجو را وارد کنید' });
    }
    
    const results = vectorDB.search(query, topK, tags);
    res.json({ ok: true, query, results });
});

// API جستجو بر اساس موقعیت
app.get('/api/vector/situation/:situation', (req, res) => {
    const { situation } = req.params;
    const results = vectorDB.searchBySituation(situation, 10);
    res.json({ ok: true, situation, results });
});

// API جستجوی ترکیبی
app.post('/api/vector/hybrid', (req, res) => {
    const { query, filters, topK = 5 } = req.body;
    const results = vectorDB.hybridSearch(query, filters, topK);
    res.json({ ok: true, query, filters, results });
});

// API آمار
app.get('/api/vector/stats', (req, res) => {
    res.json(vectorDB.getStats());
});

// API پیشنهاد خودکار
app.post('/api/vector/suggest', (req, res) => {
    const { text } = req.body;
    if (!text) return res.json({ ok: false });
    
    const results = vectorDB.search(text, 3);
    const suggestions = results.map(r => r.bandari);
    res.json({ ok: true, suggestions });
});

// صفحه اصلی Vector DB
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>HDP Vector DB - گویش بندری</title>
            <style>
                *{margin:0;padding:0;box-sizing:border-box}
                body{font-family:Tahoma;background:linear-gradient(135deg,#1a2a6c,#b21f1f,#fdbb4d);padding:20px}
                .container{max-width:800px;margin:0 auto}
                .header{text-align:center;color:white;margin-bottom:30px}
                .header h1{font-size:36px}
                .card{background:rgba(255,255,255,0.95);border-radius:15px;padding:20px;margin-bottom:20px;color:#333}
                .card h3{color:#b21f1f;margin-bottom:15px}
                input,select{width:100%;padding:12px;margin:10px 0;border:1px solid #ddd;border-radius:8px}
                button{background:#b21f1f;color:white;padding:12px 25px;border:none;border-radius:8px;cursor:pointer}
                .result{background:#f5f5f5;padding:10px;border-radius:8px;margin-top:10px}
                .stats{display:flex;gap:15px;flex-wrap:wrap;margin-top:15px}
                .stat{background:#e0e0e0;padding:10px;border-radius:8px;flex:1;text-align:center}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🗄️ HDP Vector DB</h1>
                    <p>پایگاه داده برداری گویش بندرعباسی</p>
                </div>
                
                <div class="card">
                    <h3>🔍 جستجوی برداری</h3>
                    <input type="text" id="searchInput" placeholder="عبارت به فارسی یا بندری...">
                    <button onclick="search()">جستجو</button>
                    <div id="searchResults" class="result"></div>
                </div>
                
                <div class="card">
                    <h3>📊 آمار دیتابیس</h3>
                    <div id="stats" class="stats">در حال بارگذاری...</div>
                </div>
                
                <div class="card">
                    <h3>🗣️ نمونه جملات بندری</h3>
                    <div id="samples"></div>
                </div>
            </div>
            
            <script>
                async function search() {
                    const input = document.getElementById('searchInput');
                    const query = input.value.trim();
                    if(!query) return;
                    
                    const res = await fetch('/api/vector/search', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({query, topK: 5})
                    });
                    const data = await res.json();
                    
                    const resultsDiv = document.getElementById('searchResults');
                    if(data.results && data.results.length > 0){
                        resultsDiv.innerHTML = '<strong>نتایج مشابه:</strong><br>';
                        data.results.forEach(r => {
                            resultsDiv.innerHTML += \`
                                <div style="border-bottom:1px solid #ddd;padding:8px">
                                    <strong>🗣️ بندری:</strong> \${r.bandari}<br>
                                    <strong>📖 فارسی:</strong> \${r.persian}<br>
                                    <strong>🎯 تشابه:</strong> \${(r.similarity * 100).toFixed(1)}%
                                </div>
                            \`;
                        });
                    } else {
                        resultsDiv.innerHTML = 'نتیجه‌ای یافت نشد';
                    }
                }
                
                async function loadStats() {
                    const res = await fetch('/api/vector/stats');
                    const data = await res.json();
                    const statsDiv = document.getElementById('stats');
                    statsDiv.innerHTML = \`
                        <div class="stat">📚 \${data.totalVectors} بردار</div>
                        <div class="stat">📐 \${data.dimensions} بعد</div>
                        <div class="stat">🏷️ \${Object.keys(data.tags).length} برچسب</div>
                    \`;
                }
                
                async function loadSamples() {
                    const res = await fetch('/api/vector/situation/greeting');
                    const data = await res.json();
                    const samplesDiv = document.getElementById('samples');
                    if(data.results){
                        samplesDiv.innerHTML = data.results.map(r => 
                            \`<div style="background:#f0f0f0;margin:5px 0;padding:10px;border-radius:8px">
                                🗣️ <strong>\${r.bandari}</strong><br>
                                📖 \${r.persian}
                            </div>\`
                        ).join('');
                    }
                }
                
                loadStats();
                loadSamples();
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`╔══════════════════════════════════════════════════════════════╗`);
    console.log(`║         🗄️ HDP Vector DB - Bandari Dialect                    ║`);
    console.log(`╠══════════════════════════════════════════════════════════════╣`);
    console.log(`║  🌐 http://localhost:${PORT}                                    ║`);
    console.log(`║  📚 ${vectorDB.vectors.length} vectors | ${vectorDB.dimension} dimensions         ║`);
    console.log(`║  🗣️ Semantic Search for Bandari Dialect                      ║`);
    console.log(`╚══════════════════════════════════════════════════════════════╝`);
});

module.exports = { BandariVectorDB, app };
