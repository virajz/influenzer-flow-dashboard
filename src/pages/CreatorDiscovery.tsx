
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { mockCreators } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { FiInstagram, FiYoutube, FiFilter, FiUsers, FiDollarSign, FiMapPin } from 'react-icons/fi';
import { SiTiktok, SiTwitter, SiLinkedin } from 'react-icons/si';

const CreatorDiscovery = () => {
  const [filters, setFilters] = useState({
    category: '',
    platform: '',
    minFollowers: [0],
    maxBudget: [10000],
    searchTerm: ''
  });

  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <FiInstagram className="h-4 w-4" />;
      case 'youtube': return <FiYoutube className="h-4 w-4" />;
      case 'tiktok': return <SiTiktok className="h-4 w-4" />;
      case 'twitter': return <SiTwitter className="h-4 w-4" />;
      case 'linkedin': return <SiLinkedin className="h-4 w-4" />;
      default: return <FiUsers className="h-4 w-4" />;
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const filteredCreators = mockCreators.filter(creator => {
    if (filters.category && creator.category !== filters.category) return false;
    if (filters.platform && !creator.platforms.includes(filters.platform)) return false;
    if (creator.followers < filters.minFollowers[0]) return false;
    if (creator.baseRate > filters.maxBudget[0]) return false;
    if (filters.searchTerm && !creator.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !creator.handle.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    return true;
  });

  const toggleCreatorSelection = (creatorId: string) => {
    setSelectedCreators(prev => 
      prev.includes(creatorId) 
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  const addSelectedToCalmapaign = () => {
    if (selectedCreators.length > 0) {
      toast({
        title: "Creators Added!",
        description: `${selectedCreators.length} creators added to your campaign.`,
      });
      setSelectedCreators([]);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Creator Discovery</h1>
        <p className="text-gray-600">Find the perfect creators for your campaign</p>
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
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="Tech">Tech</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
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
                  <SelectItem value="">All Platforms</SelectItem>
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
                category: '',
                platform: '',
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
              <Button onClick={addSelectedToCalmapaign} className="bg-purple-600 hover:bg-purple-700">
                Add {selectedCreators.length} to Campaign
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCreators.map((creator) => (
              <Card key={creator.id} className="rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{creator.name}</h3>
                          <p className="text-sm text-gray-600">{creator.handle}</p>
                        </div>
                        <Checkbox
                          checked={selectedCreators.includes(creator.id)}
                          onCheckedChange={() => toggleCreatorSelection(creator.id)}
                        />
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <FiUsers className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{formatFollowers(creator.followers)}</span>
                        <Badge variant="secondary">{creator.category}</Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <FiMapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{creator.location}</span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">{creator.bio}</p>

                      <div className="flex items-center gap-2 mb-4">
                        {creator.platforms.map((platform) => (
                          <div key={platform} className="flex items-center gap-1 text-gray-600">
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <FiDollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-medium">${creator.baseRate.toLocaleString()}</span>
                          </div>
                          <span className="text-gray-500">{creator.engagementRate}% engagement</span>
                        </div>
                        <Button
                          size="sm"
                          variant={selectedCreators.includes(creator.id) ? "default" : "outline"}
                          onClick={() => toggleCreatorSelection(creator.id)}
                        >
                          {selectedCreators.includes(creator.id) ? 'Added' : 'Add to Campaign'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDiscovery;
