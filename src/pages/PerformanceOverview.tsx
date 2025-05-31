
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { mockCampaigns } from '@/data/mockData';
import { FiTrendingUp, FiUsers, FiDollarSign, FiEye, FiHeart, FiShare2 } from 'react-icons/fi';

const PerformanceOverview = () => {
  // Mock performance data
  const roiData = [
    { month: 'Jan', roi: 180 },
    { month: 'Feb', roi: 220 },
    { month: 'Mar', roi: 285 },
    { month: 'Apr', roi: 310 },
    { month: 'May', roi: 285 },
    { month: 'Jun', roi: 340 }
  ];

  const impressionsData = [
    { month: 'Jan', impressions: 450000 },
    { month: 'Feb', impressions: 520000 },
    { month: 'Mar', impressions: 680000 },
    { month: 'Apr', impressions: 720000 },
    { month: 'May', impressions: 650000 },
    { month: 'Jun', impressions: 890000 }
  ];

  const engagementData = [
    { name: 'Instagram', value: 45, color: '#E1306C' },
    { name: 'TikTok', value: 35, color: '#000000' },
    { name: 'YouTube', value: 20, color: '#FF0000' }
  ];

  const campaignPerformance = [
    {
      name: 'Summer Fashion',
      status: 'Active',
      impressions: 1200000,
      engagement: 4.2,
      roi: 285,
      progress: 75
    },
    {
      name: 'Tech Launch',
      status: 'Draft',
      impressions: 0,
      engagement: 0,
      roi: 0,
      progress: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Performance Overview</h1>
        <p className="text-gray-600">Track your campaign performance and ROI</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiDollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total ROI</p>
                <p className="text-2xl font-bold text-gray-900">285%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <FiTrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiEye className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                <p className="text-2xl font-bold text-gray-900">2.4M</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <FiTrendingUp className="h-3 w-3 mr-1" />
                  +25% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiHeart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
                <p className="text-2xl font-bold text-gray-900">4.8%</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <FiTrendingUp className="h-3 w-3 mr-1" />
                  +0.3% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiShare2 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Share Rate</p>
                <p className="text-2xl font-bold text-gray-900">2.1%</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <FiTrendingUp className="h-3 w-3 mr-1" />
                  +0.5% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* ROI Trend */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>ROI Trend</CardTitle>
            <CardDescription>Return on investment over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'ROI']} />
                <Line 
                  type="monotone" 
                  dataKey="roi" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Impressions */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Impressions Growth</CardTitle>
            <CardDescription>Total impressions across all campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={impressionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [value.toLocaleString(), 'Impressions']} />
                <Bar dataKey="impressions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Platform Distribution */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>Engagement rate by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Engagement']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {engagementData.map((platform) => (
                <div key={platform.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: platform.color }}
                    />
                    <span className="text-sm">{platform.name}</span>
                  </div>
                  <span className="text-sm font-medium">{platform.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Performance */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Individual campaign metrics and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {campaignPerformance.map((campaign, index) => (
                  <div key={index} className="p-4 border rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Progress</p>
                        <p className="font-semibold">{campaign.progress}%</p>
                      </div>
                    </div>

                    <Progress value={campaign.progress} className="mb-4" />

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Impressions</p>
                        <p className="font-semibold">
                          {campaign.impressions > 0 ? campaign.impressions.toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Engagement</p>
                        <p className="font-semibold">
                          {campaign.engagement > 0 ? `${campaign.engagement}%` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">ROI</p>
                        <p className="font-semibold">
                          {campaign.roi > 0 ? `${campaign.roi}%` : 'N/A'}
                        </p>
                      </div>
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

export default PerformanceOverview;
