import bcrypt
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.exam_app

# Create users collection and insert example data
users = db.users
users.insert_many([
    {
        'name': 'nick',
        'user_type': 'student',
        'password': bcrypt.hashpw('password'.encode('utf-8'), bcrypt.gensalt())
    },
    {
        'name': 'sarah',
        'user_type': 'teacher',
        'password': bcrypt.hashpw('password'.encode('utf-8'), bcrypt.gensalt())
    }
])

# Create questions collection and insert example data
questions = db.questions
questions.insert_many([
    {
        'content': 'What is the capital of France?',
        'difficulty': 'easy',
        'chapter': 'Countries',
        'subject': 'Geography'
    },
    {
        'content': 'Solve for x: 2x + 3 = 7',
        'difficulty': 'medium',
        'chapter': 'Algebra',
        'subject': 'Mathematics'
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

