// ============ Vector Database بدون وابستگی خارجی ============
const fs = require('fs');

class BandariVectorDB {
    constructor() {
        this.vectors = [];
        this.corpus = [];
        this.dimension = 64;
        this.loadSampleData();
        this.createVectors();
    }
    
    loadSampleData() {
        this.corpus = [
            { id: 1, bandari: "صُبح بِخِیر، چِ طوری؟", persian: "صبح بخیر، چطوری؟", tags: ["greeting", "casual"] },
            { id: 2, bandari: "خُوبَم، سُوکور وَالله", persian: "خوبم، شکر خدا", tags: ["greeting", "casual"] },
            { id: 3, bandari: "ابی چش داداش؟", persian: "حالت چطوره داداش؟", tags: ["greeting", "slang"] },
            { id: 4, bandari: "واویلا چیزها!", persian: "وای خدای من!", tags: ["exclamation", "slang"] },
            { id: 5, bandari: "دستت طلا", persian: "دستت طلا", tags: ["praise", "casual"] },
            { id: 6, bandari: "چشات در نکون!", persian: "چشمت درنیاد!", tags: ["warning", "slang"] },
            { id: 7, bandari: "بمیرم از دردت", persian: "از دستت می‌میرم", tags: ["affection", "intimate"] },
            { id: 8, bandari: "دِیگَه", persian: "دیگر", tags: ["adverb"] },
            { id: 9, bandari: "گَردَه", persian: "بعداً", tags: ["adverb", "time"] },
            { id: 10, bandari: "پَرتَک", persian: "دقیقه", tags: ["time"] },
            { id: 11, bandari: "تا چَهارراه غَزی چَندَه؟", persian: "تا چهارراه غزی چند است؟", tags: ["driving", "taxi"] },
            { id: 12, bandari: "نَخو، اَز دِل", persian: "نه، اصلاً", tags: ["negative", "slang"] },
            { id: 13, bandari: "والله راست می‌گم", persian: "به خدا راست می‌گویم", tags: ["emphasis", "casual"] },
            { id: 14, bandari: "هَرَکِلی نَکُن", persian: "هرج و مرج نکن", tags: ["warning", "casual"] },
            { id: 15, bandari: "خدا نگهدار", persian: "خدا نگهدار", tags: ["farewell"] }
        ];
        console.log(`✅ ${this.corpus.length} نمونه گویش بندری بارگذاری شد`);
    }
    
    // ایجاد بردار ساده (TF-IDF-like)
    createVector(text) {
        const words = text.split(/\s+/);
        const vec = new Array(this.dimension).fill(0);
        
        for (let i = 0; i < words.length && i < this.dimension; i++) {
            let hash = 0;
            for (let j = 0; j < words[i].length; j++) {
                hash = ((hash << 5) - hash) + words[i].charCodeAt(j);
                hash |= 0;
            }
            vec[i] = (hash % 100) / 100;
        }
        
        // نرمالایز کردن
        let norm = 0;
        for (let i = 0; i < this.dimension; i++) norm += vec[i] * vec[i];
        norm = Math.sqrt(norm);
        if (norm > 0) {
            for (let i = 0; i < this.dimension; i++) vec[i] /= norm;
        }
        
        return vec;
    }
    
    createVectors() {
        for (let item of this.corpus) {
            const text = item.bandari + ' ' + item.persian;
            this.vectors.push({
                id: item.id,
                vector: this.createVector(text),
                metadata: {
                    bandari: item.bandari,
                    persian: item.persian,
                    tags: item.tags
                }
            });
        }
        console.log(`✅ ${this.vectors.length} بردار ایجاد شد`);
    }
    
