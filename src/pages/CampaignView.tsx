
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { campaignsService } from '@/services/campaignsService';
import { negotiationsService } from '@/services/negotiationsService';
import { creatorsService } from '@/services/creatorsService';
import { creatorAssignmentsService } from '@/services/creatorAssignmentsService';
import { communicationsService } from '@/services/communicationsService';
import { CommunicationHistoryTab } from '@/components/creators/CommunicationHistoryTab';
import { CampaignViewHeader } from '@/components/campaigns/CampaignViewHeader';
import { CampaignMetrics } from '@/components/campaigns/CampaignMetrics';
import { ContactedCreatorsList } from '@/components/campaigns/ContactedCreatorsList';
import { CampaignDebugSection } from '@/components/campaigns/CampaignDebugSection';

const CampaignView = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { currentUser } = useAuth();
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);

  console.log('CampaignView - campaignId:', campaignId);

  // Fetch campaign details
  const { data: campaign, isLoading: campaignLoading } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      if (!campaignId) throw new Error('Campaign ID is required');
      const campaignData = await campaignsService.getCampaignById(campaignId);
      console.log('Campaign data fetched:', campaignData);
      return campaignData;
    },
    enabled: !!campaignId,
  });

  // Fetch creator assignments for current user
  const { data: creatorAssignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['creatorAssignments', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser?.uid) return [];
      console.log('Fetching creator assignments for user:', currentUser.uid);
      const assignments = await creatorAssignmentsService.getAssignmentsByUser(currentUser.uid);
      console.log('Creator assignments fetched:', assignments.length);
      return assignments;
    },
    enabled: !!currentUser?.uid,
  });

  // Fetch ALL negotiations for debugging
  const { data: allNegotiations = [] } = useQuery({
    queryKey: ['all-negotiations'],
    queryFn: async () => {
      const negotiationsData = await negotiationsService.getAllNegotiations();
      console.log('ALL negotiations fetched:', negotiationsData.length);
      return negotiationsData;
    },
  });

  // Fetch negotiations for this campaign
  const { data: negotiations = [], isLoading: negotiationsLoading } = useQuery({
    queryKey: ['negotiations', campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      console.log('Fetching negotiations for campaign:', campaignId);
      
      const negotiationsData = await negotiationsService.getNegotiationsByCampaign(campaignId);
      console.log('Negotiations fetched for campaign:', negotiationsData.length);
      return negotiationsData;
    },
    enabled: !!campaignId,
  });

  // Fetch all creators to get creator details
  const { data: allCreators = [] } = useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const creatorsData = await creatorsService.getAllCreators();
      console.log('All creators fetched:', creatorsData.length);
      return creatorsData;
    },
  });

  // Fetch communications for selected negotiation
  const selectedNegotiation = negotiations.find(n => n.creatorId === selectedCreatorId);
  const { data: communications = [] } = useQuery({
    queryKey: ['communications', selectedNegotiation?.negotiationId],
    queryFn: async () => {
      if (!selectedNegotiation?.negotiationId) return [];
      return await communicationsService.getCommunicationsByNegotiation(selectedNegotiation.negotiationId);
    },
    enabled: !!selectedNegotiation?.negotiationId,
  });

  // Get creators assigned to this campaign from creatorAssignments
  const assignedCreatorIds = creatorAssignments
    .filter(assignment => assignment.campaignIds.includes(campaignId || ''))
    .map(assignment => assignment.creatorId);

  console.log('Creators assigned to this campaign:', assignedCreatorIds.length);

  // Get creators who have negotiations for this campaign
  const negotiationCreatorIds = negotiations.map(n => n.creatorId);

  // Combine both sets of creator IDs (unique)
  const allContactedCreatorIds = [...new Set([...assignedCreatorIds, ...negotiationCreatorIds])];

  console.log('Total contacted creators (assignments + negotiations):', allContactedCreatorIds.length);

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

  console.log('Final contacted creators:', contactedCreators.length);

  if (campaignLoading || negotiationsLoading || assignmentsLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading campaign...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h1>
          <p className="text-gray-600">The campaign you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <CampaignDebugSection 
        campaignId={campaignId}
        allNegotiations={allNegotiations}
        negotiations={negotiations}
      />

      <CampaignViewHeader campaign={campaign} />
      
      <CampaignMetrics 
        campaign={campaign}
        contactedCreatorsCount={contactedCreators.length}
      />

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Left Sidebar - Contacted Creators */}
        <div className="w-1/3">
          <ContactedCreatorsList
            contactedCreators={contactedCreators}
            selectedCreatorId={selectedCreatorId}
            onCreatorSelect={setSelectedCreatorId}
            negotiationsCount={negotiations.length}
            allNegotiationsCount={allNegotiations.length}
          />
        </div>

        {/* Right Content - Communication History */}
        <div className="flex-1">
          {selectedCreatorId ? (
            <CommunicationHistoryTab communications={communications} />
          ) : (
            <Card className="rounded-2xl shadow-md">
              <CardContent className="p-12">
                <div className="text-center">
                  <p className="text-gray-600">Select a creator to view communication history</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignView;
