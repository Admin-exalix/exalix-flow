import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const mockPurchaseOrders = [
  { id: "PO-2024-001", supplier: "Tech Supplies Inc", total: "$5,400", status: "Draft", date: "2024-01-15" },
  { id: "PO-2024-002", supplier: "Global Electronics", total: "$12,800", status: "Submitted", date: "2024-01-14" },
  { id: "PO-2024-003", supplier: "Office Mart", total: "$3,200", status: "Completed", date: "2024-01-13" },
  { id: "PO-2024-004", supplier: "Hardware Hub", total: "$8,900", status: "Submitted", date: "2024-01-12" },
];

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = mockPurchaseOrders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success";
      case "Submitted":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <Button onClick={() => navigate("/buying/new-purchase-order")} className="gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search purchase orders..."
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
              onClick={() => navigate(`/buying/purchase-order/${order.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{order.id}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{order.supplier}</p>
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

export default PurchaseOrderList;
