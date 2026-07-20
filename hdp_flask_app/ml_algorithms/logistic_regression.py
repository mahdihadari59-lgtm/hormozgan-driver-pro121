import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

class IntentClassifier:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=500, ngram_range=(1, 3))
        self.model = LogisticRegression(C=1.0, max_iter=500, class_weight='balanced')
        self.is_trained = False
    
    def train(self, texts, labels):
        X = self.vectorizer.fit_transform(texts)
        self.model.fit(X, labels)
        self.is_trained = True
        return self
    
    def predict(self, text):
        if not self.is_trained:
            return {'intent': 'unknown', 'confidence': 0.0}
        X = self.vectorizer.transform([text])
        proba = self.model.predict_proba(X)[0]
        intent = self.model.predict(X)[0]
        return {'intent': intent, 'confidence': float(max(proba))}
    
    def save(self, path='intent_model.pkl'):
        with open(path, 'wb') as f:
            pickle.dump({'model': self.model, 'vectorizer': self.vectorizer}, f)
    
    def load(self, path='intent_model.pkl'):
        with open(path, 'rb') as f:
            data = pickle.load(f)
            self.model = data['model']
            self.vectorizer = data['vectorizer']
            self.is_trained = True
