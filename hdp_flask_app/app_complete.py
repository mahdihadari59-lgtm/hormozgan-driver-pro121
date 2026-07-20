from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from services.rag_engine_final import RAGEngineFinal
from traffic_algorithm import register_traffic_routes

import json
import os

app = Flask(__name__)
CORS(app)

# -----------------------------
# Load Knowledge Base
# -----------------------------

knowledge = {}

KB_PATH = "data/hormozgan_knowledge.json"

try:
    if os.path.exists(KB_PATH):
        with open(KB_PATH, "r", encoding="utf-8") as f:
            knowledge = json.load(f)

        print(f"✅ Knowledge Loaded: {len(knowledge)}")
    else:
        print("⚠️ Knowledge file not found")

except Exception as e:
    print("❌ Knowledge Load Error:", e)

# -----------------------------
# RAG Engine
# -----------------------------

rag = RAGEngineFinal(knowledge)

print("✅ RAG Engine Ready")

# -----------------------------
# Traffic Routes
# -----------------------------

try:
    register_traffic_routes(app)
except Exception as e:
    print("⚠️ Traffic Module Error:", e)

# -----------------------------
# Pages
# -----------------------------

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat")
def chat():
    return render_template("chat.html")

@app.route("/api/health")
def health():
    return jsonify({
        "ok": True,
        "status": "online",
        "topics": len(knowledge)
    })

# -----------------------------
# Chat API
# -----------------------------

@app.route("/api/chat", methods=["POST"])
def chat_api():

    try:

        data = request.get_json(silent=True) or {}

        msg = data.get("message", "").strip()

        if not msg:

            return jsonify({
                "response": "لطفاً سوال خود را وارد کنید.",
                "source": "error"
            })

        result = rag.get_answer(msg)

        if result:

            return jsonify({
                "response": str(result)[:2000],
                "source": "rag"
            })

        return jsonify({
            "response": "🤔 متوجه نشدم. سوال خود را واضح‌تر بپرسید.",
            "source": "fallback"
        })

    except Exception as e:

        return jsonify({
            "response": f"Server Error: {str(e)}",
            "source": "error"
        }), 500

# -----------------------------
# Main
# -----------------------------

if __name__ == "__main__":

    print("=" * 50)
    print("🚀 HDP ONE Flask Server")
    print("=" * 50)
    print("📍 http://127.0.0.1:5000")
    print("💬 /api/chat")
    print("📊 /api/health")
    print("=" * 50)

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
        use_reloader=False
    )
