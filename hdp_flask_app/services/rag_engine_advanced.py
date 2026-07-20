# rag_engine_advanced.py - RAG Engine پیشرفته با پشتیبانی از تمام موضوعات

import sqlite3
import json
import numpy as np
from pathlib import Path

class RAGEngineAdvanced:
    def __init__(self, embedding_service, db_path='hdp_pro.db'):
        self.embedding_service = embedding_service
        self.db_path = db_path
        self.documents = []
        self.embeddings = []
        self._load_all_data()
    
    def _load_all_data(self):
        """Load data from all SQLite tables and JSON"""
        
        # Load from all SQLite tables
        self._load_speed_cameras()
        self._load_danger_zones()
        self._load_traffic_info()
        self._load_hotels()
        self._load_tours()
        self._load_car_showrooms()
        self._load_stores()
        
        # Load from JSON knowledge base
        self._load_json_knowledge()
        
        print(f"✅ RAG Engine Advanced: {len(self.documents)} total documents")
    
    def _load_speed_cameras(self):
        """Load speed camera data"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT name, location, city, speed_limit, camera_type, description FROM speed_cameras WHERE is_active = 1")
            cameras = cursor.fetchall()
            conn.close()
            
            for cam in cameras:
                content = f"""
                📸 **دوربین سرعت: {cam[0]}**
                • موقعیت: {cam[1]}
                • شهر: {cam[2]}
                • محدودیت سرعت: {cam[3]} کیلومتر بر ساعت
                • نوع: {cam[4]}
                • توضیحات: {cam[5]}
                ⚠️ رعایت سرعت مجاز الزامی است - جریمه سرعت غیرمجاز: ۳۰۰ هزار تا ۲ میلیون تومان
                """
                self.documents.append({
                    'title': f"دوربین سرعت {cam[0]}",
                    'content': content,
                    'source': 'speed_camera',
                    'type': 'speed_camera',
                    'location': cam[1],
                    'city': cam[2],
                    'speed_limit': cam[3]
                })
            print(f"   📸 Loaded {len(cameras)} speed cameras")
        except Exception as e:
            print(f"   ⚠️ Speed cameras error: {e}")
    
    def _load_danger_zones(self):
        """Load danger zones data"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT name, location, city, risk_level, accident_count, description, suggestion FROM danger_zones")
            zones = cursor.fetchall()
            conn.close()
            
            for zone in zones:
                risk_emoji = '🔴' if zone[3] == 'بحرانی' else ('🟠' if zone[3] == 'بالا' else '🟡')
                content = f"""
                {risk_emoji} **نقطه حادثه‌خیز: {zone[0]}**
                • موقعیت: {zone[1]}
                • شهر: {zone[2]}
                • سطح خطر: {zone[3]}
                • تعداد تصادفات: {zone[4]} مورد
                • توضیحات: {zone[5]}
                💡 **توصیه:** {zone[6]}
                """
                self.documents.append({
                    'title': f"نقطه حادثه‌خیز {zone[0]}",
                    'content': content,
                    'source': 'danger_zone',
                    'type': 'danger_zone',
                    'location': zone[1],
                    'city': zone[2],
                    'risk_level': zone[3]
                })
            print(f"   ⚠️ Loaded {len(zones)} danger zones")
        except Exception as e:
            print(f"   ⚠️ Danger zones error: {e}")
    
    def _load_traffic_info(self):
        """Load real-time traffic info"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT location, status, level, delay_minutes, update_time, suggestion FROM traffic_info")
            traffic = cursor.fetchall()
            conn.close()
            
            for t in traffic:
                status_emoji = '🔴' if t[1] == 'سنگین' else ('🟡' if t[1] == 'نیمه سنگین' else '🟢')
                content = f"""
                {status_emoji} **وضعیت ترافیک: {t[0]}**
                • وضعیت: {t[1]}
                • تاخیر: {t[3]} دقیقه
                • آخرین بروزرسانی: {t[4]}
                💡 {t[5]}
                """
                self.documents.append({
                    'title': f"ترافیک {t[0]}",
                    'content': content,
                    'source': 'traffic',
                    'type': 'traffic',
                    'location': t[0],
                    'status': t[1],
                    'delay': t[3]
                })
            print(f"   🚦 Loaded {len(traffic)} traffic points")
        except Exception as e:
            print(f"   ⚠️ Traffic error: {e}")
    
    def _load_hotels(self):
        """Load hotels data"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT name, stars, city, district, price, phone, amenities, rating FROM hotels_full")
            hotels = cursor.fetchall()
            conn.close()
            
            for hotel in hotels:
                stars_emoji = '⭐' * int(hotel[1])
                content = f"""
                🏨 **{hotel[0]}** {stars_emoji}
                • شهر: {hotel[2]}
                • منطقه: {hotel[3]}
                • قیمت هر شب: {hotel[4]:,} تومان
                • امکانات: {hotel[6]}
                • امتیاز کاربران: {hotel[7]}/5
                📞 تلفن: {hotel[5]}
                """
                self.documents.append({
                    'title': f"هتل {hotel[0]}",
                    'content': content,
                    'source': 'hotel',
                    'type': 'hotel',
                    'city': hotel[2],
                    'stars': hotel[1],
                    'price': hotel[4]
                })
            print(f"   🏨 Loaded {len(hotels)} hotels")
        except Exception as e:
            print(f"   ⚠️ Hotels error: {e}")
    
    def _load_tours(self):
        """Load tours data"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT name, destination, duration, transport, price, includes, rating FROM tours_full")
            tours = cursor.fetchall()
            conn.close()
            
            for tour in tours:
                content = f"""
                🌴 **{tour[0]}**
                • مقصد: {tour[1]}
                • مدت: {tour[2]}
                • حمل و نقل: {tour[3]}
                • قیمت: {tour[4]:,} تومان
                • شامل: {tour[5]}
                • امتیاز: {tour[6]}/5
                """
                self.documents.append({
                    'title': tour[0],
                    'content': content,
                    'source': 'tour',
                    'type': 'tour',
                    'destination': tour[1],
                    'price': tour[4]
                })
            print(f"   🌴 Loaded {len(tours)} tours")
        except Exception as e:
            print(f"   ⚠️ Tours error: {e}")
    
    def _load_car_showrooms(self):
        """Load car showrooms data"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT name, brand, city, address, phone, opening_hours, services, rating FROM car_showrooms")
            showrooms = cursor.fetchall()
            conn.close()
            
            for showroom in showrooms:
                content = f"""
                🚗 **نمایشگاه خودرو: {showroom[0]}**
                • برند: {showroom[1]}
                • شهر: {showroom[2]}
                • آدرس: {showroom[3]}
                • ساعات کاری: {showroom[5]}
                • خدمات: {showroom[6]}
                • امتیاز: {showroom[7]}/5
                📞 تلفن: {showroom[4]}
                """
                self.documents.append({
                    'title': f"نمایشگاه خودرو {showroom[0]}",
                    'content': content,
                    'source': 'car_showroom',
                    'type': 'car_showroom',
                    'city': showroom[2],
                    'brand': showroom[1]
                })
            print(f"   🚗 Loaded {len(showrooms)} car showrooms")
        except Exception as e:
            print(f"   ⚠️ Car showrooms error: {e}")
    
    def _load_stores(self):
        """Load stores data"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT name, category, city, address, phone, opening_hours, rating, has_delivery FROM stores")
            stores = cursor.fetchall()
            conn.close()
            
            for store in stores:
                delivery = '✅' if store[7] else '❌'
                content = f"""
                🛍️ **فروشگاه: {store[0]}**
                • نوع: {store[1]}
                • شهر: {store[2]}
                • آدرس: {store[3]}
                • ساعات کاری: {store[5]}
                • امتیاز: {store[6]}/5
                • ارسال آنلاین: {delivery}
                📞 تلفن: {store[4]}
                """
                self.documents.append({
                    'title': store[0],
                    'content': content,
                    'source': 'store',
                    'type': 'store',
                    'city': store[2],
                    'category': store[1]
                })
            print(f"   🛍️ Loaded {len(stores)} stores")
        except Exception as e:
            print(f"   ⚠️ Stores error: {e}")
    
    def _load_json_knowledge(self):
        """Load JSON knowledge base as fallback"""
        json_paths = [
            Path(__file__).parent.parent / 'data' / 'hormozgan_knowledge.json',
            Path(__file__).parent.parent.parent / 'backend' / 'data' / 'hormozgan_knowledge.json'
        ]
        
        for path in json_paths:
            if path.exists():
                with open(path, 'r', encoding='utf-8') as f:
                    knowledge = json.load(f)
                for title, content in list(knowledge.items())[:300]:
                    self.documents.append({
                        'title': title,
                        'content': content[:500],
                        'source': 'json_knowledge',
                        'type': 'knowledge'
                    })
                print(f"   📚 Loaded {min(len(knowledge), 300)} JSON knowledge topics")
                break
    
    def search(self, query, top_k=5):
        """Search across all document types"""
        query_lower = query.lower()
        
        # First try direct keyword matching for specific queries
        direct_results = self._direct_search(query_lower)
        if direct_results:
            return direct_results[:top_k]
        
        # Then use embedding similarity
        if not self.embeddings:
            self._create_embeddings()
        
        if len(self.embeddings) == 0:
            return []
        
        query_emb = self.embedding_service.encode(query)
        
        similarities = []
        for i, doc_emb in enumerate(self.embeddings):
            sim = self.embedding_service.cosine_similarity(query_emb, doc_emb)
            if sim > 0.1:
                similarities.append((i, sim))
        
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        results = []
        for i, sim in similarities[:top_k]:
            doc = self.documents[i].copy()
            doc['similarity'] = float(sim)
            results.append(doc)
        
        return results
    
    def _direct_search(self, query_lower):
        """Direct keyword-based search for specific queries"""
        results = []
        
        # Search in speed cameras
        if 'دوربین' in query_lower or 'سرعت' in query_lower or 'speed' in query_lower:
            for doc in self.documents:
                if doc['type'] == 'speed_camera':
                    results.append(doc)
        
        # Search in danger zones
        if 'حادثه' in query_lower or 'خطر' in query_lower or 'پر خطر' in query_lower:
            for doc in self.documents:
                if doc['type'] == 'danger_zone':
                    results.append(doc)
        
        # Search in traffic
        if 'ترافیک' in query_lower or 'شلوغ' in query_lower:
            for doc in self.documents:
                if doc['type'] == 'traffic':
                    results.append(doc)
        
        # Search in hotels
        if 'هتل' in query_lower or 'اقامت' in query_lower:
            for doc in self.documents:
                if doc['type'] == 'hotel':
                    if 'قشم' in query_lower and doc['city'] == 'قشم':
                        results.insert(0, doc)
                    elif 'کیش' in query_lower and doc['city'] == 'کیش':
                        results.insert(0, doc)
                    else:
                        results.append(doc)
        
        # Search in tours
        if 'تور' in query_lower or 'سفر' in query_lower:
            for doc in self.documents:
                if doc['type'] == 'tour':
                    if 'قشم' in query_lower and doc.get('destination') == 'قشم':
                        results.insert(0, doc)
                    elif 'کیش' in query_lower and doc.get('destination') == 'کیش':
                        results.insert(0, doc)
                    else:
                        results.append(doc)
        
        # Search in car showrooms
        if 'خودرو' in query_lower or 'ماشین' in query_lower or 'نمایشگاه' in query_lower:
            for doc in self.documents:
                if doc['type'] == 'car_showroom':
                    results.append(doc)
        
        # Search in stores
        if 'فروشگاه' in query_lower or 'خرید' in query_lower or 'بازار' in query_lower:
            for doc in self.documents:
                if doc['type'] == 'store':
                    results.append(doc)
        
        return results
    
    def _create_embeddings(self):
        """Create embeddings for all documents"""
        print("   🧠 Creating embeddings for documents...")
        self.embeddings = []
        for doc in self.documents:
            text = doc['title'] + ' ' + doc['content'][:200]
            emb = self.embedding_service.encode(text)
            self.embeddings.append(emb)
        print(f"   ✅ Created {len(self.embeddings)} embeddings")
    
    def get_speed_cameras(self, city=None):
        """Get speed cameras by city"""
        results = []
        for doc in self.documents:
            if doc['type'] == 'speed_camera':
                if not city or doc.get('city') == city:
                    results.append(doc)
        return results
    
    def get_danger_zones(self, city=None):
        """Get danger zones by city"""
        results = []
        for doc in self.documents:
            if doc['type'] == 'danger_zone':
                if not city or doc.get('city') == city:
                    results.append(doc)
        return results
    
    def get_traffic_info(self):
        """Get all traffic info"""
        return [doc for doc in self.documents if doc['type'] == 'traffic']
    
    def get_hotels(self, city=None, min_stars=1):
        """Get hotels by city and stars"""
        results = []
        for doc in self.documents:
            if doc['type'] == 'hotel':
                if (not city or doc.get('city') == city) and doc.get('stars', 0) >= min_stars:
                    results.append(doc)
        return sorted(results, key=lambda x: x.get('stars', 0), reverse=True)

print("✅ RAGEngineAdvanced loaded successfully")
