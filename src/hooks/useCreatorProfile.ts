import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { creatorsService } from '@/services/creatorsService';
import { campaignsService } from '@/services/campaignsService';
import { negotiationsService } from '@/services/negotiationsService';
import { creatorAssignmentsService } from '@/services/creatorAssignmentsService';
import { apiService } from '@/services/apiService';
import { useRealTimeNegotiations } from '@/hooks/useRealTimeNegotiations';
import { useRealTimeCommunications } from '@/hooks/useRealTimeCommunications';
import { toast } from '@/hooks/use-toast';

export const useCreatorProfile = () => {
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

  // Fetch creator assignments
  const { data: creatorAssignment } = useQuery({
    queryKey: ['creatorAssignments', currentUser?.uid, creatorId],
    queryFn: async () => {
      if (!currentUser?.uid || !creatorId) return null;
      return await creatorAssignmentsService.getCreatorAssignment(currentUser.uid, creatorId);
    },
    enabled: !!currentUser?.uid && !!creatorId,
  });

  // Fetch ALL campaigns for the brand
  const { data: brandCampaigns = [] } = useQuery({
    queryKey: ['campaigns', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser?.uid) return [];
      return await campaignsService.getCampaignsByBrand(currentUser.uid);
    },
    enabled: !!currentUser?.uid,
  });

  // Combine campaign IDs from negotiations and assignments
  const negotiationCampaignIds = negotiations.map(n => n.campaignId);
  const assignmentCampaignIds = creatorAssignment?.campaignIds || [];
  const allCampaignIds = [...new Set([...negotiationCampaignIds, ...assignmentCampaignIds])];

  // Filter campaigns to show those where this creator has negotiations or assignments
  const allCampaigns = brandCampaigns.filter(campaign => 
    allCampaignIds.includes(campaign.campaignId)
  );

  // Use real-time communications hook
  const negotiationIds = negotiations.map(n => n.negotiationId);
  const { communications: allCommunications } = useRealTimeCommunications(negotiationIds);

  const handleAutoEmail = async (campaignId: string) => {
    if (!currentUser?.uid || !creatorId) return;

    try {
      let negotiation = negotiations.find(n => n.campaignId === campaignId);
      
      if (!negotiation) {
        const campaign = brandCampaigns.find(c => c.campaignId === campaignId);
        if (!campaign) return;

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

        await apiService.startNegotiation(negotiationId);
      } else {
        await negotiationsService.updateNegotiation(negotiation.negotiationId, {
          status: 'email_sent'
        });

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
        const campaign = brandCampaigns.find(c => c.campaignId === campaignId);
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

  return {
    creatorId,
    creator,
    negotiations,
    allCampaigns,
    allCommunications,
    showAssignmentModal,
    setShowAssignmentModal,
    creatorsLoading,
    negotiationsLoading,
    handleAutoEmail,
    handleAgentCall,
    handleAssignmentComplete
  };
};
