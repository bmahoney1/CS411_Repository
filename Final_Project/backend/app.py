import requests
import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from dotenv import load_dotenv
import logging

# Initialize Flask app
app = Flask(__name__)

# Set up logging
logging.basicConfig(
    level=logging.INFO,  # Log level
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler()  # Log to stdout
    ]
)

# Enable CORS
CORS(app, origins=["http://localhost:3000"])  # Allow only requests from the React app

# App configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'  # Replace with a secure key in production

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    salt = db.Column(db.String(64), nullable=False)
    hashed_password = db.Column(db.String(128), nullable=False)
    amount = db.Column(db.Float, default=0.0)
    currency = db.Column(db.String(10), default='USD')

# Helper functions
def hash_password(password: str) -> tuple:
    salt = bcrypt.generate_password_hash(password).decode('utf-8')
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    return salt, hashed_password

def check_password(stored_hash: str, password: str) -> bool:
    return bcrypt.check_password_hash(stored_hash, password)

# Load the API key from the environment variables
load_dotenv()
API_KEY = os.getenv('CURRENCY_API_KEY')

# Routes
@app.route('/create-account', methods=['POST'])
def create_account() -> tuple:
    app.logger.info("Creating an account")
    data = request.json
    username = data['username']
    password = data['password']

    if User.query.filter_by(username=username).first():
        app.logger.warning(f"Account creation failed: User {username} already exists")
        return jsonify({"error": "User already exists"}), 400

    salt, hashed_password = hash_password(password)
    user = User(username=username, salt=salt, hashed_password=hashed_password)
    db.session.add(user)
    db.session.commit()
    app.logger.info(f"Account successfully created for user {username}")
    return jsonify({"message": "Account created successfully"}), 201

@app.route('/user/<username>/delete', methods=['DELETE'])
def delete_user(username: str) -> tuple:
    app.logger.info(f"Attempting to delete user {username}")
    user = User.query.filter_by(username=username).first()
    if not user:
        app.logger.warning(f"Deletion failed: User {username} not found")
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    app.logger.info(f"User {username} deleted successfully")
    return jsonify({"message": f"User {username} deleted successfully"}), 200

@app.route('/user/<username>/update-password', methods=['PUT'])
def update_password(username: str) -> tuple:
    app.logger.info(f"Attempting to update password for user {username}")
    data = request.json
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    user = User.query.filter_by(username=username).first()
    if not user:
        app.logger.warning(f"Password update failed: User {username} not found")
        return jsonify({"error": "User not found"}), 404

    if not check_password(user.hashed_password, current_password):
        app.logger.warning(f"Password update failed: Incorrect current password for user {username}")
        return jsonify({"error": "Current password is incorrect"}), 400

    salt, hashed_password = hash_password(new_password)
    user.salt = salt
    user.hashed_password = hashed_password
    db.session.commit()
    app.logger.info(f"Password updated successfully for user {username}")
    return jsonify({"message": "Password updated successfully"}), 200

@app.route('/login', methods=['POST'])
def login() -> tuple:
    app.logger.info("Login attempt")
    data = request.json
    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()
    if not user or not check_password(user.hashed_password, password):
        app.logger.warning(f"Login failed for user {username}")
        return jsonify({"error": "Invalid credentials"}), 401

    app.logger.info(f"Login successful for user {username}")
    return jsonify({"message": "Login successful"}), 200

@app.route('/debug/users', methods=['GET'])
def debug_users() -> tuple:
    app.logger.info("Fetching all users for debugging")
    users = User.query.all()
    return jsonify([
        {"id": user.id, "username": user.username, "amount": user.amount, "currency": user.currency}
        for user in users
    ])

@app.route('/user/<username>', methods=['GET'])
def get_user_data(username: str) -> tuple:
    app.logger.info(f"Fetching data for user {username}")
    user = User.query.filter_by(username=username).first()
    if not user:
        app.logger.warning(f"Data fetch failed: User {username} not found")
        return jsonify({"error": "User not found"}), 404

    app.logger.info(f"Data fetched successfully for user {username}")
    return jsonify({
        "id": user.id,
        "username": user.username,
        "amount": user.amount,
        "currency": user.currency
    }), 200

@app.route('/user/<username>/update-amount', methods=['PUT'])
def update_amount(username: str) -> tuple:
    app.logger.info(f"Updating amount for user {username}")
    data = request.json
    new_amount = data.get("amount")

    user = User.query.filter_by(username=username).first()
    if not user:
        app.logger.warning(f"Amount update failed: User {username} not found")
        return jsonify({"error": "User not found"}), 404

    user.amount = new_amount
    db.session.commit()
    app.logger.info(f"Amount updated successfully for user {username}")
    return jsonify({"message": "Amount updated successfully"}), 200

@app.route('/user/<username>/update-currency', methods=['PUT'])
def update_currency(username: str) -> tuple:
    app.logger.info(f"Updating currency for user {username}")
    data = request.json
    target_currency = data.get("currency")

    user = User.query.filter_by(username=username).first()
    if not user:
        app.logger.warning(f"Currency update failed: User {username} not found")
        return jsonify({"error": "User not found"}), 404

    response = requests.get(
        f'https://api.exchangerate-api.com/v4/latest/{user.currency}',
        params={'access_key': API_KEY}
    )
    rates = response.json().get('rates', {})
    if target_currency not in rates:
        app.logger.warning(f"Invalid currency {target_currency} requested")
        return jsonify({"error": "Invalid currency"}), 400

    conversion_rate = rates[target_currency]
    user.amount *= conversion_rate
    user.currency = target_currency
    db.session.commit()
    app.logger.info(f"Currency updated successfully for user {username}")
    return jsonify({
        "message": "Currency updated successfully",
        "new_amount": user.amount,
        "currency": user.currency
    }), 200

@app.route('/currencies', methods=['GET'])
def get_supported_currencies():
    app.logger.info("Fetching supported currencies")
    response = requests.get(f'https://v6.exchangerate-api.com/v6/{API_KEY}/codes')
    data = response.json()

    if data['result'] == 'success':
        currencies = {code: name for code, name in data['supported_codes']}
        app.logger.info("Supported currencies fetched successfully")
        return jsonify(currencies), 200

    app.logger.error("Failed to fetch supported currencies")
    return jsonify({"error": "Failed to fetch supported currencies"}), 400

@app.route('/quota', methods=['GET'])
def get_quota():
    app.logger.info("Fetching API request quota")
    response = requests.get(f'https://v6.exchangerate-api.com/v6/{API_KEY}/quota')
    data = response.json()

    if data['result'] == 'success':
        app.logger.info("API quota fetched successfully")
        return jsonify(data), 200

    app.logger.error("Failed to fetch API")
    return jsonify({"error": "Failed to fetch request quota"}), 400

@app.route('/health', methods=['GET'])
def health_check() -> tuple:
    """
    Health check endpoint.

    This endpoint returns a JSON response with the application status, used to check if the app is running properly.

    Args:
        None

    Returns:
        dict: A JSON response indicating the app's health status.
    """
    app.logger.error("Doing health check")
    return jsonify({"status": "App is running"}), 200

# Setup database
with app.app_context():
    db.create_all()

# Run app
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
