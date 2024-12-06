// src/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; 

function NotFound() {
  return (
    <div className="app-container flex items-center justify-center min-h-screen bg-[#0e0e0e]">
      <div className="text-center p-6">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-gray-300 mb-6">Page Not Found</p>
        <Link
          to="/"
          className="text-[rgba(6,147,227,1)] hover:underline text-lg"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
