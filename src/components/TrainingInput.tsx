
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrainingData } from '@/lib/types';
import { toast } from 'sonner';
import { PlusCircle, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const TrainingInput: React.FC = () => {
  const { state, dispatch } = useApp();
  const [apiKey, setApiKey] = useState(state.apiKey || '');
  const [newTraining, setNewTraining] = useState('');

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
