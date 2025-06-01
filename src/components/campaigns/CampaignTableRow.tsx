
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Campaign } from '@/services/campaignsService';

interface CampaignTableRowProps {
  campaign: Campaign;
}

export const CampaignTableRow = ({ campaign }: CampaignTableRowProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'negotiating':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TableRow key={campaign.campaignId}>
      <TableCell>
        <div>
          <div className="font-medium">{campaign.campaignName}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {campaign.description}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(campaign.status)}>
          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <DollarSign className="mr-1 h-4 w-4 text-gray-400" />
          {campaign.budget.toLocaleString()}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center text-sm">
          <Calendar className="mr-1 h-4 w-4 text-gray-400" />
          {format(new Date(campaign.startDate), 'MMM d')} - {format(new Date(campaign.endDate), 'MMM d, yyyy')}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {campaign.requiredPlatforms.slice(0, 2).map((platform, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {platform.platform}
            </Badge>
          ))}
          {campaign.requiredPlatforms.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{campaign.requiredPlatforms.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/campaigns/${campaign.campaignId}`)}
          >
            View
          </Button>
          {campaign.status === 'draft' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/campaigns/${campaign.campaignId}/edit`)}
            >
              Edit
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
