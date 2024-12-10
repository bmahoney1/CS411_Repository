### README: User Management System

---

## **Overview**
The application is a user management system with a Flask backend and a React frontend. It provides features to create accounts, log in, manage user financial data, and perform currency conversions using a third-party API. The backend uses Flask with SQLAlchemy for database management, bcrypt for password hashing, and CORS to enable frontend communication. The application uses SQLite as the database and provides RESTful endpoints for user account management and data updates.

---

## **Routes Documentation**

### **1. Create Account**
- **Route Name and Path:** `/create-account`
- **Request Type:** `POST`
- **Purpose:** Creates a new user account with a unique username and hashed password.
- **Request Format:**
  - **Body (JSON):**
    ```json
    {
        "username": "string",
        "password": "string"
    }
    ```
- **Response Format:**
  - **Success Response (201):**
    ```json
    {
        "message": "Account created successfully"
    }
    ```
  - **Error Response (400):**
    ```json
    {
        "error": "User already exists"
    }
    ```
- **Example:**
  - **Request:**
    ```bash
    curl -X POST http://localhost:5000/create-account -H "Content-Type: application/json" -d '{"username":"user1","password":"pass123"}'
    ```
  - **Response:**
    ```json
    {
        "message": "Account created successfully"
    }
    ```

---

### **2. Login**
- **Route Name and Path:** `/login`
- **Request Type:** `POST`
- **Purpose:** Authenticates a user with their username and password.
- **Request Format:**
  - **Body (JSON):**
    ```json
    {
        "username": "string",
        "password": "string"
    }
    ```
- **Response Format:**
  - **Success Response (200):**
    ```json
    {
        "message": "Login successful"
    }
    ```
  - **Error Response (401):**
    ```json
    {
        "error": "Invalid credentials"
    }
    ```
- **Example:**
  - **Request:**
    ```bash
    curl -X POST http://localhost:5000/login -H "Content-Type: application/json" -d '{"username":"user1","password":"pass123"}'
    ```
  - **Response:**
    ```json
    {
        "message": "Login successful"
    }
    ```

---

### **3. Debug Users**
- **Route Name and Path:** `/debug/users`
- **Request Type:** `GET`
- **Purpose:** Retrieves all users for debugging purposes.
- **Request Format:**
  - **No Parameters**
- **Response Format:**
  - **Success Response (200):**
    ```json
    [
        {
            "id": "int",
            "username": "string",
            "amount": "float",
            "currency": "string"
        }
    ]
    ```
- **Example:**
  - **Request:**
    ```bash
    curl -X GET http://localhost:5000/debug/users
    ```
  - **Response:**
    ```json
    [
        {
            "id": 1,
            "username": "user1",
            "amount": 0.0,
            "currency": "USD"
        }
    ]
    ```

---

### **4. Get User Data**
- **Route Name and Path:** `/user/<username>`
- **Request Type:** `GET`
- **Purpose:** Retrieves data for a specific user by username.
- **Request Format:**
  - **GET Parameter:**
    - `<username>`: The username of the user.
- **Response Format:**
  - **Success Response (200):**
    ```json
    {
        "id": "int",
        "username": "string",
        "amount": "float",
        "currency": "string"
    }
    ```
  - **Error Response (404):**
    ```json
    {
        "error": "User not found"
    }
    ```
- **Example:**
  - **Request:**
    ```bash
    curl -X GET http://localhost:5000/user/user1
    ```
  - **Response:**
    ```json
    {
        "id": 1,
        "username": "user1",
        "amount": 0.0,
        "currency": "USD"
    }
    ```

---

### **5. Update Amount**
- **Route Name and Path:** `/user/<username>/update-amount`
- **Request Type:** `PUT`
- **Purpose:** Updates the amount for a specific user.
- **Request Format:**
  - **GET Parameter:**
    - `<username>`: The username of the user.
  - **Body (JSON):**
    ```json
    {
        "amount": "float"
    }
    ```
- **Response Format:**
  - **Success Response (200):**
    ```json
    {
        "message": "Amount updated successfully"
    }
    ```
  - **Error Response (404):**
    ```json
    {
        "error": "User not found"
    }
    ```
- **Example:**
  - **Request:**
    ```bash
    curl -X PUT http://localhost:5000/user/user1/update-amount -H "Content-Type: application/json" -d '{"amount": 100.0}'
    ```
  - **Response:**
    ```json
    {
        "message": "Amount updated successfully"
    }
    ```

---

### **6. Update Currency**
- **Route Name and Path:** `/user/<username>/update-currency`
- **Request Type:** `PUT`
- **Purpose:** Converts the user's amount to a new currency and updates the currency field.
- **Request Format:**
  - **GET Parameter:**
    - `<username>`: The username of the user.
  - **Body (JSON):**
    ```json
    {
        "currency": "string"
    }
    ```
- **Response Format:**
  - **Success Response (200):**
    ```json
    {
        "message": "Currency updated successfully",
        "new_amount": "float",
        "currency": "string"
    }
    ```
  - **Error Response (404):**
    ```json
    {
        "error": "User not found"
    }
    ```
  - **Error Response (400):**
    ```json
    {
        "error": "Invalid currency"
    }
    ```
- **Example:**
  - **Request:**
    ```bash
    curl -X PUT http://localhost:5000/user/user1/update-currency -H "Content-Type: application/json" -d '{"currency": "EUR"}'
    ```
  - **Response:**
    ```json
    {
        "message": "Currency updated successfully",
        "new_amount": 85.0,
        "currency": "EUR"
    }
    ```

---

### **7. Health Check**
- **Route Name and Path:** `/health`
- **Request Type:** `GET`
- **Purpose:** Checks if the application is running properly.
- **Request Format:**
  - **No Parameters**
- **Response Format:**
  - **Success Response (200):**
    ```json
    {
        "status": "App is running"
    }
    ```
- **Example:**
  - **Request:**
    ```bash
    curl -X GET http://localhost:5000/health
    ```
  - **Response:**
    ```json
    {
        "status": "App is running"
    }
    ```

---

### **How to Run**
1. Install dependencies:
   ```bash
   pip install flask flask-sqlalchemy flask-bcrypt flask-cors python-dotenv requests
   ```
2. Start the server:
   ```bash
   python app.py
   ```
3. Access the application on [http://localhost:5000](http://localhost:5000).
