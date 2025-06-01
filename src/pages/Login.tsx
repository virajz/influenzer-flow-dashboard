import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FcGoogle } from 'react-icons/fc';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Login = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    role: '',
    brandName: '',
    email: ''
  });
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const checkBrandAndRedirect = async (user: any) => {
    try {
      console.log('Login: Checking brand for user:', user.uid);
      const brandRef = doc(db, 'brands', user.uid);
      const brandSnap = await getDoc(brandRef);

      if (brandSnap.exists()) {
        console.log('Login: User has brand, redirecting to dashboard');
        navigate('/dashboard');
      } else {
        console.log('Login: User has no brand, redirecting to onboarding');
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Login: Error checking brand status:', error);
      navigate('/onboarding');
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      toast({
        title: "Welcome to InfluencerFlow AI!",
        description: "Your Google account has been connected successfully.",
      });
      
      // Check if user has brand data and redirect accordingly
      if (result?.user) {
        await checkBrandAndRedirect(result.user);
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "Login Failed",
        description: "There was an error signing in with Google. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.role && formData.brandName && formData.email) {
      toast({
        title: "Welcome to InfluencerFlow AI!",
        description: "Please complete your profile to continue.",
      });
      navigate('/onboarding');
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-purple-600">InfluencerFlow AI</CardTitle>
          <CardDescription>
            Connect with the perfect creators for your brand
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandName">Brand/Company Name</Label>
              <Input
                id="brandName"
                type="text"
                placeholder="Enter your brand name"
                value={formData.brandName}
                onChange={(e) => setFormData({...formData, brandName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Get Started
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            By signing up, you agree to our{' '}
            <a href="#" className="underline">Terms of Service</a> and{' '}
            <a href="#" className="underline">Privacy Policy</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
