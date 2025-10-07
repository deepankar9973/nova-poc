'use client';

import { useState } from 'react';
// --- THIS IS THE CORRECTED IMPORT PATH ---
import { PersonaSelector } from '@/frontend/features/persona/components/PersonaSelector';
import { Persona } from '@/frontend/features/persona/types';
import { UserData } from '../types';

export function LoanJourney() {
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [userData, setUserData] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState(false);

  const handlePersonaSelect = async (persona: Persona) => {
    setIsLoading(true);
    setCurrentPersona(persona);
    // Here we'll add LLM call to determine UI components
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4">
      {!currentPersona ? (
        <PersonaSelector onPersonaSelect={handlePersonaSelect} />
      ) : (
        <div>
          {isLoading ? (
            <div>Loading journey for {currentPersona.name}...</div>
          ) : (
            // Journey components will go here
            <div>Journey starts here</div>
          )}
        </div>
      )}
    </div>
  );
}