import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Package, IndianRupeeIcon, ShoppingCart, Users } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Layout } from "@/components/layout/Layout";
import { erpnextClient } from "@/lib/erpnext"; // ✅ your ERPNext.ts

interface MonthlyData {
  month: string;
  sales: number;
  purchase: number;
}

interface StockData {
  category: string;
  value: number;
}

export default function Dashboard() {
  const [salesData, setSalesData] = useState<MonthlyData[]>([]);
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalPurchase: 0,
    stockValue: 0,
    customers: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // ✅ Login first (optional if session exists)
      await erpnextClient.login({ usr: "admin@example.com", pwd: "yourpassword" });

      // ✅ Fetch total sales
      const salesInvoices = await erpnextClient.fetchResource<any>(
        "Sales Invoice",
        { docstatus: 1 },
        ["name", "grand_total", "posting_date"]
      );

      const totalSales = salesInvoices.reduce((sum, s) => sum + (s.grand_total || 0), 0);

      // ✅ Fetch total purchases
      const purchaseInvoices = await erpnextClient.fetchResource<any>(
        "Purchase Invoice",
        { docstatus: 1 },
        ["name", "grand_total", "posting_date"]
      );

      const totalPurchase = purchaseInvoices.reduce((sum, p) => sum + (p.grand_total || 0), 0);

      // ✅ Fetch stock value
      const stockBins = await erpnextClient.fetchResource<any>("Bin", {}, ["warehouse", "actual_qty", "valuation_rate"]);
      const stockValue = stockBins.reduce((sum, item) => sum + (item.actual_qty * item.valuation_rate || 0), 0);

      // ✅ Fetch customers
      const customers = await erpnextClient.fetchResource<any>("Customer", { disabled: 0 });
      const customerCount = customers.length;

      // ✅ Group monthly sales/purchases for charts
      const monthlySales: Record<string, number> = {};
      for (const s of salesInvoices) {
        const month = new Date(s.posting_date).toLocaleString("default", { month: "short" });
        monthlySales[month] = (monthlySales[month] || 0) + s.grand_total;
      }

      const monthlyPurchases: Record<string, number> = {};
      for (const p of purchaseInvoices) {
        const month = new Date(p.posting_date).toLocaleString("default", { month: "short" });
        monthlyPurchases[month] = (monthlyPurchases[month] || 0) + p.grand_total;
      }

      const combinedMonths = Array.from(new Set([...Object.keys(monthlySales), ...Object.keys(monthlyPurchases)]));

      const monthlyData = combinedMonths.map((m) => ({
        month: m,
        sales: monthlySales[m] || 0,
        purchase: monthlyPurchases[m] || 0,
      }));

      // ✅ Simple stock category chart
      const stockSummary: StockData[] = [
        { category: "Total Items", value: stockBins.length },
        { category: "Total Qty", value: stockBins.reduce((s, b) => s + b.actual_qty, 0) },
        { category: "Total Value", value: Math.round(stockValue / 1000) },
      ];

      setMetrics({
        totalSales,
        totalPurchase,
        stockValue,
        customers: customerCount,
      });

      setSalesData(monthlyData);
      setStockData(stockSummary);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Live ERPNext Analytics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Sales" value={`₹${metrics.totalSales.toLocaleString()}`} icon={IndianRupeeIcon} />
          <StatCard title="Total Purchase" value={`₹${metrics.totalPurchase.toLocaleString()}`} icon={ShoppingCart} />
          <StatCard title="Stock Value" value={`₹${metrics.stockValue.toLocaleString()}`} icon={Package} />
          <StatCard title="Active Customers" value={metrics.customers.toString()} icon={Users} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales vs Purchase */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Sales vs Purchase</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="hsl(var(--primary))" name="Sales" />
                <Bar dataKey="purchase" fill="hsl(var(--secondary))" name="Purchase" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Stock Overview */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Stock Overview</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Profit Trend */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Profit Trend</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} name="Revenue" />
              <Line type="monotone" dataKey="purchase" stroke="hsl(var(--destructive))" strokeWidth={2} name="Cost" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </Layout>
  );
}
