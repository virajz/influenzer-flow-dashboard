
import { useParams } from 'react-router-dom';
import { CampaignViewHeader } from '@/components/campaigns/CampaignViewHeader';
import { CampaignMetrics } from '@/components/campaigns/CampaignMetrics';
import { CampaignMainContent } from '@/components/campaigns/CampaignMainContent';
import { useCampaignData } from '@/hooks/useCampaignData';
import { useCampaignActions } from '@/hooks/useCampaignActions';
import { useState } from 'react';

const CampaignView = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [showCreatorSelectionModal, setShowCreatorSelectionModal] = useState(false);

  const {
    campaign,
    creatorAssignments,
    negotiations,
    allCreators,
    contactedCreators,
    allContactedCreatorIds,
    refetchAssignments,
    isLoading
  } = useCampaignData(campaignId);

  const {
    handleAutoEmail,
    handleAgentCall,
    isEmailLoading,
    isCallLoading
  } = useCampaignActions(campaignId, campaign, negotiations, allCreators, refetchAssignments);

  if (isLoading) {
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
    <div className="p-8 h-screen flex flex-col">
      <CampaignViewHeader 
        campaign={campaign} 
        onAddCreator={() => setShowCreatorSelectionModal(true)}
      />
      
      <CampaignMetrics campaign={campaign} />

      <CampaignMainContent
        campaignId={campaignId || ''}
        contactedCreators={contactedCreators}
        negotiations={negotiations}
        creatorAssignments={creatorAssignments}
        allContactedCreatorIds={allContactedCreatorIds}
        onAutoEmail={handleAutoEmail}
        onAgentCall={handleAgentCall}
        isEmailLoading={isEmailLoading}
        isCallLoading={isCallLoading}
        onCreatorAssigned={refetchAssignments}
        showCreatorSelectionModal={showCreatorSelectionModal}
        setShowCreatorSelectionModal={setShowCreatorSelectionModal}
      />
    </div>
  );
};

export default CampaignView;
