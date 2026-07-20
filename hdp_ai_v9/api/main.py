#!/usr/bin/env python3
"""
HDP AI v9 - سرور اصلی
"""

import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(BASE_DIR))
sys.path.insert(0, str(BASE_DIR / 'services'))

from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from datetime import datetime

from config.config import config
from services.embedding_service import embedding
from services.intent_classifier import intent_classifier
from services.search_engine import SearchEngine

app = Flask(__name__)
CORS(app)

search_engine = SearchEngine(embedding, config)

print("=" * 70)
print("🚀 HDP AI v9 - هوش مصنوعی هرمزگان")
print("=" * 70)
print(f"📚 دانشنامه: {len(search_engine.knowledge)} موضوع")
print(f"🎯 Intentها: {len(intent_classifier.intents)} دسته")
print("=" * 70)

@app.route('/')
def home():
    return f"""
    <html dir="rtl">
    <head><meta charset="UTF-8"><title>HDP AI v9</title>
    <style>
        body{{font-family:Tahoma;background:linear-gradient(135deg,#0f2027,#203a43,#2c5364);color:#fff;padding:20px;text-align:center}}
        h1{{color:#ffd700}}
        .badge{{display:inline-block;background:rgba(255,255,255,0.1);border-radius:20px;padding:8px 16px;margin:5px}}
        .card{{background:rgba(255,255,255,0.05);border-radius:15px;padding:20px;margin:20px auto;max-width:600px}}
        .endpoint{{background:rgba(0,0,0,0.3);padding:10px;margin:5px;border-radius:8px;font-family:monospace}}
    </style>
    </head>
    <body>
        <h1>🚗 HDP AI v9</h1>
        <p>دستیار هوشمند هرمزگان</p>
        <div class="card">
            <span class="badge">✅ سرور فعال</span>
            <span class="badge">📚 {len(search_engine.knowledge)} موضوع</span>
            <span class="badge">🎯 {len(intent_classifier.intents)} Intent</span>
        </div>
        <div class="card">
            <div class="endpoint">POST /api/v9/search</div>
            <div class="endpoint">GET /api/v9/health</div>
            <div class="endpoint">POST /api/v9/chat</div>
        </div>
        <p style="color:#aaa">نسخه 9.0.0 | پورت {config.PORT}</p>
    </body>
    </html>
    """

@app.route('/api/v9/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'version': '9.0.0',
        'timestamp': datetime.now().isoformat(),
        'knowledge_size': len(search_engine.knowledge),
        'intents_count': len(intent_classifier.intents)
    })

@app.route('/api/v9/search', methods=['POST'])
def search():
    data = request.json
    query = data.get('query', '')
    if not query:
        return jsonify({'error': 'لطفاً عبارت جستجو را وارد کنید'}), 400
    
    start = time.time()
    intent = intent_classifier.classify(query)
    results = search_engine.search(query, top_k=5)
    latency = int((time.time() - start) * 1000)
    
    return jsonify({
        'query': query,
        'intent': intent['intent'],
        'confidence': intent['confidence'],
        'results': results,
        'count': len(results),
        'latency_ms': latency
    })

@app.route('/api/v9/chat', methods=['POST'])
def chat():
    data = request.json
    query = data.get('message', '')
    if not query:
        return jsonify({'error': 'پیام را وارد کنید'}), 400
    
    intent = intent_classifier.classify(query)
    results = search_engine.search(query, top_k=3)
    
    if intent['intent'] == 'emergency':
        response = "🚨 شماره‌های اضطراری: اورژانس 115، پلیس 110، آتش‌نشانی 125"
    elif intent['intent'] == 'greeting':
        response = "👋 سلام! من دستیار هوشمند هرمزگان هستم. چطور میتونم کمک کنم؟"
    elif results:
        best = results[0]
        response = f"📚 **{best['title']}**\n\n{best['content']}"
    else:
        response = "🤔 سوال شما را متوجه نشدم. لطفاً واضح‌تر بپرسید."
    
    return jsonify({
        'response': response,
        'intent': intent['intent'],
        'confidence': intent['confidence']
    })

if __name__ == '__main__':
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
