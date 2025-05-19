import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { UserRound, Check, Shield, Send, FileText, TrendingUp, Zap } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";

const StatCard = ({ title, value, icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        {title}
      </CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        <NumberTicker value={value} />
      </div>
      <p className="text-xs text-muted-foreground">
        {description}
      </p>
    </CardContent>
  </Card>
);

function AdminDashboard({ token }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    adminUsers: 0,
    totalSubmissions: 0,
    successfulSubmissions: 0,
    problemsCount: 0,
    recentUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.SERVER_URL}/admin/stats`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
          validateStatus: false,
        });

        if (response.data.success) {
          setStats(response.data.data);
        } else {
          toast({
            title: "Error",
            description: response.data.message || "Failed to fetch stats",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch dashboard statistics",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, toast]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading statistics...</div>;
  }

  const successRate = stats.totalSubmissions 
    ? Math.round((stats.successfulSubmissions / stats.totalSubmissions) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Platform Overview</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<UserRound className="h-4 w-4 text-muted-foreground" />}
          description="Total registered users"
        />
        
        <StatCard
          title="Verified Users"
          value={stats.verifiedUsers}
          icon={<Check className="h-4 w-4 text-green-500" />}
          description={`${Math.round((stats.verifiedUsers / (stats.totalUsers || 1)) * 100)}% verification rate`}
        />
        
        <StatCard
          title="Admins"
          value={stats.adminUsers}
          icon={<Shield className="h-4 w-4 text-blue-500" />}
          description="Users with admin privileges"
        />
        
        <StatCard
          title="Total Submissions"
          value={stats.totalSubmissions}
          icon={<Send className="h-4 w-4 text-primary" />}
          description="Across all problem statements"
        />
        
        <StatCard
          title="Problem Statements"
          value={stats.problemsCount}
          icon={<FileText className="h-4 w-4 text-yellow-500" />}
          description="Available coding challenges"
        />
        
        <StatCard
          title="Success Rate"
          value={`${successRate}%`}
          icon={<TrendingUp className="h-4 w-4 text-green-500" />}
          description={`${stats.successfulSubmissions} successful submissions`}
        />
        
        <StatCard
          title="New Users (7 days)"
          value={stats.recentUsers}
          icon={<Zap className="h-4 w-4 text-purple-500" />}
          description="Recent user signups"
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
