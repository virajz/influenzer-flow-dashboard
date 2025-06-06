import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, PhoneCall } from 'lucide-react';
import { TabbedCommunicationHistory } from './TabbedCommunicationHistory';
import { Communication } from '@/services/communicationsService';
import { useRealTimeVoiceCommunications } from '@/hooks/useRealTimeVoiceCommunications';

interface CommunicationPanelProps {
  selectedCreatorId: string | null;
  communications: Communication[];
  communicationsLoading: boolean;
  hasPhone: boolean;
  isEmailLoading: boolean;
  isCallLoading: boolean;
  onAutoEmail: (creatorId: string) => void;
  onAgentCall: (creatorId: string) => void;
  negotiationIds: string[];
  creatorName: string;
}

export const CommunicationPanel = ({
  selectedCreatorId,
  communications,
  communicationsLoading,
  hasPhone,
  isEmailLoading,
  isCallLoading,
  onAutoEmail,
  onAgentCall,
  negotiationIds,
  creatorName
}: CommunicationPanelProps) => {
  // Get voice communications for selected creator
  const { voiceCommunications, isLoading: voiceLoading } = useRealTimeVoiceCommunications(negotiationIds);

  if (!selectedCreatorId) {
    return (
      <Card className="rounded-2xl shadow-md flex-1">
        <CardContent className="p-12">
          <div className="text-center">
            <p className="text-gray-600">Select a creator to view communication history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (communicationsLoading || voiceLoading) {
    return (
      <Card className="rounded-2xl shadow-md flex-1">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading communications...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (communications.length > 0 || voiceCommunications.length > 0) {
    return (
      <TabbedCommunicationHistory
        communications={communications}
        voiceCommunications={voiceCommunications}
        creatorName={creatorName}
        selectedCreatorId={selectedCreatorId}
        hasPhone={hasPhone}
        isCallLoading={isCallLoading}
        onAgentCall={onAgentCall}
      />
    );
  }

  return (
    <Card className="rounded-2xl shadow-md flex-1">
      <CardContent className="p-12">
        <div className="text-center space-y-4">
          <p className="text-gray-600 mb-4">No communication history found</p>
          <p className="text-sm text-gray-500 mb-6">Start outreach using the buttons below</p>

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => onAutoEmail(selectedCreatorId)}
              disabled={isEmailLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              {isEmailLoading ? 'Sending...' : 'Auto Email'}
            </Button>
            <Button
              onClick={() => onAgentCall(selectedCreatorId)}
              disabled={!hasPhone || isCallLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <PhoneCall className="h-4 w-4" />
              {isCallLoading ? 'Calling...' : 'Agent Call'}
              {!hasPhone && <span className="text-xs ml-1">(No Phone)</span>}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
