import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { campaignsService } from '@/services/campaignsService';
import { negotiationsService } from '@/services/negotiationsService';
import { creatorsService } from '@/services/creatorsService';
import { creatorAssignmentsService } from '@/services/creatorAssignmentsService';

export const useCampaignData = (campaignId: string | undefined) => {
    const { currentUser } = useAuth();

    // Debug user information

    // Fetch campaign details
    const { data: campaign, isLoading: campaignLoading } = useQuery({
        queryKey: ['campaign', campaignId],
        queryFn: async () => {
            if (!campaignId) throw new Error('Campaign ID is required');
            const campaignData = await campaignsService.getCampaignById(campaignId);
            return campaignData;
        },
        enabled: !!campaignId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });

    // Fetch negotiations for this campaign (for metrics and other purposes)
    const { data: negotiations = [], isLoading: negotiationsLoading } = useQuery({
        queryKey: ['negotiations', campaignId],
        queryFn: async () => {
            if (!campaignId) return [];
            const negotiationsData = await negotiationsService.getNegotiationsByCampaign(campaignId);

            return negotiationsData;
        },
        enabled: !!campaignId,
        staleTime: 30 * 1000, // 30 seconds
        refetchOnWindowFocus: false,
    });

    // Fetch creator assignments for this campaign
    const { data: creatorAssignments = [], isLoading: assignmentsLoading, refetch: refetchAssignments } = useQuery({
        queryKey: ['creatorAssignmentsByCampaign', campaignId],
        queryFn: async () => {
            if (!campaignId) return [];
            const assignments = await creatorAssignmentsService.getAssignmentsByCampaign(campaignId);
            return assignments;
        },
        enabled: !!campaignId,
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchOnWindowFocus: false,
    });

    // Fetch all creators to get creator details
    const { data: allCreators = [] } = useQuery({
        queryKey: ['creators'],
        queryFn: async () => {
            const creatorsData = await creatorsService.getAllCreators();
            return creatorsData;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false,
    });

    // Filter creator assignments for THIS SPECIFIC CAMPAIGN
    const campaignAssignments = creatorAssignments;


    // Get creator IDs assigned to THIS SPECIFIC CAMPAIGN
    const assignedCreatorIds = campaignAssignments.map(assignment => assignment.creatorId);


    // Build contacted creators list from actual assignments
    const contactedCreators = campaignAssignments.map(assignment => {
        const creator = allCreators.find(c => c.creatorId === assignment.creatorId);

        if (!creator) {
            return null;
        }

        const negotiation = negotiations.find(n => n.creatorId === assignment.creatorId);

        const defaultNegotiation = negotiation || {
            negotiationId: '',
            campaignId: campaignId || '',
            brandId: currentUser?.uid || '',
            creatorId: assignment.creatorId,
            status: 'initiated' as const,
            proposedRate: 0,
            counterRate: 0,
            finalRate: 0,
            maxBudget: 0,
            deliverables: [],
            aiAgentNotes: '',
            creatorAvailability: 'unknown' as const,
            initialContactMethod: 'email' as const,
            phoneContactAttempted: false,
            voiceCallCompleted: false,
            paymentStatus: 'pending' as const,
            createdAt: assignment.createdAt || new Date().toISOString(),
            updatedAt: assignment.updatedAt || new Date().toISOString(),
            escalationCount: 0
        };

        return {
            creator,
            negotiation: defaultNegotiation,
        };
    }).filter(item => item !== null);


    // For the CreatorSelectionModal, exclude creators who are already assigned to this campaign
    const existingCreatorIds = assignedCreatorIds;


    const isLoading = campaignLoading || negotiationsLoading || assignmentsLoading;

    return {
        campaign,
        creatorAssignments,
        negotiations,
        allCreators,
        contactedCreators,
        allContactedCreatorIds: assignedCreatorIds, // Only assigned creators for this campaign
        existingCreatorIds, // Only assigned creators for this campaign
        refetchAssignments,
        isLoading
    };
};
