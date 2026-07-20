from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import pickle

class UserClusterer:
    def __init__(self, n_clusters=5):
        self.scaler = StandardScaler()
        self.model = KMeans(n_clusters=n_clusters, random_state=42)
    
    def train(self, features):
        scaled = self.scaler.fit_transform(features)
        self.model.fit(scaled)
        return self
    
    def predict(self, features):
        scaled = self.scaler.transform([features])
        return {"cluster": int(self.model.predict(scaled)[0])}

