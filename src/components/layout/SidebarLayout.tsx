import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface SidebarLayoutProps {
  children: ReactNode;
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar with proper background for mobile dialog */}
        <AppSidebar />

        {/* Main content */}
        <div className="flex-1 bg-white">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};
