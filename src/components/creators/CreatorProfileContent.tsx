
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CampaignAssignmentModal } from '@/components/campaigns/CampaignAssignmentModal';
import { CreatorHeader } from '@/components/creators/CreatorHeader';
import { CurrentCampaignsTab } from '@/components/creators/CurrentCampaignsTab';
import { PastCampaignsTab } from '@/components/creators/PastCampaignsTab';
import { Creator } from '@/services/creatorsService';
import { Campaign } from '@/services/campaignsService';
import { Negotiation } from '@/services/negotiationsService';

interface CreatorProfileContentProps {
    creator: Creator;
    currentCampaigns: Array<{ campaign: Campaign; negotiation: Negotiation | undefined }>;
    pastCampaigns: Array<{ campaign: Campaign; negotiation: Negotiation | undefined }>;
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
    showAssignmentModal,
    onAssignmentModalChange,
    onAutoEmail,
    onAgentCall,
    onAssignmentComplete,
    creatorId
}: CreatorProfileContentProps) => {
    return (
        <div className="p-8">
            <CreatorHeader creator={creator} />

            <Tabs defaultValue="current" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 py-2 px-2 h-auto">
                    <TabsTrigger value="current">Current Campaigns</TabsTrigger>
                    <TabsTrigger value="past">Past Campaigns</TabsTrigger>
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
