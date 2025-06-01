import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { creatorsService } from '@/services/creatorsService';
import { creatorAssignmentsService } from '@/services/creatorAssignmentsService';
import { campaignsService } from '@/services/campaignsService';
import { negotiationsService, Negotiation } from '@/services/negotiationsService';
import { communicationHistoryService, CommunicationRecord } from '@/services/communicationHistoryService';
import { CampaignAssignmentModal } from '@/components/campaigns/CampaignAssignmentModal';
import { OutreachActions } from '@/components/outreach/OutreachActions';
import { EmailComposerModal, EmailData } from '@/components/outreach/EmailComposerModal';
import { toast } from '@/hooks/use-toast';
import { FiUsers, FiDollarSign, FiMapPin, FiMail, FiPhone, FiMessageSquare, FiCalendar } from 'react-icons/fi';

const CreatorProfile = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const { currentUser } = useAuth();
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Fetch creator data
  const { data: allCreators = [], isLoading: creatorsLoading } = useQuery({
    queryKey: ['creators'],
    queryFn: creatorsService.getAllCreators,
  });

  const creator = allCreators.find(c => c.id === creatorId);

  // Fetch negotiations for this creator
  const { data: negotiations = [], refetch: refetchNegotiations } = useQuery({
    queryKey: ['negotiations', creatorId],
    queryFn: async () => {
      if (!creatorId) return [];
      return await negotiationsService.getNegotiationsByCreator(creatorId);
    },
    enabled: !!creatorId,
  });

  // Fetch campaigns
  const { data: allCampaigns = [] } = useQuery({
    queryKey: ['campaigns', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser?.uid) return [];
      return await campaignsService.getCampaignsByBrand(currentUser.uid);
    },
    enabled: !!currentUser?.uid,
  });

  // Fetch communication history
  const { data: communicationHistory = [], refetch: refetchHistory } = useQuery({
    queryKey: ['communication-history', creatorId, currentUser?.uid],
    queryFn: async () => {
      if (!creatorId || !currentUser?.uid) return [];
      return await communicationHistoryService.getCommunicationHistory(creatorId, currentUser.uid);
    },
    enabled: !!creatorId && !!currentUser?.uid,
  });

  // Get campaigns with negotiations
  const campaignsWithNegotiations = allCampaigns.map(campaign => {
    const negotiation = negotiations.find(n => n.campaignId === campaign.campaignId);
    return { campaign, negotiation };
  });

  const currentCampaigns = campaignsWithNegotiations.filter(({ campaign, negotiation }) => {
    const endDate = new Date(campaign.endDate);
    const today = new Date();
    return (campaign.status === 'active' || campaign.status === 'draft' || endDate >= today) && 
           (!negotiation || !['rejected', 'cancelled'].includes(negotiation.status));
  });

  const pastCampaigns = campaignsWithNegotiations.filter(({ campaign, negotiation }) => {
    const endDate = new Date(campaign.endDate);
    const today = new Date();
    return endDate < today || campaign.status === 'completed' || campaign.status === 'cancelled' ||
           (negotiation && ['rejected', 'cancelled', 'accepted'].includes(negotiation.status));
  });

  const handleManualEmail = () => {
    setShowEmailModal(true);
  };

  const handleAutoEmail = async (campaignId: string) => {
    if (!currentUser?.uid || !creatorId) return;

    try {
      // Create or update negotiation
      let negotiation = negotiations.find(n => n.campaignId === campaignId);
      
      if (!negotiation) {
        const campaign = allCampaigns.find(c => c.campaignId === campaignId);
        if (!campaign) return;

        const negotiationId = await negotiationsService.createNegotiation({
          campaignId,
          brandId: currentUser.uid,
          creatorId,
          status: 'email_sent',
          proposedRate: creator?.baseRate || 0,
          counterRate: 0,
          finalRate: 0,
          maxBudget: campaign.budget,
          deliverables: [],
          aiAgentNotes: '',
          creatorAvailability: 'unknown',
          initialContactMethod: 'email',
          phoneContactAttempted: false,
          voiceCallCompleted: false,
          escalationCount: 0
        });
      } else {
        await negotiationsService.updateNegotiation(negotiation.negotiationId, {
          status: 'email_sent'
        });
      }

      // Add communication record
      await communicationHistoryService.addCommunicationRecord({
        creatorId,
        brandId: currentUser.uid,
        campaignId,
        negotiationId: negotiation?.negotiationId,
        type: 'email',
        method: 'auto',
        subject: 'Collaboration Opportunity',
        status: 'sent',
        details: 'Auto-generated email sent with campaign details',
        timestamp: new Date().toISOString()
      });

      refetchNegotiations();
      refetchHistory();
      
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

  const handleEmailSend = async (emailData: EmailData) => {
    if (!currentUser?.uid || !creatorId) return;

    try {
      // Add communication record
      await communicationHistoryService.addCommunicationRecord({
        creatorId,
        brandId: currentUser.uid,
        type: 'email',
        method: 'manual',
        subject: emailData.subject,
        content: emailData.content,
        status: 'sent',
        details: `Manual email sent: ${emailData.subject}`,
        timestamp: new Date().toISOString()
      });

      refetchHistory();
      
      toast({
        title: "Email Sent!",
        description: "Your email has been sent to the creator.",
      });
    } catch (error) {
      console.error('Error sending email:', error);
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
      // Add communication record
      await communicationHistoryService.addCommunicationRecord({
        creatorId,
        brandId: currentUser.uid,
        campaignId,
        type: 'agent_call',
        method: 'ai_agent',
        subject: 'AI Agent Call',
        status: 'completed',
        details: 'AI agent call initiated',
        timestamp: new Date().toISOString(),
        metadata: {
          hasAudio: true,
          hasTranscript: true,
          duration: 0
        }
      });

      // Update negotiation if exists
      if (campaignId) {
        const negotiation = negotiations.find(n => n.campaignId === campaignId);
        if (negotiation) {
          await negotiationsService.updateNegotiation(negotiation.negotiationId, {
            status: 'phone_contacted',
            phoneContactAttempted: true
          });
          refetchNegotiations();
        }
      }

      refetchHistory();
      
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
    refetchNegotiations();
    toast({
      title: "Success!",
      description: "Creator has been assigned to the selected campaign.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <FiMail className="h-4 w-4" />;
      case 'call':
      case 'agent_call':
        return <FiPhone className="h-4 w-4" />;
      case 'dm':
        return <FiMessageSquare className="h-4 w-4" />;
      default:
        return <FiMail className="h-4 w-4" />;
    }
  };

  if (creatorsLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Creator Not Found</h1>
          <p className="text-gray-600 mt-2">The creator you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Creator Header */}
      <Card className="rounded-2xl shadow-md mb-8">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={creator.avatar} alt={creator.name} className="object-cover" />
              <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{creator.name}</h1>
                  <p className="text-lg text-gray-600">{creator.handle}</p>
                </div>
                <Badge className={getStatusColor('active')}>Available</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <FiUsers className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Followers</p>
                    <p className="font-semibold">{creator.followers.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FiDollarSign className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Base Rate</p>
                    <p className="font-semibold">${creator.baseRate.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-purple-500 rounded text-white flex items-center justify-center text-xs">%</div>
                  <div>
                    <p className="text-sm text-gray-500">Engagement Rate</p>
                    <p className="font-semibold">{creator.engagementRate}%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{creator.category}</Badge>
                  {creator.platforms.map((platform) => (
                    <Badge key={platform} variant="outline">{platform}</Badge>
                  ))}
                </div>
                
                {creator.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiMapPin className="h-4 w-4" />
                    <span>{creator.location}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mt-4">{creator.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Campaigns</TabsTrigger>
          <TabsTrigger value="past">Past Campaigns</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Current Campaigns Tab */}
        <TabsContent value="current">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Current Campaigns</CardTitle>
              <CardDescription>Active campaigns and outreach status</CardDescription>
            </CardHeader>
            <CardContent>
              {currentCampaigns.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No current campaigns assigned</p>
                  <Button 
                    onClick={() => setShowAssignmentModal(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Add to Campaign
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {currentCampaigns.map(({ campaign, negotiation }) => (
                    <div key={campaign.campaignId} className="p-6 border rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">{campaign.campaignName}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FiCalendar className="h-4 w-4" />
                            {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <FiDollarSign className="h-4 w-4" />
                            ${campaign.budget.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{campaign.description}</p>

                      <OutreachActions
                        negotiation={negotiation}
                        creatorPhone={creator.phone}
                        onManualEmail={handleManualEmail}
                        onAutoEmail={() => handleAutoEmail(campaign.campaignId)}
                        onAgentCall={() => handleAgentCall(campaign.campaignId)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Past Campaigns Tab */}
        <TabsContent value="past">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Past Campaigns</CardTitle>
              <CardDescription>Completed or cancelled campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {pastCampaigns.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No past campaigns found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastCampaigns.map(({ campaign, negotiation }) => (
                    <div key={campaign.campaignId} className="p-4 border rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{campaign.campaignName}</h3>
                        <div className="flex items-center gap-2">
                          {negotiation && (
                            <Badge className={`bg-${negotiation.status === 'accepted' ? 'green' : negotiation.status === 'rejected' ? 'red' : 'gray'}-100 text-${negotiation.status === 'accepted' ? 'green' : negotiation.status === 'rejected' ? 'red' : 'gray'}-800`}>
                              {negotiation.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          )}
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{campaign.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="h-4 w-4" />
                          {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <FiDollarSign className="h-4 w-4" />
                          ${campaign.budget.toLocaleString()}
                        </div>
                        {negotiation?.finalRate && (
                          <div className="flex items-center gap-1">
                            <span>Final Rate: ${negotiation.finalRate.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
              <CardDescription>All interactions with this creator</CardDescription>
            </CardHeader>
            <CardContent>
              {communicationHistory.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No communication history found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {communicationHistory.map((item) => (
                    <div key={item.id} className="p-4 border rounded-xl">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getCommunicationIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{item.subject}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{item.details}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{item.type}</Badge>
                            <Badge variant="outline">{item.method}</Badge>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                            {item.metadata?.hasAudio && (
                              <Badge variant="outline" className="text-blue-600">
                                Audio Available
                              </Badge>
                            )}
                            {item.metadata?.hasTranscript && (
                              <Badge variant="outline" className="text-green-600">
                                Transcript Available
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CampaignAssignmentModal
        open={showAssignmentModal}
        onOpenChange={setShowAssignmentModal}
        selectedCreatorIds={creatorId ? [creatorId] : []}
        onAssignmentComplete={handleAssignmentComplete}
      />

      <EmailComposerModal
        open={showEmailModal}
        onOpenChange={setShowEmailModal}
        creatorName={creator.name}
        creatorEmail={creator.email}
        onSend={handleEmailSend}
      />
    </div>
  );
};

export default CreatorProfile;
