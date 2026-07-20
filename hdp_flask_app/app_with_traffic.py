from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import os
from traffic_algorithm import register_traffic_routes

app = Flask(__name__)
CORS(app)

# ============ بارگذاری دانشنامه ============
knowledge = {}
kb_path = 'data/hormozgan_knowledge.json'

if os.path.exists(kb_path):
    with open(kb_path, 'r', encoding='utf-8') as f:
        knowledge = json.load(f)
    print(f"✅ دانشنامه loaded: {len(knowledge)} topics")
else:
    print("⚠️ دانشنامه یافت نشد")

# ============ ثبت مسیرهای ترافیک ============
register_traffic_routes(app)

# ============ مسیرهای اصلی ============
@app.route('/')
def index():
    return render_template('index.html', topics=len(knowledge))

@app.route('/chat')
def chat():
    return render_template('chat.html')

@app.route('/traffic')
def traffic_page():
    """صفحه اختصاصی ترافیک"""
    return '''
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
        <meta charset="UTF-8">
        <title>وضعیت ترافیک بندرعباس</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { font-family: Tahoma; background: linear-gradient(135deg,#1a1a2e,#16213e); padding:20px; color:white; }
            .container { max-width:800px; margin:auto; }
            .card { background: rgba(255,255,255,0.1); border-radius:15px; padding:20px; margin-bottom:20px; backdrop-filter:blur(10px); }
            .zone { border-right: 4px solid #e74c3c; padding:15px; margin:10px 0; background: rgba(0,0,0,0.3); border-radius:10px; }
            .status-badge { display:inline-block; padding:5px 12px; border-radius:20px; font-size:12px; margin-right:10px; }
            .critical { background:#e74c3c; color:white; }
            .heavy { background:#f39c12; color:black; }
            .normal { background:#2ecc71; color:white; }
            .light { background:#3498db; color:white; }
            .index { font-size:24px; font-weight:bold; }
            .refresh-btn { background:#e74c3c; color:white; border:none; padding:10px 20px; border-radius:25px; cursor:pointer; margin-top:10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚦 وضعیت ترافیک بندرعباس</h1>
            <p id="datetime" style="color:#aaa"></p>
            
            <div class="card">
                <h3>📍 وضعیت کلی شهر</h3>
                <div id="cityStatus"></div>
                <div id="alternativeRoutes" style="margin-top:15px; font-size:14px;"></div>
            </div>
            
            <div class="card">
                <h3>🗺️ مناطق چهارگانه</h3>
                <div id="zones"></div>
            </div>
            
            <div class="card">
                <h3>⚠️ نقاط حادثه‌خیز</h3>
                <div id="hotspots"></div>
            </div>
            
            <div class="card">
                <h3>⏰ ساعات اوج ترافیک</h3>
                <div id="peakHours"></div>
            </div>
            
            <button class="refresh-btn" onclick="loadData()">🔄 به‌روزرسانی</button>
        </div>
        
        <script>
            async function loadData() {
                try {
                    const res = await fetch('/api/traffic/status');
                    const data = await res.json();
                    
                    document.getElementById('datetime').innerHTML = `📅 ${data.datetime}`;
                    
                    // وضعیت کلی
                    const cityDiv = document.getElementById('cityStatus');
                    cityDiv.innerHTML = `
                        <div class="zone">
                            <span class="status-badge ${getStatusClass(data.city_congestion_index)}">شاخص ${data.city_congestion_index}/10</span>
                            <strong>${data.city_status}</strong>
                        </div>
                    `;
                    
                    // مسیرهای جایگزین
                    const altDiv = document.getElementById('alternativeRoutes');
                    if(data.alternative_routes.length > 0) {
                        altDiv.innerHTML = `<strong>🔄 مسیرهای جایگزین:</strong><ul>${data.alternative_routes.map(r => `<li>${r}</li>`).join('')}</ul>`;
                    }
                    
                    // مناطق
                    const zonesDiv = document.getElementById('zones');
                    zonesDiv.innerHTML = '';
                    for(const [key, zone] of Object.entries(data.zones)) {
                        zonesDiv.innerHTML += `
                            <div class="zone">
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <strong>${zone.name}</strong>
                                    <span class="status-badge ${getStatusClass(zone.index)}">شاخص ${zone.index}/10</span>
                                </div>
                                <div>${zone.status}</div>
                                <div style="font-size:12px; color:#aaa; margin-top:5px;">${zone.desc || ''}</div>
                            </div>
                        `;
                    }
                    
                    // نقاط حادثه‌خیز
                    const hotspotsRes = await fetch('/api/traffic/hotspots');
                    const hotspotsData = await hotspotsRes.json();
                    const hotspotsDiv = document.getElementById('hotspots');
                    hotspotsDiv.innerHTML = hotspotsData.hotspots.map(h => `
                        <div style="margin:10px 0; padding:10px; background:rgba(0,0,0,0.3); border-radius:8px;">
                            <strong>⚠️ ${h.name}</strong> - <span style="color:#e74c3c">${h.risk}</span>
                            <div style="font-size:12px;">${h.description}</div>
                        </div>
                    `).join('');
                    
                    // ساعات اوج
                    document.getElementById('peakHours').innerHTML = `
                        <ul>
                            <li>🌅 صبح: ${data.peak_hours.morning}</li>
                            <li>🌞 ظهر: ${data.peak_hours.noon}</li>
                            <li>🌙 عصر: ${data.peak_hours.evening}</li>
                        </ul>
                    `;
                    
                } catch(e) {
                    console.error(e);
                }
            }
            
            function getStatusClass(index) {
                if(index >= 9) return 'critical';
                if(index >= 7) return 'heavy';
                if(index >= 5) return 'normal';
                return 'light';
            }
            
            loadData();
            setInterval(loadData, 60000);
        </script>
    </body>
    </html>
    '''

