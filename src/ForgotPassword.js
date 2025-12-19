// src/ForgotPassword.js
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import './Login.css'; // Reusing the same styles from Login.css
import 'tailwindcss/tailwind.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setErrorMessage('Invalid email format');
      return;
    }

    try {
      const response = await fetch('https://asknau-backend-20d79e207a54.herokuapp.com/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Password reset link has been sent to your email.');
        setErrorMessage('');
      } else {
        setErrorMessage(data.error || 'Failed to send reset email.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Forgot Password</h2>
        <p className="register-link">
          Enter your email to receive a password reset link.
        </p>
        <br />
        <form onSubmit={handleForgotPassword}>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          <div className="input-field">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Send Reset Link
          </button>
          <p className="register-link">
            Remembered your password? <Link href="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;