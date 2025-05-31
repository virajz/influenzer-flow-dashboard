
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { mockCampaigns } from '@/data/mockData';
import { FiPlus, FiUsers, FiDollarSign, FiTrendingUp, FiTarget, FiClock, FiFileText, FiEdit3 } from 'react-icons/fi';

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

  const campaignInsights = [
    {
      icon: FiUsers,
      number: "4",
      description: "Creators Awaiting Response",
      color: "text-orange-600"
    },
    {
      icon: FiFileText,
      number: "2",
      description: "Deliverables Due This Week",
      color: "text-blue-600"
    },
    {
      icon: FiEdit3,
      number: "3",
      description: "Contracts Awaiting Signature",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your campaigns.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiTarget className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{activeCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiDollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">${totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Creators Connected</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiTrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg. ROI</p>
                <p className="text-2xl font-bold text-gray-900">285%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Campaigns */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl shadow-sm">
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
                    className="flex items-center justify-between p-6 border rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{campaign.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
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

        {/* Campaign Insights & Performance */}
        <div className="space-y-8">
          {/* Campaign Insights */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Campaign Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {campaignInsights.map((insight, index) => (
                <div key={index} className="p-6 bg-muted rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg bg-white ${insight.color}`}>
                      <insight.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold text-gray-900">{insight.number}</span>
                        <span className="text-sm text-muted-foreground">{insight.description}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-xl">
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="font-medium text-gray-900">Campaign Progress</span>
                  <span className="text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-1.5" />
              </div>
              <div className="bg-muted/30 p-4 rounded-xl">
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="font-medium text-gray-900">Budget Utilization</span>
                  <span className="text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-1.5" />
              </div>
              <div className="bg-muted/30 p-4 rounded-xl">
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="font-medium text-gray-900">Creator Response Rate</span>
                  <span className="text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
