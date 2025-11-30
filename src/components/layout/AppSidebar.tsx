import { 
  BarChart3, 
  Settings, 
  Bell, 
  FileText,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  CreditCard
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
  { icon: CreditCard, label: "POS", path: "/pos" },
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
          bg-[hsl(var(--sidebar-bg))] text-[hsl(var(--sidebar-foreground))] shadow-lg 
          w-64 sm:w-64 md:w-64 
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
          <SidebarGroupLabel className="text-[hsl(var(--sidebar-foreground))] text-xs uppercase tracking-wider px-3 py-2">
            Modules
          </SidebarGroupLabel>

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
                            ? "bg-[hsl(var(--sidebar-active))] text-white font-medium flex items-center gap-3 px-4 py-3 rounded-md mx-2 my-1"
                            : "text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-bg))]/80 flex items-center gap-3 px-4 py-3 rounded-md mx-2 my-1"
                        }
                      >
                        <Icon className="h-5 w-5" />
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
