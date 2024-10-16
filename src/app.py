from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import datetime

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Secure this in production
jwt = JWTManager(app)

# Set up CORS to allow requests from frontend
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Use the MongoDB Atlas connection string
client = MongoClient('mongodb+srv://22cs260:vvSZxjIzr1m88tpZ@twitter.ycl6p.mongodb.net/twitter_clone?retryWrites=true&w=majority&appName=Twitter')

# Define the database and collections
db = client['twitter_clone']
users = db['users']
tweets = db['tweets']

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    user = users.find_one({'email': email})
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    token = create_access_token(identity={'email': user['email']})
    return jsonify({'token': token}), 200

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data['email']
    password = generate_password_hash(data['password'])
    if users.find_one({'email': email}):
        return jsonify({'error': 'User already exists'}), 400
    users.insert_one({'email': email, 'password': password})
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/tweets', methods=['POST'])
@jwt_required()  # Require JWT authentication
def create_tweet():
    data = request.get_json()
    content = data.get('content')
    if not content:
        return jsonify({'error': 'Tweet content is required'}), 400

    email = get_jwt_identity()['email']
    tweet = {
        'email': email,
        'content': content,
        'likes': 0,
        'userHasLiked': False,
    }

    tweets.insert_one(tweet)
    return jsonify(tweet), 201

@app.route('/tweets', methods=['GET'])
@jwt_required()
def get_tweets():
    all_tweets = list(tweets.find())
    return jsonify(all_tweets), 200

@app.route('/test_db', methods=['GET'])
def test_db():
    try:
        user = users.find_one()  # Fetch any user in the collection
        if user:
            return jsonify({'message': 'Connected to MongoDB, found a user'}), 200
        else:
            return jsonify({'message': 'Connected to MongoDB, no users found'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
