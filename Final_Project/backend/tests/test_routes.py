import pytest
from backend.app import app, db, User
from flask import jsonify

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.session.remove()
            db.drop_all()

##################################################
# Test create-account route
##################################################
def test_create_account_success(client):
    # Create a user
    response = client.post('/create-account', json={
        "username": "testuser",
        "password": "password123"
    })
    assert response.status_code == 201
    assert response.json["message"] == "Account created successfully"

    with client.application.app_context():
        user = User.query.filter_by(username="testuser").first()
        assert user is not None

def test_create_account_specified_amount_currency(client):
    # Create a user with a specified amount and currency
    response = client.post('/create-account', json={
        "username": "testuser",
        "password": "password123",
        "amount": 20.0,
        "currency": "CAD"
    })
    assert response.status_code == 201
    assert response.json["message"] == "Account created successfully"

    with client.application.app_context():
        user = User.query.filter_by(username="testuser").first()
        assert user is not None


def test_create_account_specified_with_id(client):
    # Create a user with a specified id, amount, and currency
    response = client.post('/create-account', json={
        "id": 21,
        "username": "testuser",
        "password": "password123",
        "amount": 20.0,
        "currency": "CAD"
    })
    assert response.status_code == 201
    assert response.json["message"] == "Account created successfully"

    with client.application.app_context():
        user = User.query.filter_by(username="testuser").first()
        assert user is not None

def test_create_account_user_exists(client):
    # Create the first user
    client.post('/create-account', json={
        "username": "testuser",
        "password": "password123"
    })

    # Try to create the same user again
    response = client.post('/create-account', json={
        "username": "testuser",
        "password": "password123"
    })
    assert response.status_code == 400
    assert response.json["error"] == "User already exists"

def test_create_account_password_exists(client):
    # Create the first user
    client.post('/create-account', json={
        "username": "testuser1",
        "password": "password123"
    })

    # Create a different user with the same password
    response = client.post('/create-account', json={
        "username": "testuser2",
        "password": "password123"
    })
    assert response.status_code == 201
    assert response.json["message"] == "Account created successfully"

##################################################
# Test delete route
##################################################
def test_delete_user(client):
    # Create a user
    client.post('/create-account', json={
        "username": "testuser",
        "password": "password123"
    })

    # Assert the user exists before deletion
    response = client.get('/user/testuser')
    assert response.status_code == 200
    assert response.json["username"] == "testuser"

    # Delete the user
    response = client.delete('/user/testuser/delete')
    assert response.status_code == 200
    assert response.json["message"] == "User testuser deleted successfully"

    # Verify the user was deleted
    response = client.get('/user/testuser')
    assert response.status_code == 404
    assert response.json["error"] == "User not found"

def test_delete_non_existent_user(client):
    # Try to delete a non-existent user
    response = client.delete('/user/nonexistentuser/delete')

    # Verify the user was not found
    assert response.status_code == 404
    assert response.json["error"] == "User not found"

##################################################
# Test update_password route
##################################################
def test_update_password(client):
    # Create a user
    client.post('/create-account', json={
        "username": "testuser",
        "password": "password123"
    })

    # Try to update the password with incorrect current password
    response = client.put('/user/testuser/update-password', json={
        "current_password": "wrongpassword",
        "new_password": "newpassword123"
    })
    assert response.status_code == 400
    assert response.json["error"] == "Current password is incorrect"

    # Update the password with the correct current password
    response = client.put('/user/testuser/update-password', json={
        "current_password": "password123",
        "new_password": "newpassword123"
    })
    assert response.status_code == 200
    assert response.json["message"] == "Password updated successfully"

    # Verify the new password by logging in with it
    response = client.post('/login', json={
        "username": "testuser",
        "password": "newpassword123"
    })
    assert response.status_code == 200
    assert response.json["message"] == "Login successful"

def test_update_password_user_not_found(client):
    # Try to update the password for a non-existent user
    response = client.put('/user/nonexistentuser/update-password', json={
        "current_password": "password123",
        "new_password": "newpassword123"
    })
    assert response.status_code == 404
    assert response.json["error"] == "User not found"


##################################################
# Test login route
##################################################
def test_login_success(client):
    # Create a user
    client.post('/create-account', json={
        "username": "testuser",
        "password": "password123"
    })

    # Try logging in with the created user
    response = client.post('/login', json={
        "username": "testuser",
        "password": "password123"
    })
    assert response.status_code == 200
    assert response.json["message"] == "Login successful"

