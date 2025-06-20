

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PhoneCall } from 'lucide-react';
import { MailHistoryTab } from './MailHistoryTab';
import { VoiceHistoryTab } from './VoiceHistoryTab';
import { Communication } from '@/services/communicationsService';
import { VoiceCommunication } from '@/services/voiceCommunicationsService';

interface TabbedCommunicationHistoryProps {
  communications: Communication[];
  voiceCommunications: VoiceCommunication[];
  creatorName: string;
  selectedCreatorId?: string;
  hasPhone?: boolean;
  isCallLoading?: boolean;
  onAgentCall?: (creatorId: string) => void;
}

export const TabbedCommunicationHistory = ({
  communications,
  voiceCommunications,
  creatorName,
  selectedCreatorId,
  hasPhone = true,
  isCallLoading = false,
  onAgentCall
}: TabbedCommunicationHistoryProps) => {
  return (
    <Card className="rounded-2xl shadow-md flex flex-col h-full">
      <CardContent className="flex-1 flex flex-col p-6 overflow-hidden">
        <Tabs defaultValue="mail" className="flex flex-col h-full">
          <div className="flex flex-col md:flex-row items-center justify-between flex-shrink-0 mb-4">
            <TabsList className="grid grid-cols-2 w-full md:w-auto">
              <TabsTrigger value="mail">Mail History</TabsTrigger>
              <TabsTrigger value="voice">Voice History</TabsTrigger>
            </TabsList>

            {selectedCreatorId && onAgentCall && (
              <Button
                onClick={() => onAgentCall(selectedCreatorId)}
                disabled={!hasPhone || isCallLoading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <PhoneCall className="h-4 w-4" />
                {isCallLoading ? 'Calling...' : 'Agent Call'}
                {!hasPhone && <span className="text-xs ml-1">(No Phone)</span>}
              </Button>
            )}
          </div>

          <TabsContent value="mail" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <MailHistoryTab communications={communications} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="voice" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <VoiceHistoryTab voiceCommunications={voiceCommunications} creatorName={creatorName} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

