// src/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import 'tailwindcss/tailwind.css';

function Login() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/chat');
      } else {
        setErrorMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Sign In</h2>
        <p className="register-link">
          Don't know what is AskNAU? {' '}
          <Link to="/demo">
            Watch Demo
          </Link>
        </p>
        <br></br>
        <form onSubmit={handleLoginSubmit}>
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}
          <div className="input-field">
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          <p className="register-link">
            Don't have an account?{' '}
            <Link to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
