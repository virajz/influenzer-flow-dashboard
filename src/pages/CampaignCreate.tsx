import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { FiCalendar, FiTarget, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { campaignsService, CampaignPlatformRequirement, CampaignTargetCategory } from '@/services/campaignsService';

const CampaignCreate = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const [formData, setFormData] = useState({
        name: '',
        budgetPerCreator: '',
        targetAudience: '',
        description: '',
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

        if (!currentUser?.uid) {
            toast({
                title: "Error",
                description: "You must be logged in to create a campaign.",
                variant: "destructive"
            });
            return;
        }

        if (!formData.name || !formData.budgetPerCreator || !startDate || !endDate) {
            toast({
                title: "Error",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const campaignData = {
                brandId: currentUser.uid,
                campaignName: formData.name,
                description: formData.description,
                budgetPerCreator: parseInt(formData.budgetPerCreator),
                targetAudience: formData.targetAudience,
                requiredPlatforms: formData.platforms,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                status: 'draft' as const,
                targetCreatorCategories: formData.targetCategories
            };

            const campaignId = await campaignsService.createCampaign(campaignData);

            toast({
                title: "Campaign Created!",
                description: "Your campaign has been created successfully.",
            });

            navigate('/campaigns');
        } catch (error) {
            console.error('Error creating campaign:', error);
            toast({
                title: "Error",
                description: "There was an error creating your campaign. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
                <p className="text-gray-600">Set up your influencer marketing campaign</p>
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
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Summer Fashion Collection"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="budget">Budget (INR) *</Label>
                                    <Input
                                        id="budget"
                                        type="number"
                                        value={formData.budgetPerCreator}
                                        onChange={(e) => setFormData({ ...formData, budgetPerCreator: e.target.value })}
                                        placeholder="25000"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="targetAudience">Target Audience</Label>
                                    <Input
                                        id="targetAudience"
                                        value={formData.targetAudience}
                                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                                        placeholder="e.g., Women 18-35, fashion enthusiasts"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe your campaign goals and message..."
                                        rows={3}
                                    />
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
                                                    className="pointer-events-auto"
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
                                                    className="pointer-events-auto"
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
                                    <Select value={newPlatform.platform} onValueChange={(value: CampaignPlatformRequirement['platform']) => setNewPlatform({ ...newPlatform, platform: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Platform" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {platforms.map(platform => (
                                                <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select value={newPlatform.contentType} onValueChange={(value: CampaignPlatformRequirement['contentType']) => setNewPlatform({ ...newPlatform, contentType: value })}>
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
                                        onChange={(e) => setNewPlatform({ ...newPlatform, quantity: parseInt(e.target.value) || 1 })}
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
                                    <Select value={newCategory.category} onValueChange={(value) => setNewCategory({ ...newCategory, category: value })}>
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
                                        onChange={(e) => setNewCategory({ ...newCategory, minFollowers: parseInt(e.target.value) || 0 })}
                                    />

                                    <Input
                                        type="number"
                                        placeholder="Max Budget"
                                        value={newCategory.maxBudget || ''}
                                        onChange={(e) => setNewCategory({ ...newCategory, maxBudget: parseInt(e.target.value) || 0 })}
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
                                                    Max: ₹{category.maxBudgetPerCreator.toLocaleString()}
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
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Campaign'}
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

export default CampaignCreate;
