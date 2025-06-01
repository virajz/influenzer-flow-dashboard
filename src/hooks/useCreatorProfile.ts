import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { creatorsService } from '@/services/creatorsService';
import { campaignsService } from '@/services/campaignsService';
import { negotiationsService } from '@/services/negotiationsService';
import { creatorAssignmentsService } from '@/services/creatorAssignmentsService';
import { apiService } from '@/services/apiService';
import { useRealTimeNegotiations } from '@/hooks/useRealTimeNegotiations';
import { toast } from '@/hooks/use-toast';

export const useCreatorProfile = () => {
    const { creatorId } = useParams<{ creatorId: string }>();
    const { currentUser } = useAuth();
    const queryClient = useQueryClient();
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

            // Fetch the phone number from creatorAssignments
            const assignment = await creatorAssignmentsService.getCreatorAssignment(currentUser.uid, creatorId);
            console.log('Assignment:', assignment);
            if (!assignment || !assignment.phone) {
                toast({
                    title: "Error",
                    description: "Phone number not found for the creator in assignments.",
                    variant: "destructive",
                });
                return;
            }
            const phone = assignment.phone;

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
                    paymentStatus: 'pending',
                    escalationCount: 0
                });

                negotiation = { negotiationId } as any; // Cast to Negotiation like type
            } else if (negotiation) {
                await negotiationsService.updateNegotiation(negotiation.negotiationId, {
                    status: 'phone_contacted',
                    phoneContactAttempted: true,
                    voiceCallCompleted: true
                });
            }

            if (!negotiation) {
                toast({
                    title: "Error",
                    description: "Negotiation could not be found or created.",
                    variant: "destructive",
                });
                return;
            }

            // Use the fetched phone number
            await apiService.initiateAgentCall(negotiation.negotiationId, phone);

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

        // Invalidate relevant caches to ensure immediate updates
        if (currentUser?.uid && creatorId) {
            queryClient.invalidateQueries({
                queryKey: ['creatorAssignments', currentUser.uid, creatorId]
            });
            queryClient.invalidateQueries({
                queryKey: ['creatorAssignments', currentUser.uid]
            });
            queryClient.invalidateQueries({
                queryKey: ['campaigns', currentUser.uid]
            });
        }

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
        showAssignmentModal,
        setShowAssignmentModal,
        creatorsLoading,
        negotiationsLoading,
        handleAutoEmail,
        handleAgentCall,
        handleAssignmentComplete
    };
};
