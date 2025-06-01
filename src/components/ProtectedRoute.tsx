
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


      if (!currentUser) {

        navigate('/login');
        return;
      }

      try {

        const brandRef = doc(db, 'brands', currentUser.uid);
        const brandSnap = await getDoc(brandRef);




        if (brandSnap.exists()) {

          setHasBrand(true);
        } else {

          toast({
            title: "Complete your profile",
            description: "Please complete your brand profile to continue.",
          });
          navigate('/onboarding');
        }
      } catch (error) {

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
