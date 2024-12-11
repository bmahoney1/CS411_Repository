import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import Dashboard from './dashboard';

function App() {
  const [loggedInUsername, setLoggedInUsername] = useState(''); // Track logged-in user

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login setLoggedInUsername={setLoggedInUsername} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={<Dashboard loggedInUsername={loggedInUsername} />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

