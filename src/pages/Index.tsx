
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page on initial load
    navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">InfluencerFlow AI</h1>
        <p className="text-xl text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default Index;
