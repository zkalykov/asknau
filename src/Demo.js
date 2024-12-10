import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Demo.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faUpRightFromSquare, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faFile, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


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
            <Link className={'try-now'} to="/chat">
              <FontAwesomeIcon icon={faUpRightFromSquare} style={{ marginRight: '10px' }} />
              Try Now
            </Link>
          </li>
        </ul>
      </nav>

      <h1 className='first-word'>First ever AI assistant for NAU students</h1>
      <h1 className='second-word'>Meet AskNAU</h1>
      <center>
        <Link className={'click-here'} to="/chat">
          <FontAwesomeIcon icon={faUpRightFromSquare} style={{ marginRight: '10px' }} />
          Click here to start
        </Link>
      </center>
      <div className="demo-content">
        <video autoPlay muted loop playsInline>
          <source src="https://download-video-ak.vimeocdn.com/v3-1/playback/857629e2-d70c-4660-8c77-fb33b595e17c/efe429d6-7a7c76c8?__token__=st=1733815200~exp=1733829600~acl=%2Fv3-1%2Fplayback%2F857629e2-d70c-4660-8c77-fb33b595e17c%2Fefe429d6-7a7c76c8%2A~hmac=232230e8aa1d0e98aee2b7e06984ae0d3b3e1708726f49773d62f6521256a159&r=dXMtd2VzdDE%3D" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>


      <div className="can-do">
        <div className="feature">
          <h3>
            <FontAwesomeIcon icon={faFile}style={{ marginRight: '10px' }}  />
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

      <h1 className='first-word' style={{paddingBottom:'20px'}}>
      <FontAwesomeIcon icon={faArrowDown} style={{ marginRight: '10px' }} />
        Watch Demo
      </h1>

      <div className="youtube-video-wrapper">
        <iframe
          className="youtube-video"
          src="https://www.youtube.com/embed/HK6y8DAPN_0"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>


      <h1 className='first-word'>
        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '10px'}}/>
          Read More
        </h1>
      <div className="how-works">

        <h3>Project Idea</h3>
        <p>This project founded by Zhyrgalbek Kalykov and supervised by Sabina Akhikary. Every year we have seen students asking same question again and again, and waiting days or weeks to get info, so we stored thousands of questions and fine tuned GPT so now it can answer them.</p>
        
        
      </div>


      <div className="footer">
        © AskNAU. All rights reserved.
      </div>

      
    </div>
  );
}

export default Demo;
