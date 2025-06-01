
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { negotiationsService } from '@/services/negotiationsService';
import { apiService } from '@/services/apiService';
import { toast } from '@/hooks/use-toast';

export const useCampaignActions = (
  campaignId: string | undefined,
  campaign: any,
  negotiations: any[],
  allCreators: any[],
  refetchAssignments: () => void
) => {
  const { currentUser } = useAuth();
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isCallLoading, setIsCallLoading] = useState(false);

  const handleAutoEmail = async (creatorId: string) => {
    if (!currentUser?.uid || !campaignId) return;

    setIsEmailLoading(true);
    try {
      let negotiation = negotiations.find(n => n.creatorId === creatorId);

      if (!negotiation) {
        const creator = allCreators.find(c => c.creatorId === creatorId);
        if (!creator) return;

        const deliverables = campaign?.requiredPlatforms.map(platform => ({
          platform: platform.platform,
          contentType: platform.contentType,
          quantity: platform.quantity,
          deadline: campaign.endDate,
          status: 'pending' as const
        })) || [];

        const negotiationId = await negotiationsService.createNegotiation({
          campaignId,
          brandId: currentUser.uid,
          creatorId,
          status: 'email_sent',
          proposedRate: creator.baseRate || 0,
          counterRate: 0,
          finalRate: 0,
          maxBudget: campaign?.budget || 0,
          deliverables,
          aiAgentNotes: '',
          creatorAvailability: 'unknown',
          initialContactMethod: 'email',
          phoneContactAttempted: false,
          voiceCallCompleted: false,
          paymentStatus: 'pending',
          escalationCount: 0
        });

        const token = await currentUser.getIdToken();
        await apiService.startNegotiation(negotiationId, token);
      } else {
        await negotiationsService.updateNegotiation(negotiation.negotiationId, {
          status: 'email_sent'
        });

        const token = await currentUser.getIdToken();
        await apiService.startNegotiation(negotiation.negotiationId, token);
      }

      toast({
        title: "Email Sent!",
        description: "Auto email has been sent to the creator.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleAgentCall = async (creatorId: string) => {
    if (!currentUser?.uid || !campaignId) return;

    setIsCallLoading(true);
    try {
      let negotiation = negotiations.find(n => n.creatorId === creatorId);

      if (!negotiation) {
        const creator = allCreators.find(c => c.creatorId === creatorId);
        if (!creator) return;

        const negotiationId = await negotiationsService.createNegotiation({
          campaignId,
          brandId: currentUser.uid,
          creatorId,
          status: 'phone_contacted',
          proposedRate: creator.baseRate || 0,
          counterRate: 0,
          finalRate: 0,
          maxBudget: campaign?.budget || 0,
          deliverables: [],
          aiAgentNotes: '',
          creatorAvailability: 'unknown',
          initialContactMethod: 'phone',
          phoneContactAttempted: true,
          voiceCallCompleted: true,
          paymentStatus: 'pending',
          escalationCount: 0
        });

        negotiation = { negotiationId } as any;
      } else {
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
      toast({
        title: "Error",
        description: "Failed to initiate call. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCallLoading(false);
    }
  };

  return {
    handleAutoEmail,
    handleAgentCall,
    isEmailLoading,
    isCallLoading
  };
};
