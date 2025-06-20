import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { campaignsService, Campaign } from '@/services/campaignsService';
import { creatorAssignmentsService } from '@/services/creatorAssignmentsService';
import { toast } from '@/hooks/use-toast';
import { Calendar, DollarSign } from 'lucide-react';

interface CampaignAssignmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCreatorIds: string[];
    onAssignmentComplete: () => void;
}

export const CampaignAssignmentModal = ({
    open,
    onOpenChange,
    selectedCreatorIds,
    onAssignmentComplete
}: CampaignAssignmentModalProps) => {
    const { currentUser } = useAuth();
    const queryClient = useQueryClient();
    const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
    const [isAssigning, setIsAssigning] = useState(false);

    // Fetch assignable campaigns (draft and active)
    const { data: campaigns = [], isLoading } = useQuery({
        queryKey: ['campaigns', currentUser?.uid],
        queryFn: async () => {
            if (!currentUser?.uid) return [];
            const allCampaigns = await campaignsService.getCampaignsByBrand(currentUser.uid);
            console.log('All campaigns fetched for assignment:', allCampaigns);
            // Include both draft and active campaigns for assignment
            const assignableCampaigns = allCampaigns.filter(campaign =>
                campaign.status === 'active' || campaign.status === 'draft'
            );
            console.log('Assignable campaigns:', assignableCampaigns);
            return assignableCampaigns;
        },
        enabled: !!currentUser?.uid && open,
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleAssign = async () => {
        if (!selectedCampaignId || !currentUser?.uid) return;

        setIsAssigning(true);
        try {
            // Check for existing assignments and create/update them
            let assignedCount = 0;
            let alreadyAssignedCount = 0;

            for (const creatorId of selectedCreatorIds) {
                const isAlreadyAssigned = await creatorAssignmentsService.isCreatorAssigned(
                    currentUser.uid,
                    creatorId,
                    selectedCampaignId
                );

                if (isAlreadyAssigned) {
                    alreadyAssignedCount++;
                } else {
                    await creatorAssignmentsService.createOrUpdateAssignment(
                        currentUser.uid,
                        creatorId,
                        selectedCampaignId
                    );
                    assignedCount++;
                }

                // Invalidate caches for each creator
                queryClient.invalidateQueries({
                    queryKey: ['creatorAssignments', currentUser.uid, creatorId]
                });
            }

            // Invalidate broader assignment queries
            queryClient.invalidateQueries({
                queryKey: ['creatorAssignments', currentUser.uid]
            });

            // Show appropriate toast message
            if (assignedCount > 0) {
                toast({
                    title: "Creators Assigned!",
                    description: `${assignedCount} creator(s) successfully assigned to campaign.${alreadyAssignedCount > 0 ? ` ${alreadyAssignedCount} were already assigned.` : ''
                        }`,
                });
            } else if (alreadyAssignedCount > 0) {
                toast({
                    title: "Already Assigned",
                    description: "All selected creators were already assigned to this campaign.",
                    variant: "destructive"
                });
            }

            onAssignmentComplete();
            onOpenChange(false);
            setSelectedCampaignId('');
        } catch (error) {
            console.error('Error assigning creators:', error);
            toast({
                title: "Error",
                description: "Failed to assign creators to campaign. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsAssigning(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Assign Creators to Campaign</DialogTitle>
                    <DialogDescription>
                        Select a campaign to assign {selectedCreatorIds.length} selected creator(s).
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No assignable campaigns found.</p>
                            <p className="text-sm text-gray-500 mt-2">Create a campaign first to assign creators.</p>
                        </div>
                    ) : (
                        <RadioGroup value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {campaigns.map((campaign) => (
                                    <div key={campaign.campaignId} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                                        <RadioGroupItem value={campaign.campaignId} id={campaign.campaignId} />
                                        <Label htmlFor={campaign.campaignId} className="flex-1 cursor-pointer">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{campaign.campaignName}</h4>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{campaign.description}</p>

                                                    <div className="flex items-center gap-4 mt-2">
                                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                                            <DollarSign className="h-4 w-4" />
                                                            ₹{campaign.budgetPerCreator.toLocaleString()}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                                            <Calendar className="h-4 w-4" />
                                                            {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge className={getStatusColor(campaign.status)}>
                                                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                                </Badge>
                                            </div>
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAssign}
                        disabled={!selectedCampaignId || isAssigning || campaigns.length === 0}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {isAssigning ? 'Assigning...' : 'Assign to Campaign'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
