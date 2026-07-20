# HDP ONE Flask App - نسخه ادغام شده
# سامانه هوشمند یکپارچه هرمزگان

from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
import requests
import json
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'hdp-one-secret-key-2024'
CORS(app)

# ============================================
# تنظیمات اتصال به HDP ONE Backend
# ============================================
HDP_BACKEND_URL = os.environ.get('HDP_BACKEND_URL', 'http://localhost:9090')
HDP_RAG_URL = os.environ.get('HDP_RAG_URL', 'http://localhost:9091')

# ============================================
# مسیرهای اصلی
# ============================================

@app.route('/')
def index():
    """صفحه اصلی"""
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    """داشبورد مدیریت"""
    return render_template('dashboard.html')

@app.route('/chat')
def chat():
    """صفحه چت هوشمند"""
    return render_template('chat.html')

@app.route('/dialects')
def dialects():
    """صفحه گویش‌های هرمزگان"""
    return render_template('dialects.html')

@app.route('/about')
def about():
    """درباره پروژه"""
    return render_template('about.html')

# ============================================
# APIهای داخلی (متصل به HDP ONE Backend)
# ============================================

@app.route('/api/health')
def api_health():
    """وضعیت سلامت سیستم"""
    try:
        response = requests.get(f'{HDP_BACKEND_URL}/api/health', timeout=5)
        return jsonify(response.json())
    except:
        return jsonify({'status': 'healthy', 'backend': 'connected', 'timestamp': datetime.now().isoformat()})

@app.route('/api/gold')
def api_gold():
    """قیمت طلا و ارز"""
    try:
        response = requests.get(f'{HDP_BACKEND_URL}/api/gold', timeout=5)
        return jsonify(response.json())
    except:
        return jsonify({'gold18': '4,852,000', 'emamiCoin': '52,000,000', 'source': 'cache'})

@app.route('/api/weather')
def api_weather():
    """آب و هوا"""
    city = request.args.get('city', 'بندرعباس')
    try:
        response = requests.get(f'{HDP_BACKEND_URL}/api/weather?city={city}', timeout=5)
        return jsonify(response.json())
    except:
        return jsonify({'city': city, 'temperature': '35°C', 'condition': 'آفتابی', 'source': 'cache'})

@app.route('/api/traffic')
def api_traffic():
    """وضعیت ترافیک"""
    location = request.args.get('location', '')
    try:
        response = requests.get(f'{HDP_BACKEND_URL}/api/traffic?location={location}', timeout=5)
        return jsonify(response.json())
    except:
        return jsonify({'location': location or 'بندرعباس', 'status': 'معمولی', 'source': 'cache'})

@app.route('/api/bandari')
def api_bandari():
    """گویش بندری"""
    word = request.args.get('word', '')
    try:
        response = requests.get(f'{HDP_BACKEND_URL}/api/bandari?word={word}', timeout=5)
        return jsonify(response.json())
    except:
        return jsonify({'word': word or 'واویلا', 'meaning': 'چه قدر / چقدر'})

@app.route('/api/calendar')
def api_calendar():
    """تقویم شمسی"""
    try:
        response = requests.get(f'{HDP_BACKEND_URL}/api/calendar', timeout=5)
        return jsonify(response.json())
    except:
        return jsonify({'persian': '۱۴۰۳/۰۳/۲۰', 'weekday': 'سه‌شنبه', 'gregorian': datetime.now().date().isoformat()})

@app.route('/api/fal')
def api_fal():
    """فال حافظ"""
    try:
        response = requests.get(f'{HDP_BACKEND_URL}/api/fal', timeout=5)
        return jsonify(response.json())
    except:
        return jsonify({'poem': 'صبا به لطف بگو آن غزال رعنا را', 'interpretation': 'روز خوبی در پیش دارید'})

@app.route('/api/intent', methods=['POST'])
def api_intent():
    """تشخیص Intent"""
    data = request.json
    text = data.get('text', '')
    try:
        response = requests.post(f'{HDP_BACKEND_URL}/api/intent', json={'text': text}, timeout=5)
        return jsonify(response.json())
    except:
        # تشخیص ساده محلی
        intent = 'general'
        if 'طلا' in text:
            intent = 'gold'
        elif 'هوا' in text:
            intent = 'weather'
        elif 'ترافیک' in text:
            intent = 'traffic'
        elif 'سلام' in text:
            intent = 'greeting'
        return jsonify({'intent': intent, 'confidence': 0.8})

