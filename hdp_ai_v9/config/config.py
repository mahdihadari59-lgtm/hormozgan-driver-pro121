"""
HDP AI v9 - Configuration
"""

from pathlib import Path

class Config:
    PORT = 5000
    HOST = '0.0.0.0'
    DEBUG = False
    API_VERSION = 'v9'
    EMBEDDING_DIM = 384
    
    BASE_DIR = Path(__file__).parent.parent
    DATA_DIR = BASE_DIR / 'data'
    
    KNOWLEDGE_PATHS = [
        DATA_DIR / 'hormozgan_knowledge.json',
        BASE_DIR.parent / 'backend' / 'data' / 'hormozgan_knowledge.json',
        BASE_DIR.parent / 'hdp_flask_app' / 'data' / 'hormozgan_knowledge.json'
    ]

config = Config()
