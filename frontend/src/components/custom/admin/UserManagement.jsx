import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  ShieldOff,
  Search,
  RefreshCw,
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

function UserManagement({ token }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.SERVER_URL}/admin/users`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        validateStatus: false,
      });

      if (response.data.success) {
        setUsers(response.data.data.users);
        setFilteredUsers(response.data.data.users);
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to fetch users",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        user => 
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (activeFilter === 'admin') {
      filtered = filtered.filter(user => user.admin);
    } else if (activeFilter === 'unverified') {
      filtered = filtered.filter(user => !user.isVerified);
    }
    
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, activeFilter]);

  const toggleAdminStatus = async (userId) => {
    try {
      const response = await axios.patch(
        `${process.env.SERVER_URL}/admin/users/${userId}/toggle-admin`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          validateStatus: false,
        }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        
        // Update the local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? { ...user, admin: !user.admin } 
              : user
          )
        );
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to update user",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant={activeFilter === 'all' ? 'default' : 'outline'} 
                onClick={() => setActiveFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button 
                variant={activeFilter === 'admin' ? 'default' : 'outline'} 
                onClick={() => setActiveFilter('admin')}
                size="sm"
              >
                Admins
              </Button>
              <Button 
                variant={activeFilter === 'unverified' ? 'default' : 'outline'} 
                onClick={() => setActiveFilter('unverified')}
                size="sm"
              >
                Unverified
              </Button>
              <Button 
                variant="outline" 
                onClick={fetchUsers}
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading users...</div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {user.admin && (
                              <Badge variant="default" className="bg-blue-500">Admin</Badge>
                            )}
                            {user.isVerified ? (
                              <Badge variant="outline" className="border-green-500 text-green-500">Verified</Badge>
                            ) : (
                              <Badge variant="outline" className="border-amber-500 text-amber-500">Unverified</Badge>
                            )}
                            {user.authProvider === "GITHUB" && (
                              <Badge variant="outline" className="border-gray-500">GitHub</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{user._count.submissions}</TableCell>
                        <TableCell>{getFormattedDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleAdminStatus(user.id)}
                                  >
                                    {user.admin ? (
                                      <ShieldOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <Shield className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {user.admin ? "Remove admin privileges" : "Grant admin privileges"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UserManagement;
