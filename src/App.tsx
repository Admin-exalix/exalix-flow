import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PurchaseOrderList from "./pages/buying/PurchaseOrderList";
import SalesOrderList from "./pages/selling/SalesOrderList";
import ItemList from "./pages/stock/ItemList";
import AccountsOverview from "./pages/accounts/AccountsOverview";
import NotFound from "./pages/NotFound";
import { erpnextClient } from "./lib/erpnext";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = erpnextClient.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/buying" element={<ProtectedRoute><PurchaseOrderList /></ProtectedRoute>} />
          <Route path="/selling" element={<ProtectedRoute><SalesOrderList /></ProtectedRoute>} />
          <Route path="/stock" element={<ProtectedRoute><ItemList /></ProtectedRoute>} />
          <Route path="/accounts" element={<ProtectedRoute><AccountsOverview /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
