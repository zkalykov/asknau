'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import './Demo.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faUpRightFromSquare, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faFile, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';


function Demo() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev); // This ensures we always get the current state
  };

  return (
    <div className="Demo">
      <nav className="navbar">
        <div className="navbar-logo">
          <img src='logo192.png' alt="AskNAU logo" />
          <span>AskNAU</span>
        </div>

        <button className="menu-icon" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>

        <ul className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          <li>
            <a href="https://github.com/zkalykov/asknau" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} style={{ marginRight: '5px' }} />
              Github
            </a>
          </li>
          <li>
            <Link className={'try-now'} href="/chat">
              <FontAwesomeIcon icon={faUpRightFromSquare} style={{ marginRight: '10px' }} />
              Try Now
            </Link>
          </li>
        </ul>
      </nav>

      <h1 className='first-word'>First ever AI assistant for NAU students</h1>
      <h1 className='second-word'>Meet AskNAU</h1>
      <center>
        <Link className={'click-here'} href="/chat">
          <FontAwesomeIcon icon={faUpRightFromSquare} style={{ marginRight: '10px' }} />
          Click here to start
        </Link>
      </center>
      <div className="demo-content">
        <video
          src="/demo_asknau.mov"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '100%', height: 'auto' }}
        />
      </div>


      <div className="can-do">
        <div className="feature">
          <h3>
            <FontAwesomeIcon icon={faFile} style={{ marginRight: '10px' }} />
            Courses
          </h3>
          <p>AskNAU can provide information about courses and its prerequisites.</p>
        </div>
        <div className="feature">
          <h3>
            <FontAwesomeIcon icon={farStar} style={{ marginRight: '10px' }} />
            Grades
          </h3>
          <p>By simply uploading your transcript you can see your GPA or get help with that.</p>
        </div>
        <div className="feature">
          <h3>
            <FontAwesomeIcon icon={faPenToSquare} style={{ marginRight: '10px' }} />
            Plan
          </h3>
          <p>You can plan your career or see what classes you can take for next semester.</p>
        </div>
      </div>




      <h1 className='read-more'>
        <FontAwesomeIcon icon={faArrowDown} style={{ marginRight: '10px' }} />
        Read More
      </h1>
      <div className="how-works">

        <h3>Project idea</h3>
        <p>Reason to create this website, was to help students & teachers to cut their time, doing same things again and again. I have faced several occasions where student ask same questions, where they could search online, but it may be problem to go over a lot of pages and waste time. And I thought creating AI which will be able to search for themselves would be great.</p>
      </div>

      <div className="how-works">

        <h3>Development</h3>
        <p>This is more likely Hybrid AI, It uses both <span className='highlight-yellow'>GPT API</span> and <span className='highlight-yellow'>Local Trained Model</span> from database.</p>
        <p>This project built with React for front-end, Flask for backend, TailwindCSS for style. Uses GPT API and GPT APIs. Used platforms such as <span className='highlight-yellow'>Vercel</span>, <span className='highlight-yellow'>Heroku</span> and Heroku Database, Github.</p>
      </div>

      <div className="how-works">
        <h3>Presentation</h3>
        <img src="chat-first-pic.png" alt="Project Illustration" className="how-works-image" />
        <p>This is first page, made everything simple. It has a profile button to see Profile, Go to New Chat, <span className='highlight-yellow'>History</span>, Demo and of course Log out buttons</p>
        <img src="chat-second-pic.png" alt="Project Illustration" className="how-works-image" />
        <img src="chat-third-pic.png" alt="Project Illustration" className="how-works-image" />
      </div>
      <div className="how-works">
        <h3>Contribution</h3>
        {/* <img src="chat-first-pic.png" alt="Project Illustration" className="how-works-image" /> */}
        <p>Feel free to submit your pull requests on Github. Source code: <a className='highlight-yellow' href="https://github.com/zkalykov/asknau">https://github.com/zkalykov/asknau</a> !</p>
        <p>If you have questions feel free to connect me at <a className='highlight-yellow' href="mailto:zkalykov@na.edu">zkalykov@na.edu</a></p>

      </div>




      <div className="footer">
        © AskNAU. All rights reserved.
      </div>


    </div>
  );
}

export default Demo;
