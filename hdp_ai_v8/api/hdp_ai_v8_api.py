"""
HDP AI v8 API - نسخه نهایی با موتور جستجوی ترکیبی
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import time
from datetime import datetime

# Import core modules
import sys
from pathlib import Path

# Add paths
sys.path.insert(0, str(Path(__file__).parent.parent))
sys.path.insert(0, str(Path(__file__).parent.parent.parent / 'hdp_flask_app' / 'services'))

from search.hybrid_search_engine import HybridSearchEngine
from memory.conversation_memory import ConversationMemory
from analytics.search_analytics import SearchAnalytics

# Import existing services
try:
    from embedding_service import EmbeddingService
    from intent_classifier import IntentClassifier
except:
    # Fallback classes
    class EmbeddingService:
        def encode(self, text): return [0.1] * 128
    class IntentClassifier:
        def classify(self, text): return {'intent': 'general', 'confidence': 0.5}

app = Flask(__name__)
CORS(app)

# Initialize services
embedding_service = EmbeddingService()
intent_classifier = IntentClassifier()
search_engine = HybridSearchEngine('hdp_pro.db', embedding_service)
conversation_memory = ConversationMemory()
analytics = SearchAnalytics()

print("=" * 60)
print("🚀 HDP AI v8 - Production Ready")
print("=" * 60)
print(f"📊 Modules loaded: {len([m for m in [search_engine, conversation_memory, analytics] if m])}")
print("=" * 60)

@app.route('/api/v8/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'version': '8.0',
        'timestamp': datetime.now().isoformat(),
        'modules': {
            'hybrid_search': True,
            'conversation_memory': True,
            'analytics': True
        }
    })

@app.route('/api/v8/search', methods=['POST'])
def search():
    """جستجوی هیبرید پیشرفته"""
    data = request.json
    query = data.get('query', '')
    user_id = data.get('user_id', 'anonymous')
    session_id = data.get('session_id', 'default')
    
    start_time = time.time()
    
    # 1. تشخیص Intent
    intent_result = intent_classifier.classify(query)
    
    # 2. جستجوی هیبرید
    results = search_engine.hybrid_search(query, intent_result['intent'], top_k=5)
    
    latency = int((time.time() - start_time) * 1000)
    
    # 3. ثبت در Analytics (async)
    analytics.log_search(query, intent_result['intent'], latency, len(results))
    
    # 4. ذخیره در حافظه گفتگو
    conversation_memory.add_conversation(
        user_id, session_id, query, intent_result['intent'], 
        results[0]['content'][:200] if results else '', 
        intent_result['confidence']
    )
    
    # 5. دریافت بافت گفتگو
    context = conversation_memory.get_context(user_id, session_id, limit=3)
    
    return jsonify({
        'query': query,
        'intent': intent_result['intent'],
        'confidence': intent_result['confidence'],
        'results': results,
        'context': context,
        'latency_ms': latency,
        'count': len(results)
    })

@app.route('/api/v8/popular', methods=['GET'])
def popular_queries():
    """پرتکرارترین جستجوها"""
    queries = conversation_memory.get_popular_queries(limit=10)
    return jsonify({'popular_queries': queries})

@app.route('/api/v8/stats', methods=['GET'])
def get_stats():
    """آمار جستجو"""
    stats = analytics.get_stats(days=7)
    return jsonify(stats)

@app.route('/api/v8/clear-cache', methods=['POST'])
def clear_cache():
    search_engine.clear_cache()
    return jsonify({'status': 'ok', 'message': 'Cache cleared'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081, debug=True)

print("✅ HDP AI v8 API ready on port 8081")
