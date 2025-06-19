
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{campaign.campaignName}</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">{campaign.description}</p>
        </div>
        <div className="flex-shrink-0">
          <Button 
            onClick={onAddCreator} 
            className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Creator
          </Button>
        </div>
      </div>
    </div>
  );
};
