
import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { CallRecord } from '@/lib/types';
import { 
  setupRealtimeConnection, 
  startRealtimeCall,
  stopRealtimeCall
} from '@/utils/openaiService';

const MOCK_CALLERS = [
  { name: "John Smith", number: "+1 555-123-4567" },
  { name: "Mary Johnson", number: "+1 555-987-6543" },
  { name: "Robert Brown", number: "+1 555-246-8101" },
  { name: "Emma Wilson", number: "+1 555-369-2580" },
  { name: null, number: "+1 555-741-9630" }
];

export const useSimulateCall = () => {
  const { state, dispatch } = useApp();
  const [simulatedCall, setSimulatedCall] = useState(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);
  const currentCallRef = useRef<CallRecord | null>(null);
  
  const handleTranscriptUpdate = (text: string) => {
    if (currentCallRef.current) {
      const updatedCall = {
        ...currentCallRef.current,
        transcript: text
      };
      currentCallRef.current = updatedCall;
      dispatch({ type: 'SET_CURRENT_CALL', payload: updatedCall });
    }
  };
  
  const handleAiResponse = (text: string) => {
    if (currentCallRef.current) {
      const updatedCall = {
        ...currentCallRef.current,
        aiResponses: [...currentCallRef.current.aiResponses, text]
      };
      currentCallRef.current = updatedCall;
      dispatch({ type: 'SET_CURRENT_CALL', payload: updatedCall });
    }
  };
  
  const simulateIncomingCall = async () => {
    if (!state.apiKey) {
      toast.error('Please add your OpenAI API key in settings before testing.');
      return;
    }
    
    if (state.trainingData.length === 0) {
      toast.warning('No training data available. Responses may be generic.');
    }
    
    const randomCaller = MOCK_CALLERS[Math.floor(Math.random() * MOCK_CALLERS.length)];
    setSimulatedCall(true);
    
    try {
      toast.info(`Incoming call from ${randomCaller.name || randomCaller.number}`);
      
      const callId = uuidv4();
      const newCall: CallRecord = {
        id: callId,
        callerName: randomCaller.name,
        phoneNumber: randomCaller.number,
        timestamp: new Date(),
        duration: 0,
        transcript: '',
        aiResponses: []
      };
      
      currentCallRef.current = newCall;
      dispatch({ type: 'SET_CURRENT_CALL', payload: newCall });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!state.isEnabled) {
        toast.info('Call not answered - Call Whisperer is disabled');
        dispatch({ type: 'SET_CURRENT_CALL', payload: null });
        currentCallRef.current = null;
        setSimulatedCall(false);
        return;
      }
      
      toast.success('Call automatically answered');
      setIsRealtimeActive(true);

      const trainingContent = state.trainingData.map(t => t.content).join('\n');
      const callerInfo = `${randomCaller.name ? randomCaller.name + ' (' + randomCaller.number + ')' : randomCaller.number}`;
      
      const config = {
        apiKey: state.apiKey,
        model: state.realtimeConfig?.model || "gpt-4o",
        voice: state.realtimeConfig?.voice || "alloy"
      };
      
      const success = await startRealtimeCall(
        config,
        trainingContent,
        callerInfo,
        handleTranscriptUpdate,
        handleAiResponse
      );
      
      if (!success) {
        toast.error('Failed to establish realtime connection');
        setIsRealtimeActive(false);
        dispatch({ type: 'SET_CURRENT_CALL', payload: null });
        currentCallRef.current = null;
        setSimulatedCall(false);
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      await stopRealtimeCall();
      setIsRealtimeActive(false);
      
      if (currentCallRef.current) {
        const finalCall = {
          ...currentCallRef.current,
          duration: Math.floor(Math.random() * 60) + 20
        };
        
        toast.info('Call ended');
        dispatch({ type: 'ADD_CALL_RECORD', payload: finalCall });
        dispatch({ type: 'SET_CURRENT_CALL', payload: null });
        currentCallRef.current = null;
      }
      
    } catch (error) {
      console.error('Error in simulated call:', error);
      toast.error('Simulated call failed');
      setIsRealtimeActive(false);
    } finally {
      setSimulatedCall(false);
    }
  };

  return {
    simulatedCall,
    isRealtimeActive,
    simulateIncomingCall
  };
};
