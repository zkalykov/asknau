// src/Register.js
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './Login.css';
import 'tailwindcss/tailwind.css';

function Register() {
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ level: '', color: '', width: '0%' });
  const [showPasswordIndicator, setShowPasswordIndicator] = useState(false);
  const router = useRouter();

  // Email validation function
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = { level: '', color: '', width: '0%' };

    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const onlyLowercaseLetters = /^[a-z]+$/.test(password);
    const onlyUppercaseLetters = /^[A-Z]+$/.test(password);

    if (password.length === 0) {
      strength = { level: '', color: 'transparent', width: '0%' };
    }
    else if (password.length < 8) {
      strength = { level: 'Weak', color: 'red', width: '33%' };
    }
    else if (onlyLowercaseLetters) {
      strength = { level: 'Weak', color: 'red', width: '33%' };
    }
    else if (onlyUppercaseLetters) {
      strength = { level: 'Good', color: 'orange', width: '66%' };
    }
    else if ([hasUppercase, hasDigit, hasSpecialChar].filter(Boolean).length === 1) {
      strength = { level: 'Good', color: 'orange', width: '66%' };
    }
    else if ([hasUppercase, hasDigit, hasSpecialChar].filter(Boolean).length === 2) {
      strength = { level: 'Good', color: 'orange', width: '66%' };
    }
    else if (hasUppercase && hasDigit && hasSpecialChar) {
      strength = { level: 'Strong', color: 'green', width: '100%' };
    }

    setPasswordStrength(strength);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(signUpEmail)) {
      setErrorMessage('Invalid email format');
      return;
    }

    if (signUpPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (signUpPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    try {
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
        router.push('/login');
      } else {
        setErrorMessage(data.error || 'Registration failed');
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
        <h2 className="login-title">Sign Up</h2>
        <p className="register-link">
          Don't know what is AskNAU? <Link href="/demo">Watch Demo</Link>
        </p>
        <br />
        <form onSubmit={handleSignUpSubmit}>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="input-field">
            <input
              type="text"
              placeholder="Full Name"
              value={signUpFullName}
              onChange={(e) => setSignUpFullName(e.target.value)}
              required
              onFocus={() => setShowPasswordIndicator(false)}
            />
          </div>
          <div className="input-field">
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
              onFocus={() => setShowPasswordIndicator(false)}
            />
            {!validateEmail(signUpEmail) && signUpEmail && (
              <p className="error-text">Invalid email format</p>
            )}
          </div>
          <div className="input-field">
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => {
                setSignUpPassword(e.target.value);
                checkPasswordStrength(e.target.value);
                setShowPasswordIndicator(true);
              }}
              required
            />
            {showPasswordIndicator && (
              <>
                <div className="password-strength-meter">
                  <div
                    className="password-strength-bar"
                    style={{
                      backgroundColor: passwordStrength.color,
                      width: passwordStrength.width,
                    }}
                  ></div>
                </div>
                <p className="password-strength-text">{passwordStrength.level}</p>
              </>
            )}
          </div>
          <div className="input-field">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              onFocus={() => setShowPasswordIndicator(false)}
            />
          </div>
          <button type="submit" className="login-button">
            Register
          </button>
          <p className="register-link">
            Already have an account? <Link href="/login">Sign In</Link>
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

export default Register;