# ============ API چت ============
@app.route('/api/health')
def health():
    return jsonify({'ok': True, 'status': 'online', 'topics': len(knowledge)})

@app.route('/api/chat', methods=['POST'])
def chat_api():
    data = request.json
    msg = data.get('message', '')
    
    # جستجو در دانشنامه
    for key, value in knowledge.items():
        if msg in key or key in msg:
            return jsonify({'response': value[:500], 'source': 'knowledge'})
    
    return jsonify({'response': '🤔 متوجه نشدم. سوال خود را واضح‌تر بپرسید.', 'source': 'fallback'})

if __name__ == '__main__':
    print("🚀 HDP ONE Flask Server with Traffic Algorithm")
    print("📍 http://localhost:5000")
    print("🚦 Traffic API: /api/traffic/status")
    print("🌐 Traffic Page: /traffic")
    app.run(host='0.0.0.0', port=5000, debug=True)

# ============ ML API Routes ============
from ml_algorithms.simple_ml import SimpleIntentClassifier, SimpleEmotionDetector, SimpleSearchRanker

# راه‌اندازی مدل‌ها
intent_clf = SimpleIntentClassifier()
emotion_detector = SimpleEmotionDetector()
search_ranker = SimpleSearchRanker()

# دانشنامه برای جستجو
knowledge_docs = [
    "جزیره قشم بزرگترین جزیره خلیج فارس با جاذبه های دره ستارگان و جنگل حرا",
    "بندرعباس مرکز استان هرمزگان با جمعیت 680 هزار نفر",
    "ترافیک در چهارراه غزی و میدان سپاه سنگین است",
    "قیمت طلا 18 عیار 4,850,000 تومان، دلار 78,000 تومان",
    "آب و هوای بندرعباس گرم و مرطوب با دمای 32 درجه",
    "بیمارستان شهید محمدی در بلوار جمهوری اسلامی"
]
search_ranker.train(knowledge_docs)

@app.route('/api/ml/intent', methods=['POST'])
def ml_intent():
    data = request.json
    text = data.get('text', '')
    result = intent_clf.predict(text)
    return jsonify({'ok': True, **result})

@app.route('/api/ml/emotion', methods=['POST'])
def ml_emotion():
    data = request.json
    text = data.get('text', '')
    result = emotion_detector.predict(text)
    return jsonify({'ok': True, **result})

@app.route('/api/ml/search', methods=['POST'])
def ml_search():
    data = request.json
    query = data.get('query', '')
    results = search_ranker.search(query, top_k=3)
    return jsonify({'ok': True, 'query': query, 'results': [{'text': r[0], 'score': r[1]} for r in results]})

