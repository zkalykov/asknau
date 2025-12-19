// src/Login.js
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import './Login.css';
import 'tailwindcss/tailwind.css';

function Login() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://asknau-backend-20d79e207a54.herokuapp.com/login', {
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
        router.push('/chat');
      } else {
        setErrorMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  // Handlers for Google and Microsoft authentication
  const handleGoogleLogin = () => {
    window.location.href = 'https://asknau-backend-20d79e207a54.herokuapp.com/auth/google';
  };

  const handleMicrosoftLogin = () => {
    window.location.href = 'https://asknau-backend-20d79e207a54.herokuapp.com/auth/microsoft';
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Sign In</h2>
        <p className="register-link">
          Don't know what is AskNAU? <Link href="/demo">Watch Demo</Link>
        </p>
        <br />
        <form onSubmit={handleLoginSubmit}>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
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
            <Link href="/forgot-password">Forgot password?</Link>
          </p>
          <p className="register-link">
            Don't have an account? <Link href="/register">Register</Link>
          </p>
        </form>

        {/* Google and Microsoft Login Buttons */}
        <div className="social-login">
          <button className="social-button google-login" onClick={handleGoogleLogin}>
            <img src="google_logo.png" alt="Google" />
            Continue with Google
          </button>
          <button className="social-button microsoft-login" onClick={handleMicrosoftLogin}>
            <img src="microsoft_logo.png" alt="Microsoft" />
            Continue with Microsoft Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;