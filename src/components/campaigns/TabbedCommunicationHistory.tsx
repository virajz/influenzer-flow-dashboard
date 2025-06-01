import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MailHistoryTab } from './MailHistoryTab';
import { VoiceHistoryTab } from './VoiceHistoryTab';
import { Communication } from '@/services/communicationsService';
import { VoiceCommunication } from '@/services/voiceCommunicationsService';

interface TabbedCommunicationHistoryProps {
  communications: Communication[];
  voiceCommunications: VoiceCommunication[];
  creatorName: string;
}

export const TabbedCommunicationHistory = ({
  communications,
  voiceCommunications,
  creatorName
}: TabbedCommunicationHistoryProps) => {
  return (
    <Card className="rounded-2xl shadow-md flex flex-col h-full">
      <CardContent className="flex-1 flex flex-col min-h-0 p-6">
        <Tabs defaultValue="mail" className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mail">Mail History</TabsTrigger>
            <TabsTrigger value="voice">Voice History</TabsTrigger>
          </TabsList>

          <TabsContent value="mail" className="flex-1 mt-4">
            <ScrollArea className="h-full">
              <MailHistoryTab communications={communications} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="voice" className="flex-1 mt-4">
            <ScrollArea className="h-full">
              <VoiceHistoryTab voiceCommunications={voiceCommunications} creatorName={creatorName} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
