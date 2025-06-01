
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import { filterCampaignsByStatus } from '@/utils/campaignFilters';
import { CreatorProfileContent } from '@/components/creators/CreatorProfileContent';
import { CreatorProfileLoading } from '@/components/creators/CreatorProfileLoading';
import { CreatorNotFound } from '@/components/creators/CreatorNotFound';

const CreatorProfile = () => {
  const {
    creatorId,
    creator,
    negotiations,
    allCampaigns,
    allCommunications,
    showAssignmentModal,
    setShowAssignmentModal,
    creatorsLoading,
    negotiationsLoading,
    handleAutoEmail,
    handleAgentCall,
    handleAssignmentComplete
  } = useCreatorProfile();

  if (creatorsLoading || negotiationsLoading) {
    return <CreatorProfileLoading />;
  }

  if (!creator) {
    return <CreatorNotFound />;
  }

  const { currentCampaigns, pastCampaigns } = filterCampaignsByStatus(allCampaigns, negotiations);

  return (
    <CreatorProfileContent
      creator={creator}
      currentCampaigns={currentCampaigns}
      pastCampaigns={pastCampaigns}
      allCommunications={allCommunications}
      showAssignmentModal={showAssignmentModal}
      onAssignmentModalChange={setShowAssignmentModal}
      onAutoEmail={handleAutoEmail}
      onAgentCall={handleAgentCall}
      onAssignmentComplete={handleAssignmentComplete}
      creatorId={creatorId || ''}
    />
  );
};

export default CreatorProfile;
