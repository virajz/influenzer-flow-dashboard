
import { Card, CardContent } from '@/components/ui/card';

interface Campaign {
  budget: number;
  startDate: string;
  endDate: string;
}

interface CampaignMetricsProps {
  campaign: Campaign;
  contactedCreatorsCount: number;
}

export const CampaignMetrics = ({ campaign, contactedCreatorsCount }: CampaignMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Budget</div>
          <div className="text-2xl font-bold">₹{campaign.budget.toLocaleString()}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Duration</div>
          <div className="text-lg font-semibold">
            {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Contacted Creators</div>
          <div className="text-2xl font-bold">{contactedCreatorsCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};
