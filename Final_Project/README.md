To get the backend running:
```markdown
# Flask User Management API with Docker

This is a Flask-based API for user management and currency conversion, set up to run inside a Docker container. It allows users to create accounts, update their password and amount, delete their account, and view their data. Additionally, it provides endpoints for currency conversion, fetching supported currencies, and checking the API request quota.

## Docker Setup

### Prerequisites

- Docker installed on your system.
- A working internet connection to pull images and dependencies.

### Building the Docker Image

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/yourrepository.git
   cd yourrepository
   ```

2. Build the Docker image:

   ```bash
   docker build -t flask-app .
   ```

   This command will create the Docker image with the tag `flask-app`.

### Running the Application

1. Run the Docker container, mapping port 5000 inside the container to port 8080 on your host:

   ```bash
   docker run -p 8080:5000 flask-app
   ```

   This will start the Flask application inside the container and make it accessible on `http://localhost:8080`.

### Stopping the Application

To stop the running container, use the following command:

```bash
docker ps  # Get the container ID
docker stop <container_id>  # Replace <container_id> with the actual container ID
```

### Verify the API is Running

You can verify if the application is running correctly by opening a browser or making an HTTP request to:

```
http://localhost:8080/health
```

You should get a response:

```json
{
  "status": "App is running"
}
```

To get the frontend running, go into the frontend/frontend directory and run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.


## Endpoints

### 1. **Create Account**
   - **Route:** `/create-account`
   - **Method:** `POST`
   - **Description:** Creates a new user account with a username and password.
   - **Request Body (JSON):**
     ```json
     {
       "username": "string",
       "password": "string"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Account created successfully"
     }
     ```

### 2. **Login**
   - **Route:** `/login`
   - **Method:** `POST`
   - **Description:** Authenticates a user with a username and password.
   - **Request Body (JSON):**
     ```json
     {
       "username": "string",
       "password": "string"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Login successful"
     }
     ```

### 3. **Get User Data**
   - **Route:** `/user/<username>`
   - **Method:** `GET`
   - **Description:** Retrieves the data of a specific user by username.
   - **URL Parameters:**
     - `username`: The username of the user to retrieve data for.
   - **Response:**
     ```json
     {
       "id": "int",
       "username": "string",
       "amount": "float",
       "currency": "string"
     }
     ```

### 4. **Update User Amount**
   - **Route:** `/user/<username>/update-amount`
   - **Method:** `PUT`
   - **Description:** Updates the amount for a specific user.
   - **URL Parameters:**
     - `username`: The username of the user to update.
   - **Request Body (JSON):**
     ```json
     {
       "amount": "float"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Amount updated successfully"
     }
     ```

### 5. **Update User Currency**
   - **Route:** `/user/<username>/update-currency`
   - **Method:** `PUT`
   - **Description:** Updates the currency of a specific user by converting the user's amount to the target currency.
   - **URL Parameters:**
     - `username`: The username of the user to update.
   - **Request Body (JSON):**
     ```json
     {
       "currency": "string"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Currency updated successfully",
       "new_amount": "float",
       "currency": "string"
     }
     ```

### 6. **Update Password**
   - **Route:** `/user/<username>/update-password`
   - **Method:** `PUT`
   - **Description:** Updates the password for a specific user.
   - **URL Parameters:**
     - `username`: The username of the user to update.
   - **Request Body (JSON):**
     ```json
     {
       "current_password": "string",
       "new_password": "string"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Password updated successfully"
     }
     ```

### 7. **Delete User**
   - **Route:** `/user/<username>/delete`
   - **Method:** `DELETE`
   - **Description:** Deletes a user from the database.
   - **URL Parameters:**
     - `username`: The username of the user to be deleted.
   - **Response:**
     ```json
     {
       "message": "User deleted successfully"
     }
     ```

### 8. **Debug Users**
   - **Route:** `/debug/users`
   - **Method:** `GET`
   - **Description:** Retrieves all users for debugging purposes.
   - **Response:**
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

### 9. **Health Check**
   - **Route:** `/health`
   - **Method:** `GET`
   - **Description:** A health check endpoint to verify if the API is running properly.
   - **Response:**
     ```json
     {
       "status": "App is running"
     }
     ```

### 10. **Get Supported Currencies**
   - **Route:** `/currencies`
   - **Method:** `GET`
   - **Description:** Fetches all supported currencies from the Exchange Rate API.
   - **Response:**
     ```json
     {
       "USD": "United States Dollar",
       "EUR": "Euro",
       "GBP": "British Pound"
     }
     ```

### 11. **Get API Request Quota**
   - **Route:** `/quota`
   - **Method:** `GET`
   - **Description:** Fetches the current API request quota.
   - **Response:**
     ```json
     {
       "result": "success",
       "data": {
         "requests_left": "int",
         "requests_total": "int"
       }
     }
     ```
