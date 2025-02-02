// src/EditProfile.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';

export default function EditProfile() {
  const navigate = useNavigate();
  const API_BASE_URL = 'https://asknau-backend-20d79e207a54.herokuapp.com';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  // Fetch the current profile information on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error('Error fetching profile');
        }
        return res.json();
      })
      .then((data) => {
        setName(data.full_name || '');
        setEmail(data.email || '');
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load profile information.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, API_BASE_URL]);

  // Handle form submission for profile update
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setUpdating(true);
    setError('');
    const payload = {
      full_name: name,
      email: email
    };

    fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error('Error updating profile');
        }
        return res.json();
      })
      .then(() => {
        // After successful update, navigate back to the chat page
        navigate('/chat');
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to update profile.');
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  // Handle cancel button click by navigating back
  const handleCancel = () => {
    navigate('/chat');
  };

  return (
    <div className="edit-profile-container">
      <h1>Edit Profile</h1>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <div className="form-actions">
            <button type="submit" disabled={updating}>
              {updating ? 'Updating...' : 'Save'}
            </button>
            <button type="button" className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}