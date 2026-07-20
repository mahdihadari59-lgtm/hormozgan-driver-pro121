import json
import re
import math
import random
from collections import Counter

print("📚 آموزش مدل تشخیص Intent (نسخه اصلاح شده)")

# ============ 1. دیتاست ============
data = [
    # greeting (احوالپرسی)
    ("سلام چطوری", "greeting"),
    ("سلام خوبی داداش", "greeting"),
    ("درود بر تو", "greeting"),
    ("صبح بخیر", "greeting"),
    ("عصر بخیر", "greeting"),
    ("چه خبر", "greeting"),
    ("خوبی تو", "greeting"),
    ("حالت چطوره", "greeting"),
    
    # farewell (خداحافظی)
    ("خداحافظ", "farewell"),
    ("بای بای", "farewell"),
    ("فعلا", "farewell"),
    ("بدرود", "farewell"),
    ("خدا نگهدار", "farewell"),
    ("به سلامت", "farewell"),
    
    # translation_request (درخواست ترجمه)
    ("به بندری بگو خواب چی میشه", "translation_request"),
    ("به مینابی بگو من رفتم", "translation_request"),
    ("ترجمه کن کتاب به قشمی", "translation_request"),
    ("آب به بندری چی میشه", "translation_request"),
    ("معنی واویلا چیه", "translation_request"),
    ("چطور میگن دریا به قشمی", "translation_request"),
    
    # faq_grammar (سوال دستوری)
    ("ارگاتیو چیه", "faq_grammar"),
    ("ارگاتیو در بندری چطوره", "faq_grammar"),
    ("گذشته فعل در مینابی", "faq_grammar"),
    ("صرف فعل حال", "faq_grammar"),
    ("نحوه صرف فعل", "faq_grammar"),
    
    # traffic (ترافیک)
    ("ترافیک چطوره", "traffic"),
    ("وضعیت ترافیک", "traffic"),
    ("راه بندان", "traffic"),
    ("چهارراه غزی چطوره", "traffic"),
    ("میدان سپاه شلوغه", "traffic"),
    
    # weather (آب و هوا)
    ("هوا چطوره", "weather"),
    ("آب و هوا", "weather"),
    ("امروز بارون میاد", "weather"),
    ("دما چنده", "weather"),
    
    # gold (طلا)
    ("قیمت طلا", "gold"),
    ("طلا چند", "gold"),
    ("سکه چنده", "gold"),
    
    # help (کمک)
    ("کمک میخوام", "help"),
    ("راهنما", "help"),
    ("نمیدونم چیکار کنم", "help"),
    
    # conversation (گفتگو عادی)
    ("من کتابو دیدم", "conversation"),
    ("تو چی کار میکنی", "conversation"),
    ("او کجاست", "conversation"),
    ("ما رفتیم", "conversation"),
]

# تکرار داده‌ها برای بالانس
balanced_data = []
for _ in range(10):
    balanced_data.extend(data)

print(f"📊 تعداد نمونه‌ها: {len(balanced_data)}")

