import requests
from app.core.config import settings

API_URL = "https://api.groq.com/openai/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {settings.HF_TOKEN}",
    "Content-Type": "application/json"
}


def generate_answer(query: str, context_chunks: list) -> str:
    context = "\n\n".join(context_chunks)

    prompt = f"""Answer based ONLY on this context. If answer is not in context, say so.

Context:
{context}

Question: {query}

Answer:"""

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 200,
        "temperature": 0.3
    }

    try:
        response = requests.post(API_URL, headers=HEADERS, json=payload, timeout=30)
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        else:
            return f"API Error: {response.status_code}"
    except Exception as e:
        return f"Connection Error: {str(e)}"