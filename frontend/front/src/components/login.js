// components/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API_ENDPOINT from './../api/index.js';
import { UserContext } from './../context/UserContext';
import './login.css'
import Preloader from '../components/preloader.js';
function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { username, setUsername } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        setError('');
        setUsername(username);
        navigate('/profile');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }finally {
      setLoading(false); 
    }
  };
  if (loading) {
    return <Preloader />; 
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate('/signup')}>Signup</button> 
    </div>
  );
}

export default Login;



