import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    brandName: 'Tech Startup Inc.', // Prefilled example
    description: '',
    phoneNumber: '',
    website: '',
    industry: '',
    companySize: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return (
      formData.brandName.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.phoneNumber.trim() !== '' &&
      formData.industry.trim() !== '' &&
      formData.companySize !== ''
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: "Please complete all required fields",
        description: "All fields are mandatory except website.",
        variant: "destructive"
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "Please log in to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://creator-server-173826602269.us-central1.run.app/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': currentUser.getIdToken()
        },
        body: JSON.stringify({
          // uid: currentUser.uid,
          brandName: formData.brandName,
          description: formData.description,
          email: currentUser.email,
          phone: formData.phoneNumber,
          website: formData.website || null,
          industry: formData.industry,
          companySize: formData.companySize,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create brand profile');
      }

      toast({
        title: "Profile created successfully!",
        description: "Welcome to InfluencerFlow AI. Let's get started with your campaigns.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating brand profile:', error);
      toast({
        title: "Error creating profile",
        description: "There was an error creating your brand profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const industryOptions = [
    { value: 'fashion', label: 'Fashion & Beauty' },
    { value: 'technology', label: 'Technology' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'fitness', label: 'Health & Fitness' },
    { value: 'travel', label: 'Travel & Lifestyle' },
    { value: 'gaming', label: 'Gaming & Entertainment' },
    { value: 'other', label: 'Other' }
  ];

  const companySizeOptions = [
    { value: 'startup', label: 'Startup (1-10 employees)' },
    { value: 'small', label: 'Small (11-50 employees)' },
    { value: 'medium', label: 'Medium (51-200 employees)' },
    { value: 'large', label: 'Large (201-1000 employees)' },
    { value: 'enterprise', label: 'Enterprise (1000+ employees)' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-purple-600">Complete Your Profile</CardTitle>
          <CardDescription className="text-lg">
            Help us personalize your InfluencerFlow AI experience
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Brand Name */}
            <div className="space-y-2">
              <Label htmlFor="brandName" className="text-sm font-medium">
                Brand Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="brandName"
                type="text"
                value={formData.brandName}
                onChange={(e) => handleInputChange('brandName', e.target.value)}
                placeholder="Enter your brand name"
                className="h-12"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Brand Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell us about your brand"
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Phone Number and Website Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter your phone number"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium">
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourbrand.com"
                  className="h-12"
                />
              </div>
            </div>

            {/* Industry and Company Size Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-sm font-medium">
                  Industry <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.industry} 
                  onValueChange={(value) => handleInputChange('industry', value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize" className="text-sm font-medium">
                  Company Size <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.companySize} 
                  onValueChange={(value) => handleInputChange('companySize', value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className={`w-full h-12 text-lg font-semibold ${
                  isFormValid() 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                disabled={!isFormValid() || isSubmitting}
              >
                {isSubmitting ? 'Setting up your account...' : 'Continue to Dashboard'}
              </Button>
            </div>

            {/* Required Fields Note */}
            <p className="text-center text-sm text-muted-foreground">
              <span className="text-red-500">*</span> Required fields
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
