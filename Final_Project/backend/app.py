from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS  # Import flask-cors

# Initialize Flask app
app = Flask(__name__)

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
    """
    Hashes the password and generates a salt.

    Args:
        password (str): The plain text password to hash.

    Returns:
        tuple: A tuple containing the salt and hashed password.
    """
    salt = bcrypt.generate_password_hash(password).decode('utf-8')
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    return salt, hashed_password

def check_password(stored_hash: str, password: str) -> bool:
    """
    Checks if the provided password matches the stored hash.

    Args:
        stored_hash (str): The hashed password stored in the database.
        password (str): The plain text password to compare.

    Returns:
        bool: True if the password matches the stored hash, False otherwise.
    """
    return bcrypt.check_password_hash(stored_hash, password)

# Routes
@app.route('/create-account', methods=['POST'])
def create_account() -> tuple:
    """
    Creates a new user account.

    This endpoint accepts a POST request with JSON data containing a username and password.
    It hashes the password and stores the user's details in the database.

    Args:
        None

    Returns:
        dict: A JSON response indicating the result of the account creation (success or error).
    """
    data = request.json
    username = data['username']
    password = data['password']

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "User already exists"}), 400

    salt, hashed_password = hash_password(password)
    user = User(username=username, salt=salt, hashed_password=hashed_password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Account created successfully"}), 201

@app.route('/login', methods=['POST'])
def login() -> tuple:
    """
    Authenticates a user.

    This endpoint accepts a POST request with JSON data containing a username and password.
    It checks if the provided credentials are correct and returns a login success or error message.

    Args:
        None

    Returns:
        dict: A JSON response indicating the login status (success or error).
    """
    data = request.json
    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()
    if not user or not check_password(user.hashed_password, password):
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful"}), 200

@app.route('/debug/users', methods=['GET'])
def debug_users() -> tuple:
    """
    Retrieves all users for debugging purposes.

    This endpoint returns a list of all users in the database, including their IDs, usernames, amount, and currency.

    Args:
        None

    Returns:
        list: A JSON list containing the details of all users.
    """
    users = User.query.all()
    return jsonify([
        {"id": user.id, "username": user.username, "amount": user.amount, "currency": user.currency}
        for user in users
    ])

@app.route('/user/<username>', methods=['GET'])
def get_user_data(username: str) -> tuple:
    """
    Retrieves data for a specific user.

    This endpoint accepts a GET request with a username as a parameter and returns the user's details.
    If the user is not found, a 404 error response is returned.

    Args:
        username (str): The username of the user whose data is to be retrieved.

    Returns:
        dict: A JSON response with the user's data, or an error message if the user is not found.
    """
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "username": user.username,
        "amount": user.amount,
        "currency": user.currency
    }), 200

@app.route('/user/<username>/update-amount', methods=['PUT'])
def update_amount(username: str) -> tuple:
    """
    Updates the amount for a specific user.

    This endpoint accepts a PUT request with a new amount in JSON data. It updates the user's amount in the database.

    Args:
        username (str): The username of the user whose amount is to be updated.
        amount (float): The new amount to set for the user.

    Returns:
        dict: A JSON response indicating the result of the amount update (success or error).
    """
    data = request.json
    new_amount = data.get("amount")

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.amount = new_amount
    db.session.commit()

    return jsonify({"message": "Amount updated successfully"}), 200

@app.route('/user/<username>/update-currency', methods=['PUT'])
def update_currency(username: str) -> tuple:
    """
    Updates the currency of a specific user.

    This endpoint accepts a PUT request with a target currency in JSON data and converts the user's amount to the new currency.
    It fetches the conversion rate from a third-party API and updates the user's data.

    Args:
        username (str): The username of the user whose currency is to be updated.
        currency (str): The target currency to convert the user's amount to.

    Returns:
        dict: A JSON response indicating the result of the currency update, including the new amount and currency.
    """
    data = request.json
    target_currency = data.get("currency")

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Fetch conversion rate from third-party API
    import requests
    from dotenv import load_dotenv
    import os

    load_dotenv()
    API_KEY = os.getenv('CURRENCY_API_KEY')

    response = requests.get(
        f'https://api.exchangerate-api.com/v4/latest/{user.currency}',
        params={'access_key': API_KEY}
    )
    rates = response.json().get('rates', {})
    if target_currency not in rates:
        return jsonify({"error": "Invalid currency"}), 400

    conversion_rate = rates[target_currency]

    # Update user data
    user.amount *= conversion_rate
    user.currency = target_currency
    db.session.commit()

    return jsonify({
        "message": "Currency updated successfully",
        "new_amount": user.amount,
        "currency": user.currency
    }), 200


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
    return jsonify({"status": "App is running"}), 200

# Setup database
with app.app_context():
    db.create_all()

# Run app
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
