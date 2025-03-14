import { useEffect, useState } from 'react';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  BarChart2,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Placeholder data for charts
const weeklyRevenue = [
  { day: 'Mon', amount: 540 },
  { day: 'Tue', amount: 620 },
  { day: 'Wed', amount: 480 },
  { day: 'Thu', amount: 580 },
  { day: 'Fri', amount: 780 },
  { day: 'Sat', amount: 850 },
  { day: 'Sun', amount: 690 },
];

// Mock data for the dashboard
const mockData = {
  totalSubscribers: 1245,
  activeSubscribers: 1078,
  contentItems: 78,
  weeklyRevenue: '$4,540',
  conversionRate: '12.8%',
  revenueGrowth: '+15.3%',
  tierDistribution: {
    free: 55,
    daily: 10,
    weekly: 15,
    monthly: 20,
  },
  recentContent: [
    { id: 1, title: 'MLB Picks - June 15', date: '2023-06-15', openRate: '68%' },
    { id: 2, title: 'NBA Finals Special', date: '2023-06-12', openRate: '74%' },
    { id: 3, title: 'MLB Picks - June 10', date: '2023-06-10', openRate: '65%' },
  ],
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(mockData);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch data from the API
        // const response = await fetch('/api/admin/analytics/dashboard', {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        //   },
        // });
        // const data = await response.json();
        // setDashboardData(data);
        
        // For now, we'll use mock data with a simulated delay
        setTimeout(() => {
          setDashboardData(mockData);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  // Function to render the tier distribution chart
  const renderTierDistribution = () => {
    const { tierDistribution } = dashboardData;
    const tiers = Object.entries(tierDistribution);
    const total = tiers.reduce((sum, [_, value]) => sum + value, 0);

    return (
      <div className="flex items-center space-x-2 mt-4">
        {tiers.map(([tier, percentage]) => (
          <div key={tier} className="flex flex-col items-center">
            <div className="text-xs text-gray-500 mb-1 capitalize">{tier}</div>
            <div className="w-12 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-24 ${
                  tier === 'free' ? 'bg-gray-400' :
                  tier === 'daily' ? 'bg-blue-400' :
                  tier === 'weekly' ? 'bg-green-400' :
                  'bg-purple-400'
                }`}
                style={{ height: `${(percentage / 100) * 120}px` }}
              ></div>
            </div>
            <div className="text-xs font-medium mt-1">{percentage}%</div>
          </div>
        ))}
      </div>
    );
  };

  // Simplified bar chart for weekly revenue
  const renderRevenueChart = () => {
    const maxAmount = Math.max(...weeklyRevenue.map(item => item.amount));
    
    return (
      <div className="flex items-end space-x-2 h-36 mt-4">
        {weeklyRevenue.map((item) => (
          <div key={item.day} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-blue-500 rounded-t"
              style={{ height: `${(item.amount / maxAmount) * 100}%` }}
            ></div>
            <div className="text-xs text-gray-500 mt-1">{item.day}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={() => window.location.reload()} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalSubscribers}</div>
            <p className="text-xs text-gray-500">
              {dashboardData.activeSubscribers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Content Items</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.contentItems}</div>
            <p className="text-xs text-gray-500">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.weeklyRevenue}</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              {dashboardData.revenueGrowth} from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.conversionRate}</div>
            <p className="text-xs text-gray-500">
              Free to paid conversion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Weekly revenue for the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>{renderRevenueChart()}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Tiers</CardTitle>
            <CardDescription>Distribution of subscribers by tier</CardDescription>
          </CardHeader>
          <CardContent>{renderTierDistribution()}</CardContent>
        </Card>
      </div>

      {/* Recent content */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Content</CardTitle>
          <CardDescription>Latest content performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Title</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Open Rate</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentContent.map((content) => (
                  <tr key={content.id} className="border-b">
                    <td className="py-3 px-4 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {content.title}
                    </td>
                    <td className="py-3 px-4">{content.date}</td>
                    <td className="py-3 px-4">{content.openRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              View All Content
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard; 