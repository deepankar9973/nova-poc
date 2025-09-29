'use client';

import React, { useState } from 'react';
import { PERSONAS } from '../data';
import { Persona } from '../types';

interface UserSelectorProps {
  onGenerate: (persona: Persona) => void;
  isLoading: boolean;
}

export function UserSelector({ onGenerate, isLoading }: UserSelectorProps) {
  const [selectedId, setSelectedId] = useState<string>(PERSONAS[0].id);

  const handleGenerateClick = () => {
    const selectedPersona = PERSONAS.find(p => p.id === selectedId);
    if (selectedPersona) {
      onGenerate(selectedPersona);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="block w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        disabled={isLoading}
      >
        <option value="" disabled>Select a User Profile</option>
        {PERSONAS.map(persona => (
          <option key={persona.id} value={persona.id}>
            {persona.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleGenerateClick}
        disabled={isLoading || !selectedId}
        className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating...' : 'Generate Journey'}
      </button>
    </div>
  );
}