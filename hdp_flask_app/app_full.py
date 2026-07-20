from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import os
from ml_algorithms.simple_ml import SimpleIntentClassifier, SimpleEmotionDetector, SimpleSearchRanker

app = Flask(__name__)
CORS(app)

# ============ راه‌اندازی مدل‌های ML ============
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

print("🧠 ML Models initialized")

# ============ بارگذاری دانشنامه ============
knowledge = {}
kb_path = 'data/hormozgan_knowledge.json'

if os.path.exists(kb_path):
    with open(kb_path, 'r', encoding='utf-8') as f:
        knowledge = json.load(f)
    print(f"✅ دانشنامه loaded: {len(knowledge)} topics")
else:
    print("⚠️ دانشنامه یافت نشد")

# ============ ML APIها ============
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

@app.route('/api/ml/stats', methods=['GET'])
def ml_stats():
    return jsonify({
        'ok': True,
        'models': ['intent', 'emotion', 'search'],
        'status': 'active'
    })

# ============ API چت ============
@app.route('/api/health')
def health():
    return jsonify({'ok': True, 'status': 'online', 'topics': len(knowledge)})

@app.route('/api/chat', methods=['POST'])
def chat_api():
    data = request.json
    msg = data.get('message', '')
    
    # تشخیص نیت با ML
    intent_result = intent_clf.predict(msg)
    
    # جستجو در دانشنامه
    for key, value in knowledge.items():
        if msg in key or key in msg:
            return jsonify({'response': value[:500], 'source': 'knowledge', 'intent': intent_result})
    
    # پاسخ پیش‌فرض
    return jsonify({
        'response': f"🤔 متوجه نشدم. نیت تشخیص داده شده: {intent_result['intent']}\n\n📌 می‌تونی بپرسی:\n• سلام\n• ترافیک\n• آب و هوا\n• قیمت طلا\n• جزیره قشم",
        'source': 'fallback',
        'intent': intent_result
    })

# ============ صفحات ============
@app.route('/')
def index():
    return '''
    <!DOCTYPE html>
    <html>
    <head><title>HDP ML</title><meta charset="UTF-8"></head>
    <body style="text-align:center;padding:50px;font-family:Tahoma">
        <h1>🚕 HDP ONE with ML</h1>
        <p>🧠 الگوریتم‌های یادگیری ماشین فعال</p>
        <p>📚 {} موضوع</p>
        <hr>
        <p><a href="/chat">💬 ورود به چت</a></p>
        <p>👨‍💻 مهدی حیدری پوری | ۱۴۰۴</p>
    </body>
    </html>
    '''.format(len(knowledge))

@app.route('/chat')
def chat():
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>HDP Chat</title>
        <meta charset="UTF-8">
        <style>
            body { font-family: Tahoma; background: linear-gradient(135deg,#667eea,#764ba2); padding:20px; }
            .chat-container { max-width:500px; margin:auto; background:white; border-radius:20px; overflow:hidden; }
            .header { background: linear-gradient(135deg,#667eea,#764ba2); padding:20px; color:white; text-align:center; }
            .messages { height:400px; overflow-y:auto; padding:15px; background:#f5f5f5; }
            .message { margin-bottom:15px; display:flex; }
            .user { justify-content:flex-end; }
            .bot { justify-content:flex-start; }
            .bubble { max-width:80%; padding:10px 15px; border-radius:20px; }
            .user .bubble { background:#667eea; color:white; }
            .bot .bubble { background:white; color:#333; }
            .input-area { display:flex; padding:15px; gap:10px; }
            .input-area input { flex:1; padding:12px; border:1px solid #ddd; border-radius:25px; }
            .input-area button { padding:12px 20px; background:#667eea; color:white; border:none; border-radius:25px; cursor:pointer; }
            .footer { text-align:center; padding:10px; font-size:11px; color:#888; }
        </style>
    </head>
    <body>
        <div class="chat-container">
            <div class="header"><h3>🚕 HDP Chat with ML</h3><p>تشخیص نیت | هوشمند</p></div>
            <div class="messages" id="messages">
                <div class="message bot"><div class="bubble">👋 سلام! به HDP ONE خوش آمدید. من با الگوریتم‌های ML نیت شما را تشخیص می‌دهم!</div></div>
            </div>
            <div class="input-area">
                <input type="text" id="input" placeholder="پیام خود را بنویسید..." onkeypress="if(event.key==='Enter') send()">
                <button onclick="send()">📤</button>
            </div>
            <div class="footer">👨‍💻 مهدی حیدری پوری | ۱۴۰۴</div>
        </div>
        <script>
            async function send() {
                const input = document.getElementById('input');
                const msg = input.value.trim();
                if (!msg) return;
                const messages = document.getElementById('messages');
                messages.innerHTML += `<div class="message user"><div class="bubble">${escapeHtml(msg)}</div></div>`;
                input.value = '';
                messages.scrollTop = messages.scrollHeight;
                try {
                    const res = await fetch('/api/chat', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({message: msg})
                    });
                    const data = await res.json();
                    const intentText = data.intent ? ` [نیت: ${data.intent.intent}]` : '';
                    messages.innerHTML += `<div class="message bot"><div class="bubble">${escapeHtml(data.response)}${intentText}</div></div>`;
                } catch(e) {
                    messages.innerHTML += `<div class="message bot"><div class="bubble">❌ خطا در ارتباط</div></div>`;
                }
                messages.scrollTop = messages.scrollHeight;
            }
            function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
        </script>
    </body>
    </html>
    '''

if __name__ == '__main__':
    print("🚀 HDP ONE with ML Algorithms")
    print("📍 http://localhost:5000")
    print("🧠 ML APIs: /api/ml/intent, /api/ml/emotion, /api/ml/search")
    app.run(host='0.0.0.0', port=5000, debug=True)
