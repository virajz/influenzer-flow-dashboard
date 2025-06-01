import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, PhoneCall } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { campaignsService } from '@/services/campaignsService';
import { negotiationsService } from '@/services/negotiationsService';
import { creatorsService } from '@/services/creatorsService';
import { creatorAssignmentsService } from '@/services/creatorAssignmentsService';
import { communicationsService } from '@/services/communicationsService';
import { apiService } from '@/services/apiService';
import { CommunicationHistoryTab } from '@/components/creators/CommunicationHistoryTab';
import { CampaignViewHeader } from '@/components/campaigns/CampaignViewHeader';
import { CampaignMetrics } from '@/components/campaigns/CampaignMetrics';
import { ContactedCreatorsList } from '@/components/campaigns/ContactedCreatorsList';
import { CreatorSelectionModal } from '@/components/campaigns/CreatorSelectionModal';
import { useRealTimeCommunications } from '@/hooks/useRealTimeCommunications';
import { toast } from '@/hooks/use-toast';

const CampaignView = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { currentUser } = useAuth();
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [showCreatorSelectionModal, setShowCreatorSelectionModal] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isCallLoading, setIsCallLoading] = useState(false);

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
  const { data: creatorAssignments = [], isLoading: assignmentsLoading, refetch: refetchAssignments } = useQuery({
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

  // Get negotiation IDs for selected creator for real-time communications
  const selectedNegotiationIds = selectedCreatorId 
    ? negotiations.filter(n => n.creatorId === selectedCreatorId).map(n => n.negotiationId)
    : [];

  // Use real-time communications hook
  const { communications, isLoading: communicationsLoading } = useRealTimeCommunications(selectedNegotiationIds);

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

  // Get selected creator data and assignment
  const selectedCreator = selectedCreatorId ? allCreators.find(c => c.creatorId === selectedCreatorId) : null;
  const selectedCreatorAssignment = selectedCreatorId ? creatorAssignments.find(a => a.creatorId === selectedCreatorId) : null;
  const hasPhone = selectedCreatorAssignment?.phoneDiscovered !== false;

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
      console.error('Error sending auto email:', error);
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
      console.error('Error initiating agent call:', error);
      toast({
        title: "Error",
        description: "Failed to initiate call. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCallLoading(false);
    }
  };

  const handleCreatorAssigned = () => {
    refetchAssignments();
    setShowCreatorSelectionModal(false);
  };

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
      <CampaignViewHeader 
        campaign={campaign} 
        onAddCreator={() => setShowCreatorSelectionModal(true)}
      />
      
      <CampaignMetrics campaign={campaign} />

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Left Sidebar - Contacted Creators */}
        <div className="w-1/3">
          <ContactedCreatorsList
            contactedCreators={contactedCreators}
            selectedCreatorId={selectedCreatorId}
            onCreatorSelect={setSelectedCreatorId}
            negotiationsCount={negotiations.length}
            allNegotiationsCount={0}
            creatorAssignments={creatorAssignments}
            communications={communications}
          />
        </div>

        {/* Right Content - Communication History */}
        <div className="flex-1">
          {selectedCreatorId ? (
            communicationsLoading ? (
              <Card className="rounded-2xl shadow-md">
                <CardContent className="p-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading communications...</p>
                  </div>
                </CardContent>
              </Card>
            ) : communications.length > 0 ? (
              <CommunicationHistoryTab 
                communications={communications} 
                showAgentCall={hasPhone}
                onAgentCall={() => handleAgentCall(selectedCreatorId)}
                isCallLoading={isCallLoading}
              />
            ) : (
              <Card className="rounded-2xl shadow-md">
                <CardContent className="p-12">
                  <div className="text-center space-y-4">
                    <p className="text-gray-600 mb-4">No communication history found</p>
                    <p className="text-sm text-gray-500 mb-6">Start outreach using the buttons below</p>
                    
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={() => handleAutoEmail(selectedCreatorId)}
                        disabled={isEmailLoading}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        {isEmailLoading ? 'Sending...' : 'Auto Email'}
                      </Button>
                      <Button
                        onClick={() => handleAgentCall(selectedCreatorId)}
                        disabled={!hasPhone || isCallLoading}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <PhoneCall className="h-4 w-4" />
                        {isCallLoading ? 'Calling...' : 'Agent Call'}
                        {!hasPhone && <span className="text-xs ml-1">(No Phone)</span>}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
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

      {showCreatorSelectionModal && (
        <CreatorSelectionModal
          open={showCreatorSelectionModal}
          onOpenChange={setShowCreatorSelectionModal}
          campaignId={campaignId || ''}
          onCreatorAssigned={handleCreatorAssigned}
        />
      )}
    </div>
  );
};

export default CampaignView;
