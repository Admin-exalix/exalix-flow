// src/pages/buying/PurchaseOrderList.tsx
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { erpnextClient } from "@/lib/erpnext";

// Status colors for PO
const getStatusColor = (status: string) => {
  switch ((status || "").toLowerCase()) {
    case "draft":
    case "cancelled":
      return "bg-muted text-muted-foreground";
    case "to receive and bill":
    case "to receive":
    case "partially received":
      return "bg-warning/10 text-warning";
    case "completed":
    case "closed":
      return "bg-success/10 text-success";
    case "submitted":
      return "bg-primary/10 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
};

// Human-readable status
const humanStatus = (order: any) => {
  if (order.docstatus === 0) return "Draft";
  if (order.docstatus === 2) return "Cancelled";
  return order.status || (order.docstatus === 1 ? "Submitted" : "Draft");
};

// Modal Component
const Modal = ({ open, onClose, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-red-100 text-red-600"
          onClick={onClose}
        >
          <X />
        </button>
        {children}
      </div>
    </div>
  );
};

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch POs
  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      if (!erpnextClient.isAuthenticated()) {
        console.error("User not authenticated. Aborting fetch.");
        setPurchaseOrders([]);
        return;
      }

      setLoading(true);
      try {
        const filters = [["docstatus", "in", [0, 1]]];
        const fields = [
          "name",
          "supplier",
          "supplier_name",
          "docstatus",
          "status",
          "transaction_date",
          "grand_total",
          "currency",
        ];

        const orders = await erpnextClient.fetchResource(
          "Purchase Order",
          filters,
          fields
        );

        if (Array.isArray(orders)) setPurchaseOrders(orders);
        else if (orders && Array.isArray((orders as any).data))
          setPurchaseOrders((orders as any).data);
        else setPurchaseOrders([]);
      } catch (error) {
        console.error("Error fetching purchase orders:", error);
        setPurchaseOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseOrders();
  }, []);

  // Filter by search query
  const filteredOrders = purchaseOrders.filter((order) => {
    const name = (order.name || "").toString().toLowerCase();
    const supplier = (order.supplier || order.supplier_name || "")
      .toString()
      .toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || supplier.includes(q);
  });

  // Open PO modal
  const openPurchaseOrder = async (name: string) => {
    try {
      const doc = await erpnextClient.getDocument("Purchase Order", name);
      setSelectedPO(doc);
      setModalOpen(true);
    } catch (error) {
      console.error("Error loading Purchase Order:", error);
    }
  };

  return (
    <Layout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Purchase Orders</h1>
          <Button
            onClick={() => navigate("/buying/new-purchase-order")}
            className="gradient-primary"
          >
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
          {loading ? (
            <p className="text-muted-foreground">Loading purchase orders…</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-muted-foreground">No purchase orders found.</p>
          ) : (
            filteredOrders.map((order) => {
              const name = order.name || "N/A";
              const supplier = order.supplier || order.supplier_name || "N/A";
              const grandTotalNum =
                parseFloat(order.grand_total ?? order.base_grand_total ?? 0) || 0;
              const currency = order.currency || "INR";
              const date = order.transaction_date || order.posting_date || "N/A";
              const statusLabel = humanStatus(order);

              return (
                <Card
                  key={name}
                  className="shadow-card hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => openPurchaseOrder(name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                          statusLabel
                        )}`}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-1">{supplier}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        {currency} {grandTotalNum.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">{date}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Purchase Order Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          {selectedPO && (
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-bold">{selectedPO.name}</h2>
              <p>
                <strong>{selectedPO.supplier_name || selectedPO.supplier || "N/A"}</strong>
              </p>
              <p>Date: {selectedPO.transaction_date}</p>
              <p>Status: {selectedPO.status}</p>
              <p>Total: ₹{parseFloat(selectedPO.total || 0).toLocaleString()}</p>
              <p>Total Taxes: ₹{parseFloat(selectedPO.total_taxes_and_charges || 0).toLocaleString()}</p>
              <p>Grand Total: ₹{parseFloat(selectedPO.grand_total || 0).toLocaleString()}</p>

              <h3 className="font-semibold mt-4">Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-muted divide-y divide-muted">
                  <thead>
                    <tr className="bg-muted/20">
                      <th className="p-2 text-left">Item</th>
                      <th className="p-2 text-left">Qty</th>
                      <th className="p-2 text-left">Rate</th>
                      <th className="p-2 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPO.items?.map((item: any, idx: number) => (
                      <tr key={idx} className="border-b border-muted">
                        <td className="p-2">{item.item_name}</td>
                        <td className="p-2">{item.qty}</td>
                        <td className="p-2">₹{parseFloat(item.rate).toLocaleString()}</td>
                        <td className="p-2">₹{parseFloat(item.amount).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default PurchaseOrderList;
