from flask import Flask, request, jsonify
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

def register_ml_routes(app):
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
