import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShoppingCart,
  TrendingUp,
  Package,
  DollarSign,
  Plus,
  RefreshCw,
  Truck,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { erpnextClient } from "@/lib/erpnext";

// Types for ERPNext resources used on this page
type SalesOrder = {
  name: string;
  customer: string;
  grand_total?: string | number;
  status: string;
  transaction_date?: string;
};

type PurchaseOrder = {
  name: string;
  supplier: string;
  grand_total?: string | number;
  status: string;
  transaction_date?: string;
};

type Invoice = {
  grand_total?: string | number;
  outstanding_amount?: string | number;
};

type BinData = {
  stock_value?: string | number;
};


const Home = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<any[]>([]);
  const [salesOrders, setSalesOrders] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!erpnextClient.isAuthenticated()) return;

      try {
        // ✅ Fetch Sales Orders (submitted)
        const sales = await erpnextClient.fetchResource<SalesOrder>(
          "Sales Order",
          { docstatus: 1 },
          ["name", "customer", "grand_total", "status", "transaction_date"]
        );

        // ✅ Fetch Purchase Orders (submitted)
        const purchases = await erpnextClient.fetchResource<PurchaseOrder>(
          "Purchase Order",
          { docstatus: 1 },
          ["name", "supplier", "grand_total", "status", "transaction_date"]
        );

        // ✅ Fetch Sales Invoices (for receivable)
        const salesInvoices = await erpnextClient.fetchResource<Invoice>(
          "Sales Invoice",
          { docstatus: 1 },
          ["grand_total", "outstanding_amount"]
        );

        // ✅ Fetch Purchase Invoices (for payable)
        const purchaseInvoices = await erpnextClient.fetchResource<Invoice>(
          "Purchase Invoice",
          { docstatus: 1 },
          ["grand_total", "outstanding_amount"]
        );

        // ✅ Fetch Items (for stock value)
        const items = await erpnextClient.fetchResource(
          "Item",
          { disabled: 0 },
          ["name", "valuation_rate", "actual_qty"]
        );

        // ---- Calculations ----
        // Fetch Bin for stock value
        const bins = await erpnextClient.fetchResource<BinData>(
          "Bin",
          {},
          ["stock_value"]
        );

        // Sum stock_value from all bins
        const stockValue = bins.reduce(
          (acc, bin) => acc + Number((bin.stock_value ?? 0) as number | string),
          0
        );


        // CORRECT: Using Sales Invoices for revenue
        const totalRevenue = salesInvoices.reduce(
          (acc, inv) => acc + Number(inv.grand_total ?? 0),
          0
        );

        const receivable = salesInvoices.reduce(
          (acc, inv) => acc + Number(inv.outstanding_amount ?? 0),
          0
        );

        const payable = purchaseInvoices.reduce(
          (acc, inv) => acc + Number(inv.outstanding_amount ?? 0),
          0
        );

        // ---- Stats Cards ----
        setStats([
          {
            title: "Sales Orders",
            value: sales.length.toString(),
            icon: ShoppingCart,
            trend: { value: `${sales.length} total`, isPositive: true },
          },
          {
            title: "Purchase Orders",
            value: purchases.length.toString(),
            icon: Truck,
            trend: { value: `${purchases.length} total`, isPositive: true },
          },
          {
            title: "Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: TrendingUp,
            trend: { value: "Updated", isPositive: true },
          },
          {
            title: "Stock Value",
            value: `₹${stockValue.toLocaleString()}`,
            icon: Package,
            trend: { value: "Updated", isPositive: true },
          },
          {
            title: "Receivable",
            value: `₹${receivable.toLocaleString()}`,
            icon: ArrowDownCircle,
            trend: { value: "Pending", isPositive: true },
          },
          {
            title: "Payable",
            value: `₹${payable.toLocaleString()}`,
            icon: ArrowUpCircle,
            trend: { value: "Pending", isPositive: false },
          },
        ]);

        // ---- Data for lists ----
        setSalesOrders(sales);
        setPurchaseOrders(purchases);
        setRecentSales(sales.slice(-5));
        setRecentPurchases(purchases.slice(-5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back to Exalix ERP
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate("/buying/new-purchase-order")}
              >
                <Plus className="h-5 w-5 text-light" />
                <span className="text-sm font-medium">New Purchase</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate("/selling/new-sales-order")}
              >
                <Plus className="h-5 w-5 text-light" />
                <span className="text-sm font-medium">New Sale</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate("/stock")}
              >
                <Package className="h-5 w-5 text-light" />
                <span className="text-sm font-medium">View Stock</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate("/accounts")}
              >
                <DollarSign className="h-5 w-5 text-light" />
                <span className="text-sm font-medium">Accounts</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sales */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Recent Sales Orders</CardTitle>
              <CardDescription>Latest sales transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSales.map((so) => (
                  <div
                    key={so.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {so.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {so.customer} • {so.transaction_date}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        so.status === "Completed"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {so.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Purchases */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Recent Purchase Orders</CardTitle>
              <CardDescription>Latest purchase transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPurchases.map((po) => (
                  <div
                    key={po.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {po.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {po.supplier} • {po.transaction_date}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        po.status === "Completed"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {po.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
