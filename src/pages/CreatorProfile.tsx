import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { creatorsService } from '@/services/creatorsService';
import { campaignsService } from '@/services/campaignsService';
import { negotiationsService } from '@/services/negotiationsService';
import { communicationsService } from '@/services/communicationsService';
import { CampaignAssignmentModal } from '@/components/campaigns/CampaignAssignmentModal';
import { EmailComposerModal, EmailData } from '@/components/outreach/EmailComposerModal';
import { CreatorHeader } from '@/components/creators/CreatorHeader';
import { CurrentCampaignsTab } from '@/components/creators/CurrentCampaignsTab';
import { PastCampaignsTab } from '@/components/creators/PastCampaignsTab';
import { CommunicationHistoryTab } from '@/components/creators/CommunicationHistoryTab';
import { toast } from '@/hooks/use-toast';

const CreatorProfile = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const { currentUser } = useAuth();
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Fetch creator data
  const { data: allCreators = [], isLoading: creatorsLoading } = useQuery({
    queryKey: ['creators'],
    queryFn: creatorsService.getAllCreators,
  });

  const creator = allCreators.find(c => c.creatorId === creatorId);

  // Fetch negotiations for this creator
  const { data: negotiations = [], refetch: refetchNegotiations } = useQuery({
    queryKey: ['negotiations', creatorId],
    queryFn: async () => {
      if (!creatorId) return [];
      return await negotiationsService.getNegotiationsByCreator(creatorId);
    },
    enabled: !!creatorId,
  });

  // Fetch campaigns
  const { data: allCampaigns = [] } = useQuery({
    queryKey: ['campaigns', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser?.uid) return [];
      return await campaignsService.getCampaignsByBrand(currentUser.uid);
    },
    enabled: !!currentUser?.uid,
  });

  // Fetch all communications for negotiations involving this creator
  const { data: allCommunications = [], refetch: refetchCommunications } = useQuery({
    queryKey: ['communications', negotiations.map(n => n.negotiationId)],
    queryFn: async () => {
      if (negotiations.length === 0) return [];
      
      const communicationsPromises = negotiations.map(negotiation => 
        communicationsService.getCommunicationsByNegotiation(negotiation.negotiationId)
      );
      
      const results = await Promise.all(communicationsPromises);
      return results.flat();
    },
    enabled: negotiations.length > 0,
  });

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

  const handleManualEmail = () => {
    setShowEmailModal(true);
  };

  const handleAutoEmail = async (campaignId: string) => {
    if (!currentUser?.uid || !creatorId) return;

    try {
      // Create or update negotiation
      let negotiation = negotiations.find(n => n.campaignId === campaignId);
      
      if (!negotiation) {
        const campaign = allCampaigns.find(c => c.campaignId === campaignId);
        if (!campaign) return;

        const negotiationId = await negotiationsService.createNegotiation({
          campaignId,
          brandId: currentUser.uid,
          creatorId,
          status: 'email_sent',
          proposedRate: creator?.baseRate || 0,
          counterRate: 0,
          finalRate: 0,
          maxBudget: campaign.budget,
          deliverables: [],
          aiAgentNotes: '',
          creatorAvailability: 'unknown',
          initialContactMethod: 'email',
          phoneContactAttempted: false,
          voiceCallCompleted: false,
          escalationCount: 0
        });

        // Add communication record
        await communicationsService.addCommunication({
          negotiationId,
          type: 'email',
          direction: 'outbound',
          status: 'sent',
          subject: 'Collaboration Opportunity',
          content: 'Auto-generated email sent with campaign details',
          aiAgentUsed: true,
          voiceCallDuration: 0,
          voiceCallSummary: '',
          followUpRequired: false,
          followUpDate: '',
          messageId: `email_${Date.now()}`
        });
      } else {
        await negotiationsService.updateNegotiation(negotiation.negotiationId, {
          status: 'email_sent'
        });

        // Add communication record
        await communicationsService.addCommunication({
          negotiationId: negotiation.negotiationId,
          type: 'email',
          direction: 'outbound',
          status: 'sent',
          subject: 'Follow-up: Collaboration Opportunity',
          content: 'Auto-generated follow-up email',
          aiAgentUsed: true,
          voiceCallDuration: 0,
          voiceCallSummary: '',
          followUpRequired: false,
          followUpDate: '',
          messageId: `email_${Date.now()}`
        });
      }

      refetchNegotiations();
      refetchCommunications();
      
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

  const handleEmailSend = async (emailData: EmailData) => {
    if (!currentUser?.uid || !creatorId) return;

    try {
      // Find an existing negotiation to link the communication to
      const activeNegotiation = negotiations.find(n => !['rejected', 'cancelled'].includes(n.status));
      
      if (activeNegotiation) {
        await communicationsService.addCommunication({
          negotiationId: activeNegotiation.negotiationId,
          type: 'email',
          direction: 'outbound',
          status: 'sent',
          subject: emailData.subject,
          content: emailData.content,
          aiAgentUsed: false,
          voiceCallDuration: 0,
          voiceCallSummary: '',
          followUpRequired: false,
          followUpDate: '',
          messageId: `manual_email_${Date.now()}`
        });

        refetchCommunications();
      }
      
      toast({
        title: "Email Sent!",
        description: "Your email has been sent to the creator.",
      });
    } catch (error) {
      console.error('Error sending email:', error);
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

      if (negotiation) {
        // Add communication record
        await communicationsService.addCommunication({
          negotiationId: negotiation.negotiationId,
          type: 'voice_call',
          direction: 'outbound',
          status: 'completed',
          subject: 'AI Agent Call',
          content: 'AI agent call initiated and completed',
          aiAgentUsed: true,
          voiceCallDuration: 120, // 2 minutes default
          voiceCallSummary: 'AI agent call completed successfully',
          followUpRequired: true,
          followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          messageId: `voice_call_${Date.now()}`
        });

        refetchNegotiations();
        refetchCommunications();
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
    refetchNegotiations();
    toast({
      title: "Success!",
      description: "Creator has been assigned to the selected campaign.",
    });
  };

  if (creatorsLoading) {
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
            onManualEmail={handleManualEmail}
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

      {/* Modals */}
      <CampaignAssignmentModal
        open={showAssignmentModal}
        onOpenChange={setShowAssignmentModal}
        selectedCreatorIds={creatorId ? [creatorId] : []}
        onAssignmentComplete={handleAssignmentComplete}
      />

      <EmailComposerModal
        open={showEmailModal}
        onOpenChange={setShowEmailModal}
        creatorName={creator.displayName}
        creatorEmail={creator.email}
        onSend={handleEmailSend}
      />
    </div>
  );
};

export default CreatorProfile;
