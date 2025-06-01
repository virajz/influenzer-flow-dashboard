
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { creatorsService } from '@/services/creatorsService';
import { toast } from '@/hooks/use-toast';
import { FiInstagram, FiYoutube, FiFilter, FiUsers, FiDollarSign, FiMapPin, FiEye } from 'react-icons/fi';
import { SiTiktok, SiX, SiLinkedin } from 'react-icons/si';
import { CampaignAssignmentModal } from '@/components/campaigns/CampaignAssignmentModal';

const CreatorDiscovery = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: 'all',
    platform: 'all',
    minFollowers: [0],
    maxBudget: [10000],
    searchTerm: ''
  });

  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  // Fetch all creators
  const { data: allCreators = [], isLoading } = useQuery({
    queryKey: ['creators'],
    queryFn: creatorsService.getAllCreators,
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <FiInstagram className="h-4 w-4" />;
      case 'youtube': return <FiYoutube className="h-4 w-4" />;
      case 'tiktok': return <SiTiktok className="h-4 w-4" />;
      case 'twitter': return <SiX className="h-4 w-4" />;
      case 'linkedin': return <SiLinkedin className="h-4 w-4" />;
      default: return <FiUsers className="h-4 w-4" />;
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const filteredCreators = allCreators.filter(creator => {
    if (filters.category !== 'all' && creator.category !== filters.category) return false;
    if (filters.platform !== 'all' && 
        !((creator.instagramHandle && filters.platform === 'Instagram') || 
          (creator.youtubeHandle && filters.platform === 'YouTube'))) return false;
    if (creator.instagramFollowers < filters.minFollowers[0]) return false;
    if (creator.baseRate > filters.maxBudget[0]) return false;
    if (filters.searchTerm && 
        !creator.displayName.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !creator.instagramHandle.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    return true;
  });

  const toggleCreatorSelection = (creatorId: string) => {
    setSelectedCreators(prev => 
      prev.includes(creatorId) 
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const handleViewCreator = (creator: any) => {
    navigate(`/creators/${creator.creatorId}`);
  };

  const handleAssignmentComplete = () => {
    setSelectedCreators([]);
    toast({
      title: "Success!",
      description: "Creators have been assigned to the selected campaign.",
    });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading creators...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Creator Discovery</h1>
        <p className="text-gray-600">Discover and connect with creators for your campaigns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <Card className="rounded-2xl shadow-md h-fit">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FiFilter className="mr-2 h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search creators..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              />
            </div>

            <div>
              <Label>Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Platform</Label>
              <Select value={filters.platform} onValueChange={(value) => setFilters({...filters, platform: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Min Followers: {filters.minFollowers[0].toLocaleString()}</Label>
              <Slider
                value={filters.minFollowers}
                onValueChange={(value) => setFilters({...filters, minFollowers: value})}
                max={1000000}
                min={0}
                step={10000}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Max Budget: ${filters.maxBudget[0].toLocaleString()}</Label>
              <Slider
                value={filters.maxBudget}
                onValueChange={(value) => setFilters({...filters, maxBudget: value})}
                max={10000}
                min={500}
                step={100}
                className="mt-2"
              />
            </div>

            <Button 
              onClick={() => setFilters({
                category: 'all',
                platform: 'all',
                minFollowers: [0],
                maxBudget: [10000],
                searchTerm: ''
              })}
              variant="outline"
              className="w-full"
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>

        {/* Creator Grid */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">{filteredCreators.length} creators found</p>
            {selectedCreators.length > 0 && (
              <Button 
                onClick={() => setShowAssignmentModal(true)} 
                className="bg-purple-600 hover:bg-purple-700"
              >
                Add {selectedCreators.length} to Campaign
              </Button>
            )}
          </div>

          {filteredCreators.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No creators match your current filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCreators.map((creator) => (
                <Card key={creator.creatorId} className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={creator.profileURL}
                        alt={creator.displayName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{creator.displayName}</h3>
                            <p className="text-sm text-gray-600">{creator.instagramHandle}</p>
                          </div>
                          <Checkbox
                            checked={selectedCreators.includes(creator.creatorId)}
                            onCheckedChange={() => toggleCreatorSelection(creator.creatorId)}
                          />
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <FiUsers className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">{formatFollowers(creator.instagramFollowers)}</span>
                          <Badge variant="secondary">{creator.category}</Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <FiMapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Location TBD</span>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                          {creator.category} creator with {creator.averageEngagementRate}% engagement rate
                        </p>

                        <div className="flex items-center gap-2 mb-4">
                          {creator.instagramHandle && (
                            <div className="flex items-center gap-1 text-gray-600">
                              {getPlatformIcon('Instagram')}
                            </div>
                          )}
                          {creator.youtubeHandle && (
                            <div className="flex items-center gap-1 text-gray-600">
                              {getPlatformIcon('YouTube')}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <FiDollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-medium">${creator.baseRate.toLocaleString()}</span>
                            </div>
                            <span className="text-gray-500">{creator.averageEngagementRate}% engagement</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewCreator(creator)}
                            >
                              <FiEye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant={selectedCreators.includes(creator.creatorId) ? "default" : "outline"}
                              onClick={() => toggleCreatorSelection(creator.creatorId)}
                            >
                              {selectedCreators.includes(creator.creatorId) ? 'Selected' : 'Select'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Campaign Assignment Modal */}
      <CampaignAssignmentModal
        open={showAssignmentModal}
        onOpenChange={setShowAssignmentModal}
        selectedCreatorIds={selectedCreators}
        onAssignmentComplete={handleAssignmentComplete}
      />
    </div>
  );
};

export default CreatorDiscovery;
