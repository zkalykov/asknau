// src/CopyButton.js
import React, { useState } from 'react';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      className="copy-button"
      onClick={copyToClipboard}
      data-tooltip={copied ? 'Copied!' : 'Copy'}
    >
      {/* Copy Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="copy-icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16h8M8 12h6M8 8h4M4 20h16V4H4v16z"
        />
      </svg>
    </button>
  );
}

export default CopyButton;
