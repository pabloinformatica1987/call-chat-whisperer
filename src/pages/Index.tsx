
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import CallWhisperer from '@/components/call-whisperer/CallWhisperer';
import TrainingInput from '@/components/TrainingInput';
import CallHistory from '@/components/CallHistory';
import { PhoneCall, BookOpen, History, Info } from 'lucide-react';

const Index = () => {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        
        <main className="flex-1 container max-w-3xl py-6 px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Call Chat Whisperer</h1>
            <p className="text-muted-foreground">
              Automatically answer calls using AI trained with your custom instructions.
            </p>
          </div>
          
          <Tabs defaultValue="status">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="status" className="flex items-center">
                <PhoneCall className="h-4 w-4 mr-2" />
                Status
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Training
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="status">
              <div className="space-y-6">
                <CallWhisperer />
                <div className="p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center mb-2">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <h3 className="font-medium text-sm">Demo Mode</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This is a simulated demo. In a real mobile app, this would connect to your phone's call handling system.
                    Use the "Simulate Incoming Call" button to test how the app would work with real calls.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="training">
              <TrainingInput />
            </TabsContent>
            <TabsContent value="history">
              <CallHistory />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AppProvider>
  );
};

export default Index;
