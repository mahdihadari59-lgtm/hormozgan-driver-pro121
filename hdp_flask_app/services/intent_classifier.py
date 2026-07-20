# intent_classifier.py - Intent Classification Service
import re

class IntentClassifier:
    def __init__(self):
        self.intents = self._load_intents()
    
    def _load_intents(self):
        return {
            'greeting': {
                'keywords': ['سلام', 'درود', 'چطوری', 'خوبی', 'چه خبر'],
                'priority': 3,
                'threshold': 1
            },
            'farewell': {
                'keywords': ['خداحافظ', 'بای', 'فعلا', 'خدانگهدار'],
                'priority': 3,
                'threshold': 1
            },
            'emergency': {
                'keywords': ['اورژانس', 'کمک', 'تصادف', '115', '110', 'پلیس'],
                'priority': 0,
                'threshold': 1,
                'exact': ['115', '110', 'اورژانس']
            },
            'traffic': {
                'keywords': ['ترافیک', 'شلوغ', 'راه', 'مسیر', 'غزی', 'سپاه'],
                'priority': 2,
                'threshold': 1
            },
            'tourism': {
                'keywords': ['قشم', 'کیش', 'هرمز', 'جزیره', 'تور', 'سفر', 'گردشگری'],
                'priority': 2,
                'threshold': 1
            },
            'hotel': {
                'keywords': ['هتل', 'اقامتگاه', 'رزرو', 'اتاق'],
                'priority': 2,
                'threshold': 1
            },
            'restaurant': {
                'keywords': ['رستوران', 'غذا', 'کباب', 'ماهی', 'قلیه'],
                'priority': 2,
                'threshold': 1
            },
            'gold': {
                'keywords': ['طلا', 'سکه', 'قیمت', 'دلار'],
                'priority': 2,
                'threshold': 1
            },
            'medical': {
                'keywords': ['دکتر', 'بیمارستان', 'پزشک', 'درمان'],
                'priority': 1,
                'threshold': 1
            },
            'help': {
                'keywords': ['راهنما', 'کمک', 'راهنمایی'],
                'priority': 1,
                'threshold': 1
            }
        }
    
    def classify(self, text):
        text_lower = text.lower()
        
        # Check exact matches first
        for intent, config in self.intents.items():
            if 'exact' in config:
                for exact in config['exact']:
                    if exact in text_lower:
                        return {
                            'intent': intent,
                            'confidence': 0.95,
                            'matched_keywords': [exact]
                        }
        
        # Check keyword matches
        matches = []
        for intent, config in self.intents.items():
            matched = []
            for keyword in config['keywords']:
                if keyword in text_lower:
                    matched.append(keyword)
            
            if matched:
                matches.append({
                    'intent': intent,
                    'count': len(matched),
                    'keywords': matched,
                    'priority': config['priority']
                })
        
        if not matches:
            return {'intent': 'general', 'confidence': 0.3, 'matched_keywords': []}
        
        # Sort by priority (lower is higher) then by match count
        matches.sort(key=lambda x: (x['priority'], -x['count']))
        best = matches[0]
        
        confidence = min(0.5 + (best['count'] * 0.1), 0.95)
        
        return {
            'intent': best['intent'],
            'confidence': confidence,
            'matched_keywords': best['keywords']
        }

print("✅ IntentClassifier loaded")
