
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckCircle2, PhoneCall, PhoneOff, AlertCircle } from 'lucide-react';
import { checkCallPermissions, generateResponse, transcribeAudio } from '@/utils/openaiService';
import { CallRecord } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const MOCK_CALLERS = [
  { name: "John Smith", number: "+1 555-123-4567" },
  { name: "Mary Johnson", number: "+1 555-987-6543" },
  { name: "Robert Brown", number: "+1 555-246-8101" },
  { name: "Emma Wilson", number: "+1 555-369-2580" },
  { name: null, number: "+1 555-741-9630" }
];

const CallWhisperer: React.FC = () => {
  const { state, dispatch } = useApp();
  const [permissionsGranted, setPermissionsGranted] = useState<boolean | null>(null);
  const [simulatedCall, setSimulatedCall] = useState(false);
  
  // Check permissions on component mount and when enabled state changes
  useEffect(() => {
    const checkPermissions = async () => {
      if (state.isEnabled) {
        try {
          const granted = await checkCallPermissions();
          setPermissionsGranted(granted);
          if (!granted) {
            dispatch({ type: 'SET_ENABLED', payload: false });
            toast.error('Call permission denied. Please grant permissions in settings.');
          }
        } catch (error) {
          console.error('Error checking permissions:', error);
          setPermissionsGranted(false);
          dispatch({ type: 'SET_ENABLED', payload: false });
        }
      }
    };
    
    checkPermissions();
  }, [state.isEnabled, dispatch]);
  
  const handleToggleEnabled = (checked: boolean) => {
    dispatch({ type: 'SET_ENABLED', payload: checked });
    toast({
      title: checked ? 'Call Whisperer Activated' : 'Call Whisperer Deactivated',
      description: checked
        ? 'The app will now answer incoming calls automatically.'
        : 'You will need to answer calls manually.'
    });
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
      
      // Create a call record
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
      
      dispatch({ type: 'SET_CURRENT_CALL', payload: newCall });
      
      // Simulate delay before answering
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!state.isEnabled) {
        toast.info('Call not answered - Call Whisperer is disabled');
        dispatch({ type: 'SET_CURRENT_CALL', payload: null });
        setSimulatedCall(false);
        return;
      }
      
      // Simulate answering
      toast.success('Call automatically answered');
      
      // Simulate transcription delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get mock transcript
      const mockTranscript = await transcribeAudio(new Blob());
      
      // Update call with transcript
      newCall.transcript = mockTranscript;
      dispatch({ type: 'SET_CURRENT_CALL', payload: { ...newCall } });
      
      // Generate AI response
      const trainingContent = state.trainingData.map(t => t.content).join('\n');
      const callerInfo = `${randomCaller.name ? randomCaller.name + ' (' + randomCaller.number + ')' : randomCaller.number}`;
      const response = await generateResponse(
        state.apiKey,
        trainingContent,
        callerInfo,
        mockTranscript
      );
      
      // Update with response
      newCall.aiResponses = [response];
      newCall.duration = Math.floor(Math.random() * 60) + 20; // Random duration between 20-80s
      
      // Simulate call ending
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // End call
      toast.info('Call ended');
      dispatch({ type: 'ADD_CALL_RECORD', payload: newCall });
      dispatch({ type: 'SET_CURRENT_CALL', payload: null });
      
    } catch (error) {
      console.error('Error in simulated call:', error);
      toast.error('Simulated call failed');
    } finally {
      setSimulatedCall(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Call Whisperer Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-answer">Auto-Answer Calls</Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, Call Whisperer will automatically answer incoming calls
                </p>
              </div>
              <Switch
                id="auto-answer"
                checked={state.isEnabled}
                onCheckedChange={handleToggleEnabled}
              />
            </div>
            
            <div className="flex items-center p-3 rounded-lg bg-muted">
              <div className="mr-3">
                {permissionsGranted === null ? (
                  <div className="w-8 h-8 rounded-full border-2 border-muted-foreground flex items-center justify-center">
                    <PhoneCall className="h-4 w-4 text-muted-foreground" />
                  </div>
                ) : permissionsGranted ? (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">
                  {permissionsGranted === null
                    ? 'Checking permissions...'
                    : permissionsGranted
                    ? 'Call permissions granted'
                    : 'Call permissions denied'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {permissionsGranted === null
                    ? 'Verifying access to call features'
                    : permissionsGranted
                    ? 'Call Whisperer can answer calls'
                    : 'Please grant call permissions in settings'}
                </p>
              </div>
            </div>

            {state.currentCall ? (
              <div className="relative p-4 bg-whisperer-primary/10 rounded-lg border border-whisperer-primary animate-pulse">
                <div className="absolute -top-3 -right-3">
                  <div className="relative inline-flex">
                    <span className="flex h-8 w-8 bg-whisperer-primary rounded-full items-center justify-center">
                      <PhoneCall className="h-4 w-4 text-white" />
                    </span>
                    <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full border-2 border-whisperer-primary opacity-75"></span>
                  </div>
                </div>
                <p className="font-semibold text-whisperer-primary">
                  Active Call: {state.currentCall.callerName || state.currentCall.phoneNumber}
                </p>
                <p className="text-sm mt-1">
                  {state.currentCall.transcript ? 'Processing response...' : 'Listening...'}
                </p>
              </div>
            ) : (
              <Button 
                onClick={simulateIncomingCall}
                disabled={simulatedCall || !state.isEnabled}
                className="w-full bg-gradient-to-r from-whisperer-primary to-whisperer-secondary hover:from-whisperer-primary/90 hover:to-whisperer-secondary/90"
              >
                {simulatedCall ? (
                  <>
                    <PhoneCall className="mr-2 h-4 w-4 animate-pulse" />
                    Processing Call...
                  </>
                ) : (
                  <>
                    <PhoneCall className="mr-2 h-4 w-4" />
                    Simulate Incoming Call
                  </>
                )}
              </Button>
            )}
            
            {!state.isEnabled && (
              <div className="flex items-center p-3 rounded-lg bg-amber-50 border border-amber-200">
                <PhoneOff className="h-5 w-5 text-amber-600 mr-3" />
                <p className="text-sm text-amber-800">
                  Call Whisperer is currently disabled. Enable it to automatically answer calls.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallWhisperer;
