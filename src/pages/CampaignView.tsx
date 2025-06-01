
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { campaignsService } from '@/services/campaignsService';
import { negotiationsService } from '@/services/negotiationsService';
import { creatorsService } from '@/services/creatorsService';
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
  console.log('CampaignView - currentUser:', currentUser?.uid);

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

  // Fetch ALL negotiations for debugging
  const { data: allNegotiations = [] } = useQuery({
    queryKey: ['all-negotiations'],
    queryFn: async () => {
      const negotiationsData = await negotiationsService.getAllNegotiations();
      console.log('ALL negotiations fetched:', negotiationsData);
      return negotiationsData;
    },
  });

  // Fetch negotiations for this campaign with enhanced error handling
  const { data: negotiations = [], isLoading: negotiationsLoading, error: negotiationsError } = useQuery({
    queryKey: ['negotiations', campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      console.log('=== STARTING NEGOTIATION QUERY ===');
      console.log('Query campaignId:', campaignId);
      console.log('Query campaignId type:', typeof campaignId);
      
      try {
        const negotiationsData = await negotiationsService.getNegotiationsByCampaign(campaignId);
        console.log('=== NEGOTIATION QUERY SUCCESSFUL ===');
        console.log('Negotiations fetched for campaign:', campaignId, negotiationsData);
        console.log('Number of negotiations:', negotiationsData.length);
        return negotiationsData;
      } catch (error) {
        console.error('=== NEGOTIATION QUERY FAILED ===');
        console.error('Error:', error);
        throw error;
      }
    },
    enabled: !!campaignId,
    retry: false, // Don't retry on failure so we can see the exact error
  });

  // Log any query errors
  if (negotiationsError) {
    console.error('React Query negotiationsError:', negotiationsError);
  }

  // Fetch all creators to get creator details
  const { data: allCreators = [] } = useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const creatorsData = await creatorsService.getAllCreators();
      console.log('All creators fetched:', creatorsData.length);
      console.log('Creator IDs available:', creatorsData.map(c => c.creatorId));
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

  // Get contacted creators (those with negotiations)
  const contactedCreators = negotiations.map(negotiation => {
    console.log('Processing negotiation with creatorId:', negotiation.creatorId);
    const creator = allCreators.find(c => {
      console.log(`Comparing negotiation.creatorId "${negotiation.creatorId}" with creator.creatorId "${c.creatorId}"`);
      return c.creatorId === negotiation.creatorId;
    });
    console.log('Looking for creator with ID:', negotiation.creatorId, 'Found:', !!creator);
    if (creator) {
      console.log('Found creator:', creator.displayName, creator.email);
    } else {
      console.log('No creator found for negotiation creatorId:', negotiation.creatorId);
      console.log('Available creator IDs:', allCreators.map(c => c.creatorId));
    }
    return {
      creator,
      negotiation,
    };
  }).filter(item => item.creator);

  console.log('Final contacted creators:', contactedCreators);

  if (campaignLoading || negotiationsLoading) {
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
        <div className="w-1/4">
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
