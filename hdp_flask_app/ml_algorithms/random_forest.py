from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle

class SearchRanker:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=300)
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
    
    def train(self, queries, scores):
        X = self.vectorizer.fit_transform(queries)
        self.model.fit(X, scores)
        return self
    
    def predict_score(self, query):
        X = self.vectorizer.transform([query])
        proba = self.model.predict_proba(X)[0]
        return float(max(proba))

