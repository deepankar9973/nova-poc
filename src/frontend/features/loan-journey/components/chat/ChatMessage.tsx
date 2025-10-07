'use client';
import React from 'react';
import Image from 'next/image'; // <-- 1. IMPORT THE IMAGE COMPONENT

interface ChatMessageProps {
  speaker: 'bot' | 'user';
  text: string;
}

// --- 2. UPDATE THE BOT ICON TO USE YOUR IMAGE ---
const BotIcon = () => (
  // The outer div creates the circular shape and size
  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
    <Image
      src="/MV-artha-ai-logo-small.png" // The path starts from the 'public' folder
      alt="MoneyView Bot"
      width={32} // The size should match the container
      height={32}
    />
  </div>
);

// The UserIcon remains the same
const UserIcon = () => (
  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 text-white">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  </div>
);

// The rest of the file remains exactly the same
export function ChatMessage({ speaker, text }: ChatMessageProps) {
  const isBot = speaker === 'bot';
  
  return (
    <div className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'flex-row-reverse'}`}>
      <div className="mt-1">
        {isBot ? <BotIcon /> : <UserIcon />}
      </div>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isBot
            ? 'bg-white text-mv-text-heading shadow-sm'
            : 'bg-gray-200 text-mv-text-heading'
        }`}
      >
        <p className="text-base leading-relaxed">{text}</p>
      </div>
    </div>
  );
}