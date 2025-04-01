
import React from 'react';
import { PhoneOff, Info } from 'lucide-react';

interface WhispererInfoProps {
  isEnabled: boolean;
}

const WhispererInfo: React.FC<WhispererInfoProps> = ({ isEnabled }) => {
  return (
    <>
      {!isEnabled && (
        <div className="flex items-center p-3 rounded-lg bg-amber-50 border border-amber-200">
          <PhoneOff className="h-5 w-5 text-amber-600 mr-3" />
          <p className="text-sm text-amber-800">
            Call Whisperer is currently disabled. Enable it to automatically answer calls.
          </p>
        </div>
      )}

      <div className="flex items-center p-3 rounded-lg bg-blue-50 border border-blue-200">
        <Info className="h-5 w-5 text-blue-600 mr-3" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">OpenAI Realtime API</p>
          <p>
            This app è ora configurata per utilizzare OpenAI Realtime API per la trascrizione e la risposta
            alle chiamate in tempo reale.
          </p>
        </div>
      </div>
    </>
  );
};

export default WhispererInfo;
