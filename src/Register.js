// src/Register.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import 'tailwindcss/tailwind.css';


function Register() {
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (signUpPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      console.log('Sending data:', {
        email: signUpEmail,
        full_name: signUpFullName,
        password: signUpPassword,
      });

      const response = await fetch('https://asknau-backend-20d79e207a54.herokuapp.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signUpEmail,
          full_name: signUpFullName,
          password: signUpPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setErrorMessage(data.error || 'Registration failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Sign Up</h2>
          <p className="register-link">
            Don't know what is AskNAU - {' '}
            <Link to="/demo">
              Watch Demo
            </Link>
          </p>
          <br></br>
        <form onSubmit={handleSignUpSubmit}>
          {errorMessage && (
            <div className="error-message">{errorMessage}</div>
          )}
          <div className="input-field">
            <input
              type="text"
              placeholder="Full Name"
              value={signUpFullName}
              onChange={(e) => setSignUpFullName(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Register
          </button>
          <p className="register-link">
            Already have an account?{' '}
            <Link to="/login">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
