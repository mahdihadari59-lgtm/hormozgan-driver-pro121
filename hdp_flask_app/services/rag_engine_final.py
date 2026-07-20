import json

class RAGEngineFinal:
    def __init__(self, knowledge):
        self.knowledge = knowledge

    def get_answer(self, query):
        q = query.strip()

        # تطبیق دقیق
        if q in self.knowledge:
            return self.knowledge[q]

        results = []

        for key, value in self.knowledge.items():

            score = 0

            if key == q:
                score = 100

            elif key.startswith(q):
                score = 90

            elif q in key:
                score = 80

            elif any(word in key for word in q.split()):
                score = 60

            elif any(word in str(value) for word in q.split()):
                score = 40

            if score > 0:
                results.append((score, value))

        if results:
            results.sort(key=lambda x: x[0], reverse=True)
            return results[0][1]

        return None
