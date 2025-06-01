
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { creatorsService } from '@/services/creatorsService';
import { campaignsService } from '@/services/campaignsService';
import { negotiationsService } from '@/services/negotiationsService';
import { apiService } from '@/services/apiService';
import { useRealTimeNegotiations } from '@/hooks/useRealTimeNegotiations';
import { useRealTimeCommunications } from '@/hooks/useRealTimeCommunications';
import { CampaignAssignmentModal } from '@/components/campaigns/CampaignAssignmentModal';
import { CreatorHeader } from '@/components/creators/CreatorHeader';
import { CurrentCampaignsTab } from '@/components/creators/CurrentCampaignsTab';
import { PastCampaignsTab } from '@/components/creators/PastCampaignsTab';
import { CommunicationHistoryTab } from '@/components/creators/CommunicationHistoryTab';
import { toast } from '@/hooks/use-toast';

const CreatorProfile = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const { currentUser } = useAuth();
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  // Fetch creator data
  const { data: allCreators = [], isLoading: creatorsLoading } = useQuery({
    queryKey: ['creators'],
    queryFn: creatorsService.getAllCreators,
  });

  const creator = allCreators.find(c => c.creatorId === creatorId);

  // Use real-time negotiations hook
  const { negotiations, isLoading: negotiationsLoading } = useRealTimeNegotiations(creatorId);

  // Fetch campaigns
  const { data: allCampaigns = [] } = useQuery({
    queryKey: ['campaigns', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser?.uid) return [];
      return await campaignsService.getCampaignsByBrand(currentUser.uid);
    },
    enabled: !!currentUser?.uid,
  });

  // Use real-time communications hook
  const negotiationIds = negotiations.map(n => n.negotiationId);
  const { communications: allCommunications } = useRealTimeCommunications(negotiationIds);

  // Get campaigns with negotiations
  const campaignsWithNegotiations = allCampaigns.map(campaign => {
    const negotiation = negotiations.find(n => n.campaignId === campaign.campaignId);
    return { campaign, negotiation };
  });

  const currentCampaigns = campaignsWithNegotiations.filter(({ campaign, negotiation }) => {
    const endDate = new Date(campaign.endDate);
    const today = new Date();
    return (campaign.status === 'active' || campaign.status === 'draft' || endDate >= today) && 
           (!negotiation || !['rejected', 'cancelled'].includes(negotiation.status));
  });

  const pastCampaigns = campaignsWithNegotiations.filter(({ campaign, negotiation }) => {
    const endDate = new Date(campaign.endDate);
    const today = new Date();
    return endDate < today || campaign.status === 'completed' || campaign.status === 'cancelled' ||
           (negotiation && ['rejected', 'cancelled', 'accepted'].includes(negotiation.status));
  });

  const handleAutoEmail = async (campaignId: string) => {
    if (!currentUser?.uid || !creatorId) return;

    try {
      // Create or update negotiation
      let negotiation = negotiations.find(n => n.campaignId === campaignId);
      
      if (!negotiation) {
        const campaign = allCampaigns.find(c => c.campaignId === campaignId);
        if (!campaign) return;

        // Map campaign requiredPlatforms to deliverables
        const deliverables = campaign.requiredPlatforms.map(platform => ({
          platform: platform.platform,
          contentType: platform.contentType,
          quantity: platform.quantity,
          deadline: campaign.endDate,
          status: 'pending' as const
        }));

        const negotiationId = await negotiationsService.createNegotiation({
          campaignId,
          brandId: currentUser.uid,
          creatorId,
          status: 'email_sent',
          proposedRate: creator?.baseRate || 0,
          counterRate: 0,
          finalRate: 0,
          maxBudget: campaign.budget,
          deliverables,
          aiAgentNotes: '',
          creatorAvailability: 'unknown',
          initialContactMethod: 'email',
          phoneContactAttempted: false,
          voiceCallCompleted: false,
          escalationCount: 0
        });

        // Call external API to start negotiation
        await apiService.startNegotiation(negotiationId);
      } else {
        await negotiationsService.updateNegotiation(negotiation.negotiationId, {
          status: 'email_sent'
        });

        // Call external API to start negotiation
        await apiService.startNegotiation(negotiation.negotiationId);
      }
      
      toast({
        title: "Email Sent!",
        description: "Auto email has been sent to the creator.",
      });
    } catch (error) {
      console.error('Error sending auto email:', error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAgentCall = async (campaignId?: string) => {
    if (!currentUser?.uid || !creatorId) return;

    try {
      let negotiation = negotiations.find(n => n.campaignId === campaignId);
      
      if (!negotiation && campaignId) {
        const campaign = allCampaigns.find(c => c.campaignId === campaignId);
        if (!campaign) return;

        const negotiationId = await negotiationsService.createNegotiation({
          campaignId,
          brandId: currentUser.uid,
          creatorId,
          status: 'phone_contacted',
          proposedRate: creator?.baseRate || 0,
          counterRate: 0,
          finalRate: 0,
          maxBudget: campaign.budget,
          deliverables: [],
          aiAgentNotes: '',
          creatorAvailability: 'unknown',
          initialContactMethod: 'phone',
          phoneContactAttempted: true,
          voiceCallCompleted: true,
          escalationCount: 0
        });

        negotiation = { negotiationId } as any;
      } else if (negotiation) {
        await negotiationsService.updateNegotiation(negotiation.negotiationId, {
          status: 'phone_contacted',
          phoneContactAttempted: true,
          voiceCallCompleted: true
        });
      }
      
      toast({
        title: "Agent Call Initiated!",
        description: "AI agent is calling the creator.",
      });
    } catch (error) {
      console.error('Error initiating agent call:', error);
      toast({
        title: "Error",
        description: "Failed to initiate call. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAssignmentComplete = () => {
    setShowAssignmentModal(false);
    toast({
      title: "Success!",
      description: "Creator has been assigned to the selected campaign.",
    });
  };

  if (creatorsLoading || negotiationsLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Creator Not Found</h1>
          <p className="text-gray-600 mt-2">The creator you're looking for doesn't exist.</p>
        </div>
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
            onAssignToCampaign={() => setShowAssignmentModal(true)}
            onAutoEmail={handleAutoEmail}
            onAgentCall={handleAgentCall}
          />
        </TabsContent>

        <TabsContent value="past">
          <PastCampaignsTab pastCampaigns={pastCampaigns} />
        </TabsContent>

        <TabsContent value="history">
          <CommunicationHistoryTab communications={allCommunications} />
        </TabsContent>
      </Tabs>

      {/* Campaign Assignment Modal */}
      <CampaignAssignmentModal
        open={showAssignmentModal}
        onOpenChange={setShowAssignmentModal}
        selectedCreatorIds={creatorId ? [creatorId] : []}
        onAssignmentComplete={handleAssignmentComplete}
      />
    </div>
  );
};

export default CreatorProfile;
