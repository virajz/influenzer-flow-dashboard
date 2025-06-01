
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
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid time';
      }
      return date.toLocaleTimeString();
    } catch (error) {
      return 'Invalid time';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Voice Call Transcript</DialogTitle>
          <DialogDescription>
            Conversation transcript between AI agent and creator
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 h-[60vh] pr-4">
          <div className="space-y-4">
            {transcript.map((turn, index) => (
              <div key={index} className={`flex ${turn.speaker === 'agent' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[75%] p-4 rounded-lg shadow-sm ${
                  turn.speaker === 'agent' 
                    ? 'bg-slate-100 text-slate-900 rounded-bl-sm' 
                    : 'bg-blue-500 text-white rounded-br-sm'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant={turn.speaker === 'agent' ? 'secondary' : 'default'}
                      className={turn.speaker === 'agent' ? 'bg-slate-200 text-slate-700' : 'bg-blue-600 text-white'}
                    >
                      {turn.speaker === 'agent' ? 'AI Agent' : 'Creator'}
                    </Badge>
                    <span className={`text-xs ${
                      turn.speaker === 'agent' ? 'text-slate-500' : 'text-blue-100'
                    }`}>
                      {formatTime(turn.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{turn.message}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
