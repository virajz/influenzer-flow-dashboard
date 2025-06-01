
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FiPhone, FiSend } from 'react-icons/fi';
import { Negotiation } from '@/services/negotiationsService';

interface OutreachActionsProps {
  negotiation: Negotiation | null;
  creatorPhone?: string;
  onAutoEmail: () => void;
  onAgentCall: () => void;
}

export const OutreachActions = ({ 
  negotiation, 
  creatorPhone, 
  onAutoEmail, 
  onAgentCall 
}: OutreachActionsProps) => {
  const getStatusBadge = () => {
    if (!negotiation) {
      return <Badge variant="secondary">Not Started</Badge>;
    }

    const statusColors = {
      'initiated': 'bg-blue-100 text-blue-800',
      'email_sent': 'bg-yellow-100 text-yellow-800',
      'phone_contacted': 'bg-purple-100 text-purple-800',
      'in_progress': 'bg-orange-100 text-orange-800',
      'deal_proposed': 'bg-cyan-100 text-cyan-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={statusColors[negotiation.status]}>
        {negotiation.status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const canSendEmail = !negotiation || !['accepted', 'rejected', 'cancelled'].includes(negotiation.status);
  const canCall = creatorPhone && canSendEmail;
  const hasPhoneAttempted = negotiation?.phoneContactAttempted;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Outreach Status</h3>
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          onClick={onAutoEmail}
          disabled={!canSendEmail}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FiSend className="h-4 w-4" />
          Auto Email
        </Button>

        <Button
          onClick={onAgentCall}
          disabled={!canCall}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FiPhone className="h-4 w-4" />
          Agent Call
          {!creatorPhone && <span className="text-xs">(No Phone)</span>}
          {hasPhoneAttempted && <Badge variant="secondary" className="ml-1">Called</Badge>}
        </Button>
      </div>

      {negotiation && (
        <div className="text-sm text-gray-600">
          <p>Initial Contact: {negotiation.initialContactMethod}</p>
          <p>Availability: {negotiation.creatorAvailability}</p>
          {negotiation.proposedRate > 0 && (
            <p>Proposed Rate: ${negotiation.proposedRate.toLocaleString()}</p>
          )}
        </div>
      )}
    </div>
  );
};
