import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { campaignsService } from '@/services/campaignsService';
import { negotiationsService } from '@/services/negotiationsService';
import { creatorsService } from '@/services/creatorsService';
import { communicationsService } from '@/services/communicationsService';
import { CommunicationHistoryTab } from '@/components/creators/CommunicationHistoryTab';

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

  // Fetch negotiations for this campaign
  const { data: negotiations = [], isLoading: negotiationsLoading } = useQuery({
    queryKey: ['negotiations', campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      const negotiationsData = await negotiationsService.getNegotiationsByCampaign(campaignId);
      console.log('Negotiations fetched for campaign:', campaignId, negotiationsData);
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
    console.log('Looking for creator with ID:', negotiation.creatorId, 'Found:', !!creator);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'negotiating':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      {/* Campaign Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{campaign.campaignName}</h1>
            <p className="text-gray-600 mt-2">{campaign.description}</p>
          </div>
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Budget</div>
              <div className="text-2xl font-bold">₹{campaign.budget.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Duration</div>
              <div className="text-lg font-semibold">
                {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Contacted Creators</div>
              <div className="text-2xl font-bold">{contactedCreators.length}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Left Sidebar - Contacted Creators */}
        <div className="w-1/4">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Contacted Creators</CardTitle>
            </CardHeader>
            <CardContent>
              {contactedCreators.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No creators contacted yet</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Debug: Found {negotiations.length} negotiations, {allCreators.length} total creators
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {contactedCreators.map(({ creator, negotiation }) => (
                    <div
                      key={creator.creatorId}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedCreatorId === creator.creatorId
                          ? 'bg-purple-100 border-purple-200'
                          : 'hover:bg-gray-50 border-gray-200'
                      } border`}
                      onClick={() => setSelectedCreatorId(creator.creatorId)}
                    >
                      <div className="font-medium text-sm">{creator.displayName}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {creator.instagramHandle && `@${creator.instagramHandle}`}
                      </div>
                      <Badge 
                        variant="outline" 
                        className="mt-2 text-xs"
                      >
                        {negotiation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
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
