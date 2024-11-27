import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // API call for signup
    const response = await fetch('http://localhost:8080/create-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      setMessage('Account created successfully!');
      navigate('/login'); // Redirect to login after successful signup
    } else {
      const error = await response.json();
      setMessage(`Error: ${error.message || 'Signup failed'}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Signup</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Signup</button>
        </form>
        {message && <p>{message}</p>}
      </header>
    </div>
  );
}

export default Signup;
