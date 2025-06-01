
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Campaign } from '@/services/campaignsService';
import { CampaignTableRow } from './CampaignTableRow';

interface CampaignTableProps {
  campaigns: Campaign[];
}

export const CampaignTable = ({ campaigns }: CampaignTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Platforms</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <CampaignTableRow key={campaign.campaignId} campaign={campaign} />
        ))}
      </TableBody>
    </Table>
  );
};
