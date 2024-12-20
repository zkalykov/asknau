// src Chat.js

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
    } catch {
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

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL = 'https://asknau-backend-20d79e207a54.herokuapp.com';

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
  const [selectedFile, setSelectedFile] = useState(null);

  const chatBodyRef = useRef(null);
  const profileMenuRef = useRef(null);
  const lastScrollTop = useRef(0);

  const [urlChatId, setUrlChatId] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newChatId = queryParams.get('id');
    setUrlChatId(newChatId);
  }, [location.search]);

  const scrollToBottom = useCallback(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' });
      setUserScrolled(false);
    }
  }, []);

  

  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      const data = await response.json();
      setUserName(data.full_name);
      setUserEmail(data.email);
    } catch {}
  }, [navigate, API_BASE_URL]);

  const appendMessage = (content, isUser = true, user_message_type = 'text') => {
    const stringContent = typeof content === 'object' ? JSON.stringify(content) : content;
    setMessages((prev) => [...prev, { content: stringContent, isUser, user_message_type }]);
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
    appendMessage(msg, true, 'text');
    setInputValue('');
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setBotTyping(true);
    const payload = { question: msg, chat_id: chatId, user_message_type: 'text' };
    try {
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      const data = await response.json();
      if (data.error) {
        appendMessage(`Error here: ${data.error}`, false, 'text');
      } else {
        if (!chatId && data.chat_id) {
          setChatId(data.chat_id);
          navigate(`/chat?id=${data.chat_id}`);
        } else {
          setChatId(data.chat_id);
        }
        appendMessage(data.answer, false, 'text');
      }
    } catch (error) {
      appendMessage(`Error here 2: ${error.message}`, false, 'text');
    } finally {
      setBotTyping(false);
    }
  };

  const handleChatBodyScroll = () => {
    const chatBody = chatBodyRef.current;
    const currentScrollTop = chatBody.scrollTop;
    const isAtBottom = Math.abs(chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight) < 1;
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

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent('');
    setSelectedFile(null);
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
    } catch {}
  }, [navigate, API_BASE_URL]);

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
      } catch {}
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      localStorage.removeItem('token');
      navigate('/login');
    }
    setProfileMenuOpen(false);
  };

  // Reintroduce loadChatMessages for history selection
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
            let displayContent = m.user_message_type === 'transcript' ? 'transcript sent' : m.user_message;
            msgs.push({ content: displayContent, isUser: true, user_message_type: m.user_message_type || 'text' });
          }
          if (m.bot_message) {
            msgs.push({ content: m.bot_message, isUser: false, user_message_type: m.user_message_type || 'text' });
          }
          return msgs;
        });
        setChatId(id);
        setMessages(loadedMessages);
      } catch {}
    },
    [navigate, API_BASE_URL]
  );

  const loadSelectedHistory = (selectedChatId) => {
    setModalOpen(false);
    setMessages([]);
    setChatId(selectedChatId);
    navigate(`/chat?id=${selectedChatId}`);
    // Load the messages for the selected history chat
    loadChatMessages(selectedChatId);
  };

  const handleAttachmentClick = (e) => {
    e.preventDefault();
    openModal('Attachment');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSendTranscript = async () => {
    if (!selectedFile) return;
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    if (chatId) formData.append('chat_id', chatId);
    try {
      const response = await fetch(`${API_BASE_URL}/attachment-transcript`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      const data = await response.json();
      if (!chatId && data.chat_id) {
        setChatId(data.chat_id);
        navigate(`/chat?id=${data.chat_id}`);
      }
      closeModal();
      appendMessage('transcript sent', true, 'transcript');
      setBotTyping(true);
      const payload = { question: 'transcript sent', chat_id: chatId || data.chat_id, user_message_type: 'transcript' };
      try {
        const resp = await fetch(`${API_BASE_URL}/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
        if (resp.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        if (!resp.ok) throw new Error(`Server error: ${resp.statusText}`);
        const respData = await resp.json();
        if (respData.error) {
          appendMessage(`Error here: ${respData.error}`, false, 'text');
        } else {
          setChatId(respData.chat_id);
          appendMessage(respData.answer, false, 'text');
        }
      } catch (error) {
        appendMessage(`Error here 2: ${error.message}`, false, 'text');
      } finally {
        setBotTyping(false);
      }
    } catch {}
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target) && event.target.nodeName !== 'IMG') {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Removed the automatic loading on URL chat ID change, to preserve array-list style for new chats

  useEffect(() => {
    if (!userScrolled) scrollToBottom();
  }, [messages, userScrolled, scrollToBottom]);

  const noChatSelected = !chatId && messages.length === 0;

  
  return (
    <div className="app-container text-gray-300 flex items-center justify-center h-full">
      <div className="w-full h-full flex flex-col max-w-4xl mx-auto">
        <div className="chat-header p-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold">AskNAU</span>
            <span style={{ color: 'rgba(6,147,227,1)' }} className="text-x font-normal ml-2">
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
                <button className="block px-4 py-2 text-left w-full arkasy" onClick={handleNewChatClick}>
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: '10px' }} />
                  New Chat
                </button>
                <button className="block px-4 py-2 text-left w-full arkasy" onClick={handleHistoryClick}>
                  <FontAwesomeIcon icon={faClockRotateLeft} style={{ marginRight: '10px' }} />
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
                <button className="block px-4 py-2 text-left w-full arkasy" onClick={handleLogoutClick}>
                  <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: '10px' }} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="chat-body flex flex-col p-4 space-y-4 overflow-y-auto" ref={chatBodyRef} onScroll={handleChatBodyScroll}>
          {noChatSelected && (
            <div className="flex items-center justify-center h-full text-3xl opacity-80">
              Say Hello to AskNAU !
            </div>
          )}

          {!noChatSelected &&
            messages.map((message, index) => (
              <div key={index} className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
                {message.isUser ? (
                  message.user_message_type === 'transcript' ? (
                    <span className="transcript-message">transcript sent</span>
                  ) : (
                    message.content
                  )
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
                <div className="message-content">...</div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-footer p-4 flex flex-col items-center space-y-2">
          {errorMessage && <div className="error-message text-red-600 text-sm">{errorMessage}</div>}
          <div className="input-container flex-1 w-full flex items-center">
            <a onClick={handleAttachmentClick} className="attachment-button">
              <FontAwesomeIcon icon={faPaperclip} className="text-white" />
            </a>
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
            <button onClick={sendMessage} className="p-2 bg-blue-600 rounded-r-md">
              <FontAwesomeIcon icon={faAngleRight} className="text-white" />
            </button>
          </div>
          <div className="disclaimer">@ AskNAU - 2024</div>
        </div>

        {showGoDownButton && (
          <button className="go-down-button" onClick={scrollToBottom}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        )}
      </div>

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
                <div className="disclaimer">For profile questions, contact zkalykov@na.edu</div>
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
                      {h.title ? ` - ${h.title}` : ''} - {h.date_created ? new Date(h.date_created).toLocaleString() : ''}
                    </div>
                  ))
                ) : (
                  <div>No history found.</div>
                )}
              </div>
            )}

            {modalContent === 'Attachment' && (
              <div className="modal-content space-y-6 p-6 bg-[#4b4b4b] text-[#fff] rounded-lg shadow-lg">
                <h1 className="text-xl font-semibold text-center">Upload Transcript for ASKNAU AI</h1>
                <p className="text-sm text-[#fff] text-center">
                  Please upload the correct transcript as shown in the example. This will help ASKNAU AI process
                  information about your grades, major, and more.
                </p>
                <div className="flex justify-center">
                  <img src="https://i.imgur.com/JcNsvaX.png" alt="Transcript Example" className="rounded-lg shadow-md max-w-full" />
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <label
                    htmlFor="fileInput"
                    className="block text-center text-[#fff] border border-[#fff] rounded-lg p-2 cursor-pointer hover:bg-[#4b4b4b] transition"
                  >
                    Select a Transcript File
                    <input type="file" id="fileInput" accept=".pdf" onChange={handleFileChange} className="hidden" />
                  </label>
                  {selectedFile && (
                    <p className="text-sm" style={{ color: 'rgba(6, 147, 227, 1)' }}>
                      Selected file: <span className="font-semibold">{selectedFile.name}</span>
                    </p>
                  )}
                  <button
                    onClick={handleSendTranscript}
                    className="py-2 px-4 rounded-md shadow-md transition"
                    style={{ color: '#fff', backgroundColor: 'rgba(6,147,227,1)' }}
                  >
                    Send Transcript
                  </button>
                </div>
              </div>
            )}

            <button onClick={closeModal} className="modal-close-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
