
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  FiHome, 
  FiUsers, 
  FiTarget, 
  FiMessageSquare, 
  FiDollarSign, 
  FiBarChart3,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Campaigns', href: '/campaigns', icon: FiTarget },
    { name: 'Discover', href: '/discovery', icon: FiUsers },
    { name: 'Outreach', href: '/outreach', icon: FiMessageSquare },
    { name: 'Negotiations', href: '/negotiations', icon: FiDollarSign },
    { name: 'Performance', href: '/performance', icon: FiBarChart3 },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b">
            <h1 className="text-xl font-bold text-purple-600">InfluencerFlow AI</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
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
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
                alt="User"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
                <p className="text-xs text-gray-500">Brand Manager</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="mt-2 w-full justify-start text-gray-600">
              <FiLogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
