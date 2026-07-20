import json
from pathlib import Path

class RAGEngine:
    def __init__(self, embedding_service):
        self.embedding_service = embedding_service
        self.documents = []
        self.embeddings = []
        self._load_knowledge_base()

    def _load_knowledge_base(self):
        kb_path = Path(__file__).parent.parent / "data" / "hormozgan_knowledge.json"

        if not kb_path.exists():
            print("❌ Knowledge base not found")
            return

        with open(kb_path, "r", encoding="utf-8") as f:
            knowledge = json.load(f)

        for title, content in knowledge.items():

            if isinstance(content, dict):
                text = json.dumps(content, ensure_ascii=False)

            elif isinstance(content, list):
                text = " ".join(map(str, content))

            else:
                text = str(content)

            self.documents.append({
                "title": str(title),
                "content": text[:500],
                "source": "knowledge_base"
            })

        print(f"✅ RAG Engine loaded {len(self.documents)} documents")

    def search(self, query, top_k=5):
        query = str(query).lower()
        results = []

        for doc in self.documents:
            score = doc["content"].lower().count(query)

            if score > 0:
                item = doc.copy()
                item["similarity"] = score
                results.append(item)

        results.sort(
            key=lambda x: x["similarity"],
            reverse=True
        )

        return results[:top_k]

    def add_document(self, title, content):
        self.documents.append({
            "title": str(title),
            "content": str(content)[:500],
            "source": "user_added"
        })
        return True

print("✅ RAGEngine loaded")
