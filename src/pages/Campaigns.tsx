
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Calendar, DollarSign, Users, Target } from 'lucide-react';
import { format } from 'date-fns';

interface CampaignPlatformRequirement {
  platform: 'instagram' | 'youtube' | 'tiktok' | 'facebook' | 'twitter';
  contentType: 'post' | 'story' | 'reel' | 'video' | 'live';
  quantity: number;
}

interface CampaignTargetCategory {
  category: string;
  minFollowers: number;
  maxBudgetPerCreator: number;
}

interface Campaign {
  campaignId: string;
  brandId: string;
  campaignName: string;
  description: string;
  budget: number;
  targetAudience: string;
  requiredPlatforms: CampaignPlatformRequirement[];
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'negotiating' | 'completed' | 'cancelled';
  targetCreatorCategories: CampaignTargetCategory[];
  createdAt: string;
  updatedAt: string;
}

// Mock data for demonstration
const mockCampaigns: Campaign[] = [
  {
    campaignId: '1',
    brandId: 'brand1',
    campaignName: 'Summer Fashion Collection',
    description: 'Promote our new summer collection with lifestyle influencers',
    budget: 25000,
    targetAudience: 'Women 18-35, fashion enthusiasts',
    requiredPlatforms: [
      { platform: 'instagram', contentType: 'post', quantity: 3 },
      { platform: 'instagram', contentType: 'story', quantity: 5 },
      { platform: 'tiktok', contentType: 'video', quantity: 2 }
    ],
    startDate: '2024-06-01',
    endDate: '2024-07-31',
    status: 'active',
    targetCreatorCategories: [
      { category: 'Lifestyle', minFollowers: 100000, maxBudgetPerCreator: 5000 },
      { category: 'Fashion', minFollowers: 50000, maxBudgetPerCreator: 3000 }
    ],
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-05-15T10:00:00Z'
  },
  {
    campaignId: '2',
    brandId: 'brand1',
    campaignName: 'Tech Product Launch',
    description: 'Launch campaign for our new smart home device',
    budget: 40000,
    targetAudience: 'Tech enthusiasts, early adopters',
    requiredPlatforms: [
      { platform: 'youtube', contentType: 'video', quantity: 1 },
      { platform: 'instagram', contentType: 'post', quantity: 2 }
    ],
    startDate: '2024-07-15',
    endDate: '2024-08-30',
    status: 'draft',
    targetCreatorCategories: [
      { category: 'Tech', minFollowers: 150000, maxBudgetPerCreator: 8000 }
    ],
    createdAt: '2024-05-20T14:30:00Z',
    updatedAt: '2024-05-20T14:30:00Z'
  }
];

const Campaigns = () => {
  const navigate = useNavigate();
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600">Manage your influencer marketing campaigns</p>
        </div>
        <Button onClick={() => navigate('/campaigns/new')} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="negotiating">Negotiating</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaigns Table */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Your Campaigns</CardTitle>
          <CardDescription>
            {filteredCampaigns.length} of {campaigns.length} campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {filteredCampaigns.map((campaign) => (
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
                      ${campaign.budget.toLocaleString()}
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
              ))}
            </TableBody>
          </Table>

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-8">
              <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by creating your first campaign'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => navigate('/campaigns/new')} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Campaigns;
