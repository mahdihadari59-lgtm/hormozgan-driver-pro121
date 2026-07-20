# ============ الگوریتم‌های ساده یادگیری ماشین (بدون sklearn) ============
import math
import re
from collections import Counter

class SimpleIntentClassifier:
    """طبقه‌بندی نیت با استفاده از کلمات کلیدی و امتیازدهی ساده"""
    
    def __init__(self):
        self.intent_keywords = {
            'greeting': ['سلام', 'درود', 'چطوری', 'خوبی', 'چه خبر', 'سلامتی'],
            'farewell': ['خداحافظ', 'بای', 'فعلا', 'بدرود'],
            'traffic': ['ترافیک', 'راهبندان', 'تصادف', 'رانندگی', 'جاده'],
            'weather': ['هوا', 'آب و هوا', 'دما', 'باران', 'گرما', 'شرجی'],
            'gold': ['طلا', 'قیمت', 'دلار', 'سکه', 'ارز'],
            'navigation': ['مسیر', 'راه', 'فاصله', 'چقدر', 'کیلومتر'],
            'food': ['غذا', 'رستوران', 'قلیه', 'ماهی', 'خوراک'],
            'hospital': ['بیمارستان', 'دکتر', 'درمان', 'اورژانس', '۱۱۵']
        }
        
        self.stop_words = {'و', 'به', 'از', 'در', 'را', 'با', 'برای', 'که'}
    
    def tokenize(self, text):
        """توکن‌سازی ساده"""
        text = re.sub(r'[^\w\s]', '', text)
        words = text.split()
        return [w for w in words if w not in self.stop_words and len(w) > 1]
    
    def predict(self, text):
        scores = {intent: 0 for intent in self.intent_keywords}
        tokens = self.tokenize(text)
        
        for token in tokens:
            for intent, keywords in self.intent_keywords.items():
                if token in keywords:
                    scores[intent] += 1
        
        max_score = max(scores.values()) if scores else 0
        if max_score == 0:
            return {'intent': 'unknown', 'confidence': 0.3}
        
        best_intent = max(scores, key=scores.get)
        confidence = min(0.5 + (max_score / 10), 0.95)
        
        return {'intent': best_intent, 'confidence': confidence}
    
    def predict_batch(self, texts):
        return [self.predict(t) for t in texts]


class SimpleEmotionDetector:
    """تشخیص احساسات با استفاده از کلمات کلیدی"""
    
    def __init__(self):
        self.emotion_keywords = {
            'happy': ['خوشحالم', 'مبارکه', 'عالی', 'خوبم', 'خوشحال'],
            'sad': ['ناراحتم', 'دلم گرفته', 'غمگین', 'گریه', 'تنهام'],
            'angry': ['عصبانیم', 'خشم', 'عصبانی', 'حرص', 'داغون'],
            'anxious': ['نگرانم', 'استرس', 'میترسم', 'اضطراب', 'دلواپس']
        }
    
    def predict(self, text):
        scores = {emotion: 0 for emotion in self.emotion_keywords}
        
        for emotion, keywords in self.emotion_keywords.items():
            for kw in keywords:
                if kw in text:
                    scores[emotion] += 1
        
        max_score = max(scores.values()) if scores else 0
        if max_score == 0:
            return {'emotion': 'neutral', 'confidence': 0.3}
        
        best_emotion = max(scores, key=scores.get)
        confidence = min(0.5 + (max_score / 10), 0.95)
        
        return {'emotion': best_emotion, 'confidence': confidence}


class SimpleSearchRanker:
    """رتبه‌بندی نتایج جستجو با استفاده از TF-IDF ساده"""
    
    def __init__(self):
        self.documents = []
        self.doc_vectors = []
    
    def _compute_tf(self, words):
        tf = Counter(words)
        max_tf = max(tf.values()) if tf else 1
        return {word: count / max_tf for word, count in tf.items()}
    
    def _compute_idf(self, all_docs):
        idf = {}
        doc_count = len(all_docs)
        for doc in all_docs:
            unique_words = set(doc)
            for word in unique_words:
                idf[word] = idf.get(word, 0) + 1
        return {word: math.log(doc_count / (count + 1)) for word, count in idf.items()}
    
    def _vectorize(self, words, idf):
        tf = self._compute_tf(words)
        return {word: tf[word] * idf.get(word, 1) for word in tf}
    
    def _cosine_similarity(self, vec1, vec2):
        common = set(vec1.keys()) & set(vec2.keys())
        dot = sum(vec1[w] * vec2[w] for w in common)
        norm1 = math.sqrt(sum(v ** 2 for v in vec1.values()))
        norm2 = math.sqrt(sum(v ** 2 for v in vec2.values()))
        return dot / (norm1 * norm2) if norm1 and norm2 else 0
    
    def train(self, documents):
        self.documents = documents
        all_words = [doc.split() for doc in documents]
        self.idf = self._compute_idf(all_words)
        self.doc_vectors = [self._vectorize(doc.split(), self.idf) for doc in documents]
        return self
    
    def search(self, query, top_k=5):
        query_vec = self._vectorize(query.split(), self.idf)
        scores = []
        for i, doc_vec in enumerate(self.doc_vectors):
            score = self._cosine_similarity(query_vec, doc_vec)
            scores.append((self.documents[i], score))
        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:top_k]


# ============ تست ============
if __name__ == "__main__":
    print("=" * 60)
    print("🧠 تست الگوریتم‌های ساده یادگیری ماشین")
    print("=" * 60)
    
    # تست Intent Classifier
    print("\n📊 1. Intent Classifier:")
    intent_clf = SimpleIntentClassifier()
    
    test_texts = ["سلام چطوری", "ترافیک چطوره", "قیمت طلا", "هوا چطوره"]
    for text in test_texts:
        result = intent_clf.predict(text)
        print(f"   '{text}' → {result['intent']} (conf={result['confidence']:.2f})")
    
    # تست Emotion Detector
    print("\n📊 2. Emotion Detector:")
    emotion_detector = SimpleEmotionDetector()
    
    test_emotions = ["خیلی خوشحالم", "دلم گرفته ناراحتم", "عصبانیم", "خیلی نگرانم"]
    for text in test_emotions:
        result = emotion_detector.predict(text)
        print(f"   '{text}' → {result['emotion']} (conf={result['confidence']:.2f})")
    
    # تست Search Ranker
    print("\n📊 3. Search Ranker:")
    ranker = SimpleSearchRanker()
    documents = [
        "جزیره قشم بزرگترین جزیره خلیج فارس",
        "بندرعباس مرکز استان هرمزگان",
        "ترافیک در چهارراه غزی سنگین است",
        "قیمت طلا امروز افزایش یافت"
    ]
    ranker.train(documents)
    
    results = ranker.search("قشم", top_k=2)
    for doc, score in results:
        print(f"   score={score:.3f}: {doc[:40]}...")
    
    print("\n✅ همه مدل‌ها با موفقیت کار می‌کنند!")
