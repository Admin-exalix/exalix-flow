import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const mockItems = [
  { id: "ITEM-001", name: "Wireless Mouse", qty: 150, value: "$4,500", warehouse: "Main Store" },
  { id: "ITEM-002", name: "USB Cable", qty: 500, value: "$2,500", warehouse: "Main Store" },
  { id: "ITEM-003", name: "Laptop Stand", qty: 75, value: "$5,625", warehouse: "Secondary Store" },
  { id: "ITEM-004", name: "Monitor 24\"", qty: 30, value: "$9,000", warehouse: "Main Store" },
  { id: "ITEM-005", name: "Keyboard Mechanical", qty: 85, value: "$8,500", warehouse: "Main Store" },
];

const ItemList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = mockItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Stock Items</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="shadow-card hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate(`/stock/item/${item.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{item.id}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Qty: <span className="font-medium text-foreground">{item.qty}</span></p>
                        <p className="text-xs text-muted-foreground">{item.warehouse}</p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{item.value}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ItemList;
