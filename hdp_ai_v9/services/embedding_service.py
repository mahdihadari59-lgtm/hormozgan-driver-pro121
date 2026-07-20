"""
Embedding Service - نسخه ساده برای Termux
"""

import numpy as np
import re

class EmbeddingService:
    def __init__(self, dim=384):
        self.dim = dim
        self._build_vocab()
    
    def _build_vocab(self):
        words = ['قشم', 'کیش', 'هرمز', 'بندرعباس', 'میناب', 'رودان',
                 'ترافیک', 'رستوران', 'هتل', 'تور', 'طلا', 'دکتر',
                 'سلام', 'خداحافظ', 'کمک', 'اورژانس', 'پلیس', 'بیمارستان']
        self.vocab = {w: i for i, w in enumerate(words)}
        self.vectors = {i: np.random.randn(self.dim) * 0.1 for i in range(len(words))}
    
    def encode(self, text):
        tokens = re.findall(r'[\u0600-\u06FF\w]+', text.lower())
        if not tokens:
            return np.zeros(self.dim)
        vecs = []
        for t in tokens:
            if t in self.vocab:
                vecs.append(self.vectors[self.vocab[t]])
        if not vecs:
            return np.zeros(self.dim)
        return np.mean(vecs, axis=0)
    
    def similarity(self, a, b):
        a = np.array(a)
        b = np.array(b)
        na, nb = np.linalg.norm(a), np.linalg.norm(b)
        if na == 0 or nb == 0:
            return 0.0
        return float(np.dot(a, b) / (na * nb))

embedding = EmbeddingService()
