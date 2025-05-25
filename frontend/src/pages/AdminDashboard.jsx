import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AuthContext from "@/context/auth-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, UserMinus, Eye, Trash, Edit, Plus } from "lucide-react";

export default function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState({
        users: true,
        problems: true
    });

    useEffect(() => {
        // Redirect if not admin
        if (!user.admin) {
            navigate("/");
            return;
        }

        // Fetch users
        fetchUsers();
        
        // Fetch problems
        fetchProblems();
    }, [user, navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(prev => ({ ...prev, users: true }));
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setUsers(data.data.users);
            } else {
                console.error("Failed to fetch users:", data.message);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(prev => ({ ...prev, users: false }));
        }
    };

    const fetchProblems = async () => {
        try {
            setLoading(prev => ({ ...prev, problems: true }));
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/problem-statements`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setProblems(data.data.problemStatements);
            } else {
                console.error("Failed to fetch problems:", data.message);
            }
        } catch (error) {
            console.error("Error fetching problems:", error);
        } finally {
            setLoading(prev => ({ ...prev, problems: false }));
        }
    };

    const toggleAdminStatus = async (userId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/toggle-admin`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                // Update the user in the list
                setUsers(users.map(u => 
                    u.id === userId ? { ...u, admin: !u.admin } : u
                ));
            } else {
                console.error("Failed to toggle admin status:", data.message);
            }
        } catch (error) {
            console.error("Error toggling admin status:", error);
        }
    };

    const deleteProblem = async (problemId) => {
        if (!confirm("Are you sure you want to delete this problem?")) {
            return;
        }
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/problem-statement/delete/${problemId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                // Remove the problem from the list
                setProblems(problems.filter(p => p.id !== problemId));
            } else {
                console.error("Failed to delete problem:", data.message);
            }
        } catch (error) {
            console.error("Error deleting problem:", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>

            <Tabs defaultValue="users" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="problems">Problem Statements</TabsTrigger>
                </TabsList>
                
                <TabsContent value="users">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Users</h2>
                        
                        {loading.users ? (
                            <div className="text-center py-8">Loading users...</div>
                        ) : (
                            <ScrollArea className="h-[500px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Points</TableHead>
                                            <TableHead>Submissions</TableHead>
                                            <TableHead>Joined</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map(user => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        {user.admin && <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Admin</Badge>}
                                                        {user.isVerified ? 
                                                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Verified</Badge> : 
                                                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Unverified</Badge>
                                                        }
                                                        <Badge variant="outline">{user.authProvider}</Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{user.points}</TableCell>
                                                <TableCell>{user._count.submissions}</TableCell>
                                                <TableCell>{formatDate(user.createdAt)}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => toggleAdminStatus(user.id)}
                                                            disabled={user.id === window.user?.id}
                                                        >
                                                            {user.admin ? <UserMinus size={16} /> : <UserPlus size={16} />}
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => navigate(`/user/${user.id}`)}
                                                        >
                                                            <Eye size={16} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        )}
                    </div>
                </TabsContent>
                
                <TabsContent value="problems">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Problem Statements</h2>
                            <Button onClick={() => navigate("/admin/problem/new")}>
                                <Plus size={16} className="mr-2" /> New Problem
                            </Button>
                        </div>
                        
                        {loading.problems ? (
                            <div className="text-center py-8">Loading problems...</div>
                        ) : (
                            <ScrollArea className="h-[500px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Difficulty</TableHead>
                                            <TableHead>Created By</TableHead>
                                            <TableHead>Test Cases</TableHead>
                                            <TableHead>Submissions</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {problems.map(problem => (
                                            <TableRow key={problem.id}>
                                                <TableCell className="font-medium">{problem.title}</TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant="outline" 
                                                        className={
                                                            problem.difficulty === "Easy" ? "bg-green-100 text-green-800 border-green-300" :
                                                            problem.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                                                            "bg-red-100 text-red-800 border-red-300"
                                                        }
                                                    >
                                                        {problem.difficulty}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{problem.createdBy?.name || 'N/A'}</TableCell>
                                                <TableCell>{problem._count.testCase}</TableCell>
                                                <TableCell>{problem._count.submissions}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => navigate(`/problem/${problem.id}`)}
                                                        >
                                                            <Eye size={16} />
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => navigate(`/admin/problem/edit/${problem.id}`)}
                                                        >
                                                            <Edit size={16} />
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() => deleteProblem(problem.id)}
                                                        >
                                                            <Trash size={16} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}