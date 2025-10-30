import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects/Projects";
import NewProject from "./pages/Projects/NewProject";
import HR from "./pages/HR/HR";
import NewEmployee from "./pages/HR/NewEmployee";
import Reports from "./pages/Reports/Reports";
import Notifications from "./pages/Notifications";
import Support from "./pages/Support/support";
import NewTicket from "./pages/Support/NewTicket";
import PurchaseOrderList from "./pages/buying/PurchaseOrderList";
import NewPurchaseOrder from "./pages/buying/NewPurchaseOrder";
import SalesOrderList from "./pages/selling/SalesOrderList";
import NewSalesOrder from "./pages/selling/NewSalesOrder";
import ItemList from "./pages/stock/ItemList";
import AccountsOverview from "./pages/accounts/AccountsOverview";
import Leads from "./pages/crm/Leads";
import NewLead from "./pages/crm/NewLead";
import NotFound from "./pages/NotFound";
import { erpnextClient } from "./lib/erpnext";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = erpnextClient.isAuthenticated();
  return isAuthenticated ? <SidebarLayout>{children}</SidebarLayout> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/mobileapp">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/projects/new-project" element={<ProtectedRoute><NewProject /></ProtectedRoute>} />
          <Route path="/hr" element={<ProtectedRoute><HR /></ProtectedRoute>} />
          <Route path="/hr/new-employee" element={<ProtectedRoute><NewEmployee /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
          <Route path="/support/new-ticket" element={<ProtectedRoute><NewTicket /></ProtectedRoute>} />
          <Route path="/buying" element={<ProtectedRoute><PurchaseOrderList /></ProtectedRoute>} />
          <Route path="/buying/new-purchase-order" element={<ProtectedRoute><NewPurchaseOrder /></ProtectedRoute>} />
          <Route path="/selling" element={<ProtectedRoute><SalesOrderList /></ProtectedRoute>} />
          <Route path="/selling/new-sales-order" element={<ProtectedRoute><NewSalesOrder /></ProtectedRoute>} />
          <Route path="/stock" element={<ProtectedRoute><ItemList /></ProtectedRoute>} />
          <Route path="/accounts" element={<ProtectedRoute><AccountsOverview /></ProtectedRoute>} />
          <Route path="/crm" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
          <Route path="/crm/new-lead" element={<ProtectedRoute><NewLead /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;