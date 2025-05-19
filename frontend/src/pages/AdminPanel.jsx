import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AuthContext from "@/context/auth-provider";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Users, FileText, BarChart3 } from "lucide-react";
import AdminDashboard from "@/components/custom/admin/AdminDashboard";
import UserManagement from "@/components/custom/admin/UserManagement";
import ProblemManagement from "@/components/custom/admin/ProblemManagement";

function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Check if user is admin, if not redirect to home
    if (!user.isAuthenticated) {
      navigate("/login?next=/admin");
      return;
    }

    // Check if the user is an admin
    const checkAdmin = async () => {
      try {
        await axios.get(`${process.env.SERVER_URL}/admin/stats`, {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
          validateStatus: false,
        });
      } catch (error) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    checkAdmin();
  }, [user, navigate, toast]);

  if (!user.isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="problems" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Problem Statements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <AdminDashboard token={user.token} />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement token={user.token} />
        </TabsContent>
        
        <TabsContent value="problems">
          <ProblemManagement token={user.token} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminPanel;
