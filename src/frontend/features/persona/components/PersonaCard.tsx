import React from 'react'; // <-- FIX: Added React import for JSX
import { Persona } from '../types'; // <-- FIX: Added Persona type import

interface PersonaCardProps {
  persona: Persona;
  isSelected: boolean;
  onSelect: (persona: Persona) => void;
}

export function PersonaCard({ persona, isSelected, onSelect }: PersonaCardProps) {
  return (
    <button
      onClick={() => onSelect(persona)}
      className={`w-full p-6 rounded-lg text-left transition-all ${
        isSelected 
          ? 'border-2 border-blue-500 bg-blue-50 shadow-md' 
          : 'border border-gray-200 hover:border-blue-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">{persona.name}</h3>
          <span className="text-sm px-2 py-1 rounded-full bg-gray-200 text-gray-600">
            {persona.age} yrs
          </span>
        </div>
        
        <p className="text-sm text-gray-600">{persona.description}</p>
        
        <div className="mt-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Goal:</p>
          <p className="text-sm text-gray-700">{persona.ux_goal}</p>
        </div>

        <div className="mt-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">UI Traits:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {persona.key_ui_traits.map((trait, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-500">{persona.occupation}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStrategyColor(persona.llm_strategy)}`}>
            {persona.llm_strategy}
          </span>
        </div>
      </div>
    </button>
  );
}

function getStrategyColor(strategy: string): string {
  const colors: { [key: string]: string } = {
    efficiency: 'bg-green-100 text-green-800',
    reassurance: 'bg-blue-100 text-blue-800',
    velocity: 'bg-red-100 text-red-800',
    exploration: 'bg-purple-100 text-purple-800',
    control: 'bg-yellow-100 text-yellow-800',
    clarity: 'bg-indigo-100 text-indigo-800'
  };
  return colors[strategy] || 'bg-gray-100 text-gray-800';
}