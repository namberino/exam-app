# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client.exam_app
users = db.users
questions = db.questions
tests = db.tests

def check_permission(user_id, action):
    user = users_collection.find_one({"_id": user_id})
    
    if not user:
        abort(404, "User not found")

    if user['user_type'] == 'student':
        if action in ['take_test', 'view_scores']:
            return True
    elif user['user_type'] == 'teacher':
        if action in ['create_test', 'manage_tests', 'view_scores']:
            return True
    
    abort(403, "You don't have permission to perform this action")

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
    choices = data.get('choices', [])
    correct_answer = data.get('correct_answer', '')

    # Ensure choices is a list of dicts with text and is_correct
    formatted_choices = [
        {'text': choice['text'], 'is_correct': choice['text'] == correct_answer}
        for choice in choices
    ]

    question = {
        'content': data['content'],
        'difficulty': data.get('difficulty', ''),
        'chapter': data.get('chapter', ''),
        'subject': data.get('subject', ''),
        'choices': formatted_choices,
        'correct_answer': correct_answer
    }

    result = questions.insert_one(question)
    return jsonify({'_id': str(result.inserted_id)}), 201

@app.route('/questions', methods=['GET'])
def get_questions():
    result = list(questions.find())
    for question in result:
        question['_id'] = str(question['_id'])
    return jsonify(result)

@app.route('/tests', methods=['POST'])
def create_test():
    try:
        data = request.get_json()
        question_ids = data['questions']
        name = data.get('name', '')

        # Convert question IDs from string to ObjectId
        formatted_question_ids = [ObjectId(q_id) for q_id in question_ids]

        test = {
            'questions': formatted_question_ids,
            'scores': {},
            'name': name
        }
        
        test_id = tests.insert_one(test).inserted_id
        return jsonify({'message': 'Test created successfully', 'test_id': str(test_id)}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/tests', methods=['GET'])
def get_tests():
    result = list(tests.find())
    for test in result:
        test['_id'] = str(test['_id'])
        test['questions'] = [str(q) for q in test['questions']]
        test['name'] = test.get('name', '')
    return jsonify(result)

@app.route('/tests/<test_id>', methods=['POST'])
def submit_test(test_id):
    data = request.get_json()
    test = tests.find_one({'_id': ObjectId(test_id)})
    if not test:
        return jsonify({'error': 'Test not found'}), 404
    scores = data['scores']
    tests.update_one({'_id': ObjectId(test_id)}, {'$set': {'scores': scores}})
    return jsonify({'message': 'Test submitted successfully'})

@app.route('/tests/<test_id>', methods=['DELETE'])
def delete_test(test_id):
    test = tests.find_one({'_id': ObjectId(test_id)})
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    tests.delete_one({'_id': ObjectId(test_id)})
    return jsonify({'message': 'Test deleted successfully'}), 200

# get test for testing
@app.route('/tests/<test_id>', methods=['GET'])
def get_test(test_id):
    try:
        test = db.tests.find_one({'_id': ObjectId(test_id)})
        if not test:
            return jsonify({'error': 'Test not found'}), 404

        questions = db.questions.find({'_id': {'$in': [ObjectId(q_id) for q_id in test['questions']]}})
        question_list = []
        for question in questions:
            question_list.append({
                '_id': str(question['_id']),
                'content': question['content'],
                'choices': question['choices']
            })

        return jsonify({'questions': question_list})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/tests/<test_id>/submit', methods=['POST'])
def submit_test_answer(test_id):
    data = request.get_json()
    answers = data['answers']  # answers should be a dictionary of {question_id: answer}
    
    test = tests.find_one({'_id': ObjectId(test_id)})
    if not test:
        return jsonify({'error': 'Test not found'}), 404

    question_ids = test['questions']
    questions = db.questions.find({'_id': {'$in': [ObjectId(q_id) for q_id in question_ids]}})

    correct_answers = {str(q['_id']): q['correct_answer'] for q in questions}
    score = sum(1 for qid, ans in answers.items() if correct_answers.get(qid) == ans)

    return jsonify({'score': score})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
