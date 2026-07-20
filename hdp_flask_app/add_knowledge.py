import json
import os

# مسیر دانشنامه اصلی
kb_path = '/data/data/com.termux/files/home/hormozgan-driver-pro121/backend/data/hormozgan_knowledge.json'

# مسیر Flask app
flask_path = 'app.py'

# خواندن دانشنامه
with open(kb_path, 'r', encoding='utf-8') as f:
    knowledge = json.load(f)

print(f"📚 دانشنامه loaded: {len(knowledge)} topics")

# بررسی وجود "جزیره قشم"
if 'جزیره قشم' in knowledge:
    print(f"✅ 'جزیره قشم' در دانشنامه موجود است")
    print(f"   محتوا: {knowledge['جزیره قشم'][:200]}...")
else:
    print(f"⚠️ 'جزیره قشم' در دانشنامه یافت نشد")
    
    # جستجوی مشابه
    for key in knowledge.keys():
        if 'قشم' in key:
            print(f"   کلید مشابه: {key}")
