
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhoneCall } from 'lucide-react';
import { checkCallPermissions, setupRealtimeConnection } from '@/utils/openaiService';
import CallStatus from './CallStatus';
import ActiveCall from './ActiveCall';
import WhispererInfo from './WhispererInfo';
import { useSimulateCall } from '@/hooks/useSimulateCall';

const CallWhisperer: React.FC = () => {
  const { state, dispatch } = useApp();
  const [permissionsGranted, setPermissionsGranted] = useState<boolean | null>(null);
  const { simulatedCall, isRealtimeActive, simulateIncomingCall } = useSimulateCall();
  
  useEffect(() => {
    const checkPermissions = async () => {
      if (state.isEnabled) {
        try {
          const granted = await checkCallPermissions();
          setPermissionsGranted(granted);
          if (!granted) {
            dispatch({ type: 'SET_ENABLED', payload: false });
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

  useEffect(() => {
    const initializeRealtime = async () => {
      if (state.apiKey && state.isEnabled) {
        if (!state.realtimeConfig) {
          dispatch({
            type: 'SET_REALTIME_CONFIG',
            payload: {
              apiKey: state.apiKey,
              model: "gpt-4o",
              voice: "alloy"
            }
          });
        }
        
        const config = {
          apiKey: state.apiKey,
          model: state.realtimeConfig?.model || "gpt-4o",
          voice: state.realtimeConfig?.voice || "alloy"
        };
        
        await setupRealtimeConnection(config);
      }
    };
    
    initializeRealtime();
  }, [state.apiKey, state.isEnabled, state.realtimeConfig, dispatch]);
  
  const handleToggleEnabled = (checked: boolean) => {
    dispatch({ type: 'SET_ENABLED', payload: checked });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Call Whisperer Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <CallStatus 
              isEnabled={state.isEnabled}
              permissionsGranted={permissionsGranted}
              onToggleEnabled={handleToggleEnabled}
            />
            
            {state.currentCall ? (
              <ActiveCall 
                currentCall={state.currentCall} 
                isRealtimeActive={isRealtimeActive}
              />
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
            
            <WhispererInfo isEnabled={state.isEnabled} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallWhisperer;
