// src/Chat.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      } catch (err) {
        alert('Failed to copy text.');
      }
      document.body.removeChild(textArea);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      alert('Failed to copy text. Your browser may not support this feature.');
    }
  };

  return (
    <button
      className="copy-button"
      aria-label={copied ? 'Text copied' : 'Copy text'}
      data-tooltip={copied ? 'Copied' : 'Copy'}
      onClick={handleCopy}
    >
      {copied ? (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M16.707 5.293a1 1 0 00-1.414 0L7.5 13.086l-2.793-2.793a1 1 0 00-1.414 1.414l3.5 3.5a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"></path>
        </svg>
      ) : (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 2a2 2 0 00-2 2v2h2V4h8v8h-2v2h2a 2 2 0 002-2V4a 2 2 0 00-2-2H8z"></path>
          <path d="M2 8a2 2 0 012-2h8a 2 2 0 012 2v8a 2 2 0 01-2 2H4a 2 2 0 01-2-2V8z"></path>
        </svg>
      )}
    </button>
  );
}

function Chat() {
  // State variables
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const [showGoDownButton, setShowGoDownButton] = useState(false);
  const lastScrollTop = useRef(0);
  const chatBodyRef = useRef(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const profileMenuRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  // Add state variables for user information
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const navigate = useNavigate();

  function openModal(content) {
    setModalContent(content);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setModalContent('');
  }

  // Fetch user profile function
  const fetchUserProfile = useCallback(
    async (token) => {
      try {
        const response = await fetch('https://asknau-backend-20d79e207a54.herokuapp.com/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        setUserName(data.full_name);
        setUserEmail(data.email);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    },
    [navigate]
  );

  const sendWelcomeMessage = useCallback(() => {
    const welcomeMessage =
      'Hello! And welcome to AskNAU. How can I assist you today?';
    appendMessage(welcomeMessage, false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      sendWelcomeMessage();
      fetchUserProfile(token); // Fetch user profile
    }
  }, [navigate, sendWelcomeMessage, fetchUserProfile]);

  useEffect(() => {
    if (!userScrolled) {
      scrollToBottom();
    }
  }, [messages, userScrolled]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        event.target.nodeName !== 'IMG'
      ) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const appendMessage = (content, isUser = true) => {
    if (isUser) {
      setMessages((prevMessages) => [...prevMessages, { content, isUser }]);
    } else {
      typeBotMessage(content);
    }
  };

  const typeBotMessage = (fullContent) => {
    setBotTyping(true);
    const words = fullContent.split(' ');
    let i = 0;
    const speed = 50;

    setMessages((prevMessages) => [
      ...prevMessages,
      { content: '', isUser: false },
    ]);

    const typingInterval = setInterval(() => {
      if (i < words.length) {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const newContent =
            (lastMessage.content ? lastMessage.content + ' ' : '') + words[i];
          const updatedMessages = [
            ...prevMessages.slice(0, -1),
            { ...lastMessage, content: newContent },
          ];
          return updatedMessages;
        });
        i++;
      } else {
        clearInterval(typingInterval);
        setBotTyping(false);
      }
    }, speed);
  };

  const sendMessage = async (message = null) => {
    if (botTyping) return;

    const msg = message || inputValue;
    if (msg.trim() === '') return;

    if (msg.length > 2000) {
      setErrorMessage('Message cannot exceed 2000 characters.');
      return;
    } else {
      setErrorMessage('');
    }

    appendMessage(msg, true);
    if (!message) {
      setInputValue('');
    }

    setBotTyping(true);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('https://asknau-backend-20d79e207a54.herokuapp.com/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: msg }),
      });

      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        appendMessage(`Error: ${data.error}`, false);
      } else {
        typeBotMessage(data.answer);
      }
    } catch (error) {
      appendMessage(`Error: ${error.message}`, false);
    }
  };

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setUserScrolled(false);
    }
  };

  const handleChatBodyScroll = () => {
    const chatBody = chatBodyRef.current;
    const currentScrollTop = chatBody.scrollTop;
    const isAtBottom =
      Math.abs(
        chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight
      ) < 1;

    if (currentScrollTop > lastScrollTop.current && !isAtBottom) {
      if (userScrolled) {
        setShowGoDownButton(true);
      }
    } else if (isAtBottom) {
      setShowGoDownButton(false);
      setUserScrolled(false);
    } else {
      setUserScrolled(true);
      setShowGoDownButton(false);
    }
    lastScrollTop.current = currentScrollTop;
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  return (
    <div className="app-container text-gray-300 flex items-center justify-center h-full">
      <div className="w-full h-full flex flex-col max-w-4xl mx-auto">
        {/* Chat Header */}
        <div className="chat-header p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold">AskNAU</span>
            <span
              style={{ color: 'rgba(6,147,227,1)' }}
              className="text-x font-normal ml-2"
            >
              (North American University AI)
            </span>
          </div>
          {/* Profile Picture and Menu */}
          <div className="relative">
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt="User profile"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={toggleProfileMenu}
            />
            {profileMenuOpen && (
              <div
                id="profile-menu"
                ref={profileMenuRef}
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg"
              >
                <button
                  className="block px-4 py-2 hover:bg-gray-700 text-left w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    openModal('Profile');
                    setProfileMenuOpen(false);
                  }}
                >
                  Profile
                </button>
                <button
                  className="block px-4 py-2 hover:bg-gray-700 text-left w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/demo'); // Redirect to Demo page
                    setProfileMenuOpen(false);
                  }}
                >
                  Demo
                </button>
                <button
                  className="block px-4 py-2 hover:bg-gray-700 text-left w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle logout
                    localStorage.removeItem('token');
                    navigate('/login');
                    setProfileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Chat Body */}
        <div
          className="chat-body flex flex-col p-4 space-y-4 overflow-y-auto"
          ref={chatBodyRef}
          onScroll={handleChatBodyScroll}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.isUser ? 'user-message' : 'bot-message'
              }`}
            >
              {message.isUser ? (
                message.content
              ) : (
                <div className="message-wrapper">
                  <div className="message-content">{message.content}</div>
                  <CopyButton text={message.content} />
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Chat Footer */}
        <div className="chat-footer p-4 flex flex-col items-center space-y-2">
          {errorMessage && (
            <div className="error-message text-red-600 text-sm">
              {errorMessage}
            </div>
          )}
          <div className="input-container flex-1 w-full flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                if (e.target.value.length <= 2000) {
                  setInputValue(e.target.value);
                  setErrorMessage('');
                } else {
                  setErrorMessage('Message cannot exceed 2000 characters.');
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Message AskNAU..."
              autoComplete="off"
              className="flex-grow p-2 rounded-l-md bg-gray-800 text-white"
            />
            <button
              onClick={() => sendMessage()}
              className="p-2 bg-blue-600 rounded-r-md"
            >
              {/* Arrow SVG */}
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>

          {/* Disclaimer */}
          <div className="disclaimer">@ AskNAU - 2024</div>
        </div>
        {/* Scroll to Bottom Button */}
        {showGoDownButton && (
          <button className="go-down-button" onClick={scrollToBottom}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
        )}
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title font-bold">{modalContent}</h2>
            {/* Content based on modalContent */}
            {modalContent === 'Profile' && (
              <div className="space-y-4">
                <p>
                  <span className="font-semibold">Name:</span> {userName}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {userEmail}
                </p>
              </div>
            )}

            {/* Remove the 'More' modal content since we now redirect to Demo */}
            <button onClick={closeModal} className="modal-close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
