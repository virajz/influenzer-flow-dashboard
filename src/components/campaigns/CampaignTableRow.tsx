
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Campaign } from '@/services/campaignsService';

interface CampaignTableRowProps {
    campaign: Campaign;
}

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

export const CampaignTableRow = ({ campaign }: CampaignTableRowProps) => {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getDuration = () => {
        const start = new Date(campaign.startDate);
        const end = new Date(campaign.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} days`;
    };

    const getPlatforms = () => {
        const platforms = campaign.requiredPlatforms?.map(p => p.platform) || [];
        return platforms.slice(0, 2).join(', ') + (platforms.length > 2 ? '...' : '');
    };

    return (
        <TableRow>
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
            <TableCell>₹{campaign.budget.toLocaleString()}</TableCell>
            <TableCell>
                <div className="text-sm">
                    <div>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</div>
                    <div className="text-gray-500">{getDuration()}</div>
                </div>
            </TableCell>
            <TableCell>{getPlatforms()}</TableCell>
            <TableCell>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/campaigns/${campaign.campaignId}`)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/campaigns/${campaign.campaignId}/edit`)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
};
