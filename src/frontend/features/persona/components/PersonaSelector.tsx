'use client';
import React from 'react';
import { useState } from 'react';
import { useJourney } from '@/frontend/features/loan-journey/JourneyContext';
import { useLLM } from '@/frontend/hooks/useLLM';
import { PersonaCard } from './PersonaCard';
import { PERSONAS } from '../data';
import { Persona } from '../types';

export function PersonaSelector() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const { setPersona } = useJourney();
  const { isLoading, error, getJourneyPlan } = useLLM();

  const handlePersonaSelect = async (persona: Persona) => {
    try {
      setSelectedPersonaId(persona.id);
      const journeyPlan = await getJourneyPlan(persona);
      await setPersona(persona, journeyPlan.journey_plan);
    } catch (error) {
      console.error('Failed to process persona selection:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Select Your Profile</h1>
        <p className="text-gray-600">
          Choose a profile that best matches your needs for a personalized loan journey
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p>Personalizing your journey...</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PERSONAS.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            isSelected={selectedPersonaId === persona.id}
            onSelect={handlePersonaSelect}
          />
        ))}
      </div>
    </div>
  );
}