import { JourneyState, JourneyAction } from './types';

export const initialJourneyState: JourneyState = {
  currentPersona: null,
  currentStepIndex: 0,
  journeySteps: [],
  userData: {},
  isLoading: false,
  error: null
};

export function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case 'SET_PERSONA':
      return {
        ...state,
        currentPersona: action.payload,
        currentStepIndex: 0,
        userData: {} // Reset user data when persona changes
      };

    case 'SET_JOURNEY_STEPS':
      return {
        ...state,
        journeySteps: action.payload
      };

    case 'NEXT_STEP':
      return {
        ...state,
        currentStepIndex: Math.min(
          state.currentStepIndex + 1,
          state.journeySteps.length - 1
        )
      };

    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStepIndex: Math.max(state.currentStepIndex - 1, 0)
      };

    case 'UPDATE_USER_DATA':
      return {
        ...state,
        userData: {
          ...state.userData,
          ...action.payload
        }
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'RESET_JOURNEY':
      return initialJourneyState;

    default:
      return state;
  }
}