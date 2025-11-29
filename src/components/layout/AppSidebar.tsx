import { 
  BarChart3, 
  Settings, 
  Bell, 
  FileText,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
  { icon: DollarSign, label: "Accounting", path: "/accounts" },
  { icon: Package, label: "Inventory", path: "/stock" },
  { icon: ShoppingCart, label: "Purchase", path: "/buying" },
  { icon: TrendingUp, label: "Sales", path: "/selling" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar>

      <SidebarContent
        className="
          bg-white text-foreground shadow-lg 
          w-72 sm:w-72 md:w-72 
          fixed inset-y-0 left-0 z-50
          overflow-y-auto
        "
      >
        {/* Accessibility hidden title/description */}
        <VisuallyHidden>
          <h2>Sidebar Navigation</h2>
          <p>Main application menu</p>
        </VisuallyHidden>

        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.path}
                        end
                        className={({ isActive }) =>
                          isActive
                            ? "bg-muted text-primary font-medium flex items-center gap-2 px-2 py-1 rounded"
                            : "hover:bg-muted/50 flex items-center gap-2 px-2 py-1 rounded"
                        }
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
