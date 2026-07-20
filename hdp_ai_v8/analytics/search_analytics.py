"""
Search Analytics - تحلیل جستجوها و عملکرد
"""

import sqlite3
from datetime import datetime, timedelta
import threading
from collections import Counter

class SearchAnalytics:
    def __init__(self, db_path: str = 'analytics.db'):
        self.db_path = db_path
        self._init_db()
        self.queue = []
        self.lock = threading.Lock()
        
        # شروع پردازش غیرهمزمان
        self._start_worker()
    
    def _init_db(self):
        """ایجاد جداول تحلیل"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS search_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                query TEXT,
                intent TEXT,
                latency INTEGER,
                results_count INTEGER,
                timestamp DATETIME
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS daily_stats (
                date TEXT PRIMARY KEY,
                total_searches INTEGER,
                avg_latency REAL,
                unique_users INTEGER
            )
        """)
        
        conn.commit()
        conn.close()
    
    def _start_worker(self):
        """شروع پردازش‌گر غیرهمزمان"""
        def worker():
            import time
            while True:
                time.sleep(5)  # پردازش هر 5 ثانیه
                self._process_queue()
        
        thread = threading.Thread(target=worker, daemon=True)
        thread.start()
    
    def log_search(self, query: str, intent: str, latency: int, results_count: int):
        """ثبت لاگ جستجو به صورت غیرهمزمان"""
        with self.lock:
            self.queue.append({
                'query': query,
                'intent': intent,
                'latency': latency,
                'results_count': results_count,
                'timestamp': datetime.now()
            })
    
    def _process_queue(self):
        """پردازش صف لاگ‌ها"""
        with self.lock:
            if not self.queue:
                return
            to_process = self.queue.copy()
            self.queue.clear()
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for log in to_process:
            cursor.execute("""
                INSERT INTO search_logs (query, intent, latency, results_count, timestamp)
                VALUES (?, ?, ?, ?, ?)
            """, (log['query'], log['intent'], log['latency'], log['results_count'], log['timestamp']))
        
        conn.commit()
        conn.close()
    
    def get_stats(self, days: int = 7) -> dict:
        """دریافت آمار جستجوها"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cutoff = datetime.now() - timedelta(days=days)
        
        cursor.execute("""
            SELECT COUNT(*), AVG(latency), intent
            FROM search_logs
            WHERE timestamp > ?
            GROUP BY intent
        """, (cutoff,))
        
        intent_stats = {}
        for row in cursor.fetchall():
            intent_stats[row[2]] = {'count': row[0], 'avg_latency': row[1]}
        
        cursor.execute("""
            SELECT COUNT(*), AVG(latency)
            FROM search_logs
            WHERE timestamp > ?
        """, (cutoff,))
        
        total = cursor.fetchone()
        
        conn.close()
        
        return {
            'total_searches': total[0] if total else 0,
            'avg_latency': round(total[1] if total else 0, 2),
            'by_intent': intent_stats,
            'period_days': days
        }

print("✅ SearchAnalytics loaded")
