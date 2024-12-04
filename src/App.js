// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './Chat';
import Login from './Login';
import Register from './Register';
import Demo from './Demo';
import NotFound from './NotFound'; // Import the NotFound component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Demo />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
