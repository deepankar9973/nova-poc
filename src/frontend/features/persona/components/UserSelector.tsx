'use client';
import React, { useState } from 'react';
import { PERSONAS } from '../data';
import { Persona } from '../types';

interface UserSelectorProps {
  onGenerate: (persona: Persona) => void;
  isLoading: boolean;
}

export function UserSelector({ onGenerate, isLoading }: UserSelectorProps) {
  const [selectedId, setSelectedId] = useState<string>('');

  const handleGenerateClick = () => {
    const selectedPersona = PERSONAS.find(p => p.id === selectedId);
    if (selectedPersona) {
      onGenerate(selectedPersona);
    }
  };

  return (
    <div className="flex items-center gap-2 md:gap-3 w-full">
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        disabled={isLoading}
        className="block w-full px-3 py-2 md:py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mv-green-dark focus:border-mv-green-dark text-sm"
      >
        <option value="" disabled>Please select a persona</option>
        {PERSONAS.map(persona => (
          <option key={persona.id} value={persona.id}>
            {persona.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleGenerateClick}
        disabled={isLoading || !selectedId}
        className="px-4 py-2 md:py-2.5 text-sm font-semibold text-white bg-mv-green-dark rounded-md hover:bg-opacity-90 disabled:bg-gray-400 transition-colors flex-shrink-0"
      >
        {isLoading ? '...' : 'Generate'}
      </button>
    </div>
  );
}