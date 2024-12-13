// Chat.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Chat.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faPlay,
  faRightFromBracket,
  faClockRotateLeft,
  faPlus,
  faPaperclip,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      alert('Failed to copy text.');
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
          <path d="M2 8a2 2 0 012-2h8a 2 2 0 012 2v8a 2 2 0 01-2 2H4a2 2 0 01-2-2V8z"></path>
        </svg>
      )}
    </button>
  );
}

function Chat() {
  const navigate = useNavigate();
  const location = useLocation();

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const [showGoDownButton, setShowGoDownButton] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatId, setChatId] = useState(null);

  const lastScrollTop = useRef(0);
  const chatBodyRef = useRef(null);
  const profileMenuRef = useRef(null);
  const [urlChatId, setUrlChatId] = useState(null);

  const API_BASE_URL = 'https://asknau-backend-20d79e207a54.herokuapp.com/';

  // Parse chat ID from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newChatId = queryParams.get('id');
    setUrlChatId(newChatId);
  }, [location.search]);

  const scrollToBottom = useCallback(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      });
      setUserScrolled(false);
    }
  }, []);

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent('');
  };

  // Fetch user profile function
  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
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
  }, [navigate]);

  const appendMessage = (content, isUser = true) => {
    setMessages((prev) => [...prev, { content, isUser }]);
  };

  const sendMessage = async () => {
    if (botTyping) return;
    const msg = inputValue.trim();
    if (!msg) return;
    if (msg.length > 2000) {
      setErrorMessage('Message cannot exceed 2000 characters.');
      return;
    }
    setErrorMessage('');
    appendMessage(msg, true);
    setInputValue('');

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setBotTyping(true);

    try {
      console.log('Sending message:', { question: msg, chat_id: chatId });
      console.log('Using token:', token);
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: msg, chat_id: chatId }),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);

      const data = await response.json();
      if (data.error) {
        appendMessage(`Error here: ${data.error}`, false);
      } else {
        setChatId(data.chat_id);
        appendMessage(data.answer, false);
      }
    } catch (error) {
      appendMessage(`Error here 2: ${error.message}`, false);
    } finally {
      setBotTyping(false);
    }
  };

  const handleChatBodyScroll = () => {
    const chatBody = chatBodyRef.current;
    const currentScrollTop = chatBody.scrollTop;
    const isAtBottom =
      Math.abs(chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight) <
      1;

    if (currentScrollTop > lastScrollTop.current && !isAtBottom) {
      if (userScrolled) setShowGoDownButton(true);
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

  const fetchHistory = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/history`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) return;
      const data = await response.json();
      setChatHistory(data.history || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  }, [navigate]);

  const handleHistoryClick = (e) => {
    e.preventDefault();
    fetchHistory();
    openModal('History');
    setProfileMenuOpen(false);
  };

  const handleNewChatClick = (e) => {
    e.preventDefault();
    setChatId(null);
    setMessages([]);
    navigate('/chat');
    setProfileMenuOpen(false);
  };

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      localStorage.removeItem('token');
      navigate('/login');
    }
    setProfileMenuOpen(false);
  };

  const loadSelectedHistory = (selectedChatId) => {
    setModalOpen(false);
    setMessages([]);
    setChatId(selectedChatId);
    navigate(`/chat?id=${selectedChatId}`);
  };

  const loadChatMessages = useCallback(
    async (id) => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/chats/${id}/messages`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch chat messages');

        const data = await response.json();
        const loadedMessages = data.messages.flatMap((m) => {
          const msgs = [];
          if (m.user_message) {
            msgs.push({ content: m.user_message, isUser: true });
          }
          if (m.bot_message) {
            msgs.push({ content: m.bot_message, isUser: false });
          }
          return msgs;
        });

        setChatId(id);
        setMessages(loadedMessages);
      } catch (err) {
        console.error('Error fetching chat messages:', err);
      }
    },
    [navigate]
  );

  const sendWelcomeMessage = useCallback(() => {
    setMessages([
      {
        content: 'Hello! Welcome to AskNAU. How can I assist you today?',
        isUser: false,
      },
    ]);
  }, []);

  // Handle Attachment Button Click
  const handleAttachmentClick = (e) => {
    e.preventDefault();
    openModal('Attachment');
  };

  // Close profile menu when clicking outside
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

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Load chat messages when urlChatId changes
  useEffect(() => {
    if (urlChatId) {
      setMessages([]);
      loadChatMessages(urlChatId);
    } else {
      setChatId(null);
      sendWelcomeMessage();
    }
  }, [urlChatId, loadChatMessages, sendWelcomeMessage]);

  // Scroll to bottom when messages change, unless user scrolled up
  useEffect(() => {
    if (!userScrolled) scrollToBottom();
  }, [messages, userScrolled, scrollToBottom]);

  return (
    <div className="app-container text-gray-300 flex items-center justify-center h-full">
      <div className="w-full h-full flex flex-col max-w-4xl mx-auto">
        {/* Chat Header */}
        <div className="chat-header p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold">AskNAU</span>
            <span
              style={{ color: 'rgba(6,147,227,1)' }}
              className="text-xl font-normal ml-2"
            >
              (North American University AI)
            </span>
          </div>
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
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700"
              >
                <button
                  className="block px-4 py-2 text-left w-full arkasy"
                  onClick={(e) => {
                    e.preventDefault();
                    openModal('Profile');
                    setProfileMenuOpen(false);
                  }}
                >
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
                  Profile
                </button>
                <button
                  className="block px-4 py-2 text-left w-full arkasy"
                  onClick={handleNewChatClick}
                >
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: '10px' }} />
                  New Chat
                </button>
                <button
                  className="block px-4 py-2 text-left w-full arkasy"
                  onClick={handleHistoryClick}
                >
                  <FontAwesomeIcon
                    icon={faClockRotateLeft}
                    style={{ marginRight: '10px' }}
                  />
                  History
                </button>
                <button
                  className="block px-4 py-2 text-left w-full arkasy"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/demo');
                    setProfileMenuOpen(false);
                  }}
                >
                  <FontAwesomeIcon icon={faPlay} style={{ marginRight: '10px' }} />
                  Demo
                </button>
                <button
                  className="block px-4 py-2 text-left w-full arkasy"
                  onClick={handleLogoutClick}
                >
                  <FontAwesomeIcon
                    icon={faRightFromBracket}
                    style={{ marginRight: '10px' }}
                  />
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
              className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
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
          {botTyping && (
            <div className="message bot-message">
              <div className="message-wrapper">
                <div className="message-content">Thinking...</div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Footer */}
        <div className="chat-footer p-4 flex flex-col items-center space-y-2">
          {errorMessage && (
            <div className="error-message text-red-600 text-sm">{errorMessage}</div>
          )}
          <div className="input-container flex-1 w-full flex items-center">
            <button
              onClick={handleAttachmentClick}
              className="p-2 bg-blue-600 rounded-l-md"
            >
              <FontAwesomeIcon icon={faPaperclip} className="text-white" />
            </button>
            
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
              className="flex-grow p-2 bg-gray-800 text-white rounded-l-full"
            />
            
            <button
              onClick={() => sendMessage()}
              className="p-2 bg-blue-600 rounded-r-md"
            >
              <FontAwesomeIcon icon={faAngleRight} className="text-white" />
            </button>
          </div>
          <div className="disclaimer">@ AskNAU - 2024</div>
        </div>

        {/* Go Down Button */}
        {showGoDownButton && (
          <button className="go-down-button" onClick={scrollToBottom}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        )}
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title font-bold">
              {modalContent === 'Profile' ? 'Profile' : modalContent === 'History' ? 'History' : 'Attachment'}
            </h2>
            {modalContent === 'Profile' && (
              <div className="space-y-4 modal-content">
                <p>
                  <span className="font-semibold">Name:</span> {userName}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {userEmail}
                </p>
                <div className="disclaimer">
                  For profile questions, contact zkalykov@na.edu
                </div>
              </div>
            )}
            {modalContent === 'History' && (
              <div className="space-y-4 modal-content">
                {chatHistory && chatHistory.length > 0 ? (
                  chatHistory.map((h, idx) => (
                    <div
                      key={idx}
                      className="arkasy p-2 rounded cursor-pointer history-item"
                      onClick={() => loadSelectedHistory(h.chat_id)}
                    >
                      {h.history_title}
                      {h.title ? ` - ${h.title}` : ''} -{' '}
                      {h.date_created
                        ? new Date(h.date_created).toLocaleString()
                        : ''}
                    </div>
                  ))
                ) : (
                  <div>No history found.</div>
                )}
              </div>
            )}
            {modalContent === 'Attachment' && (
              <div className="space-y-4 modal-content">
                <h1>This is used only for reading TRANSCRIPT !<br></br>As you see on an example, please upload right transcript.<br></br>This will be used to give information to ASKNAU ai about your grade, major and more.</h1>
                <img src="https://i.imgur.com/JcNsvaX.png" alt="Transcript" className="attachment-image" />
                
                {/* File input for uploading transcript */}
                <input type="file" id="fileInput" accept=".pdf"  />
                <button>Send Transcript</button>

                
              </div>
            )}
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