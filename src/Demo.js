// src/Demo.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Demo.css'; // Import the new CSS file

function Demo() {
  return (
    <div className="demo-page">
      <div className="demo-container">
        {/* Header */}
        <div className="demo-header">
          <div className="flex items-center">
            <span className="demo-title">Welcome to AskNAU</span>
          </div>
          {/* Navigation */}
          <div className="demo-navigation">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            {/* Try Now Button */}
            <Link to="/chat" className="try-button">
              Try Now
            </Link>
          </div>
        </div>
        {/* Video Section */}
        <div>
          <div className="video-container">
            <iframe
              src="https://www.youtube.com/embed/ujw0dVzNE_w9V2FN"
              title="AskNAU Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        {/* Description */}
        <div className="demo-description">
          <p>
            <strong>AskNAU</strong> is your AI-powered assistant designed to help you navigate the North American University experience. Whether you have questions about admissions, courses, campus life, or need guidance on academic resources, AskNAU is here to provide accurate and timely information.
          </p>
          <p>
            Built using advanced AI technology, AskNAU understands your queries and delivers personalized responses. Our goal is to enhance your university journey by making information more accessible and interactions more engaging.
          </p>
          <p>
            Get started by registering an account or logging in if you already have one. Experience the convenience of having a virtual assistant at your fingertips!
          </p>
        </div>
        {/* More Section */}
        <div className="demo-section">
          <h2 className="section-title">More</h2>
          <p>
            AskNAU is a specialized AI model designed to assist students at North American universities by answering their questions accurately and efficiently. This fine-tuned system is crafted to handle a wide range of academic and campus-related queries with contextual relevance and reliability.
          </p>
          <p>
            The development team includes <span>Software Engineer Zhyrgalbek Kalykov</span>, <span>Supervisor Sabina Adhikari</span>, and <span>Designer Ayana Ibragim Kyzy</span>, who have worked together to ensure AskNAU’s technical precision and user-friendly experience.
          </p>
        </div>
        {/* Policies Section */}
        <div className="demo-section">
          <h2 className="section-title">Policies</h2>
          <p>
            AskNAU tracks IP addresses to monitor usage, allowing up to <span className="font-bold">10 daily messages per user</span>. This ensures fair access and optimal performance for all.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Demo;
