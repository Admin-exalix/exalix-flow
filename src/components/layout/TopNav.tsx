import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export const TopNav = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-screen-xl mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3 animate-pulse text-muted-foreground">
            <div className="h-6 w-20 bg-muted rounded" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-xl mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger>
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
          <img
            src="/files/Logo.png"
            alt="Exalix Tech"
            className="h-8 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
          <span className="text-sm font-medium text-foreground">
            Hii! {user?.full_name || "Admin"}
          </span>
        </div>

        <Avatar
          className="h-9 w-9 cursor-pointer ring-2 ring-background hover:ring-primary/20 transition-all"
          onClick={() => navigate("/profile")}
        >
          <AvatarImage src={user?.user_image || ""} alt={user?.full_name} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(user?.full_name || "A")}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
