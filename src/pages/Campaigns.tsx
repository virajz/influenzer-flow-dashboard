
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { campaignsService, Campaign } from '@/services/campaignsService';
import { toast } from '@/hooks/use-toast';
import { CampaignFilters } from '@/components/campaigns/CampaignFilters';
import { CampaignTable } from '@/components/campaigns/CampaignTable';
import { EmptyState } from '@/components/campaigns/EmptyState';

const Campaigns = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch campaigns using React Query
  const { data: campaigns = [], isLoading, error, isError } = useQuery({
    queryKey: ['campaigns', currentUser?.uid],
    queryFn: async () => {
      if (!currentUser?.uid) {
        throw new Error('User not authenticated');
      }
      try {
        const result = await campaignsService.getCampaignsByBrand(currentUser.uid);
        return result;
      } catch (error) {
        // If it's an index error, log the URL for easy access
        if (error instanceof Error && error.message.includes('index')) {
          console.log('🔗 Create index at:', error.message.match(/https:\/\/[^\s]+/)?.[0]);
        }
        throw error;
      }
    },
    enabled: !!currentUser?.uid,
  });

  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error loading campaigns",
        description: error instanceof Error ? error.message : "There was an error loading your campaigns. Please try again.",
        variant: "destructive"
      });
    }
  }, [isError, error]);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading campaigns...</p>
          </div>
        </div>
      </div>
    );
  }

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

      <CampaignFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
      />

      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Your Campaigns</CardTitle>
          <CardDescription>
            {filteredCampaigns.length} of {campaigns.length} campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length > 0 ? (
            <CampaignTable campaigns={filteredCampaigns} />
          ) : (
            <EmptyState searchTerm={searchTerm} statusFilter={statusFilter} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Campaigns;
