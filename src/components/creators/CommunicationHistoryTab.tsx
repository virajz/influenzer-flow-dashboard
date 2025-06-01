
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';
import { CommunicationRecord } from '@/services/communicationHistoryService';

interface CommunicationHistoryTabProps {
  communicationHistory: CommunicationRecord[];
}

export const CommunicationHistoryTab = ({ communicationHistory }: CommunicationHistoryTabProps) => {
  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <FiMail className="h-4 w-4" />;
      case 'call':
      case 'agent_call':
        return <FiPhone className="h-4 w-4" />;
      case 'dm':
        return <FiMessageSquare className="h-4 w-4" />;
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
      case 'read':
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

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle>Communication History</CardTitle>
        <CardDescription>All interactions with this creator</CardDescription>
      </CardHeader>
      <CardContent>
        {communicationHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No communication history found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {communicationHistory.map((item) => (
              <div key={item.id} className="p-4 border rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getCommunicationIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{item.subject}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{item.details}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.type}</Badge>
                      <Badge variant="outline">{item.method}</Badge>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                      {item.metadata?.hasAudio && (
                        <Badge variant="outline" className="text-blue-600">
                          Audio Available
                        </Badge>
                      )}
                      {item.metadata?.hasTranscript && (
                        <Badge variant="outline" className="text-green-600">
                          Transcript Available
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
