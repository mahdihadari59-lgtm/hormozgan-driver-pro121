"""
Hybrid Search Engine v2.0 - ترکیب BM25 + FTS5 + Vector Search
برای HDP AI Core با قابلیت رتبه‌بندی هیبرید
"""

import sqlite3
import json
import numpy as np
from pathlib import Path
from typing import List, Dict, Any

class HybridSearchEngine:
    def __init__(self, db_path: str, embedding_service):
        self.db_path = db_path
        self.embedding_service = embedding_service
        
        # تنظیمات وزن‌دهی هیبرید
        self.weights = {
            'bm25': 0.40,
            'fts5': 0.35,
            'vector': 0.20,
            'intent_boost': 0.05
        }
        
        # کش نتایج
        self.cache = {}
        self.search_history = []
        
        # فعال‌سازی FTS5
        self._enable_fts5()
        
        print("✅ Hybrid Search Engine v2.0 initialized")
        print(f"   📊 Weights: BM25={self.weights['bm25']}, FTS5={self.weights['fts5']}, Vector={self.weights['vector']}")
    
    def _enable_fts5(self):
        """فعال‌سازی FTS5 در SQLite برای جستجوی سریع فارسی"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # ایجاد جدول FTS5 برای دانشنامه
            cursor.execute("""
                CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_fts 
                USING fts5(title, content, tokenize='porter unicode61')
            """)
            
            # پر کردن جدول FTS5
            cursor.execute("SELECT COUNT(*) FROM knowledge_fts")
            if cursor.fetchone()[0] == 0:
                # بارگذاری دانشنامه JSON
                kb_paths = [
                    Path(__file__).parent.parent.parent / 'hdp_flask_app' / 'data' / 'hormozgan_knowledge.json',
                    Path(__file__).parent.parent.parent / 'backend' / 'data' / 'hormozgan_knowledge.json'
                ]
                for path in kb_paths:
                    if path.exists():
                        with open(path, 'r', encoding='utf-8') as f:
                            knowledge = json.load(f)
                        for title, content in list(knowledge.items())[:5000]:
                            cursor.execute(
                                "INSERT INTO knowledge_fts (title, content) VALUES (?, ?)",
                                (title, content[:500])
                            )
                        break
            
            conn.commit()
            conn.close()
            print("   ✅ FTS5 enabled for Persian search")
        except Exception as e:
            print(f"   ⚠️ FTS5 error: {e}")
    
    def bm25_search(self, query: str, top_k: int = 10) -> List[Dict]:
        """جستجوی BM25 با پیاده‌سازی پیشرفته"""
        results = []
        query_terms = query.lower().split()
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # دریافت تمام اسناد
        cursor.execute("SELECT rowid, title, content FROM knowledge_fts LIMIT 5000")
        docs = cursor.fetchall()
        
        # محاسبه BM25 برای هر سند
        avgdl = sum(len(doc[2].split()) for doc in docs) / max(len(docs), 1)
        k1 = 1.5
        b = 0.75
        idf = {}
        
        # محاسبه IDF برای هر ترم
        for term in query_terms:
            doc_freq = sum(1 for doc in docs if term in doc[2].lower())
            idf[term] = max(0, np.log((len(docs) - doc_freq + 0.5) / (doc_freq + 0.5) + 1))
        
        # محاسبه امتیاز BM25 برای هر سند
        for doc in docs:
            score = 0
            doc_len = len(doc[2].split())
            for term in query_terms:
                if term in doc[2].lower():
                    tf = doc[2].lower().count(term)
                    numerator = tf * (k1 + 1)
                    denominator = tf + k1 * (1 - b + b * doc_len / avgdl)
                    score += idf.get(term, 0) * (numerator / denominator)
            
            if score > 0:
                results.append({
                    'id': doc[0],
                    'title': doc[1],
                    'content': doc[2],
                    'bm25_score': score
                })
        
        conn.close()
        return sorted(results, key=lambda x: x['bm25_score'], reverse=True)[:top_k]
    
    def fts5_search(self, query: str, top_k: int = 10) -> List[Dict]:
        """جستجوی FTS5 با پشتیبانی از فارسی"""
        results = []
        
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # ساخت عبارت جستجو
            search_terms = ' OR '.join([f'"{term}"' for term in query.split()])
            
            cursor.execute(f"""
                SELECT title, content, rank 
                FROM knowledge_fts 
                WHERE knowledge_fts MATCH ? 
                ORDER BY rank 
                LIMIT ?
            """, (search_terms, top_k))
            
            for row in cursor.fetchall():
                results.append({
                    'title': row[0],
                    'content': row[1],
                    'fts5_score': 1.0 / max(row[2], 0.1)
                })
            
            conn.close()
        except Exception as e:
            print(f"   ⚠️ FTS5 search error: {e}")
        
        return results
    
    def vector_search(self, query: str, top_k: int = 10) -> List[Dict]:
        """جستجوی برداری با Embedding 128 بعدی"""
        query_emb = self.embedding_service.encode(query)
        
        # شبیه‌سازی جستجوی برداری در دیتابیس
        results = []
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT title, content FROM knowledge_fts LIMIT 5000")
            docs = cursor.fetchall()
            
            for doc in docs:
                # محاسبه امتیاز شباهت ساده (در نسخه واقعی از embedding ذخیره شده استفاده می‌شود)
                score = np.random.random() * 0.5  # Placeholder
                if score > 0.3:
                    results.append({
                        'title': doc[0],
                        'content': doc[1],
                        'vector_score': score
                    })
            conn.close()
        except:
            pass
        
        return sorted(results, key=lambda x: x['vector_score'], reverse=True)[:top_k]
    
    def hybrid_search(self, query: str, intent: str = None, top_k: int = 5) -> List[Dict]:
        """جستجوی هیبرید با ترکیب همه روش‌ها"""
        cache_key = f"{query}_{intent}"
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        # انجام جستجوها
        bm25_results = self.bm25_search(query, top_k=10)
        fts5_results = self.fts5_search(query, top_k=10)
        vector_results = self.vector_search(query, top_k=10)
        
        # ترکیب نتایج
        combined = {}
        
        # BM25 نتایج
        for r in bm25_results:
            title = r['title']
            if title not in combined:
                combined[title] = {'title': title, 'content': r['content'], 'scores': {}}
            combined[title]['scores']['bm25'] = r['bm25_score']
        
        # FTS5 نتایج
        for r in fts5_results:
            title = r['title']
            if title not in combined:
                combined[title] = {'title': title, 'content': r['content'], 'scores': {}}
            combined[title]['scores']['fts5'] = r['fts5_score']
        
        # Vector نتایج
        for r in vector_results:
            title = r['title']
            if title not in combined:
                combined[title] = {'title': title, 'content': r['content'], 'scores': {}}
            combined[title]['scores']['vector'] = r['vector_score']
        
        # محاسبه امتیاز نهایی هیبرید
        final_results = []
        for title, data in combined.items():
            scores = data['scores']
            
            final_score = (
                self.weights['bm25'] * scores.get('bm25', 0) +
                self.weights['fts5'] * scores.get('fts5', 0) +
                self.weights['vector'] * scores.get('vector', 0)
            )
            
            # ضریب Intent
            if intent and self._intent_boost(intent, title):
                final_score *= 1.2
            
            final_results.append({
                'title': title,
                'content': data['content'][:300],
                'score': final_score,
                'scores': scores
            })
        
        # مرتب‌سازی و ذخیره در کش
        final_results.sort(key=lambda x: x['score'], reverse=True)
        
        # ذخیره تاریخچه جستجو
        self.search_history.append({
            'query': query,
            'intent': intent,
            'timestamp': __import__('datetime').datetime.now().isoformat(),
            'results_count': len(final_results[:top_k])
        })
        
        # نگهداری 100 تاریخچه آخر
        if len(self.search_history) > 100:
            self.search_history.pop(0)
        
        # ذخیره در کش
        self.cache[cache_key] = final_results[:top_k]
        
        return final_results[:top_k]
    
    def _intent_boost(self, intent: str, title: str) -> bool:
        """ضریب تقویت بر اساس Intent"""
        boosts = {
            'tourism': ['قشم', 'کیش', 'هرمز', 'جزیره', 'تور', 'سفر'],
            'traffic': ['ترافیک', 'راه', 'بزرگراه', 'غزی', 'سپاه'],
            'hotel': ['هتل', 'اقامت', 'رزرو'],
            'food': ['رستوران', 'غذا', 'کباب', 'ماهی', 'قلیه'],
            'gold': ['طلا', 'سکه', 'دلار', 'قیمت'],
            'medical': ['دکتر', 'بیمارستان', 'درمانگاه', 'داروخانه']
        }
        
        if intent in boosts:
            for keyword in boosts[intent]:
                if keyword in title:
                    return True
        return False
    
    def clear_cache(self):
        """پاکسازی کش"""
        self.cache.clear()
        print("🗑️ Search cache cleared")

print("✅ HybridSearchEngine loaded")
