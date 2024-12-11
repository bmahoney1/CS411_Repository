import pytest
from backend.app import User, db, app

@pytest.fixture
def client():
    # Set up the app for testing, using an in-memory database
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.test_client() as client:
        with app.app_context():
            db.create_all()  # Create the tables in memory database
        yield client
        with app.app_context():
            db.session.remove()  # Remove the session after each test
            db.drop_all()  # Drop the tables after each test

##################################################
# Test User model
##################################################
def test_user_model_creation(client):
    # Create a new user instance without specifying amount or currency
    user = User(username="testuser", salt="test_salt", hashed_password="test_hashed_password")
    
    # Ensure the app context is available when interacting with the database
    with app.app_context():
        # Add user to the session and commit it to the database
        db.session.add(user)
        db.session.commit()
        
        # Retrieve the user from the database
        created_user = User.query.filter_by(username="testuser").first()
        
        # Check the user properties
        assert created_user.username == "testuser"
        assert created_user.salt == "test_salt"
        assert created_user.hashed_password == "test_hashed_password"
        
        # Assert the default values for amount and currency are set correctly
        assert created_user.amount == 0.0  # Default value for amount
        assert created_user.currency == "USD"  # Default value for currency

def test_user_model_creation_specified(client):
    # Create a new user instance specifying amount or currency
    user = User(username="testuser", salt="test_salt", hashed_password="test_hashed_password", amount=20.0, currency = "CAD")
    
    # Ensure the app context is available when interacting with the database
    with app.app_context():
        # Add user to the session and commit it to the database
        db.session.add(user)
        db.session.commit()
        
        # Retrieve the user from the database
        created_user = User.query.filter_by(username="testuser").first()
        
        # Check the user properties
        assert created_user.username == "testuser"
        assert created_user.salt == "test_salt"
        assert created_user.hashed_password == "test_hashed_password"
        
        # Assert the default values for amount and currency are set correctly
        assert created_user.amount == 20.0  # Specified value for amount
        assert created_user.currency == "CAD"  # Specified value for currency

