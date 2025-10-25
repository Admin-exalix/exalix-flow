import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const mockSalesOrders = [
  { id: "SO-2024-045", customer: "ABC Corporation", total: "$15,600", status: "Completed", date: "2024-01-15" },
  { id: "SO-2024-046", customer: "XYZ Ltd", total: "$8,400", status: "To Deliver", date: "2024-01-14" },
  { id: "SO-2024-047", customer: "Tech Solutions", total: "$22,800", status: "To Bill", date: "2024-01-13" },
  { id: "SO-2024-048", customer: "Innovation Inc", total: "$6,700", status: "Draft", date: "2024-01-12" },
];

const SalesOrderList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = mockSalesOrders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success";
      case "To Deliver":
      case "To Bill":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sales Orders</h1>
          <Button onClick={() => navigate("/selling/new-sales-order")} className="gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sales orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <Card
              key={order.id}
              className="shadow-card hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate(`/selling/sales-order/${order.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{order.id}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{order.customer}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{order.total}</span>
                  <span className="text-xs text-muted-foreground">{order.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SalesOrderList;
