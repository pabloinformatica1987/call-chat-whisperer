
import React, { createContext, useContext, useReducer } from 'react';
import { AppState, AppAction, TrainingData, CallRecord, OpenAIRealtimeConfig } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

const initialState: AppState = {
  isEnabled: false,
  apiKey: null,
  realtimeConfig: {
    apiKey: null,
    model: "gpt-4o",
    voice: "alloy"
  },
  trainingData: [],
  callHistory: [],
  currentCall: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ENABLED':
      return { ...state, isEnabled: action.payload };
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'SET_REALTIME_CONFIG':
      return { 
        ...state, 
        realtimeConfig: { 
          ...state.realtimeConfig, 
          ...action.payload,
          apiKey: action.payload.apiKey || state.apiKey 
        } 
      };
    case 'ADD_TRAINING_DATA':
      return { ...state, trainingData: [...state.trainingData, action.payload] };
    case 'REMOVE_TRAINING_DATA':
      return {
        ...state,
        trainingData: state.trainingData.filter(data => data.id !== action.payload),
      };
    case 'ADD_CALL_RECORD':
      return {
        ...state,
        callHistory: [action.payload, ...state.callHistory].slice(0, 50),
      };
    case 'SET_CURRENT_CALL':
      return { ...state, currentCall: action.payload };
    default:
      return state;
  }
}

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { toast } = useToast();

  React.useEffect(() => {
    // Load saved state from localStorage
    try {
      const savedState = localStorage.getItem('callWhispererState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        
        // Converting string dates back to Date objects
        if (parsed.trainingData) {
          parsed.trainingData = parsed.trainingData.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
          }));
        }
        
        if (parsed.callHistory) {
          parsed.callHistory = parsed.callHistory.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }));
        }
        
        dispatch({ type: 'SET_API_KEY', payload: parsed.apiKey || null });
        
        if (parsed.realtimeConfig) {
          dispatch({ type: 'SET_REALTIME_CONFIG', payload: parsed.realtimeConfig });
        }
        
        parsed.trainingData?.forEach((item: TrainingData) => {
          dispatch({ type: 'ADD_TRAINING_DATA', payload: item });
        });
        parsed.callHistory?.forEach((item: CallRecord) => {
          dispatch({ type: 'ADD_CALL_RECORD', payload: item });
        });
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
      toast({
        title: 'Error loading saved data',
        description: 'Your previous settings could not be loaded.',
        variant: 'destructive',
      });
    }
  }, []);

  React.useEffect(() => {
    // Save state to localStorage when it changes
    try {
      localStorage.setItem('callWhispererState', JSON.stringify({
        apiKey: state.apiKey,
        realtimeConfig: state.realtimeConfig,
        trainingData: state.trainingData,
        callHistory: state.callHistory,
      }));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, [state.apiKey, state.realtimeConfig, state.trainingData, state.callHistory]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
