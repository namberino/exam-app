# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client.exam_app
users = db.users
questions = db.questions
tests = db.tests

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data['name']
    user_type = data['user_type']
    password = data['password'].encode('utf-8')
    hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    
    if users.find_one({'name': name}):
        return jsonify({'error': 'User already exists'}), 409

    users.insert_one({
        'name': name,
        'user_type': user_type,
        'password': hashed
    })
    return jsonify({'message': 'User registered successfully'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    name = data['name']
    password = data['password'].encode('utf-8')
    
    user = users.find_one({'name': name})
    if user and bcrypt.checkpw(password, user['password']):
        return jsonify({'message': 'Login successful', 'user': {'name': name, 'user_type': user['user_type']}})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/questions', methods=['POST'])
def create_question():
    data = request.get_json()
    question = {
        'content': data['content'],
        'difficulty': data['difficulty'],
        'chapter': data['chapter'],
        'subject': data['subject']
    }
    questions.insert_one(question)
    return jsonify({'message': 'Question created successfully'})

@app.route('/questions', methods=['GET'])
def get_questions():
    result = list(questions.find())
    for question in result:
        question['_id'] = str(question['_id'])
    return jsonify(result)

@app.route('/tests', methods=['POST'])
def create_test():
    data = request.get_json()
    test = {
        'questions': data['questions'],
        'scores': {}
    }
    test_id = tests.insert_one(test).inserted_id
    return jsonify({'message': 'Test created successfully', 'test_id': str(test_id)})

@app.route('/tests/<test_id>', methods=['POST'])
def submit_test(test_id):
    data = request.get_json()
    test = tests.find_one({'_id': ObjectId(test_id)})
    if not test:
        return jsonify({'error': 'Test not found'}), 404
    scores = data['scores']
    tests.update_one({'_id': ObjectId(test_id)}, {'$set': {'scores': scores}})
    return jsonify({'message': 'Test submitted successfully'})

@app.route('/tests/<test_id>', methods=['GET'])
def get_test_scores(test_id):
    test = tests.find_one({'_id': ObjectId(test_id)})
    if not test:
        return jsonify({'error': 'Test not found'}), 404
    return jsonify(test['scores'])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
