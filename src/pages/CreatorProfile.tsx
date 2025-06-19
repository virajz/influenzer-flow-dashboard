
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
    showAssignmentModal,
    setShowAssignmentModal,
    creatorsLoading,
    negotiationsLoading,
    handleAutoEmail,
    handleAgentCall,
    handleAssignmentComplete
  } = useCreatorProfile();

  if (creatorsLoading || negotiationsLoading) {
    return (
      <div className="p-4 lg:p-8">
        <CreatorProfileLoading />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="p-4 lg:p-8">
        <CreatorNotFound />
      </div>
    );
  }

  const { currentCampaigns, pastCampaigns } = filterCampaignsByStatus(allCampaigns, negotiations);

  return (
    <div className="p-4 lg:p-8">
      <CreatorProfileContent
        creator={creator}
        currentCampaigns={currentCampaigns}
        pastCampaigns={pastCampaigns}
        showAssignmentModal={showAssignmentModal}
        onAssignmentModalChange={setShowAssignmentModal}
        onAutoEmail={handleAutoEmail}
        onAgentCall={handleAgentCall}
        onAssignmentComplete={handleAssignmentComplete}
        creatorId={creatorId || ''}
      />
    </div>
  );
};

export default CreatorProfile;
