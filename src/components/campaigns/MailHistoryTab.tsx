
import { Badge } from '@/components/ui/badge';
import { FiMail } from 'react-icons/fi';
import { Communication } from '@/services/communicationsService';

interface MailHistoryTabProps {
  communications: Communication[];
}

export const MailHistoryTab = ({ communications }: MailHistoryTabProps) => {
  // Filter for email communications only
  const emailCommunications = communications.filter(comm => comm.type === 'email');

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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDirectionColor = (direction: string) => {
    return direction === 'outbound' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800';
  };

  if (emailCommunications.length === 0) {
    return (
      <div className="text-center py-12">
        <FiMail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No email communications found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {emailCommunications.map((item) => (
        <div key={item.communicationId} className="p-4 border rounded-xl">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FiMail className="h-4 w-4" />
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
                {item.followUpRequired && (
                  <Badge variant="outline" className="text-yellow-600">
                    Follow-up Required
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
