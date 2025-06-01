
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { campaignsService, Campaign, CampaignPlatformRequirement, CampaignTargetCategory } from '@/services/campaignsService';
import { toast } from '@/hooks/use-toast';
import { FiCalendar, FiTarget, FiDollarSign } from 'react-icons/fi';

const CampaignEdit = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    targetAudience: '',
    description: '',
    status: 'draft' as Campaign['status'],
    platforms: [] as CampaignPlatformRequirement[],
    targetCategories: [] as CampaignTargetCategory[]
  });

  const [newPlatform, setNewPlatform] = useState({ 
    platform: '' as CampaignPlatformRequirement['platform'], 
    contentType: '' as CampaignPlatformRequirement['contentType'], 
    quantity: 1 
  });
  const [newCategory, setNewCategory] = useState({ category: '', minFollowers: 0, maxBudget: 0 });

  const platforms: CampaignPlatformRequirement['platform'][] = ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook'];
  const contentTypes: CampaignPlatformRequirement['contentType'][] = ['post', 'story', 'reel', 'video', 'live'];
  const categories = ['Lifestyle', 'Tech', 'Fitness', 'Food', 'Travel', 'Fashion', 'Gaming'];

  // Fetch campaign data
  const { data: campaign, isLoading, error } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      if (!campaignId) throw new Error('Campaign ID is required');
      const result = await campaignsService.getCampaignById(campaignId);
      if (!result) throw new Error('Campaign not found');
      return result;
    },
    enabled: !!campaignId,
  });

  // Set form values when campaign data is loaded
  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.campaignName,
        budget: campaign.budget.toString(),
        targetAudience: campaign.targetAudience,
        description: campaign.description,
        status: campaign.status,
        platforms: campaign.requiredPlatforms || [],
        targetCategories: campaign.targetCreatorCategories || []
      });
      setStartDate(new Date(campaign.startDate));
      setEndDate(new Date(campaign.endDate));
    }
  }, [campaign]);

  // Update campaign mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!campaignId) throw new Error('Campaign ID is required');
      await campaignsService.updateCampaign(campaignId, data);
    },
    onSuccess: () => {
      toast({
        title: "Campaign updated",
        description: "Your campaign has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      navigate('/campaigns');
    },
    onError: (error) => {
      toast({
        title: "Error updating campaign",
        description: error instanceof Error ? error.message : "There was an error updating your campaign.",
        variant: "destructive"
      });
    }
  });

  const addPlatform = () => {
    if (newPlatform.platform && newPlatform.contentType) {
      setFormData({
        ...formData,
        platforms: [...formData.platforms, newPlatform]
      });
      setNewPlatform({ platform: '' as CampaignPlatformRequirement['platform'], contentType: '' as CampaignPlatformRequirement['contentType'], quantity: 1 });
    }
  };

  const addCategory = () => {
    if (newCategory.category && newCategory.minFollowers && newCategory.maxBudget) {
      setFormData({
        ...formData,
        targetCategories: [...formData.targetCategories, { 
          category: newCategory.category, 
          minFollowers: newCategory.minFollowers, 
          maxBudgetPerCreator: newCategory.maxBudget 
        }]
      });
      setNewCategory({ category: '', minFollowers: 0, maxBudget: 0 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.budget || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        campaignName: formData.name,
        description: formData.description,
        budget: parseInt(formData.budget),
        targetAudience: formData.targetAudience,
        requiredPlatforms: formData.platforms,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: formData.status,
        targetCreatorCategories: formData.targetCategories
      };

      updateMutation.mutate(updateData);
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        title: "Error",
        description: "There was an error updating your campaign. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading campaign...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign not found</h2>
          <p className="text-gray-600 mb-6">The campaign you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/campaigns')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/campaigns')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Campaign</h1>
          <p className="text-gray-600">Update your campaign details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FiTarget className="mr-2 h-5 w-5" />
                  Campaign Details
                </CardTitle>
                <CardDescription>Basic information about your campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Summer Fashion Collection"
                  />
                </div>

                <div>
                  <Label htmlFor="budget">Budget (USD) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    placeholder="25000"
                  />
                </div>

                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                    placeholder="e.g., Women 18-35, fashion enthusiasts"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your campaign goals and message..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: Campaign['status']) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="negotiating">Negotiating</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>End Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Requirements */}
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle>Platform Requirements</CardTitle>
                <CardDescription>Specify content requirements for each platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <Select value={newPlatform.platform} onValueChange={(value: CampaignPlatformRequirement['platform']) => setNewPlatform({...newPlatform, platform: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map(platform => (
                        <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={newPlatform.contentType} onValueChange={(value: CampaignPlatformRequirement['contentType']) => setNewPlatform({...newPlatform, contentType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Content Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={newPlatform.quantity}
                    onChange={(e) => setNewPlatform({...newPlatform, quantity: parseInt(e.target.value) || 1})}
                  />

                  <Button type="button" onClick={addPlatform}>Add</Button>
                </div>

                {formData.platforms.length > 0 && (
                  <div className="space-y-2">
                    {formData.platforms.map((platform, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{platform.platform} - {platform.contentType} ({platform.quantity})</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData({
                            ...formData,
                            platforms: formData.platforms.filter((_, i) => i !== index)
                          })}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Target Categories */}
          <div className="space-y-6">
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FiDollarSign className="mr-2 h-5 w-5" />
                  Target Categories
                </CardTitle>
                <CardDescription>Define your ideal creator profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Select value={newCategory.category} onValueChange={(value) => setNewCategory({...newCategory, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Min Followers"
                    value={newCategory.minFollowers || ''}
                    onChange={(e) => setNewCategory({...newCategory, minFollowers: parseInt(e.target.value) || 0})}
                  />

                  <Input
                    type="number"
                    placeholder="Max Budget"
                    value={newCategory.maxBudget || ''}
                    onChange={(e) => setNewCategory({...newCategory, maxBudget: parseInt(e.target.value) || 0})}
                  />

                  <Button type="button" onClick={addCategory} className="w-full">
                    Add Category
                  </Button>
                </div>

                {formData.targetCategories.length > 0 && (
                  <div className="space-y-2">
                    {formData.targetCategories.map((category, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium">{category.category}</div>
                        <div className="text-sm text-gray-600">
                          {category.minFollowers.toLocaleString()}+ followers
                        </div>
                        <div className="text-sm text-gray-600">
                          Max: ${category.maxBudgetPerCreator.toLocaleString()}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => setFormData({
                            ...formData,
                            targetCategories: formData.targetCategories.filter((_, i) => i !== index)
                          })}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={isSubmitting || updateMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting || updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/campaigns')}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CampaignEdit;
