
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { mockCampaigns } from '@/data/mockData';
import { FiPlus, FiUsers, FiDollarSign, FiTrendingUp, FiTarget } from 'react-icons/fi';

const Dashboard = () => {
  const activeCampaigns = mockCampaigns.filter(c => c.status === 'active').length;
  const totalBudget = mockCampaigns.reduce((sum, c) => sum + c.budget, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your campaigns.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiTarget className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{activeCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiDollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">${totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Creators Connected</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiTrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. ROI</p>
                <p className="text-2xl font-bold text-gray-900">285%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Campaigns */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Campaigns</CardTitle>
                  <CardDescription>Manage your active and upcoming campaigns</CardDescription>
                </div>
                <Link to="/campaigns/new">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <FiPlus className="mr-2 h-4 w-4" />
                    New Campaign
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{campaign.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Budget: ${campaign.budget.toLocaleString()}</span>
                        <span>End: {new Date(campaign.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Link to={`/campaigns/${campaign.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Performance */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/discovery" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FiUsers className="mr-2 h-4 w-4" />
                  Discover Creators
                </Button>
              </Link>
              <Link to="/outreach" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FiTarget className="mr-2 h-4 w-4" />
                  Manage Outreach
                </Button>
              </Link>
              <Link to="/performance" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FiTrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Campaign Progress</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Budget Utilization</span>
                  <span>60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Creator Response Rate</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
