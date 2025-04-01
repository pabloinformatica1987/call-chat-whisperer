
export interface TrainingData {
  id: string;
  content: string;
  createdAt: Date;
}

export interface CallRecord {
  id: string;
  callerName: string | null;
  phoneNumber: string;
  timestamp: Date;
  duration: number;
  transcript: string;
  aiResponses: string[];
}

export interface OpenAIRealtimeConfig {
  apiKey: string;
  model: string;
  voice: string;
}

export interface AppState {
  isEnabled: boolean;
  apiKey: string | null;
  realtimeConfig: OpenAIRealtimeConfig;
  trainingData: TrainingData[];
  callHistory: CallRecord[];
  currentCall: CallRecord | null;
}

export type AppAction =
  | { type: 'SET_ENABLED'; payload: boolean }
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'SET_REALTIME_CONFIG'; payload: Partial<OpenAIRealtimeConfig> }
  | { type: 'ADD_TRAINING_DATA'; payload: TrainingData }
  | { type: 'REMOVE_TRAINING_DATA'; payload: string }
  | { type: 'ADD_CALL_RECORD'; payload: CallRecord }
  | { type: 'SET_CURRENT_CALL'; payload: CallRecord | null };
