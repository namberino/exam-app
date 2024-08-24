import bcrypt
from pymongo import MongoClient
from bson.objectid import ObjectId

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.testing_db

subjects = db.subjects
subjects.insert_many([
    {'name': 'Mathematics'},
    {'name': 'Science'},
    {'name': 'History'},
    {'name': 'Geography'},
    {'name': 'Physics'},
    {'name': 'Biology'}
])

# Create users collection and insert example data
users = db.users
users.insert_many([
    {
        'name': 'Nick',
        'user_type': 'student',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Sarah',
        'user_type': 'teacher',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Tony',
        'user_type': 'student',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Steve',
        'user_type': 'teacher',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Thadeus',
        'user_type': 'teacher',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Leon',
        'user_type': 'admin',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Alice',
        'user_type': 'student',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Bob',
        'user_type': 'teacher',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Charlie',
        'user_type': 'student',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 1
    },
    {
        'name': 'David',
        'user_type': 'teacher',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Eve',
        'user_type': 'admin',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Frank',
        'user_type': 'student',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 1
    },
    {
        'name': 'Grace',
        'user_type': 'teacher',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Hank',
        'user_type': 'student',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Ivy',
        'user_type': 'admin',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Jack',
        'user_type': 'teacher',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Karen',
        'user_type': 'student',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 1
    },
    {
        'name': 'Leo',
        'user_type': 'teacher',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Mia',
        'user_type': 'student',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    },
    {
        'name': 'Nathan',
        'user_type': 'admin',
        'password': bcrypt.hashpw('Password'.encode('utf-8'), bcrypt.gensalt()),
        'suspended': 0
    }
])

