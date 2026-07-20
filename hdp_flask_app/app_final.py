from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
import os
import sqlite3
from datetime import datetime

from services.embedding_service import EmbeddingService
from services.rag_engine_advanced import RAGEngineAdvanced

app = Flask(__name__)
CORS(app)
app.config['JSON_AS_ASCII'] = False

embedding_service = EmbeddingService()
rag_engine = RAGEngineAdvanced(embedding_service, 'hdp_pro.db')

print("✅ HDP PRO Final Edition Ready")
print("   📸 Speed Cameras | ⚠️ Danger Zones | 🚦 Traffic")
print("   🏨 Hotels | 🌴 Tours | 🚗 Car Showrooms | 🛍️ Stores")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'version': '6.0',
        'timestamp': datetime.now().isoformat(),
        'documents': len(rag_engine.documents)
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message', '')
    
    results = rag_engine.search(user_input, top_k=3)
    
    if results:
        best = results[0]
        response = best['content']
    else:
        response = """🤔 سوال شما را متوجه نشدم.

📌 **مواردی که می‌توانم کمک کنم:**
• 📸 دوربین‌های سرعت و محدودیت‌ها
• ⚠️ نقاط حادثه‌خیز و خطرناک
• 🚦 وضعیت ترافیک لحظه‌ای
• 🏨 هتل‌ها و اقامتگاه‌ها
• 🌴 تورهای گردشگری قشم، کیش، هرمز
• 🚗 نمایشگاه‌های خودرو
• 🛍️ فروشگاه‌ها و مراکز خرید

لطفاً دقیق‌تر بپرسید!"""
    
    return jsonify({'response': response, 'sources': len(results)})

@app.route('/api/speed-cameras', methods=['GET'])
def get_speed_cameras():
    city = request.args.get('city')
    cameras = rag_engine.get_speed_cameras(city)
    return jsonify({'count': len(cameras), 'cameras': cameras})

@app.route('/api/danger-zones', methods=['GET'])
def get_danger_zones():
    city = request.args.get('city')
    zones = rag_engine.get_danger_zones(city)
    return jsonify({'count': len(zones), 'zones': zones})

@app.route('/api/traffic', methods=['GET'])
def get_traffic():
    traffic = rag_engine.get_traffic_info()
    return jsonify({'count': len(traffic), 'traffic': traffic})

@app.route('/api/hotels', methods=['GET'])
def get_hotels():
    city = request.args.get('city')
    min_stars = request.args.get('min_stars', 1, type=int)
    hotels = rag_engine.get_hotels(city, min_stars)
    return jsonify({'count': len(hotels), 'hotels': hotels})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
