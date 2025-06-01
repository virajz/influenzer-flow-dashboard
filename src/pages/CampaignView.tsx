
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

  // Get contacted creators (those with negotiations)
  const contactedCreators = negotiations.map(negotiation => {
    const creator = allCreators.find(c => c.creatorId === negotiation.creatorId);
    return {
      creator,
      negotiation,
    };
  }).filter(item => item.creator);

  console.log('Final contacted creators:', contactedCreators.length);

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
