import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, TrendingUp, Package, DollarSign, Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Orders",
      value: "248",
      icon: ShoppingCart,
      trend: { value: "12% from last month", isPositive: true },
    },
    {
      title: "Stock Value",
      value: "$124,590",
      icon: Package,
      trend: { value: "8% from last month", isPositive: true },
    },
    {
      title: "Revenue",
      value: "$89,400",
      icon: TrendingUp,
      trend: { value: "5% from last month", isPositive: true },
    },
    {
      title: "Outstanding",
      value: "$12,340",
      icon: DollarSign,
      trend: { value: "3% from last month", isPositive: false },
    },
  ];

  const recentActivities = [
    { id: 1, type: "Purchase Order", name: "PO-2024-001", time: "2 hours ago", status: "pending" },
    { id: 2, type: "Sales Order", name: "SO-2024-045", time: "3 hours ago", status: "completed" },
    { id: 3, type: "Stock Entry", name: "STE-2024-023", time: "5 hours ago", status: "completed" },
    { id: 4, type: "Invoice", name: "INV-2024-089", time: "1 day ago", status: "pending" },
  ];

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back to Exalix ERP</p>
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
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
                <Plus className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">New Purchase</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate("/selling/new-sales-order")}
              >
                <Plus className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">New Sale</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate("/stock")}
              >
                <Package className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">View Stock</span>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => navigate("/accounts")}
              >
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Accounts</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Today's Activities</CardTitle>
            <CardDescription>Recent transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">{activity.type} • {activity.time}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      activity.status === "completed"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Home;
