"""
Conversation Memory Layer - حافظه گفتگو و ترجیحات کاربر
"""

import json
import sqlite3
from datetime import datetime, timedelta

class ConversationMemory:
    def __init__(self, db_path: str = 'memory.db'):
        self.db_path = db_path
        self._init_db()
        self.short_term = {}
        self.user_preferences = {}
    
    def _init_db(self):
        """ایجاد جداول حافظه"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # جدول تاریخچه گفتگو
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS conversation_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                session_id TEXT,
                query TEXT,
                intent TEXT,
                response TEXT,
                timestamp DATETIME,
                sentiment REAL
            )
        """)
        
        # جدول ترجیحات کاربر
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_preferences (
                user_id TEXT PRIMARY KEY,
                preferred_city TEXT,
                preferred_intents TEXT,
                search_frequency INTEGER,
                last_active DATETIME
            )
        """)
        
        # جدول جستجوهای پرتکرار
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS popular_searches (
                query TEXT PRIMARY KEY,
                count INTEGER,
                last_used DATETIME
            )
        """)
        
        conn.commit()
        conn.close()
    
    def add_conversation(self, user_id: str, session_id: str, query: str, intent: str, response: str, sentiment: float = 0.5):
        """افزودن مکالمه به حافظه"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO conversation_history (user_id, session_id, query, intent, response, timestamp, sentiment)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, session_id, query, intent, response, datetime.now(), sentiment))
        
        # به‌روزرسانی جستجوهای پرتکرار
        cursor.execute("""
            INSERT INTO popular_searches (query, count, last_used)
            VALUES (?, 1, ?)
            ON CONFLICT(query) DO UPDATE SET
                count = count + 1,
                last_used = ?
        """, (query, datetime.now(), datetime.now()))
        
        conn.commit()
        conn.close()
        
        # ذخیره در حافظه کوتاه‌مدت
        if user_id not in self.short_term:
            self.short_term[user_id] = []
        self.short_term[user_id].append({
            'query': query,
            'intent': intent,
            'timestamp': datetime.now()
        })
        
        # نگهداری 10 پیام آخر
        if len(self.short_term[user_id]) > 10:
            self.short_term[user_id].pop(0)
    
    def get_context(self, user_id: str, session_id: str, limit: int = 5) -> list:
        """دریافت بافت گفتگو"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT query, intent, response, timestamp
            FROM conversation_history
            WHERE user_id = ? AND session_id = ?
            ORDER BY timestamp DESC
            LIMIT ?
        """, (user_id, session_id, limit))
        
        history = cursor.fetchall()
        conn.close()
        
        return [{
            'query': h[0],
            'intent': h[1],
            'response': h[2],
            'timestamp': h[3]
        } for h in history]
    
    def get_popular_queries(self, limit: int = 10) -> list:
        """دریافت پرتکرارترین جستجوها"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT query, count, last_used
            FROM popular_searches
            ORDER BY count DESC
            LIMIT ?
        """, (limit,))
        
        results = cursor.fetchall()
        conn.close()
        
        return [{'query': r[0], 'count': r[1], 'last_used': r[2]} for r in results]
    
    def update_preference(self, user_id: str, key: str, value):
        """به‌روزرسانی ترجیحات کاربر"""
        self.user_preferences[f"{user_id}_{key}"] = value
    
    def get_preference(self, user_id: str, key: str):
        """دریافت ترجیحات کاربر"""
        return self.user_preferences.get(f"{user_id}_{key}")

print("✅ ConversationMemory loaded")