def test_login_invalid_credentials(client):
    # Attempt login with a non-existent user
    response = client.post('/login', json={
        "username": "nonexistentuser",
        "password": "password123"
    })
    assert response.status_code == 401
    assert response.json["error"] == "Invalid credentials"

##################################################
# Test debug-users route
##################################################
def test_debug_user(client):
    # Create a user
    client.post('/create-account', json={
        "id": 1,
        "username": "testuser",
        "password": "password123",
    })

    # Call the debug-users route
    response = client.get('/debug/users')
    assert response.status_code == 200
    assert len(response.json) == 1

    assert response.json[0]["id"] == 1
    assert response.json[0]["username"] == "testuser"
    assert response.json[0]["amount"] == 0.0
    assert response.json[0]["currency"] == "USD"

def test_debug_users(client):
    # Create user1
    client.post('/create-account', json={
        "id": 1,
        "username": "testuser1",
        "password": "password123"
    })

    # Create user2
    client.post('/create-account', json={
        "id": 2,
        "username": "testuser2",
        "password": "password234",
    })
    client.put('/user/testuser2/update-amount', json={"amount": 100.0})

    # Call the debug-users route
    response = client.get('/debug/users')
    assert response.status_code == 200
    assert len(response.json) == 2

    assert response.json[0]["id"] == 1
    assert response.json[0]["username"] == "testuser1"
    assert response.json[0]["amount"] == 0.0
    assert response.json[0]["currency"] == "USD"

    assert response.json[1]["id"] == 2
    assert response.json[1]["username"] == "testuser2"
    assert response.json[1]["amount"] == 100.0
    assert response.json[1]["currency"] == "USD"

##################################################
# Test get-user-data
##################################################
def test_get_default_user_data_success(client):
    # Create a user
    client.post('/create-account', json={
        "username": "testuser",
        "password": "password123",
    })

    # Retrieve the user data
    response = client.get('/user/testuser')
    assert response.status_code == 200
    assert response.json["username"] == "testuser"
    assert response.json["amount"] == 0.0
    assert response.json["currency"] == "USD"
    assert "id" in response.json

def test_get_non_default_user_data_success(client, mocker):
    # Create a user
    client.post('/create-account', json={
        "id": 1,
        "username": "testuser",
        "password": "password123",
    })
    # Avoid calling actual API
    mocker.patch('requests.get', return_value=mocker.Mock(json=lambda: {"rates": {"CAD": 0.71}}))
    # Update the user's currency from (default) USD to CAD
    response = client.put('/user/testuser/update-currency', json={"currency": "CAD"})
    # Set the amount to 100.0 (CAD)
    response = client.put('/user/testuser/update-amount', json={"amount": 100.0})

    # Retrieve the user data
    response = client.get('/user/testuser')
    assert response.status_code == 200
    assert response.json["id"] == 1
    assert response.json["username"] == "testuser"
    assert response.json["amount"] == 100.0
    assert response.json["currency"] == "CAD"

def test_get_user_data_not_found(client):
    # Try to retrieve a non-existent user
    response = client.get('/user/nonexistentuser')
    assert response.status_code == 404
    assert response.json["error"] == "User not found"

##################################################
# Test update-amount route
##################################################
def test_update_amount_success(client):
    # Create a user
    client.post('/create-account', json={
        "username": "testuser",
        "password": "password123"
    })

    # Update the user's amount
    response = client.put('/user/testuser/update-amount', json={"amount": 100.0})
    assert response.status_code == 200
    assert response.json["message"] == "Amount updated successfully"

    with client.application.app_context():
        user = User.query.filter_by(username="testuser").first()
        assert user.amount == 100.0

def test_update_amount_user_not_found(client):
    # Try to update a non-existent user's amount
    response = client.put('/user/nonexistentuser/update-amount', json={"amount": 100.0})
    assert response.status_code == 404
    assert response.json["error"] == "User not found"

def test_update_amount_with_currency_success(client, mocker):
    # Create a user
    client.post('/create-account', json={
        "username": "testuser",
        "password": "password123"
    })

    # Update the user's amount
    # 100.0 (USD default)
    response = client.put('/user/testuser/update-amount', json={"amount": 100.0})

    assert response.status_code == 200
    assert response.json["message"] == "Amount updated successfully"

    # Mock the external API call to avoid hitting the real API
    mocker.patch('requests.get', return_value=mocker.Mock(json=lambda: {"rates": {"CAD": 0.71}}))

    # Update the user's currency
    response = client.put('/user/testuser/update-currency', json={"currency": "CAD"})

    assert response.status_code == 200
    assert response.json["message"] == "Currency updated successfully"

    with client.application.app_context():
        user = User.query.filter_by(username="testuser").first()
        # 100 USD to CAD (with exchange rate of 0.71) becomes 71 CAD
        assert user.amount == 71.0

