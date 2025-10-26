import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { erpnextClient } from "@/lib/erpnext";

interface BinItem {
  item_code: string;
  warehouse: string;
  actual_qty: number;
  stock_value: number;
}

const ItemList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [bins, setBins] = useState<BinItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBins = async () => {
      if (!erpnextClient.isAuthenticated()) return;

      try {
        const binData: BinItem[] = await erpnextClient.fetchResource(
          "Bin",
          {},
          ["item_code", "warehouse", "actual_qty", "stock_value"]
        );

        setBins(binData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bins:", error);
        setLoading(false);
      }
    };

    fetchBins();
  }, []);

  const filteredBins = bins.filter(
    (bin) =>
      bin.item_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bin.warehouse.toLowerCase().includes(searchQuery.toLowerCase())
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

        {/* Loading */}
        {loading && <p className="text-sm text-muted-foreground">Loading stock data...</p>}

        {/* List */}
        <div className="space-y-3">
          {filteredBins.map((bin, index) => (
            <Card
              key={`${bin.item_code}-${index}`}
              className="shadow-card hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate(`/stock/item/${bin.item_code}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{bin.item_code}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Qty: <span className="font-medium text-foreground">{bin.actual_qty}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{bin.warehouse}</p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">₹{bin.stock_value.toLocaleString()}</span>
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
