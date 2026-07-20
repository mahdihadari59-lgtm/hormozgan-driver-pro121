from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
import pickle

class EmotionDetector:
    def __init__(self):
        self.vectorizer = CountVectorizer(max_features=200)
        self.model = MultinomialNB()
    
    def train(self, texts, labels):
        X = self.vectorizer.fit_transform(texts)
        self.model.fit(X, labels)
        return self
    
    def predict(self, text):
        X = self.vectorizer.transform([text])
        proba = self.model.predict_proba(X)[0]
        emotion = self.model.predict(X)[0]
        return {"emotion": emotion, "confidence": float(max(proba))}