def test_update_amount_user_not_found(client):
    # Try to update a non-existent user's amount
    response = client.put('/user/nonexistentuser/update-amount', json={"amount": 100.0})
    assert response.status_code == 404
    assert response.json["error"] == "User not found"

##################################################
# Test update-currency route
##################################################
def test_update_currency_success(client, mocker):
    # Create a user
    client.post('/create-account', json={
        "username": "testuser",
        "password": "password123"
    })

    # Avoid calling actual API
    mocker.patch('requests.get', return_value=mocker.Mock(json=lambda: {"rates": {"EUR": 1.06}}))

    # Update the user's currency
    response = client.put('/user/testuser/update-currency', json={"currency": "EUR"})
    assert response.status_code == 200
    assert response.json["message"] == "Currency updated successfully"
    assert response.json["currency"] == "EUR"

    with client.application.app_context():
        user = User.query.filter_by(username="testuser").first()
        assert user.currency == "EUR"

def test_update_currency_user_not_found(client):
    # Try to update the currency of a non-existent user
    response = client.put('/user/nonexistentuser/update-currency', json={"currency": "EUR"})
    assert response.status_code == 404
    assert response.json["error"] == "User not found"

def test_update_currency_invalid_currency(client, mocker):
    # Create a user
    client.post('/create-account', json={
        "username": "testuser",
        "password": "password123"
    })

    # Mock the external API call to return no rates
    # (North Korean Won does not have a rate in the actual database)
    mocker.patch('requests.get', return_value=mocker.Mock(json=lambda: {"rates": {"KPW"}}))

    # Try to update to an invalid currency
    response = client.put('/user/testuser/update-currency', json={"currency": "INVALID"})
    assert response.status_code == 400
    assert response.json["error"] == "Invalid currency"

def test_update_currency_empty(client, mocker):
    # Create a user
    client.post('/create-account', json={
        "username": "testuser",
        "password": "password123"
    })

    # Mock the external API call to return no rates
    mocker.patch('requests.get', return_value=mocker.Mock(json=lambda: {"rates": {}}))

    # Try to update to an invalid currency
    response = client.put('/user/testuser/update-currency', json={"currency": "INVALID"})
    assert response.status_code == 400
    assert response.json["error"] == "Invalid currency"

##################################################
# Test currencies route
##################################################

def test_get_supported_currencies(client, mocker):
    # Mock the external API call to return the supported currencies
    mocker.patch('requests.get', return_value=mocker.Mock(json=lambda: {
        'result': 'success',
        'supported_codes': [
            ('USD', 'United States Dollar'),
            ('EUR', 'Euro'),
            ('GBP', 'Pound Sterling')
        ]
    }))

    # Get the supported currencies
    response = client.get('/currencies')

    assert response.status_code == 200
    assert response.json == {
        'USD': 'United States Dollar',
        'EUR': 'Euro',
        'GBP': 'Pound Sterling'
    }

def test_get_supported_currencies_error(client, mocker):
    # Mock the external API call to return an error
    mocker.patch('requests.get', return_value=mocker.Mock(json=lambda: {
        "result": "error",
        "error": "Failed to fetch supported currencies"}))

    # Get the supported currencies
    response = client.get('/currencies')

    assert response.status_code == 400
    assert response.json == {"error": "Failed to fetch supported currencies"}

##################################################
# Test quota route
##################################################
def test_get_quota(client, mocker):
    # Simulate a successful API response
    mocker.patch('requests.get', return_value=mocker.Mock(json=lambda: {
            'result': 'success',
            'usage': 50,
            'quota': 1000
        }))

    response = client.get('/quota')

    assert response.status_code == 200
    assert response.json == {
        'result': 'success',
        'usage': 50,
        'quota': 1000
        }

def test_get_quota_error(client, mocker):
    # Mocking the requests.get call to simulate a failed API response    
    mocker.patch('requests.get', return_value=mocker.Mock(json=lambda: {
            'result': 'error',
            'message': 'Invalid API key'
        }))

    response = client.get('/quota')

    assert response.status_code == 400
    assert response.json == {"error": "Failed to fetch request quota"}

##################################################
# Test health route
##################################################
def test_health_check(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json["status"] == "App is running"
