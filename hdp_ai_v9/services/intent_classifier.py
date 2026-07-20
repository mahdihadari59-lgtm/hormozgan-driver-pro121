"""
Intent Classifier - تشخیص نیت کاربر
"""

class IntentClassifier:
    def __init__(self):
        self.intents = {
            'emergency': {'keywords': ['اورژانس', 'کمک', 'تصادف', '115', '110', 'پلیس', 'آتش', 'فوری'], 'priority': 0, 'exact': ['115', '110', 'اورژانس']},
            'help': {'keywords': ['راهنما', 'راهنمایی', 'نمیدونم', 'چیکار کنم'], 'priority': 1},
            'medical': {'keywords': ['دکتر', 'بیمارستان', 'پزشک', 'درمان', 'دارو', 'قلب'], 'priority': 1},
            'traffic': {'keywords': ['ترافیک', 'شلوغ', 'راه', 'مسیر', 'غزی', 'سپاه'], 'priority': 2},
            'tourism': {'keywords': ['قشم', 'کیش', 'هرمز', 'جزیره', 'تور', 'سفر', 'گردشگری', 'جاهای دیدنی'], 'priority': 2},
            'hotel': {'keywords': ['هتل', 'اقامتگاه', 'رزرو', 'اتاق'], 'priority': 2},
            'food': {'keywords': ['رستوران', 'غذا', 'کباب', 'ماهی', 'قلیه'], 'priority': 2},
            'gold': {'keywords': ['طلا', 'سکه', 'قیمت', 'دلار'], 'priority': 2},
            'greeting': {'keywords': ['سلام', 'درود', 'چطوری', 'خوبی', 'چه خبر'], 'priority': 3},
            'farewell': {'keywords': ['خداحافظ', 'بای', 'فعلا', 'خدانگهدار'], 'priority': 3}
        }
        self.weights = {
            'emergency': 2.0, 'help': 1.5, 'medical': 1.5,
            'traffic': 1.2, 'tourism': 1.2, 'hotel': 1.2,
            'food': 1.0, 'gold': 1.0, 'greeting': 0.8, 'farewell': 0.8
        }
    
    def classify(self, text):
        text_lower = text.lower()
        for intent, config in self.intents.items():
            if 'exact' in config:
                for ex in config['exact']:
                    if ex in text_lower:
                        return {'intent': intent, 'confidence': 0.95, 'matched': [ex]}
        
        matches = []
        for intent, config in self.intents.items():
            matched = [kw for kw in config['keywords'] if kw in text_lower]
            if matched:
                score = len(matched) * self.weights.get(intent, 1.0)
                matches.append({
                    'intent': intent,
                    'matched': matched,
                    'score': score,
                    'priority': config['priority']
                })
        
        if not matches:
            return {'intent': 'general', 'confidence': 0.3, 'matched': []}
        
        matches.sort(key=lambda x: (x['priority'], -x['score']))
        best = matches[0]
        confidence = min(0.5 + len(best['matched']) * 0.1, 0.95)
        return {
            'intent': best['intent'],
            'confidence': confidence,
            'matched': best['matched'],
            'score': best['score']
        }

intent_classifier = IntentClassifier()
