
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { campaignsService } from '@/services/campaignsService';
import { negotiationsService } from '@/services/negotiationsService';
import { creatorsService } from '@/services/creatorsService';
import { creatorAssignmentsService } from '@/services/creatorAssignmentsService';

export const useCampaignData = (campaignId: string | undefined) => {
  const { currentUser } = useAuth();

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

  // Fetch creator assignments for current user
  const { data: creatorAssignments = [], isLoading: assignmentsLoading, refetch: refetchAssignments } = useQuery({
    queryKey: ['creatorAssignments', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser?.uid) return [];
      const assignments = await creatorAssignmentsService.getAssignmentsByUser(currentUser.uid);
      return assignments;
    },
    enabled: !!currentUser?.uid,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch negotiations for this campaign
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

  // Get creators assigned to this campaign from creatorAssignments
  const assignedCreatorIds = creatorAssignments
    .filter(assignment => assignment.campaignIds.includes(campaignId || ''))
    .map(assignment => assignment.creatorId);

  // Get creators who have negotiations for this campaign
  const negotiationCreatorIds = negotiations.map(n => n.creatorId);

  // Combine both sets of creator IDs (unique)
  const allContactedCreatorIds = [...new Set([...assignedCreatorIds, ...negotiationCreatorIds])];

  // Get contacted creators with their data
  const contactedCreators = allContactedCreatorIds.map(creatorId => {
    const creator = allCreators.find(c => c.creatorId === creatorId);
    const negotiation = negotiations.find(n => n.creatorId === creatorId);
    
    // If no negotiation exists, create a default one showing assignment status
    const defaultNegotiation = negotiation || {
      negotiationId: '',
      campaignId: campaignId || '',
      brandId: currentUser?.uid || '',
      creatorId,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      escalationCount: 0
    };

    return {
      creator,
      negotiation: defaultNegotiation,
    };
  }).filter(item => item.creator);

  const isLoading = campaignLoading || negotiationsLoading || assignmentsLoading;

  return {
    campaign,
    creatorAssignments,
    negotiations,
    allCreators,
    contactedCreators,
    allContactedCreatorIds,
    refetchAssignments,
    isLoading
  };
};