print("🧠 ML API routes registered:")
print("   POST /api/ml/intent  - تشخیص نیت")
print("   POST /api/ml/emotion - تشخیص احساسات")
print("   POST /api/ml/search  - جستجوی معنایی")

# ============ ML API Routes ============
from ml_algorithms.simple_ml import SimpleIntentClassifier, SimpleEmotionDetector, SimpleSearchRanker

# راه‌اندازی مدل‌ها
intent_clf = SimpleIntentClassifier()
emotion_detector = SimpleEmotionDetector()
search_ranker = SimpleSearchRanker()

# دانشنامه برای جستجو
knowledge_docs = [
    "جزیره قشم بزرگترین جزیره خلیج فارس با جاذبه های دره ستارگان و جنگل حرا",
    "بندرعباس مرکز استان هرمزگان با جمعیت 680 هزار نفر",
    "ترافیک در چهارراه غزی و میدان سپاه سنگین است",
    "قیمت طلا 18 عیار 4,850,000 تومان، دلار 78,000 تومان",
    "آب و هوای بندرعباس گرم و مرطوب با دمای 32 درجه",
    "بیمارستان شهید محمدی در بلوار جمهوری اسلامی"
]
search_ranker.train(knowledge_docs)

@app.route('/api/ml/intent', methods=['POST'])
def ml_intent():
    data = request.json
    text = data.get('text', '')
    result = intent_clf.predict(text)
    return jsonify({'ok': True, **result})

@app.route('/api/ml/emotion', methods=['POST'])
def ml_emotion():
    data = request.json
    text = data.get('text', '')
    result = emotion_detector.predict(text)
    return jsonify({'ok': True, **result})

@app.route('/api/ml/search', methods=['POST'])
def ml_search():
    data = request.json
    query = data.get('query', '')
    results = search_ranker.search(query, top_k=3)
    return jsonify({'ok': True, 'query': query, 'results': [{'text': r[0], 'score': r[1]} for r in results]})

print("🧠 ML API routes registered:")
print("   POST /api/ml/intent  - تشخیص نیت")
print("   POST /api/ml/emotion - تشخیص احساسات")
print("   POST /api/ml/search  - جستجوی معنایی")

# ============ ML API ============
from ml_algorithms.simple_ml import SimpleIntentClassifier, SimpleEmotionDetector, SimpleSearchRanker

# راه‌اندازی مدل‌ها
ml_intent = SimpleIntentClassifier()
ml_emotion = SimpleEmotionDetector()
ml_search = SimpleSearchRanker()

# دانشنامه برای جستجو
ml_docs = [
    "جزیره قشم بزرگترین جزیره خلیج فارس با دره ستارگان و جنگل حرا",
    "بندرعباس مرکز استان هرمزگان",
    "ترافیک در چهارراه غزی سنگین است",
    "قیمت طلا 4,850,000 تومان",
    "آب و هوای بندرعباس 32 درجه"
]
ml_search.train(ml_docs)

@app.route('/api/ml/intent', methods=['POST'])
def ml_intent_api():
    data = request.get_json()
    if not data:
        return jsonify({'ok': False, 'error': 'Invalid JSON'})
    text = data.get('text', '')
    result = ml_intent.predict(text)
    return jsonify({'ok': True, **result})

@app.route('/api/ml/emotion', methods=['POST'])
def ml_emotion_api():
    data = request.get_json()
    if not data:
        return jsonify({'ok': False, 'error': 'Invalid JSON'})
    text = data.get('text', '')
    result = ml_emotion.predict(text)
    return jsonify({'ok': True, **result})

@app.route('/api/ml/search', methods=['POST'])
def ml_search_api():
    data = request.get_json()
    if not data:
        return jsonify({'ok': False, 'error': 'Invalid JSON'})
    query = data.get('query', '')
    results = ml_search.search(query, top_k=3)
    return jsonify({'ok': True, 'query': query, 'results': [{'text': r[0], 'score': r[1]} for r in results]})

print("🧠 ML APIs registered:")
print("   POST /api/ml/intent")
print("   POST /api/ml/emotion")
print("   POST /api/ml/search")