# Create questions collection and insert example data
questions = db.questions
questions.insert_many([
    {
        'content': 'What is the capital of France?',
        'difficulty': 'Easy',
        'chapter': 'Countries',
        'choices': [
        { 'text': 'Paris', 'is_correct': True },
        { 'text': 'London', 'is_correct': False },
        { 'text': 'Rome', 'is_correct': False },
        { 'text': 'Berlin', 'is_correct': False }
        ],
        'correct_answer': 'Paris',
        'subject_id': ObjectId(subjects.find_one({'name': 'Geography'})['_id'])
    },
    {
        'content': 'Solve for x: 2x + 3 = 7',
        'difficulty': 'Medium',
        'chapter': 'Algebra',
        'choices': [
        { 'text': '1', 'is_correct': False },
        { 'text': '2', 'is_correct': True },
        { 'text': '3', 'is_correct': False },
        { 'text': '4', 'is_correct': False }
        ],
        'correct_answer': '2',
        'subject_id': ObjectId(subjects.find_one({'name': 'Mathematics'})['_id'])
    },
    {
        'content': "What is the Collatz's conjecture equation?",
        'difficulty': 'Medium',
        'chapter': 'Algebra',
        'choices': [
        { 'text': '4x+1', 'is_correct': False },
        { 'text': '3x+1', 'is_correct': True },
        { 'text': '5x+1', 'is_correct': False },
        { 'text': '2x+1', 'is_correct': False }
        ],
        'correct_answer': '3x+1',
        'subject_id': ObjectId(subjects.find_one({'name': 'Mathematics'})['_id'])
    },
    {
        'content': 'What is a derivative?',
        'difficulty': 'Hard',
        'chapter': 'Calculus',
        'choices': [
        { 'text': 'Rate of change', 'is_correct': True },
        { 'text': 'Area under curve', 'is_correct': False },
        { 'text': 'Summation', 'is_correct': False },
        { 'text': 'Rate of rate of change', 'is_correct': False }
        ],
        'correct_answer': 'Rate of change',
        'subject_id': ObjectId(subjects.find_one({'name': 'Mathematics'})['_id'])
    },
    {
        'content': "What's the derivative of (x+1) sin x?",
        'difficulty': 'Medium',
        'chapter': 'Calculus',
        'choices': [
        { 'text': '(x+1) tan x', 'is_correct': False },
        { 'text': 'sin x', 'is_correct': False },
        { 'text': 'sin x + (x+1) cos x', 'is_correct': True },
        { 'text': '(x+2) cos x', 'is_correct': False }
        ],
        'correct_answer': 'sin x + (x+1) cos x',
        'subject_id': ObjectId(subjects.find_one({'name': 'Mathematics'})['_id'])
    },
    {
        'content': "Where's Brazil?",
        'difficulty': 'Easy',
        'chapter': 'Country',
        'choices': [
        { 'is_correct': True, 'text': 'South America' },
        { 'is_correct': False, 'text': 'The shadow realm' },
        { 'is_correct': False, 'text': 'China' },
        { 'is_correct': False, 'text': 'USA' }
        ],
        'correct_answer': 'North America',
        'subject_id': ObjectId(subjects.find_one({'name': 'Geography'})['_id'])
    },
    {
        'content': 'What continent contains New Zealand?',
        'difficulty': 'Easy',
        'chapter': 'Country',
        'choices': [
        { 'text': 'Australia', 'is_correct': False },
        { 'text': 'Oceania', 'is_correct': True },
        { 'text': 'Asia', 'is_correct': False },
        { 'text': 'Africa', 'is_correct': False }
        ],
        'correct_answer': 'Oceania',
        'subject_id': ObjectId(subjects.find_one({'name': 'Geography'})['_id'])
    },
    {
        'content': 'What is the capital of Japan?',
        'difficulty': 'Easy',
        'chapter': 'Countries',
        'choices': [
        { 'is_correct': True, 'text': 'Tokyo' },
        { 'is_correct': False, 'text': 'Kyoto' },
        { 'is_correct': False, 'text': 'Osaka' },
        { 'is_correct': False, 'text': 'Nagoya' }
        ],
        'correct_answer': 'Tokyo',
        'subject_id': ObjectId(subjects.find_one({'name': 'Geography'})['_id'])
    },
    {
        'content': 'What is the acceleration due to gravity on Earth?',
        'difficulty': 'Medium',
        'chapter': 'Mechanics',
        'choices': [
        { 'is_correct': True, 'text': '9.8 m/s²' },
        { 'is_correct': False, 'text': '10 m/s²' },
        { 'is_correct': False, 'text': '8.9 m/s²' },
        { 'is_correct': False, 'text': '9.2 m/s²' }
        ],
        'correct_answer': '9.8 m/s²',
        'subject_id': ObjectId(subjects.find_one({'name': 'Physics'})['_id'])
    },
    {
        'content': 'Who was the first President of the United States?',
        'difficulty': 'Easy',
        'chapter': 'American History',
        'choices': [
        { 'is_correct': True, 'text': 'George Washington' },
        { 'is_correct': False, 'text': 'Thomas Jefferson' },
        { 'is_correct': False, 'text': 'Abraham Lincoln' },
        { 'is_correct': False, 'text': 'John Adams' }
        ],
        'correct_answer': 'George Washington',
        'subject_id': ObjectId(subjects.find_one({'name': 'History'})['_id'])
    },
    {
        'content': 'What is the formula for calculating kinetic energy?',
        'difficulty': 'Medium',
        'chapter': 'Mechanics',
        'choices': [
        { 'is_correct': True, 'text': '½mv²' },
        { 'is_correct': False, 'text': 'mv' },
        { 'is_correct': False, 'text': 'mgh' },
        { 'is_correct': False, 'text': 'F=ma' }
        ],
        'correct_answer': '½mv²',
        'subject_id': ObjectId(subjects.find_one({'name': 'Physics'})['_id'])
    },
    {
        'content': 'What is the main cause of World War I?',
        'difficulty': 'Hard',
        'chapter': 'World Wars',
        'choices': [
        {
            'is_correct': True,
            'text': 'Assassination of Archduke Franz Ferdinand'
        },
        { 'is_correct': False, 'text': 'The rise of Hitler' },
        { 'is_correct': False, 'text': 'The Treaty of Versailles' },
        { 'is_correct': False, 'text': 'The Cold War' }
        ],
        'correct_answer': 'Assassination of Archduke Franz Ferdinand',
        'subject_id': ObjectId(subjects.find_one({'name': 'History'})['_id'])
    },
    {
        'content': 'What is the genetic material in humans?',
        'difficulty': 'Easy',
        'chapter': 'Genetics',
        'choices': [
        { 'is_correct': True, 'text': 'DNA' },
        { 'is_correct': False, 'text': 'RNA' },
        { 'is_correct': False, 'text': 'Proteins' },
        { 'is_correct': False, 'text': 'Lipids' }
        ],
        'correct_answer': 'DNA',
        'subject_id': ObjectId(subjects.find_one({'name': 'Biology'})['_id'])
    },
    {
        'content': 'What is the speed of light?',
        'difficulty': 'Medium',
        'chapter': 'Optics',
        'choices': [
        { 'is_correct': True, 'text': '299,792,458 m/s' },
        { 'is_correct': False, 'text': '300,000,000 m/s' },
        { 'is_correct': False, 'text': '150,000,000 m/s' },
        { 'is_correct': False, 'text': '299,792,458 km/s' }
        ],
        'correct_answer': '299,792,458 m/s',
        'subject_id': ObjectId(subjects.find_one({'name': 'Physics'})['_id'])
    },
    {
        'content': 'What is the function of the mitochondria?',
        'difficulty': 'Easy',
        'chapter': 'Cell Biology',
        'choices': [
        { 'is_correct': True, 'text': 'Powerhouse of the cell' },
        { 'is_correct': False, 'text': 'Protein synthesis' },
        { 'is_correct': False, 'text': 'DNA replication' },
        { 'is_correct': False, 'text': 'Photosynthesis' }
        ],
        'correct_answer': 'Powerhouse of the cell',
        'subject_id': ObjectId(subjects.find_one({'name': 'Biology'})['_id'])
    },
    {
        'content': 'Who proposed the theory of evolution by natural selection?',
        'difficulty': 'Easy',
        'chapter': 'Evolution',
        'choices': [
        { 'is_correct': True, 'text': 'Charles Darwin' },
        { 'is_correct': False, 'text': 'Gregor Mendel' },
        { 'is_correct': False, 'text': 'Isaac Newton' },
        { 'is_correct': False, 'text': 'Albert Einstein' }
        ],
        'correct_answer': 'Charles Darwin',
        'subject_id': ObjectId(subjects.find_one({'name': 'Biology'})['_id'])
    },
    {
        'content': 'What is the capital of Canada?',
        'difficulty': 'Easy',
        'chapter': 'Countries',
        'choices': [
        { 'is_correct': True, 'text': 'Ottawa' },
        { 'is_correct': False, 'text': 'Toronto' },
        { 'is_correct': False, 'text': 'Vancouver' },
        { 'is_correct': False, 'text': 'Montreal' }
        ],
        'correct_answer': 'Ottawa',
        'subject_id': ObjectId(subjects.find_one({'name': 'Geography'})['_id'])
    },
    {
        'content': 'What is the boiling point of water?',
        'difficulty': 'Easy',
        'chapter': 'Thermodynamics',
        'choices': [
        { 'is_correct': True, 'text': '100°C' },
        { 'is_correct': False, 'text': '212°F' },
        { 'is_correct': False, 'text': '0°C' },
        { 'is_correct': False, 'text': '373.15 K' }
        ],
        'correct_answer': '100°C',
        'subject_id': ObjectId(subjects.find_one({'name': 'Physics'})['_id'])
    },
    {
        'content': 'What was the main purpose of the Silk Road?',
        'difficulty': 'Medium',
        'chapter': 'Ancient Civilizations',
        'choices': [
        { 'is_correct': True, 'text': 'Trade between Asia and Europe' },
        { 'is_correct': False, 'text': 'Military conquests' },
        { 'is_correct': False, 'text': 'Spreading religion' },
        { 'is_correct': False, 'text': 'Exploration of new lands' }
        ],
        'correct_answer': 'Trade between Asia and Europe',
        'subject_id': ObjectId(subjects.find_one({'name': 'History'})['_id'])
    },
    {
        'content': 'What process do plants use to convert sunlight into energy?',
        'difficulty': 'Easy',
        'chapter': 'Ecology',
        'choices': [
        { 'is_correct': True, 'text': 'Photosynthesis' },
        { 'is_correct': False, 'text': 'Respiration' },
        { 'is_correct': False, 'text': 'Fermentation' },
        { 'is_correct': False, 'text': 'Transpiration' }
        ],
        'correct_answer': 'Photosynthesis',
        'subject_id': ObjectId(subjects.find_one({'name': 'Biology'})['_id'])
    }
])

