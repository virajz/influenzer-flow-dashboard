
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { campaignsService } from '@/services/campaignsService';
import { negotiationsService } from '@/services/negotiationsService';
import { creatorsService } from '@/services/creatorsService';
import { creatorAssignmentsService } from '@/services/creatorAssignmentsService';

export const useCampaignData = (campaignId: string | undefined) => {
  const { currentUser } = useAuth();

  // Debug user information
  console.log('useCampaignData - Current user:', currentUser);
  console.log('useCampaignData - Current user UID:', currentUser?.uid);
  console.log('useCampaignData - Campaign ID:', campaignId);

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
      console.log('useCampaignData - Negotiations for campaign:', negotiationsData);
      return negotiationsData;
    },
    enabled: !!campaignId,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  // Fetch creator assignments for current user
  const { data: creatorAssignments = [], isLoading: assignmentsLoading, refetch: refetchAssignments } = useQuery({
    queryKey: ['creatorAssignments', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser?.uid) {
        console.log('useCampaignData - No current user UID, returning empty assignments');
        return [];
      }
      
      console.log('useCampaignData - Fetching assignments for user:', currentUser.uid);
      const assignments = await creatorAssignmentsService.getAssignmentsByUser(currentUser.uid);
      console.log('useCampaignData - Raw assignments from service:', assignments);
      console.log('useCampaignData - Number of assignments returned:', assignments.length);
      return assignments;
    },
    enabled: !!currentUser?.uid,
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
  const campaignAssignments = creatorAssignments.filter(assignment => 
    assignment.campaignIds.includes(campaignId || '')
  );

  console.log('useCampaignData - All creator assignments:', creatorAssignments.length);
  console.log('useCampaignData - Campaign assignments (filtered):', campaignAssignments.length);
  console.log('useCampaignData - Campaign assignments details:', campaignAssignments);

  // Get creator IDs assigned to THIS SPECIFIC CAMPAIGN
  const assignedCreatorIds = campaignAssignments.map(assignment => assignment.creatorId);
  
  console.log('useCampaignData - Assigned creator IDs for this campaign:', assignedCreatorIds);

  // Build contacted creators list ONLY from creator assignments for this campaign
  const contactedCreators = assignedCreatorIds.map(creatorId => {
    const creator = allCreators.find(c => c.creatorId === creatorId);
    const negotiation = negotiations.find(n => n.creatorId === creatorId);
    
    // If creator doesn't exist in allCreators, skip this entry
    if (!creator) {
      console.log(`useCampaignData - Creator ${creatorId} not found in allCreators`);
      return null;
    }
    
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
  }).filter(item => item !== null);

  console.log('useCampaignData - Contacted creators count:', contactedCreators.length);
  console.log('useCampaignData - Contacted creators:', contactedCreators.map(c => c?.creator.displayName));

  // For the CreatorSelectionModal, exclude creators who are already assigned to this campaign
  const existingCreatorIds = assignedCreatorIds;

  console.log('useCampaignData - Existing creator IDs (for exclusion in modal):', existingCreatorIds);

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
