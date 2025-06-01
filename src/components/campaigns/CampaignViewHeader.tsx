
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Campaign {
  campaignName: string;
  description: string;
  status: string;
}

interface CampaignViewHeaderProps {
  campaign: Campaign;
  onAddCreator: () => void;
}

export const CampaignViewHeader = ({ campaign, onAddCreator }: CampaignViewHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{campaign.campaignName}</h1>
          <p className="text-gray-600 mt-2">{campaign.description}</p>
        </div>
        <Button onClick={onAddCreator} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Creator
        </Button>
      </div>
    </div>
  );
};
