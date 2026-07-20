# embedding_service.py - Custom Embedding Service
import numpy as np
from collections import Counter
import re

class EmbeddingService:
    def __init__(self, dim=128):
        self.dim = dim
        self.vocab = {}
        self.word_vectors = {}
        self._build_vocabulary()
    
    def _build_vocabulary(self):
        """Build vocabulary from Persian words"""
        # Common Persian words for Hormozgan
        words = [
            'قشم', 'کیش', 'هرمز', 'بندرعباس', 'میناب', 'رودان',
            'ترافیک', 'رستوران', 'هتل', 'تور', 'طلا', 'دکتر',
            'سلام', 'خداحافظ', 'کمک', 'اورژانس', 'پلیس', 'بیمارستان',
            'دره ستارگان', 'جنگل حرا', 'ساحل', 'جزیره', 'دریا', 'مسیر'
        ]
        
        for i, word in enumerate(words):
            # Create random embedding vector (in production, use pretrained)
            self.vocab[word] = i
            self.word_vectors[i] = np.random.randn(self.dim) * 0.1
    
    def encode(self, text):
        """Convert text to embedding vector"""
        tokens = self._tokenize(text)
        if not tokens:
            return np.zeros(self.dim)
        
        vectors = []
        for token in tokens:
            if token in self.vocab:
                idx = self.vocab[token]
                vectors.append(self.word_vectors[idx])
        
        if not vectors:
            return np.zeros(self.dim)
        
        # Average pooling
        return np.mean(vectors, axis=0)
    
    def _tokenize(self, text):
        """Simple tokenizer for Persian text"""
        # Remove punctuation
        text = re.sub(r'[^\w\s\u0600-\u06FF]', ' ', text)
        # Split by whitespace
        tokens = text.lower().split()
        return tokens
    
    def cosine_similarity(self, vec1, vec2):
        """Calculate cosine similarity between two vectors"""
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        if norm1 == 0 or norm2 == 0:
            return 0
        return np.dot(vec1, vec2) / (norm1 * norm2)

print("✅ EmbeddingService loaded")
