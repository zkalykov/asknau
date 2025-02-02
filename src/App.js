// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './Chat';
import Login from './Login';
import Register from './Register';
import Demo from './Demo';
<<<<<<< HEAD
import NotFound from './NotFound'; // Import the NotFound component
import ForgotPassword from './ForgotPassword';
import EditProfile from './EditProfile';  // Import the EditProfile component
=======
import NotFound from './NotFound';
import ForgotPassword from './ForgotPassword'; // Import ForgotPassword
>>>>>>> 10f5394c8f617945cdfb23032e702f120a344d6a

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Demo />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/demo" element={<Demo />} />
<<<<<<< HEAD
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/edit-profile" element={<EditProfile />} /> {/* New Route */}
=======
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add Forgot Password Route */}
>>>>>>> 10f5394c8f617945cdfb23032e702f120a344d6a
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;