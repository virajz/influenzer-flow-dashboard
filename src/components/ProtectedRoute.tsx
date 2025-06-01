
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasBrand, setHasBrand] = useState(false);

  useEffect(() => {
    const checkAuthAndBrand = async () => {
      console.log('ProtectedRoute: Checking auth and brand status for user:', currentUser?.uid);
      
      if (!currentUser) {
        console.log('ProtectedRoute: No user found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        console.log('ProtectedRoute: Checking brand document for UID:', currentUser.uid);
        const brandRef = doc(db, 'brands', currentUser.uid);
        const brandSnap = await getDoc(brandRef);

        console.log('ProtectedRoute: Brand document exists:', brandSnap.exists());
        if (brandSnap.exists()) {
          console.log('ProtectedRoute: Brand data found:', brandSnap.data());
        }

        if (brandSnap.exists()) {
          console.log('ProtectedRoute: User has brand, allowing access');
          setHasBrand(true);
        } else {
          console.log('ProtectedRoute: User has no brand, redirecting to onboarding');
          toast({
            title: "Complete your profile",
            description: "Please complete your brand profile to continue.",
          });
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('ProtectedRoute: Error checking brand status:', error);
        toast({
          title: "Error",
          description: "There was an error checking your profile. Please try again.",
          variant: "destructive"
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndBrand();
  }, [currentUser, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return hasBrand ? <>{children}</> : null;
};

export default ProtectedRoute;
