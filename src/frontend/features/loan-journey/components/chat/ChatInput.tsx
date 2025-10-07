'use client';
import React, { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isSending: boolean;
}

export function ChatInput({ onSend, isSending }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isSending) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 border-t border-gray-200">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type your answer here..."
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mv-gree-dark"
        disabled={isSending}
      />
      <button
        onClick={handleSend}
        disabled={isSending || !message.trim()}
        className="px-6 py-3 bg-mv-green-dark text-white font-semibold rounded-lg hover:bg-mv-green-dark disabled:bg-gray-400 transition-colors"
      >
        Send
      </button>
    </div>
  );
}