
import React from 'react';
import { Mic, PhoneCall } from 'lucide-react';
import { CallRecord } from '@/lib/types';

interface ActiveCallProps {
  currentCall: CallRecord;
  isRealtimeActive: boolean;
}

const ActiveCall: React.FC<ActiveCallProps> = ({ currentCall, isRealtimeActive }) => {
  return (
    <div className="relative p-4 bg-whisperer-primary/10 rounded-lg border border-whisperer-primary animate-pulse">
      <div className="absolute -top-3 -right-3">
        <div className="relative inline-flex">
          <span className="flex h-8 w-8 bg-whisperer-primary rounded-full items-center justify-center">
            {isRealtimeActive ? (
              <Mic className="h-4 w-4 text-white animate-pulse" />
            ) : (
              <PhoneCall className="h-4 w-4 text-white" />
            )}
          </span>
          <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full border-2 border-whisperer-primary opacity-75"></span>
        </div>
      </div>
      <p className="font-semibold text-whisperer-primary">
        Active Call: {currentCall.callerName || currentCall.phoneNumber}
      </p>
      <div className="text-sm mt-2 space-y-2">
        {isRealtimeActive && (
          <div className="flex items-center space-x-2">
            <Mic className="h-3 w-3 text-whisperer-primary animate-pulse" />
            <span>Realtime processing active</span>
          </div>
        )}
        
        {currentCall.transcript && (
          <div className="p-2 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500">Caller said:</p>
            <p className="text-sm">{currentCall.transcript}</p>
          </div>
        )}
        
        {currentCall.aiResponses && currentCall.aiResponses.length > 0 && (
          <div className="p-2 bg-whisperer-primary/5 rounded-md">
            <p className="text-xs text-whisperer-primary">AI responded:</p>
            <p className="text-sm">{currentCall.aiResponses[currentCall.aiResponses.length - 1]}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveCall;
