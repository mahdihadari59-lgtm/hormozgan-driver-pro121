"""
Search Engine - جستجوی هیبرید با Embedding
"""

import json
import random
import re
from pathlib import Path

class SearchEngine:
    def __init__(self, embedding_service, config):
        self.embedding = embedding_service
        self.config = config
        self.knowledge = {}
        self.index = []
        self._load_knowledge()
        self._prepare_index()
    
    def _load_knowledge(self):
        for path in self.config.KNOWLEDGE_PATHS:
            if path.exists():
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        self.knowledge = json.load(f)
                    print(f"✅ دانشنامه بارگذاری شد: {len(self.knowledge)} موضوع")
                    return
                except:
                    pass
        
        print("⚠️ دانشنامه یافت نشد! استفاده از داده پیش‌فرض")
        self.knowledge = {
            'هرمزگان': 'استان هرمزگان، مرکز بندرعباس',
            'بندرعباس': 'مرکز استان هرمزگان، بندر تجاری مهم',
            'قشم': 'بزرگترین جزیره ایران، ژئوپارک جهانی',
            'کیش': 'جزیره مرجانی، قطب گردشگری خلیج فارس'
        }
    
    def _prepare_index(self):
        self.index = []
        for title, content in self.knowledge.items():
            self.index.append({
                'title': title,
                'content': content[:500],
                'embedding': self.embedding.encode(f"{title} {content[:200]}")
            })
        print(f"✅ ایندکس ایجاد شد: {len(self.index)} سند")
    
    def search(self, query, top_k=5):
        if not query:
            return []
        
        query_emb = self.embedding.encode(query)
        results = []
        q_words = set(re.findall(r'[\u0600-\u06FF\w]+', query.lower()))
        
        for item in self.index:
            sim = self.embedding.similarity(query_emb, item['embedding'])
            t_words = set(re.findall(r'[\u0600-\u06FF\w]+', item['title'].lower()))
            keyword_score = len(q_words & t_words) * 0.5
            total_score = sim + keyword_score
            
            if total_score > 0.1:
                results.append({
                    'title': item['title'],
                    'content': item['content'],
                    'score': total_score,
                    'similarity': sim,
                    'keyword_score': keyword_score
                })
        
        results.sort(key=lambda x: x['score'], reverse=True)
        return results[:top_k]
    
    def get_random_topic(self):
        if self.knowledge:
            return random.choice(list(self.knowledge.keys()))
        return None

search_engine = None
