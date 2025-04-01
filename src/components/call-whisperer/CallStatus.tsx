
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";
import { CheckCircle2, PhoneCall, AlertCircle } from 'lucide-react';

interface CallStatusProps {
  isEnabled: boolean;
  permissionsGranted: boolean | null;
  onToggleEnabled: (checked: boolean) => void;
}

const CallStatus: React.FC<CallStatusProps> = ({ 
  isEnabled, 
  permissionsGranted, 
  onToggleEnabled 
}) => {
  const handleToggleEnabled = (checked: boolean) => {
    onToggleEnabled(checked);
    if (checked) {
      toast.success('Call Whisperer Activated', {
        description: 'The app will now answer incoming calls automatically.'
      });
    } else {
      toast.info('Call Whisperer Deactivated', {
        description: 'You will need to answer calls manually.'
      });
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="auto-answer">Auto-Answer Calls</Label>
          <p className="text-sm text-muted-foreground">
            When enabled, Call Whisperer will automatically answer incoming calls using OpenAI Realtime API
          </p>
        </div>
        <Switch
          id="auto-answer"
          checked={isEnabled}
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
    </div>
  );
};

export default CallStatus;