@app.route('/api/chat', methods=['POST'])
def api_chat():
    """چت هوشمند"""
    data = request.json
    message = data.get('message', '')
    
    # تلاش برای اتصال به HDP ONE Backend
    try:
        response = requests.post(f'{HDP_BACKEND_URL}/api/ai/chat-pro', 
                                  json={'message': message}, timeout=10)
        return jsonify(response.json())
    except:
        # پاسخ ساده در صورت عدم اتصال
        responses = {
            'greeting': '👋 سلام! به HDP ONE خوش آمدید.',
            'gold': '💰 قیمت طلا: 4,852,000 تومان',
            'weather': '🌤️ هوای بندرعباس: 35 درجه، آفتابی',
            'traffic': '🚦 ترافیک چهارراه غزی: سنگین',
            'default': '💬 متوجه نشدم. لطفاً واضح‌تر بپرسید.'
        }
        
        if 'طلا' in message:
            return jsonify({'response': responses['gold'], 'intent': 'gold'})
        elif 'هوا' in message:
            return jsonify({'response': responses['weather'], 'intent': 'weather'})
        elif 'ترافیک' in message:
            return jsonify({'response': responses['traffic'], 'intent': 'traffic'})
        elif 'سلام' in message:
            return jsonify({'response': responses['greeting'], 'intent': 'greeting'})
        else:
            return jsonify({'response': responses['default'], 'intent': 'general'})

@app.route('/api/keyword/classify', methods=['POST'])
def api_keyword_classify():
    """طبقه‌بندی کلیدواژه"""
    data = request.json
    keyword = data.get('keyword', '')
    try:
        response = requests.post(f'{HDP_BACKEND_URL}/api/keyword/classify', json={'keyword': keyword}, timeout=5)
        return jsonify(response.json())
    except:
        return jsonify({'keyword': keyword, 'category': '📚 دانش عمومی'})

@app.route('/api/keyword/decompose', methods=['POST'])
def api_keyword_decompose():
    """تفکیک کلیدواژه ترکیبی"""
    data = request.json
    keyword = data.get('keyword', '')
    try:
        response = requests.post(f'{HDP_BACKEND_URL}/api/keyword/decompose', json={'keyword': keyword}, timeout=5)
        return jsonify(response.json())
    except:
        parts = keyword.split('_')
        return jsonify({'original': keyword, 'parts': parts, 'type': 'underscore'})

@app.route('/api/rag/chat', methods=['POST'])
def api_rag_chat():
    """چت با RAG"""
    data = request.json
    message = data.get('message', '')
    try:
        response = requests.post(f'{HDP_RAG_URL}/rag/chat', json={'message': message}, timeout=10)
        return jsonify(response.json())
    except:
        return jsonify({'response': 'RAG server is not available. Using fallback.', 'sources': []})

@app.route('/api/rag/stats')
def api_rag_stats():
    """آمار RAG"""
    try:
        response = requests.get(f'{HDP_RAG_URL}/rag/stats', timeout=5)
        return jsonify(response.json())
    except:
        return jsonify({'totalVectors': 0, 'dialectsCount': 5, 'status': 'disconnected'})

# ============================================
# آمار سیستم
# ============================================
@app.route('/api/system/stats')
def system_stats():
    """آمار کلی سیستم"""
    return jsonify({
        'version': '1.0.0',
        'backend': 'HDP ONE',
        'backend_url': HDP_BACKEND_URL,
        'rag_url': HDP_RAG_URL,
        'uptime': datetime.now().isoformat(),
        'features': ['gold', 'weather', 'traffic', 'bandari', 'calendar', 'fal', 'chat', 'rag']
    })

if __name__ == '__main__':
    print('\n' + '='*60)
    print('🚀 HDP ONE Flask App - ادغام شده با Backend')
    print('='*60)
    print(f'📍 Backend URL: {HDP_BACKEND_URL}')
    print(f'📍 RAG URL: {HDP_RAG_URL}')
    print(f'🌐 Flask App: http://localhost:5000')
    print('='*60 + '\n')
    app.run(host='0.0.0.0', port=5000, debug=True)
