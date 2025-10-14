'use client';
import React, { useRef, useEffect } from 'react';
import { ProgressBar } from '@/frontend/components/ui/progress/ProgressBar';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface Message {
  speaker: 'bot' | 'user';
  text: string;
}

interface ChatStepRendererProps {
  history: Message[];
  onSend: (message: string) => void;
  isLoadingNextMessage: boolean;
  totalSteps: number;
  currentStepIndex: number;
}

export function ChatStepRenderer({ history, onSend, isLoadingNextMessage, totalSteps, currentStepIndex }: ChatStepRendererProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // --- THIS IS THE FIX for the progress bar ---
  // We now use the `currentStepIndex` from the orchestrator as the source of truth.
  // This ensures the progress bar updates correctly every time a new step begins.
  const currentStep = currentStepIndex + 1;

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-2xl border border-gray-200 shadow-inner">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <ProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepName="Conversation"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {history.map((msg, index) => (
          <ChatMessage key={index} speaker={msg.speaker} text={msg.text} />
        ))}
        {isLoadingNextMessage && (
          <ChatMessage speaker="bot" text="Typing..." />
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="flex-shrink-0 bg-white rounded-b-2xl">
        <ChatInput onSend={onSend} isSending={isLoadingNextMessage} />
      </div>
    </div>
  );
}