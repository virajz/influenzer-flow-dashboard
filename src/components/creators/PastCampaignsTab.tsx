
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FiCalendar, FiDollarSign } from 'react-icons/fi';
import { Campaign } from '@/services/campaignsService';
import { Negotiation } from '@/services/negotiationsService';

interface PastCampaignsTabProps {
  pastCampaigns: Array<{ campaign: Campaign; negotiation: Negotiation | undefined }>;
}

export const PastCampaignsTab = ({ pastCampaigns }: PastCampaignsTabProps) => {
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

  return (
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
  );
};
