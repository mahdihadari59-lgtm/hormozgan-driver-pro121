from sklearn.ensemble import VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle

class EnsembleIntentClassifier:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=500)
        self.model = VotingClassifier(
            estimators=[
                ("lr", LogisticRegression(max_iter=500)),
                ("rf", RandomForestClassifier(n_estimators=50)),
                ("svm", SVC(probability=True))
            ],
            voting="soft"
        )
    
    def train(self, texts, labels):
        X = self.vectorizer.fit_transform(texts)
        self.model.fit(X, labels)
        return self
    
    def predict(self, text):
        X = self.vectorizer.transform([text])
        proba = self.model.predict_proba(X)[0]
        intent = self.model.predict(X)[0]
        return {"intent": intent, "confidence": float(max(proba)), "method": "ensemble"}