tests = db.tests
tests.insert_many([
    {
        'questions': [
            ObjectId(questions.find_one({'content': 'Solve for x: 2x + 3 = 7'})['_id']),
            ObjectId(questions.find_one({'content': "What is the Collatz's conjecture equation?"})['_id']),
            ObjectId(questions.find_one({'content': 'What is a derivative?'})['_id']),
            ObjectId(questions.find_one({'content': "What's the derivative of (x+1) sin x?"})['_id'])
        ],
        'scores': {
            str(users.find_one({'name': 'Tony'})['_id']): 100,
            str(users.find_one({'name': 'Nick'})['_id']): 100,
            str(users.find_one({'name': 'Hank'})['_id']): 50,
            str(users.find_one({'name': 'Mia'})['_id']): 75,
            str(users.find_one({'name': 'Alice'})['_id']): 25
        },
        'name': 'Math 1',
        'assigned_students': [
            ObjectId(users.find_one({'name': 'Tony'})['_id']),
            ObjectId(users.find_one({'name': 'Nick'})['_id']),
            ObjectId(users.find_one({'name': 'Hank'})['_id']),
            ObjectId(users.find_one({'name': 'Mia'})['_id']),
            ObjectId(users.find_one({'name': 'Alice'})['_id'])
        ],
        'creator_id': ObjectId(users.find_one({'name': 'Steve'})['_id']),
        'time_limit': 60
    },
    {
        'questions': [
            ObjectId(questions.find_one({'content': 'What is the acceleration due to gravity on Earth?'})['_id']),
            ObjectId(questions.find_one({'content': 'What is the formula for calculating kinetic energy?'})['_id']),
            ObjectId(questions.find_one({'content': 'What is the speed of light?'})['_id']),
            ObjectId(questions.find_one({'content': 'What is the boiling point of water?'})['_id'])
        ],
        'scores': {
            str(users.find_one({'name': 'Tony'})['_id']): 75,
            str(users.find_one({'name': 'Nick'})['_id']): 75,
            str(users.find_one({'name': 'Hank'})['_id']): 100,
            str(users.find_one({'name': 'Mia'})['_id']): 25,
            str(users.find_one({'name': 'Alice'})['_id']): 50
        },
        'name': 'Physics 1',
        'assigned_students': [
            ObjectId(users.find_one({'name': 'Tony'})['_id']),
            ObjectId(users.find_one({'name': 'Nick'})['_id']),
            ObjectId(users.find_one({'name': 'Hank'})['_id']),
            ObjectId(users.find_one({'name': 'Mia'})['_id']),
            ObjectId(users.find_one({'name': 'Alice'})['_id'])
        ],
        'creator_id': ObjectId(users.find_one({'name': 'Steve'})['_id']),
        'time_limit': 120
    }
])

