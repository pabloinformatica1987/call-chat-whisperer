
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { PhoneCall, Clock, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const CallHistory: React.FC = () => {
  const { state } = useApp();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (state.callHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Call History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <PhoneCall className="h-12 w-12 mb-2 opacity-50" />
            <p>No call history yet.</p>
            <p className="text-sm">Calls will appear here once handled by the app.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {state.callHistory.map((call) => (
              <Card key={call.id} className="bg-muted/30">
                <CardContent className="py-4">
                  <div className="mb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <PhoneCall className="h-4 w-4 mr-2 text-whisperer-primary" />
                        <div>
                          <p className="font-medium">
                            {call.callerName || call.phoneNumber}
                          </p>
                          {call.callerName && (
                            <p className="text-xs text-muted-foreground">{call.phoneNumber}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {format(call.timestamp, 'MMM d, h:mm a')}
                        <span className="mx-1">•</span>
                        {formatDuration(call.duration)}
                      </div>
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible>
                    <AccordionItem value="conversation">
                      <AccordionTrigger className="text-sm">
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-2" />
                          Conversation Details
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <div className="bg-background p-2 rounded-md">
                            <p className="text-xs font-medium mb-1">Caller said:</p>
                            <p className="text-sm">{call.transcript}</p>
                          </div>
                          
                          {call.aiResponses.map((response, i) => (
                            <div key={i} className="bg-whisperer-background p-2 rounded-md">
                              <p className="text-xs font-medium mb-1 text-whisperer-text">AI responded:</p>
                              <p className="text-sm">{response}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CallHistory;
