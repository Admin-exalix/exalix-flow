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
import PurchaseOrderList from "./pages/buying/PurchaseOrderList";
import NewPurchaseOrder from "./pages/buying/NewPurchaseOrder";
import SalesOrderList from "./pages/selling/SalesOrderList";
import NewSalesOrder from "./pages/selling/NewSalesOrder";
import ItemList from "./pages/stock/ItemList";
import AccountsOverview from "./pages/accounts/AccountsOverview";
import Leads from "./pages/crm/Leads";
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
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/buying" element={<ProtectedRoute><PurchaseOrderList /></ProtectedRoute>} />
          <Route path="/buying/new-purchase-order" element={<ProtectedRoute><NewPurchaseOrder /></ProtectedRoute>} />
          <Route path="/selling" element={<ProtectedRoute><SalesOrderList /></ProtectedRoute>} />
          <Route path="/selling/new-sales-order" element={<ProtectedRoute><NewSalesOrder /></ProtectedRoute>} />
          <Route path="/stock" element={<ProtectedRoute><ItemList /></ProtectedRoute>} />
          <Route path="/accounts" element={<ProtectedRoute><AccountsOverview /></ProtectedRoute>} />
          <Route path="/crm" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
