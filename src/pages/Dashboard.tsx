import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { FiPlus, FiEye, FiTrendingUp, FiDollarSign, FiUsers, FiClock, FiFileText, FiEdit3, FiArrowRight } from 'react-icons/fi';

const Dashboard = () => {
  // Mock data for the new dashboard structure
  const activeCampaigns = [
    {
      id: '1',
      name: 'Summer Fashion Collection',
      status: 'active',
      budget: 25000,
      spent: 18750,
      engagementRate: 4.2,
      spentPercentage: 75
    },
    {
      id: '2',
      name: 'Tech Product Launch',
      status: 'negotiating',
      budget: 40000,
      spent: 8000,
      engagementRate: 5.8,
      spentPercentage: 20
    },
    {
      id: '3',
      name: 'Holiday Campaign',
      status: 'completed',
      budget: 15000,
      spent: 14200,
      engagementRate: 3.9,
      spentPercentage: 95
    }
  ];

  const attentionItems = [
    {
      priority: 'high',
      message: '3 creators haven\'t replied',
      action: 'Follow up',
      color: 'bg-red-100 border-red-200',
      indicator: 'bg-red-500'
    },
    {
      priority: 'medium',
      message: '2 deliverables due this week',
      action: 'View',
      color: 'bg-orange-100 border-orange-200',
      indicator: 'bg-orange-500'
    },
    {
      priority: 'low',
      message: '1 contract awaiting signature',
      action: 'Review',
      color: 'bg-yellow-100 border-yellow-200',
      indicator: 'bg-yellow-500'
    }
  ];

  const budgetKPIs = [
    { label: 'Total Budget', value: '₹80,000', icon: FiDollarSign },
    { label: 'Total Spent', value: '₹40,950', icon: FiTrendingUp },
    { label: 'Forecasted Spend', value: '₹72,000', icon: FiUsers },
    { label: 'Burn Rate', value: '18%/week', icon: FiClock }
  ];

  const creatorActivity = [
    { creator: '@sarahjohnson', action: 'responded with rate ₹2,750', time: '2 hours ago' },
    { creator: '@mikechentech', action: 'accepted contract', time: '4 hours ago' },
    { creator: '@emmafit', action: 'declined offer', time: '6 hours ago' },
    { creator: '@davidcooks', action: 'submitted deliverable', time: '1 day ago' }
  ];

  const upcomingDeadlines = [
    { creator: 'Sarah Johnson', contentType: 'Instagram Reel', dueDate: 'Dec 15', status: 'pending' },
    { creator: 'Mike Chen', contentType: 'YouTube Review', dueDate: 'Dec 16', status: 'submitted' },
    { creator: 'Emma Rodriguez', contentType: 'TikTok Video', dueDate: 'Dec 18', status: 'late' },
    { creator: 'David Park', contentType: 'Instagram Post', dueDate: 'Dec 20', status: 'pending' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'negotiating': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeadlineStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Good Morning, John 👋</h1>
          <p className="text-muted-foreground">Here's your campaign overview for today</p>
        </div>
        <Link to="/campaigns/new">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <FiPlus className="mr-2 h-4 w-4" />
            Create New Campaign
          </Button>
        </Link>
      </div>

      {/* Section 1: Active Campaign Snapshot */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeCampaigns.map((campaign) => (
            <Card key={campaign.id} className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Budget vs. Spent</span>
                        <span className="font-medium">₹{campaign.spent.toLocaleString()} / ₹{campaign.budget.toLocaleString()}</span>
                      </div>
                      <Progress value={campaign.spentPercentage} className="h-2" />
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Engagement Rate</span>
                      <span className="text-sm font-medium">{campaign.engagementRate}%</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <FiEye className="mr-2 h-4 w-4" />
                    View Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section 2: Attention Needed */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Attention Needed</h2>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {attentionItems.map((item, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${item.color}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.indicator}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.message}</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">
                        {item.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Performance Summary */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Summary</h2>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-muted/30 p-4 rounded-xl">
                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="font-medium text-gray-900">ROI Trend (4 weeks)</span>
                    <span className="text-green-600 font-medium">+285%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="bg-muted/30 p-4 rounded-xl">
                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="font-medium text-gray-900">Engagement Rate</span>
                    <span className="text-blue-600 font-medium">4.8%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="bg-muted/30 p-4 rounded-xl">
                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="font-medium text-gray-900">Creator Response Rate</span>
                    <span className="text-purple-600 font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 4: Budget Summary */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Summary</h2>
          <div className="space-y-4">
            {budgetKPIs.map((kpi, index) => (
              <Card key={index} className="rounded-2xl shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <kpi.icon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <p className="text-lg font-semibold text-gray-900">{kpi.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 5: Creator Activity Feed */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Creator Activity Feed</h2>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {creatorActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <FiUsers className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-purple-600">{activity.creator}</span>
                        <span className="text-gray-900"> {activity.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 6: Upcoming Deadlines */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{deadline.creator}</p>
                      <p className="text-sm text-muted-foreground">{deadline.contentType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{deadline.dueDate}</p>
                      <Badge className={getDeadlineStatusColor(deadline.status)} variant="outline">
                        {deadline.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
