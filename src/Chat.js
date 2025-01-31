// src/Chat.js

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
  faCircleChevronRight,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

/* -------------------------
 * COPY BUTTON COMPONENT
 * -------------------------
 */
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

/* -------------------------
 * HELPER: WORD-BY-WORD BOT TYPING
 * -------------------------
 */
function typeBotMessage(answer, setMessages, setBotTyping) {
  const words = answer.split(' ');

  // Insert a new, empty bot message
  setMessages((prev) => [
    ...prev,
    { content: '', isUser: false, user_message_type: 'text' },
  ]);

  let index = 0;
  const typingInterval = setInterval(() => {
    setMessages((prev) => {
      const newMessages = [...prev];
      const lastMsgIndex = newMessages.length - 1;
      const oldContent = newMessages[lastMsgIndex].content;
      newMessages[lastMsgIndex].content =
        oldContent + (index === 0 ? '' : ' ') + words[index];
      return newMessages;
    });

    index++;
    if (index >= words.length) {
      clearInterval(typingInterval);
      setBotTyping(false);
    }
  }, 40);
}

/* -------------------------
 * CHAT COMPONENT
 * -------------------------
 */
export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL = 'https://asknau-backend-20d79e207a54.herokuapp.com';

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const [showGoDownButton, setShowGoDownButton] = useState(false);

  // SIDEBAR
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Various states
  const [errorMessage, setErrorMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const chatBodyRef = useRef(null);
  const lastScrollTop = useRef(0);
  const [urlChatId, setUrlChatId] = useState(null);

  const [showImage, setShowImage] = useState(false);
  const toggleImage = () => setShowImage(!showImage);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newChatId = queryParams.get('id');
    setUrlChatId(newChatId);
  }, [location.search]);

  /* SCROLL TO BOTTOM */
  const scrollToBottom = useCallback(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setUserScrolled(false);
    }
  }, []);

  /* FETCH USER PROFILE */
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
    } catch {
      // Silent
    }
  }, [navigate, API_BASE_URL]);

  /* APPEND MESSAGE */
  const appendMessage = (content, isUser = true, user_message_type = 'text') => {
    const stringContent = typeof content === 'object' ? JSON.stringify(content) : content;
    setMessages((prev) => [...prev, { content: stringContent, isUser, user_message_type }]);
  };

  /* SEND MESSAGE */
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
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
        setBotTyping(false);
      } else {
        if (!chatId && data.chat_id) {
          setChatId(data.chat_id);
          navigate(`/chat?id=${data.chat_id}`);
        } else {
          setChatId(data.chat_id);
        }
        typeBotMessage(data.answer, setMessages, setBotTyping);
      }
    } catch (error) {
      appendMessage(`Error here 2: ${error.message}`, false, 'text');
      setBotTyping(false);
    }
  };

  /* HANDLE SCROLL */
  const handleChatBodyScroll = () => {
    const chatBody = chatBodyRef.current;
    const currentScrollTop = chatBody.scrollTop;
    const isAtBottom =
      Math.abs(chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight) < 1;

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

  /* MODALS */
  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalContent('');
    setSelectedFile(null);
  };

  /* HISTORY */
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
    } catch {
      // Silent
    }
  }, [navigate, API_BASE_URL]);

  const handleHistoryClick = (e) => {
    e.preventDefault();
    fetchHistory();
    openModal('History');
    setSidebarOpen(false);
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
            let displayContent =
              m.user_message_type === 'transcript'
                ? 'transcript sent'
                : m.user_message;
            msgs.push({
              content: displayContent,
              isUser: true,
              user_message_type: m.user_message_type || 'text',
            });
          }
          if (m.bot_message) {
            msgs.push({
              content: m.bot_message,
              isUser: false,
              user_message_type: m.user_message_type || 'text',
            });
          }
          return msgs;
        });
        setChatId(id);
        setMessages(loadedMessages);
      } catch {
        // Silent
      }
    },
    [navigate, API_BASE_URL]
  );

  const loadSelectedHistory = (selectedChatId) => {
    setModalOpen(false);
    setMessages([]);
    setChatId(selectedChatId);
    navigate(`/chat?id=${selectedChatId}`);
    loadChatMessages(selectedChatId);
  };

  const handleNewChatClick = (e) => {
    e.preventDefault();
    setChatId(null);
    setMessages([]);
    navigate('/chat');
    setSidebarOpen(false);
  };

  /* PROFILE & LOGOUT */
  const handleLogoutClick = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Silent
      }
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      localStorage.removeItem('token');
      navigate('/login');
    }
    setSidebarOpen(false);
  };

  /* ATTACHMENT */
  const handleAttachmentClick = (e) => {
    e.preventDefault();
    openModal('Attachment');
  };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
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

      const payload = {
        question: 'transcript sent',
        chat_id: chatId || data.chat_id,
        user_message_type: 'transcript',
      };

      try {
        const resp = await fetch(`${API_BASE_URL}/ask`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
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
          setBotTyping(false);
        } else {
          setChatId(respData.chat_id);
          typeBotMessage(respData.answer, setMessages, setBotTyping);
        }
      } catch (error) {
        appendMessage(`Error here 2: ${error.message}`, false, 'text');
        setBotTyping(false);
      }
    } catch {
      // Silent
    }
  };

  /* INIT FETCH */
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  /* AUTO SCROLL */
  useEffect(() => {
    if (!userScrolled) {
      scrollToBottom();
    }
  }, [messages, userScrolled, scrollToBottom]);

  const noChatSelected = !chatId && messages.length === 0;

  return (
    <div className="app-container text-gray-300 flex items-center justify-center h-full">
      {/* SIDEBAR OVERLAY */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-body">
          <button className="sidebar-item" onClick={handleNewChatClick}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '10px' }} />
            New Chat
          </button>

          <button className="sidebar-item" onClick={handleHistoryClick}>
            <FontAwesomeIcon icon={faClockRotateLeft} style={{ marginRight: '10px' }} />
            History
          </button>
        </div>

        <div className="sidebar-footer">
          <button
            className="sidebar-item"
            onClick={() => {
              openModal('Profile');
              setSidebarOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
            Profile
          </button>

          <button
            className="sidebar-item"
            onClick={(e) => {
              e.preventDefault();
              navigate('/demo');
              setSidebarOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faPlay} style={{ marginRight: '10px' }} />
            Demo
          </button>

          <button className="sidebar-item sidebar-item-logout" onClick={handleLogoutClick}>
            <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: '10px' }} />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full h-full flex flex-col max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="header">
          {/* NAU AI on the left */}
          <div>
            <span
              className="text-2xl font-bold"
              style={{ color: 'rgba(6,147,227,1)' }}
            >
              NAU AI
            </span>
          </div>

          {/* Toggle button on the right (bars <-> times) */}
          <div style={{ marginLeft: 'auto' }}>
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <FontAwesomeIcon icon={faTimes} />
              ) : (
                <FontAwesomeIcon icon={faBars} />
              )}
            </button>
          </div>
        </div>

        {/* CHAT BODY */}
        <div
          className="chat-body flex flex-col p-4 space-y-4 overflow-y-auto"
          ref={chatBodyRef}
          onScroll={handleChatBodyScroll}
        >
          {noChatSelected && (
            <div className="flex items-center justify-center h-full text-3xl opacity-80">
              Say Hello to AskNAU !
            </div>
          )}

          {!noChatSelected &&
            messages.map((message, index) => {
              const messageClass = message.isUser
                ? 'user-message'
                : 'bot-message';
              return (
                <div key={index} className={`message ${messageClass}`}>
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
              );
            })}
        </div>

        {/* FOOTER */}
        <div className="chat-footer p-4 flex flex-col items-center space-y-2">
          {errorMessage && (
            <div className="error-message text-red-600 text-sm">
              {errorMessage}
            </div>
          )}
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
            <button onClick={sendMessage} className="rounded-r-md">
              <FontAwesomeIcon
                icon={faCircleChevronRight}
                size="xl"
                className="background-grey"
              />
            </button>
          </div>
          <div className="disclaimer">
            This is early version. Please check information before use !!!
          </div>
        </div>

        {/* GO-DOWN BUTTON */}
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

      {/* MODAL OVERLAY */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title font-bold">
              {modalContent === 'Profile'
                ? 'Profile'
                : modalContent === 'History'
                ? 'History'
                : 'Attachment'}
            </h2>

            {/* PROFILE MODAL */}
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

            {/* HISTORY MODAL */}
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

            {/* ATTACHMENT MODAL */}
            {modalContent === 'Attachment' && (
              <div className="modal-content space-y-6 p-6 bg-[#4b4b4b] text-[#fff] rounded-lg shadow-lg">
                <h1 className="text-xl font-semibold text-center">
                  Upload Transcript for ASKNAU AI
                </h1>
                <p className="text-sm text-[#fff] text-center">
                  Please upload the correct transcript as shown in the example.
                  This will help ASKNAU AI process information about your grades,
                  major, and more.
                </p>

                <div className="flex flex-col items-center space-y-4">
                  <button
                    onClick={toggleImage}
                    className="block text-center text-[#fff] border border-[#fff] rounded-lg p-2 cursor-pointer hover:bg-[#4b4b4b] transition"
                  >
                    {showImage ? 'Hide Example' : 'Show Example'}
                  </button>

                  {showImage && (
                    <div className="flex justify-center mt-4">
                      <img
                        src="https://i.imgur.com/JcNsvaX.png"
                        alt="Transcript Example"
                        className="rounded-lg shadow-md max-w-full"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <label
                    htmlFor="fileInput"
                    className="block text-center text-[#fff] border border-[#fff] rounded-lg p-2 cursor-pointer hover:bg-[#4b4b4b] transition"
                  >
                    Select a Transcript File
                    <input
                      type="file"
                      id="fileInput"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {selectedFile && (
                    <p
                      className="text-sm"
                      style={{ color: 'rgba(6, 147, 227, 1)' }}
                    >
                      Selected file:{' '}
                      <span className="font-semibold">{selectedFile.name}</span>
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
            <button onClick={closeModal} className="modal-close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}