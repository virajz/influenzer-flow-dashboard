
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Index = () => {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUserAndBrand = async () => {
      console.log('Index: Starting auth check, loading:', loading, 'currentUser:', currentUser?.uid);
      
      if (loading) return;

      if (!currentUser) {
        console.log('Index: No user found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        console.log('Index: User found, checking brand for UID:', currentUser.uid);
        const brandRef = doc(db, 'brands', currentUser.uid);
        const brandSnap = await getDoc(brandRef);

        console.log('Index: Brand document exists:', brandSnap.exists());
        if (brandSnap.exists()) {
          console.log('Index: Brand data:', brandSnap.data());
        }

        if (brandSnap.exists()) {
          console.log('Index: User has brand profile, redirecting to dashboard');
          navigate('/dashboard');
        } else {
          console.log('Index: User has no brand profile, redirecting to onboarding');
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('Index: Error checking brand status:', error);
        navigate('/login');
      } finally {
        setIsChecking(false);
      }
    };

    checkUserAndBrand();
  }, [currentUser, loading, navigate]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h1 className="text-4xl font-bold text-purple-600 mb-4">InfluencerFlow AI</h1>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return null; // This should never render as we always redirect
};

export default Index;
