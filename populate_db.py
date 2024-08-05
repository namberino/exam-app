import bcrypt
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.exam_app

# Create users collection and insert example data
users = db.users
users.insert_many([
    {
        'name': 'Nick',
        'user_type': 'student',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt())
    },
    {
        'name': 'Sarah',
        'user_type': 'teacher',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt())
    }
])

# Create questions collection and insert example data
questions = db.questions
questions.insert_many([
    {
        'content': 'What is the capital of France?',
        'difficulty': 'easy',
        'chapter': 'Countries',
        'subject': 'Geography',
        'choices': [
            { 'text': 'Paris', 'is_correct': True },
            { 'text': 'London', 'is_correct': False },
            { 'text': 'Rome', 'is_correct': False },
            { 'text': 'Berlin', 'is_correct': False }
        ],
        'correct_answer': 'Paris'
    },
    {
        'content': 'Solve for x: 2x + 3 = 7',
        'difficulty': 'medium',
        'chapter': 'Algebra',
        'subject': 'Mathematics',
        'choices': [
            { 'text': '1', 'is_correct': True },
            { 'text': '2', 'is_correct': False },
            { 'text': '3', 'is_correct': False },
            { 'text': '4', 'is_correct': False }
        ],
        'correct_answer': '1'
    }
])

# Create tests collection and insert example data
tests = db.tests
tests.insert_many([
    {
        'questions': [
            questions.find_one({'content': 'What is the capital of France?'})['_id'],
            questions.find_one({'content': 'Solve for x: 2x + 3 = 7'})['_id']
        ],
        'scores': {}
    }
])

print("Database populated successfully!")

