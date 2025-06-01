
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ConversationTurn } from '@/services/voiceCommunicationsService';

interface TranscriptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transcript: ConversationTurn[];
  conversationId: string;
}

export const TranscriptModal = ({ open, onOpenChange, transcript, conversationId }: TranscriptModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Voice Call Transcript</DialogTitle>
          <DialogDescription>
            Conversation ID: {conversationId}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {transcript.map((turn, index) => (
              <div key={index} className={`flex ${turn.speaker === 'agent' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  turn.speaker === 'agent' 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'bg-green-100 text-green-900'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={turn.speaker === 'agent' ? 'default' : 'secondary'}>
                      {turn.speaker === 'agent' ? 'AI Agent' : 'Creator'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(turn.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm">{turn.message}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
