import { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Package, IndianRupeeIcon, ShoppingCart, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Layout } from "@/components/layout/Layout";
import { erpnextClient } from "@/lib/erpnext";

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
      <div className="gradient-hero min-h-screen p-6 space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 shadow-glow animate-scale-in">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-primary-foreground mb-2">Dashboard</h1>
            <p className="text-primary-foreground/80 text-lg">Live ERPNext Analytics & Insights</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}>
            <Card className="relative overflow-hidden group hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 gradient-primary opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl gradient-primary shadow-glow">
                    <IndianRupeeIcon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-success animate-float" />
                </div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Total Sales</p>
                <h3 className="text-3xl font-bold text-foreground">₹{metrics.totalSales.toLocaleString()}</h3>
              </div>
            </Card>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
            <Card className="relative overflow-hidden group hover:shadow-glow-secondary transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 gradient-secondary opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl gradient-secondary shadow-glow-secondary">
                    <ShoppingCart className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-success animate-float" style={{ animationDelay: '0.5s' }} />
                </div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Total Purchase</p>
                <h3 className="text-3xl font-bold text-foreground">₹{metrics.totalPurchase.toLocaleString()}</h3>
              </div>
            </Card>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
            <Card className="relative overflow-hidden group hover:shadow-glow transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 gradient-success opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl gradient-success">
                    <Package className="h-6 w-6 text-success-foreground" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-success animate-float" style={{ animationDelay: '1s' }} />
                </div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Stock Value</p>
                <h3 className="text-3xl font-bold text-foreground">₹{metrics.stockValue.toLocaleString()}</h3>
              </div>
            </Card>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
            <Card className="relative overflow-hidden group hover:shadow-glow-secondary transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 gradient-warning opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl gradient-warning">
                    <Users className="h-6 w-6 text-warning-foreground" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-success animate-float" style={{ animationDelay: '1.5s' }} />
                </div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Active Customers</p>
                <h3 className="text-3xl font-bold text-foreground">{metrics.customers.toString()}</h3>
              </div>
            </Card>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales vs Purchase */}
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow animate-fade-in" style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg gradient-primary">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Sales vs Purchase</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(210 100% 50%)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(210 100% 50%)" stopOpacity={0.4}/>
                  </linearGradient>
                  <linearGradient id="purchaseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(280 70% 55%)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(280 70% 55%)" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="sales" fill="url(#salesGradient)" name="Sales" radius={[8, 8, 0, 0]} />
                <Bar dataKey="purchase" fill="url(#purchaseGradient)" name="Purchase" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Stock Overview */}
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg gradient-success">
                <Package className="h-5 w-5 text-success-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Stock Overview</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockData} layout="vertical">
                <defs>
                  <linearGradient id="stockGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(165 100% 45%)" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="category" type="category" width={120} stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="url(#stockGradient)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Profit Trend */}
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow animate-fade-in" style={{ animationDelay: '0.7s', animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg gradient-primary">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Profit Trend</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(210 100% 50%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(210 100% 50%)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="hsl(210 100% 50%)" 
                strokeWidth={3} 
                name="Revenue" 
                dot={{ fill: 'hsl(210 100% 50%)', r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line 
                type="monotone" 
                dataKey="purchase" 
                stroke="hsl(0 84% 60%)" 
                strokeWidth={3} 
                name="Cost"
                dot={{ fill: 'hsl(0 84% 60%)', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </Layout>
  );
}