test_history = db.test_history
test_history.insert_many([
    {
        'user_id': ObjectId(users.find_one({'name': 'Nick'})['_id']),
        'test_id': ObjectId(tests.find_one({'name': 'Math 1'})['_id']),
        'score': 100
    },
    {
        'user_id': ObjectId(users.find_one({'name': 'Tony'})['_id']),
        'test_id': ObjectId(tests.find_one({'name': 'Math 1'})['_id']),
        'score': 100
    },
    {
        'user_id': ObjectId(users.find_one({'name': 'Alice'})['_id']),
        'test_id': ObjectId(tests.find_one({'name': 'Math 1'})['_id']),
        'score': 50
    },
    {
        'user_id': ObjectId(users.find_one({'name': 'Hank'})['_id']),
        'test_id': ObjectId(tests.find_one({'name': 'Math 1'})['_id']),
        'score': 75
    },
    {
        'user_id': ObjectId(users.find_one({'name': 'Mia'})['_id']),
        'test_id': ObjectId(tests.find_one({'name': 'Math 1'})['_id']),
        'score': 25
    },
    {
        'user_id': ObjectId(users.find_one({'name': 'Nick'})['_id']),
        'test_id': ObjectId(tests.find_one({'name': 'Physics 1'})['_id']),
        'score': 75
    },
    {
        'user_id': ObjectId(users.find_one({'name': 'Tony'})['_id']),
        'test_id': ObjectId(tests.find_one({'name': 'Physics 1'})['_id']),
        'score': 75
    },
    {
        'user_id': ObjectId(users.find_one({'name': 'Alice'})['_id']),
        'test_id': ObjectId(tests.find_one({'name': 'Physics 1'})['_id']),
        'score': 100
    },
    {
        'user_id': ObjectId(users.find_one({'name': 'Hank'})['_id']),
        'test_id': ObjectId(tests.find_one({'name': 'Physics 1'})['_id']),
        'score': 25
    },
    {
        'user_id': ObjectId(users.find_one({'name': 'Mia'})['_id']),
        'test_id': ObjectId(tests.find_one({'name': 'Physics 1'})['_id']),
        'score': 50
    }
])

print("Database populated successfully!")

