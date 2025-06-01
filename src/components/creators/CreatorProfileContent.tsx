import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CampaignAssignmentModal } from '@/components/campaigns/CampaignAssignmentModal';
import { CreatorHeader } from '@/components/creators/CreatorHeader';
import { CurrentCampaignsTab } from '@/components/creators/CurrentCampaignsTab';
import { PastCampaignsTab } from '@/components/creators/PastCampaignsTab';
import { CommunicationHistoryTab } from '@/components/creators/CommunicationHistoryTab';
import { Creator } from '@/services/creatorsService';
import { Campaign } from '@/services/campaignsService';
import { Negotiation } from '@/services/negotiationsService';
import { Communication } from '@/services/communicationsService';
import { Target, Plus } from 'lucide-react';

interface CreatorProfileContentProps {
  creator: Creator;
  currentCampaigns: Array<{ campaign: Campaign; negotiation: Negotiation | undefined }>;
  pastCampaigns: Array<{ campaign: Campaign; negotiation: Negotiation | undefined }>;
  allCommunications: Communication[];
  showAssignmentModal: boolean;
  onAssignmentModalChange: (open: boolean) => void;
  onAutoEmail: (campaignId: string) => void;
  onAgentCall: (campaignId: string) => void;
  onAssignmentComplete: () => void;
  creatorId: string;
}

export const CreatorProfileContent = ({
  creator,
  currentCampaigns,
  pastCampaigns,
  allCommunications,
  showAssignmentModal,
  onAssignmentModalChange,
  onAutoEmail,
  onAgentCall,
  onAssignmentComplete,
  creatorId
}: CreatorProfileContentProps) => {
  const hasAnyCampaigns = currentCampaigns.length > 0 || pastCampaigns.length > 0;

  if (!hasAnyCampaigns) {
    return (
      <div className="p-8">
        <CreatorHeader creator={creator} />
        
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns assigned</h3>
          <p className="text-gray-500 mb-4">
            This creator hasn't been assigned to any campaigns yet. Assign them to a campaign to start collaborating.
          </p>
          <Button onClick={() => onAssignmentModalChange(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Assign to Campaign
          </Button>
        </div>

        <CampaignAssignmentModal
          open={showAssignmentModal}
          onOpenChange={onAssignmentModalChange}
          selectedCreatorIds={creatorId ? [creatorId] : []}
          onAssignmentComplete={onAssignmentComplete}
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      <CreatorHeader creator={creator} />

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Campaigns</TabsTrigger>
          <TabsTrigger value="past">Past Campaigns</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <CurrentCampaignsTab
            currentCampaigns={currentCampaigns}
            creator={creator}
            onAssignToCampaign={() => onAssignmentModalChange(true)}
            onAutoEmail={onAutoEmail}
            onAgentCall={onAgentCall}
          />
        </TabsContent>

        <TabsContent value="past">
          <PastCampaignsTab pastCampaigns={pastCampaigns} />
        </TabsContent>

        <TabsContent value="history">
          <CommunicationHistoryTab communications={allCommunications} />
        </TabsContent>
      </Tabs>

      <CampaignAssignmentModal
        open={showAssignmentModal}
        onOpenChange={onAssignmentModalChange}
        selectedCreatorIds={creatorId ? [creatorId] : []}
        onAssignmentComplete={onAssignmentComplete}
      />
    </div>
  );
};
