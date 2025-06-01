
import { Badge } from '@/components/ui/badge';

interface Campaign {
  campaignName: string;
  description: string;
  status: string;
}

interface CampaignViewHeaderProps {
  campaign: Campaign;
}

export const CampaignViewHeader = ({ campaign }: CampaignViewHeaderProps) => {
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
    </div>
  );
};
