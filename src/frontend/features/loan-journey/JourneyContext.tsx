'use client';

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback
} from 'react';
import { journeyReducer, initialJourneyState } from './journeyReducer';
import { JourneyState, JourneyAction, UserData } from './types';
import { Persona } from '../persona/types';

interface JourneyContextType extends JourneyState {
  setPersona: (persona: Persona) => Promise<void>;
  nextStep: () => void;
  previousStep: () => void;
  updateUserData: (data: Partial<UserData>) => void;
  resetJourney: () => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(journeyReducer, initialJourneyState);

  const setPersona = useCallback(async (persona: Persona) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      dispatch({ type: 'SET_PERSONA', payload: persona });
      // Here we'll add LLM call to get journey steps
      // const steps = await getLLMJourneySteps(persona);
      // dispatch({ type: 'SET_JOURNEY_STEPS', payload: steps });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize journey' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const previousStep = useCallback(() => {
    dispatch({ type: 'PREVIOUS_STEP' });
  }, []);

  const updateUserData = useCallback((data: Partial<UserData>) => {
    dispatch({ type: 'UPDATE_USER_DATA', payload: data });
  }, []);

  const resetJourney = useCallback(() => {
    dispatch({ type: 'RESET_JOURNEY' });
  }, []);

  const value = {
    ...state,
    setPersona,
    nextStep,
    previousStep,
    updateUserData,
    resetJourney
  };

  return (
    <JourneyContext.Provider value={value}>
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}