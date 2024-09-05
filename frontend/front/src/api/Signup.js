import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_ENDPOINT from './../api/index.js';
import Preloader from '../components/preloader.js';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await fetch(`${API_ENDPOINT}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name,username, password, email })
      });

      const data = await response.json();
      if (response.ok) {
        setError('');
        setSuccess(data.message);
        setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
      } else {
        setError(data.message);
        setSuccess('');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      setSuccess('');
    }finally {
      setLoading(false); 
    }
  };
  if(loading){
    <Preloader></Preloader>
  }

  return (
    <div>
      <h2>Signup</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      <form onSubmit={handleSubmit}>
      <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setname(e.target.value)}
            required/>
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required/>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          required/>
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required/>
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
