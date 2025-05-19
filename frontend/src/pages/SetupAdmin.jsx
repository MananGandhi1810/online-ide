import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { useToast } from "@/hooks/use-toast.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Shield, AlertTriangle } from "lucide-react";

function SetupAdmin() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const createFirstAdmin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.SERVER_URL}/setup/create-first-admin`,
        {},
        { validateStatus: false }
      );

      if (response.data.success) {
        toast({
          title: "Success",
          description: "First admin created successfully. You can now log in with this account.",
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to create admin",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full-w-nav w-screen m-auto flex items-center justify-center">
      <Card className="w-[450px]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            <CardTitle>Admin Setup</CardTitle>
          </div>
          <CardDescription>
            Create the first admin user for the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 rounded-md flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">Important Information</p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  This setup will make the user with the email configured in the ADMIN_EMAIL environment variable an admin. 
                  This can only be done once when there are no existing admins in the system.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              After creating the first admin, you can assign admin privileges to other users through the admin panel.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={createFirstAdmin} 
            disabled={loading}
          >
            {loading ? "Setting up..." : "Create First Admin"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SetupAdmin;