# ============ 2. پیش‌پردازش ============
def normalize(text):
    text = text.lower()
    text = text.replace('ي', 'ی').replace('ك', 'ک')
    text = re.sub(r'[^\w\s\u0600-\u06FF]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# ایجاد لیست متون و برچسب‌ها
texts = [normalize(t) for t, _ in balanced_data]
labels = [l for _, l in balanced_data]

# لیست کلاس‌های یکتا
classes = sorted(set(labels))
class_to_idx = {c: i for i, c in enumerate(classes)}
idx_to_class = {i: c for c, i in class_to_idx.items()}

print(f"🎯 کلاس‌ها: {classes}")

# ============ 3. ساخت واژگان (TF-IDF ساده) ============
# جمع‌آوری همه کلمات
all_words = []
for text in texts:
    all_words.extend(text.split())

vocab = {}
for word in all_words:
    if word not in vocab:
        vocab[word] = len(vocab)

print(f"📚 اندازه واژگان: {len(vocab)}")

# محاسبه IDF
doc_count = len(texts)
word_in_docs = Counter()
for text in texts:
    seen = set()
    for word in text.split():
        if word not in seen:
            seen.add(word)
            word_in_docs[word] += 1

idf = {}
for word, count in word_in_docs.items():
    idf[word] = math.log((doc_count + 1) / (count + 1)) + 1

# ============ 4. ساخت ویژگی‌ها ============
X = []
y = []

for text, label in zip(texts, labels):
    words = text.split()
    vec = [0.0] * len(vocab)
    
    # TF-IDF
    word_count = Counter(words)
    for word, tf_raw in word_count.items():
        if word in vocab:
            tf = tf_raw / len(words)
            vec[vocab[word]] = tf * idf.get(word, 1)
    
    X.append(vec)
    y.append(class_to_idx[label])

# ============ 5. آموزش مدل رگرسیون لجستیک ساده ============
print("\n🔄 آموزش مدل...")

# وزن‌ها و بایاس برای هر کلاس
weights = [[0.0] * len(vocab) for _ in range(len(classes))]
biases = [0.0] * len(classes)

# Gradient Descent
learning_rate = 0.1
epochs = 100

for epoch in range(epochs):
    correct = 0
    for i in range(len(X)):
        # محاسبه scores
        scores = []
        for c in range(len(classes)):
            score = biases[c]
            for j in range(len(vocab)):
                score += weights[c][j] * X[i][j]
            scores.append(score)
        
        # softmax
        max_score = max(scores)
        exp_scores = [math.exp(s - max_score) for s in scores]
        sum_exp = sum(exp_scores)
        probs = [e / sum_exp for e in exp_scores]
        
        # به‌روزرسانی
        target = y[i]
        for c in range(len(classes)):
            error = probs[c] - (1 if c == target else 0)
            for j in range(len(vocab)):
                weights[c][j] -= learning_rate * error * X[i][j]
            biases[c] -= learning_rate * error
        
        # دقت
        pred = scores.index(max(scores))
        if pred == target:
            correct += 1
    
    if epoch % 20 == 0:
        print(f"   Epoch {epoch}: accuracy = {correct/len(X)*100:.1f}%")

# ============ 6. ذخیره مدل ============
model = {
    'classes': classes,
    'vocab': {word: idx for word, idx in vocab.items()},
    'idf': idf,
    'weights': weights,
    'biases': biases
}

with open('models/bandari_intent_model_v5.json', 'w', encoding='utf-8') as f:
    json.dump(model, f, ensure_ascii=False, indent=2)

print(f"\n✅ مدل ذخیره شد: models/bandari_intent_model_v5.json")

# ============ 7. تست ============
def sigmoid(x):
    return 1 / (1 + math.exp(-x))

def predict(text):
    norm = normalize(text)
    words = norm.split()
    
    # ساخت بردار ویژگی
    vec = [0.0] * len(vocab)
    word_count = Counter(words)
    for word, tf_raw in word_count.items():
        if word in vocab:
            tf = tf_raw / len(words) if words else 1
            vec[vocab[word]] = tf * idf.get(word, 1)
    
    # محاسبه امتیاز برای هر کلاس
    scores = []
    for c in range(len(classes)):
        score = biases[c]
        for j in range(len(vocab)):
            score += weights[c][j] * vec[j]
        scores.append(score)
    
    best_idx = scores.index(max(scores))
    prob = sigmoid(max(scores))
    
    return classes[best_idx], prob

print("\n🧪 تست مدل:")
test_texts = [
    "سلام خوبی",
    "به بندری بگو خواب چی میشه",
    "ارگاتیو چیه",
    "واویلا یعنی چی",
    "ترافیک چطوره",
    "هوا چطوره",
    "قیمت طلا",
    "خداحافظ",
]

for text in test_texts:
    pred, conf = predict(text)
    print(f"   📝 \"{text}\" → {pred} ({conf:.2f})")

print("\n✅ مدل آماده است!")
