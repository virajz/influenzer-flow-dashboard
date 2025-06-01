
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OutreachActions } from '@/components/outreach/OutreachActions';
import { FiCalendar, FiDollarSign } from 'react-icons/fi';
import { Plus } from 'lucide-react';
import { Campaign } from '@/services/campaignsService';
import { Negotiation } from '@/services/negotiationsService';
import { Creator } from '@/services/creatorsService';

interface CurrentCampaignsTabProps {
  currentCampaigns: Array<{ campaign: Campaign; negotiation: Negotiation | undefined }>;
  creator: Creator;
  onAssignToCampaign: () => void;
  onAutoEmail: (campaignId: string) => void;
  onAgentCall: (campaignId: string) => void;
}

export const CurrentCampaignsTab = ({
  currentCampaigns,
  creator,
  onAssignToCampaign,
  onAutoEmail,
  onAgentCall
}: CurrentCampaignsTabProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Current Campaigns</CardTitle>
          <CardDescription>Active campaigns and outreach status</CardDescription>
        </div>
        <Button 
          onClick={onAssignToCampaign}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Assign to Campaign
        </Button>
      </CardHeader>
      <CardContent>
        {currentCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No current campaigns assigned</p>
            <p className="text-sm text-gray-500">
              Use the "Assign to Campaign" button above to add this creator to a campaign.
            </p>
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
                  onAutoEmail={() => onAutoEmail(campaign.campaignId)}
                  onAgentCall={() => onAgentCall(campaign.campaignId)}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
