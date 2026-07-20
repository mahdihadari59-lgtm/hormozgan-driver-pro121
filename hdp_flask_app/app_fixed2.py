from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# بارگذاری دانشنامه کامل
knowledge = {}
kb_path = 'data/hormozgan_knowledge.json'

if os.path.exists(kb_path):
    with open(kb_path, 'r', encoding='utf-8') as f:
        knowledge = json.load(f)
    print(f"✅ دانشنامه loaded: {len(knowledge)} topics")
else:
    print("⚠️ دانشنامه یافت نشد")

# گویش بندری (برای احوالپرسی)
bandari = {
    'سلام': '👋 سَلام خَری! چِطوری مِردُم؟',
    'خوبی': 'خوبم الحمدلله! تو چطوری داداش؟',
    'خداحافظ': '🤚 خدا نگهدار بابا!',
    'ممنون': '🙏 خواهش می‌کنم. نون حلال.',
}

# ============ تابع جستجوی پیشرفته ============
def search_knowledge(query):
    q = query.strip()
    
    # 1. جستجوی دقیق (Exact Match) - اولویت اول
    if q in knowledge:
        return knowledge[q]
    
    # 2. جستجوی شامل (Partial Match)
    for key, value in knowledge.items():
        if q in key or key in q:
            return value
    
    # 3. جستجوی کلمات کلیدی (برای جملات بلند)
    words = q.split()
    if len(words) > 2:
        for key, value in knowledge.items():
            for word in words:
                if len(word) > 3 and (word in key or key in word):
                    return value
    
    # 4. جستجوی در محتوا (Content Search)
    for key, value in knowledge.items():
        if q in str(value):
            return value
    
    return None

# ============ سرویس‌های سریع ============
def get_fast_service(msg):
    if 'هوا' in msg and 'روغن' not in msg and 'موتور' not in msg:
        return '🌤️ بندرعباس: 32°C، آفتابی و شرجی'
    if 'طلا' in msg or 'دلار' in msg:
        return '💰 طلا 18 عیار: 4,850,000 تومان\n💵 دلار: 78,000 تومان'
    if 'ترافیک' in msg and 'سوخت' not in msg and 'مصرف' not in msg:
        return '🚦 چهارراه غزی سنگین، بلوار ساحلی روان'
    return None

# ============ مسیرها ============
@app.route('/')
def index():
    return f'''
    <!DOCTYPE html>
    <html>
    <head><title>HDP ONE</title><meta charset="UTF-8"></head>
    <body style="text-align:center;padding:50px;font-family:Tahoma;background:linear-gradient(135deg,#667eea,#764ba2);color:white">
        <h1>🚕 HDP ONE v20.0</h1>
        <p>سیستم هوشمند هرمزگان</p>
        <p>📚 {len(knowledge)} موضوع در دانشنامه</p>
        <hr>
        <p><a href="/chat" style="color:white">💬 ورود به چت</a></p>
        <p>👨‍💻 مهدی حیدری پوری | ۱۴۰۴</p>
    </body>
    </html>
    '''

@app.route('/chat')
def chat():
    return '''
    <!DOCTYPE html>
    <html>
    <head><title>HDP Chat</title><meta charset="UTF-8">
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
            <div class="header"><h3>🚕 HDP Chat</h3><p>دستیار هوشمند هرمزگان</p></div>
            <div class="messages" id="messages">
                <div class="message bot"><div class="bubble">👋 سلام! به HDP ONE خوش آمدید. چطور می‌توانم کمک کنم؟</div></div>
            </div>
            <div class="input-area">
                <input type="text" id="input" placeholder="سوال خود را بنویسید..." onkeypress="if(event.key==='Enter') send()">
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
                    messages.innerHTML += `<div class="message bot"><div class="bubble">${escapeHtml(data.response)}</div></div>`;
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

@app.route('/api/health')
def health():
    return jsonify({'ok': True, 'status': 'online', 'topics': len(knowledge)})

@app.route('/api/chat', methods=['POST'])
def chat_api():
    data = request.json
    msg = data.get('message', '')
    
    # 1. گویش بندری (اولویت اول)
    for k, v in bandari.items():
        if k in msg or msg in k:
            return jsonify({'response': v, 'source': 'bandari'})
    
    # 2. جستجو در دانشنامه (اولویت دوم - مهمترین)
    result = search_knowledge(msg)
    if result:
        return jsonify({'response': result[:600], 'source': 'knowledge'})
    
    # 3. سرویس‌های سریع (فقط در صورتی که دانشنامه جواب نداد)
    fast_service = get_fast_service(msg)
    if fast_service:
        return jsonify({'response': fast_service, 'source': 'fast_service'})
    
    # 4. پاسخ پیش‌فرض
    return jsonify({'response': '🤔 متوجه نشدم. سوال خود را واضح‌تر بپرسید.\n\n📌 می‌توانید بپرسید:\n• آب و هوا\n• قیمت طلا\n• وضعیت ترافیک\n• جزایر هرمزگان\n• پارک‌های بندرعباس', 'source': 'fallback'})

if __name__ == '__main__':
    print(f"🚀 HDP ONE Flask on port 5000")
    print(f"📚 {len(knowledge)} topics loaded")
    app.run(host='0.0.0.0', port=5000, debug=True)
