
import { Card, CardContent } from '@/components/ui/card';

interface Campaign {
  budgetPerCreator: number;
  startDate: string;
  endDate: string;
}

interface CampaignMetricsProps {
  campaign: Campaign;
}

export const CampaignMetrics = ({ campaign }: CampaignMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Budget Per Creator</div>
          <div className="text-2xl font-bold">₹{campaign.budgetPerCreator.toLocaleString()}</div>
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
    </div>
  );
};
