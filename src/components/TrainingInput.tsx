
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrainingData } from '@/lib/types';
import { toast } from 'sonner';
import { PlusCircle, Trash2, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const TrainingInput: React.FC = () => {
  const { state, dispatch } = useApp();
  const [apiKey, setApiKey] = useState(state.apiKey || '');
  const [newTraining, setNewTraining] = useState('');
  const [model, setModel] = useState(state.realtimeConfig?.model || 'gpt-4o');
  const [voice, setVoice] = useState(state.realtimeConfig?.voice || 'alloy');

  const handleAddTraining = () => {
    if (!newTraining.trim()) {
      toast.error('Please enter some training data.');
      return;
    }

    const trainingData: TrainingData = {
      id: uuidv4(),
      content: newTraining.trim(),
      createdAt: new Date(),
    };

    dispatch({ type: 'ADD_TRAINING_DATA', payload: trainingData });
    toast.success('Training data added');
    setNewTraining('');
  };

  const handleRemoveTraining = (id: string) => {
    dispatch({ type: 'REMOVE_TRAINING_DATA', payload: id });
    toast.info('Training data removed');
  };

  const handleSaveApiKey = () => {
    dispatch({ type: 'SET_API_KEY', payload: apiKey });
    toast.success('API key saved');
  };
  
  const handleSaveRealtimeConfig = () => {
    dispatch({
      type: 'SET_REALTIME_CONFIG',
      payload: {
        model,
        voice
      }
    });
    toast.success('Realtime configuration saved');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>OpenAI API Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">OpenAI API Key</Label>
              <div className="flex space-x-2">
                <Input
                  id="api-key"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Button onClick={handleSaveApiKey}>Save</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Your API key is stored locally and used to access OpenAI services.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>OpenAI Realtime Configuration</CardTitle>
          <CardDescription>
            Configure the models and voices used for realtime call processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">AI Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="voice">Voice</Label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger id="voice">
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alloy">Alloy</SelectItem>
                    <SelectItem value="echo">Echo</SelectItem>
                    <SelectItem value="fable">Fable</SelectItem>
                    <SelectItem value="onyx">Onyx</SelectItem>
                    <SelectItem value="nova">Nova</SelectItem>
                    <SelectItem value="shimmer">Shimmer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={handleSaveRealtimeConfig} 
              className="w-full"
              variant="outline"
            >
              <Settings className="mr-2 h-4 w-4" />
              Save Realtime Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Training Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-training">Add New Training Information</Label>
              <Textarea
                id="new-training"
                placeholder="Add information about how you want the AI to respond to calls..."
                value={newTraining}
                onChange={(e) => setNewTraining(e.target.value)}
                className="min-h-[120px]"
              />
              <Button 
                onClick={handleAddTraining} 
                className="w-full"
                disabled={!newTraining.trim()}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Training Data
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Existing Training Data</h3>
              {state.trainingData.length === 0 ? (
                <p className="text-sm text-muted-foreground">No training data added yet.</p>
              ) : (
                <div className="space-y-2">
                  {state.trainingData.map((data) => (
                    <div key={data.id} className="p-3 border rounded-md bg-muted/50 relative">
                      <p className="pr-8 text-sm">{data.content}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => handleRemoveTraining(data.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingInput;
