from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS extension
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import json

app = Flask(__name__)
CORS(app, resources={r"/get_answer": {"origins": "http://localhost:9090"}})  # Enable CORS for the /get_answer route, allowing requests from http://localhost:9090
model = SentenceTransformer('all-MiniLM-L6-v2')

with open('faq_data.json', 'r') as f:
    faq_data = json.load(f)

faq_questions = [item['question'] for item in faq_data]
faq_answers = [item['answer'] for item in faq_data]
faq_embeddings = model.encode(faq_questions)

@app.route('/get_answer', methods=['POST'])
def get_answer():
    user_question = request.json['question']
    user_embedding = model.encode([user_question])
    
    print('---->', user_question)

    similarities = cosine_similarity(user_embedding, faq_embeddings)[0]
    most_similar_index = similarities.argmax()
    similarity_score = similarities[most_similar_index]
    
    print('---------> Similarity score', similarity_score)
    
    print('---------> most_similar_index ', most_similar_index)

    if similarity_score > 0.65:  # You can adjust this threshold
        answer = faq_answers[most_similar_index]
    else:
        answer = "Sorry, I don't have a relevant answer for that."

    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True, port=5000)