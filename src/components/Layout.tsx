
import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  FiHome, 
  FiUsers, 
  FiTarget, 
  FiMessageSquare, 
  FiDollarSign, 
  FiBarChart,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Campaigns', href: '/campaigns', icon: FiTarget },
    { name: 'Discover', href: '/discovery', icon: FiUsers },
    { name: 'Negotiations', href: '/negotiations', icon: FiDollarSign },
    { name: 'Performance', href: '/performance', icon: FiBarChart },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with sidebar toggle */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-white shadow-sm"
            >
              {sidebarOpen ? <FiX className="h-4 w-4" /> : <FiMenu className="h-4 w-4" />}
            </Button>
            <h1 className="text-lg font-bold text-purple-600 lg:hidden">InfluencerFlow AI</h1>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col pt-16">
          {/* Logo - hidden on mobile since it's in header */}
          <div className="hidden lg:flex h-16 items-center px-6 border-b -mt-16">
            <h1 className="text-lg lg:text-xl font-bold text-purple-600">InfluencerFlow AI</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User profile */}
          <div className="border-t p-4">
            <div className="flex items-center">
              <img
                className="h-8 w-8 rounded-full"
                src={currentUser?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"}
                alt="User"
              />
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {currentUser?.displayName || currentUser?.email || "User"}
                </p>
                <p className="text-xs text-gray-500">Brand Manager</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 w-full justify-start text-gray-600"
              onClick={handleLogout}
            >
              <FiLogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ease-in-out pt-16 ${
        sidebarOpen ? 'lg:ml-64' : 'ml-0'
      }`}>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
