import { useEffect, useState } from "react";
import { Package, CheckCircle2, Truck, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { erpnextClient } from "@/lib/erpnext";

interface SalesActivity {
  toBePacked: number;
  toBeShipped: number;
  toBeDelivered: number;
  toBeInvoiced: number;
}

interface InventoryMetrics {
  quantityInHand: number;
  quantityToBeReceived: number;
}

interface ProductDetail {
  label: string;
  count: number;
  isAlert?: boolean;
}

export default function Dashboard() {
  const [salesActivity, setSalesActivity] = useState<SalesActivity>({
    toBePacked: 228,
    toBeShipped: 6,
    toBeDelivered: 10,
    toBeInvoiced: 474,
  });

  const [inventory, setInventory] = useState<InventoryMetrics>({
    quantityInHand: 10458,
    quantityToBeReceived: 168,
  });

  const [productDetails] = useState<ProductDetail[]>([
    { label: "Low Stock Items", count: 3, isAlert: true },
    { label: "All Item Group", count: 39 },
    { label: "All Items", count: 190 },
    { label: "Unconfirmed Items", count: 121, isAlert: true },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // Fetch data from ERPNext if needed
      // This is placeholder - adjust based on your ERPNext setup
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[hsl(var(--background))] p-6 space-y-6">
        {/* Sales Activity Section */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Sales Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* To Be Packed */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold text-[hsl(var(--primary))] mb-2">
                  {salesActivity.toBePacked}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Qty</div>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>TO BE PACKED</span>
                </div>
              </div>
            </Card>

            {/* To Be Shipped */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold text-[#dc2626] mb-2">
                  {salesActivity.toBeShipped}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Pkgs</div>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>TO BE SHIPPED</span>
                </div>
              </div>
            </Card>

            {/* To Be Delivered */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold text-[#16a34a] mb-2">
                  {salesActivity.toBeDelivered}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Pkgs</div>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>TO BE DELIVERED</span>
                </div>
              </div>
            </Card>

            {/* To Be Invoiced */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl font-bold text-[hsl(var(--primary))] mb-2">
                  {salesActivity.toBeInvoiced}
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wide">Qty</div>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>TO BE INVOICED</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Details */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">PRODUCT DETAILS</h3>
              <div className="space-y-3">
                {productDetails.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className={item.isAlert ? "text-destructive font-medium" : "text-foreground"}>
                      {item.label}
                    </span>
                    <span className={item.isAlert ? "text-destructive font-bold" : "text-foreground font-semibold"}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Purchase & Sales Orders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Purchase Order */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">PURCHASE ORDER</h3>
                  <select className="text-sm border border-border rounded px-2 py-1 bg-background">
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>This Year</option>
                  </select>
                </div>
                <div className="text-center py-8">
                  <div className="text-sm text-muted-foreground mb-2">Quantity Ordered</div>
                  <div className="text-4xl font-bold text-[hsl(var(--primary))]">652.00</div>
                </div>
              </Card>

              {/* Sales Order */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">SALES ORDER</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr className="text-muted-foreground">
                        <th className="text-left py-2 font-medium">Channel</th>
                        <th className="text-center py-2 font-medium">Draft</th>
                        <th className="text-center py-2 font-medium">Confirmed</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-2 text-foreground">Direct sales</td>
                        <td className="text-center py-2 text-foreground">0</td>
                        <td className="text-center py-2 text-foreground">50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column - Inventory Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 h-full">
              <h3 className="text-lg font-semibold text-foreground mb-6">Inventory Summary</h3>
              <div className="space-y-6">
                <div className="pb-4 border-b border-border">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    QUANTITY IN HAND
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    {inventory.quantityInHand.toLocaleString()}
                  </div>
                </div>
                <div className="pb-4">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    QUANTITY TO BE RECEIVED
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    {inventory.quantityToBeReceived}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
