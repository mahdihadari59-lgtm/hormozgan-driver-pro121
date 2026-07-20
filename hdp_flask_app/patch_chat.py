from pathlib import Path

p = Path("app_complete.py")
txt = p.read_text(encoding="utf-8")

old = """@app.route('/api/chat', methods=['POST'])
def chat_api():
    data = request.json
    msg = data.get('message', '')

    # جستجو در دانشنامه
    for key, value in knowledge.items():
        if msg in key or key in msg:
            return jsonify({'response': value[:500], 'source': 'knowledge'})

    return jsonify({'response': '🤔 متوجه نشدم. سوال خود را واضح‌تر بپرسید.', 'source': 'fallback'})
"""

new = """@app.route('/api/chat', methods=['POST'])
def chat_api():
    data = request.json or {}
    msg = data.get('message', '').strip()

    result = search_in_knowledge(msg)

    if result:
        return jsonify({
            'response': result[:1000],
            'source': 'knowledge'
        })

    return jsonify({
        'response': '🤔 متوجه نشدم. سوال خود را واضح‌تر بپرسید.',
        'source': 'fallback'
    })
"""

txt = txt.replace(old, new)

p.write_text(txt, encoding="utf-8")
print("✅ chat_api patched")