    cosineSimilarity(a, b) {
        let dot = 0, normA = 0, normB = 0;
        for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
    
    search(query, topK = 5) {
        const queryVec = this.createVector(query);
        const results = [];
        
        for (let item of this.vectors) {
            const similarity = this.cosineSimilarity(queryVec, item.vector);
            results.push({
                id: item.id,
                similarity: similarity,
                bandari: item.metadata.bandari,
                persian: item.metadata.persian,
                tags: item.metadata.tags
            });
        }
        
        results.sort((a, b) => b.similarity - a.similarity);
        return results.slice(0, topK);
    }
    
    searchByTag(tag, topK = 10) {
        const filtered = this.vectors.filter(v => v.metadata.tags && v.metadata.tags.includes(tag));
        return filtered.slice(0, topK).map(v => ({
            bandari: v.metadata.bandari,
            persian: v.metadata.persian
        }));
    }
    
    getStats() {
        const tags = {};
        for (let item of this.vectors) {
            if (item.metadata.tags) {
                for (let tag of item.metadata.tags) {
                    tags[tag] = (tags[tag] || 0) + 1;
                }
            }
        }
        return {
            totalVectors: this.vectors.length,
            dimension: this.dimension,
            tags: tags
        };
    }
}

const express = require('express');
const app = express();
const PORT = 9093;

app.use(express.json());
app.use(express.static('public'));

const db = new BandariVectorDB();

app.post('/api/vector/search', (req, res) => {
    const { query, topK = 5 } = req.body;
    if (!query) return res.json({ ok: false, error: 'لطفاً عبارت را وارد کنید' });
    
    const results = db.search(query, topK);
    res.json({ ok: true, query, results });
});

app.get('/api/vector/tag/:tag', (req, res) => {
    const results = db.searchByTag(req.params.tag);
    res.json({ ok: true, tag: req.params.tag, results });
});

app.get('/api/vector/stats', (req, res) => {
    res.json(db.getStats());
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>HDP Vector DB</title>
            <style>
                *{margin:0;padding:0;box-sizing:border-box}
                body{font-family:Tahoma;background:linear-gradient(135deg,#1a2a6c,#b21f1f,#fdbb4d);padding:20px}
                .container{max-width:600px;margin:0 auto}
                .header{text-align:center;color:white;margin-bottom:30px}
                .card{background:white;border-radius:15px;padding:20px;margin-bottom:20px}
                input{width:100%;padding:12px;margin:10px 0;border:1px solid #ddd;border-radius:8px}
                button{background:#b21f1f;color:white;padding:12px 25px;border:none;border-radius:8px;cursor:pointer}
                .result{background:#f5f5f5;padding:10px;border-radius:8px;margin-top:10px}
                .result-item{border-bottom:1px solid #ddd;padding:8px}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header"><h1>🗄️ HDP Vector DB</h1><p>جستجوی معنایی گویش بندری</p></div>
                <div class="card">
                    <h3>🔍 جستجو</h3>
                    <input type="text" id="searchInput" placeholder="عبارت خود را وارد کنید...">
                    <button onclick="search()">جستجو</button>
                    <div id="results" class="result"></div>
                </div>
                <div class="card"><h3>📊 آمار</h3><div id="stats"></div></div>
            </div>
            <script>
                async function search(){
                    const input=document.getElementById('searchInput');
                    const query=input.value.trim();
                    if(!query)return;
                    const res=await fetch('/api/vector/search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query})});
                    const data=await res.json();
                    const resultsDiv=document.getElementById('results');
                    if(data.results && data.results.length){
                        resultsDiv.innerHTML=data.results.map(r=>\`<div class="result-item"><strong>🗣️ \${r.bandari}</strong><br>📖 \${r.persian}<br>🎯 \${(r.similarity*100).toFixed(1)}%</div>\`).join('');
                    }else{resultsDiv.innerHTML='نتیجه‌ای یافت نشد';}
                }
                async function loadStats(){
                    const res=await fetch('/api/vector/stats');
                    const data=await res.json();
                    document.getElementById('stats').innerHTML=\`📚 \${data.totalVectors} بردار | 📐 \${data.dimension} بعد\`;
                }
                loadStats();
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`✅ Vector DB on http://localhost:${PORT}`);
    console.log(`📚 ${db.vectors.length} vectors | ${db.dimension} dimensions`);
});

module.exports = app;
