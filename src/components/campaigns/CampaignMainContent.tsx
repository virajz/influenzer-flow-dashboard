import { useState } from 'react';
import { ContactedCreatorsList } from './ContactedCreatorsList';
import { CommunicationPanel } from './CommunicationPanel';
import { CreatorSelectionModal } from './CreatorSelectionModal';
import { useRealTimeCommunications } from '@/hooks/useRealTimeCommunications';

interface CampaignMainContentProps {
    campaignId: string;
    contactedCreators: any[];
    negotiations: any[];
    creatorAssignments: any[];
    allContactedCreatorIds: string[];
    existingCreatorIds: string[];
    onAutoEmail: (creatorId: string) => void;
    onAgentCall: (creatorId: string) => void;
    isEmailLoading: boolean;
    isCallLoading: boolean;
    onCreatorAssigned: () => void;
    showCreatorSelectionModal: boolean;
    setShowCreatorSelectionModal: (show: boolean) => void;
}

export const CampaignMainContent = ({
    campaignId,
    contactedCreators,
    negotiations,
    creatorAssignments,
    allContactedCreatorIds,
    existingCreatorIds,
    onAutoEmail,
    onAgentCall,
    isEmailLoading,
    isCallLoading,
    onCreatorAssigned,
    showCreatorSelectionModal,
    setShowCreatorSelectionModal
}: CampaignMainContentProps) => {
    const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);

    // Get negotiation IDs for selected creator for real-time communications
    const selectedNegotiationIds = selectedCreatorId
        ? negotiations.filter(n => n.creatorId === selectedCreatorId).map(n => n.negotiationId)
        : [];

    // Use real-time communications hook
    const { communications, isLoading: communicationsLoading } = useRealTimeCommunications(selectedNegotiationIds);

    // Get selected creator assignment
    const selectedCreatorAssignment = selectedCreatorId ? creatorAssignments.find(a => a.creatorId === selectedCreatorId) : null;
    const hasPhone = selectedCreatorAssignment?.phoneDiscovered !== false;

    const creatorName = contactedCreators.find((creator) => {
        return creator.creator.creatorId === selectedCreatorId;
    })?.creator.displayName || 'Unknown Creator';

    console.log('Selected Creator ID:', creatorName);

    const handleCreatorAssignedInternal = () => {
        onCreatorAssigned();
        setShowCreatorSelectionModal(false);
    };

    return (
        <>
            {/* Main Content */}
            <div className="flex gap-6 flex-1 min-h-0">
                {/* Left Sidebar - Contacted Creators */}
                <div className="w-1/3 flex flex-col min-h-0">
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
                <div className="flex-1 flex flex-col min-h-0">
                    <CommunicationPanel
                        selectedCreatorId={selectedCreatorId}
                        communications={communications}
                        communicationsLoading={communicationsLoading}
                        hasPhone={hasPhone}
                        isEmailLoading={isEmailLoading}
                        isCallLoading={isCallLoading}
                        onAutoEmail={onAutoEmail}
                        onAgentCall={onAgentCall}
                        negotiationIds={selectedNegotiationIds}
                        creatorName={creatorName}
                    />
                </div>
            </div>

            {showCreatorSelectionModal && (
                <CreatorSelectionModal
                    open={showCreatorSelectionModal}
                    onOpenChange={setShowCreatorSelectionModal}
                    campaignId={campaignId}
                    onCreatorAssigned={handleCreatorAssignedInternal}
                    existingCreatorIds={existingCreatorIds}
                />
            )}
        </>
    );
};
