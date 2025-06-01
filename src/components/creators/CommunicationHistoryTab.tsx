
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FiMail, FiPhone, FiMessageSquare, FiVideo } from 'react-icons/fi';
import { PhoneCall } from 'lucide-react';
import { Communication } from '@/services/communicationsService';

interface CommunicationHistoryTabProps {
  communications: Communication[];
  hasPhone?: boolean;
  onAgentCall?: () => void;
  isCallLoading?: boolean;
}

export const CommunicationHistoryTab = ({ 
  communications,
  hasPhone = false,
  onAgentCall,
  isCallLoading = false
}: CommunicationHistoryTabProps) => {
  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <FiMail className="h-4 w-4" />;
      case 'voice_call':
        return <FiPhone className="h-4 w-4" />;
      case 'instagram_dm':
        return <FiMessageSquare className="h-4 w-4" />;
      case 'youtube_message':
        return <FiVideo className="h-4 w-4" />;
      default:
        return <FiMail className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'opened':
        return 'bg-purple-100 text-purple-800';
      case 'replied':
        return 'bg-cyan-100 text-cyan-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDirectionColor = (direction: string) => {
    return direction === 'outbound' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <Card className="rounded-2xl shadow-md flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Communication History</CardTitle>
            <CardDescription>All interactions with this creator</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={onAgentCall}
              disabled={!hasPhone || isCallLoading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <PhoneCall className="h-4 w-4" />
              {isCallLoading ? 'Calling...' : 'Agent Call'}
              {!hasPhone && <span className="text-xs ml-1">(No Phone)</span>}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        {communications.length === 0 ? (
          <div className="text-center py-12 flex-1 flex items-center justify-center">
            <p className="text-gray-600">No communication history found</p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-4">
              {communications.map((item) => (
                <div key={item.communicationId} className="p-4 border rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getCommunicationIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{item.subject}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{item.content}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{item.type}</Badge>
                        <Badge className={getDirectionColor(item.direction)}>
                          {item.direction}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        {item.aiAgentUsed && (
                          <Badge variant="outline" className="text-purple-600">
                            AI Agent Used
                          </Badge>
                        )}
                        {item.type === 'voice_call' && item.voiceCallDuration > 0 && (
                          <Badge variant="outline" className="text-green-600">
                            Duration: {item.voiceCallDuration}s
                          </Badge>
                        )}
                        {item.followUpRequired && (
                          <Badge variant="outline" className="text-yellow-600">
                            Follow-up Required
                          </Badge>
                        )}
                      </div>
                      {item.type === 'voice_call' && item.voiceCallSummary && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <strong>Call Summary:</strong> {item.voiceCallSummary}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
