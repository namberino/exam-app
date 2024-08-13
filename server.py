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
subjects = db.subjects

def check_permission(user_id, action):
    user = users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_type_permissions = {
        'student': ['take_test', 'view_scores'],
        'teacher': ['create_test', 'manage_tests', 'view_scores'],
        'admin': ['create_test', 'manage_tests', 'view_scores', 'delete_tests'],
    }

    if action in user_type_permissions.get(user['user_type'], []):
        return True
    
    return jsonify({"error": "You don't have permission to perform this action"}), 403

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
        return jsonify({'message': 'Login successful', 'user': {'name': name, 'user_type': user['user_type'], '_id': str(user['_id']) }})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/questions', methods=['POST'])
def create_question():
    data = request.get_json()
    choices = data.get('choices', [])
    correct_answer = data.get('correct_answer', '')
    subject_id = data.get('subject_id')

    # Ensure choices is a list of dicts with text and is_correct
    formatted_choices = [
        {'text': choice['text'], 'is_correct': choice['text'] == correct_answer}
        for choice in choices
    ]

    question = {
        'content': data['content'],
        'difficulty': data.get('difficulty', ''),
        'chapter': data.get('chapter', ''),
        'subject_id': ObjectId(subject_id),
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
        subject = subjects.find_one({"_id": ObjectId(question['subject_id'])})
        question['subject_id'] = str(question['subject_id'])
        question['subject'] = subject['name'] if subject else None
    return jsonify(result)

@app.route('/tests', methods=['POST'])
def create_test():
    try:
        data = request.get_json()
        question_ids = data['questions']
        name = data.get('name', '')
        user_id = data.get('user_id')
        assigned_students = data['assigned_students']

        # Convert question IDs from string to ObjectId
        formatted_question_ids = [ObjectId(q_id) for q_id in question_ids]
        assigned_student_ids = [ObjectId(s_id) for s_id in assigned_students]

        test = {
            'questions': formatted_question_ids,
            'scores': {},
            'name': name,
            'assigned_students': assigned_student_ids,
            'creator_id': ObjectId(user_id)
        }
        
        test_id = tests.insert_one(test).inserted_id
        return jsonify({'message': 'Test created successfully', 'test_id': str(test_id)}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/tests', methods=['GET'])
def get_tests():
    user_id = ObjectId(request.args.get('user_id'))  # Pass user ID as a query parameter
    user = db.users.find_one({'_id': user_id})

    if user['user_type'] == 'teacher':
        found_tests = tests.find({'creator_id': user_id})
    else:
        found_tests = tests.find({'assigned_students': user_id })

    test_list = []
    for test in found_tests:
        test_list.append({
            '_id': str(test['_id']),
            'questions': [str(q_id) for q_id in test['questions']],
            'scores': test['scores'],
            'name': test['name']
        })
    return jsonify(test_list)

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
    user_id = request.args.get('user_id')
    test = db.tests.find_one({'_id': ObjectId(test_id)})

    if not test:
        return jsonify({'error': 'Test not found'}), 404

    if str(test['creator_id']) != user_id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.tests.delete_one({'_id': ObjectId(test_id)})
    return jsonify({'message': 'Test deleted successfully'})

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

@app.route('/search_students', methods=['GET'])
def search_students():
    query = request.args.get('query')
    students = db.users.find({'name': {'$regex': query, '$options': 'i'}, 'user_type': 'student'})
    student_list = [{'name': student['name'], '_id': str(student['_id'])} for student in students]
    return jsonify(student_list)

@app.route('/assign_students', methods=['POST'])
def assign_students():
    data = request.json
    test_id = ObjectId(data['test_id'])
    student_ids = [ObjectId(student_id) for student_id in data['student_ids']]

    # Update the test with the assigned students
    db.tests.update_one(
        {'_id': test_id},
        {'$addToSet': {'students_assigned': {'$each': student_ids}}}
    )

    return jsonify({'message': 'Students assigned successfully!'}), 200

@app.route('/questions/<question_id>', methods=['PUT'])
def update_question(question_id):
    data = request.get_json()
    question = {
        "content": data.get("content"),
        "chapter": data.get("chapter"),
        "subject_id": ObjectId(data.get("subject_id")),
        "difficulty": data.get("difficulty"),
        "choices": data.get("choices"),
        "correct_answer": data.get("correct_answer")
    }
    db.questions.update_one({"_id": ObjectId(question_id)}, {"$set": question})
    return jsonify({"message": "Question updated successfully!"})

@app.route('/subjects', methods=['GET'])
def get_subjects():
    subjects = db.subjects.find()
    subject_list = [{"_id": str(subject["_id"]), "name": subject["name"]} for subject in subjects]
    return jsonify(subject_list)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
