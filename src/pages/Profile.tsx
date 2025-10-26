import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Building2, LogOut, Settings } from "lucide-react";
import { erpnextClient } from "@/lib/erpnext";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 1️⃣ Get currently logged-in user
        const res = await erpnextClient.get(
          "/method/frappe.auth.get_logged_user"
        );
        const loggedInUser = res.message; // e.g., "krish@exalix.tech"

        if (!loggedInUser) throw new Error("No logged-in user");

        // 2️⃣ Fetch user document by email
        const user = await erpnextClient.getDocument("User", loggedInUser);
        if (!user) throw new Error("User document not found");

        setUserData(user);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to fetch user info",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    erpnextClient.logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = userData?.full_name || "";
  const userEmail = userData?.email || "";
  const userOrg = userData?.company || "Exalix Tech";
  const userAvatar = userData?.user_image || "";

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            {loading ? (
              <p className="text-center text-sm text-muted-foreground">
                Loading...
              </p>
            ) : (
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {userName}
                  </h2>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Info */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Account Information</CardTitle>
            <CardDescription>Your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="text-sm font-medium text-foreground">
                  {userName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">
                  {userEmail}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Organization</p>
                <p className="text-sm font-medium text-foreground">{userOrg}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.location.href = "https://exalixtech.com/mobileapp/settings"}
            >
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
