// src/pages/selling/SalesOrderList.tsx
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { erpnextClient } from "@/lib/erpnext";

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

const SalesOrderList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [salesOrders, setSalesOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [selectedSO, setSelectedSO] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Status color helper
  const getStatusColor = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "completed":
        return "bg-success/10 text-success";
      case "to deliver":
      case "to bill":
        return "bg-warning/10 text-warning";
      case "draft":
      case "cancelled":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Human readable status (ERPNext)
  const humanStatus = (order: any) => {
    if (order.docstatus === 0) return "Draft";
    if (order.docstatus === 2) return "Cancelled";
    return order.status || (order.docstatus === 1 ? "Submitted" : "Draft");
  };

  // Fetch Sales Orders from ERPNext
  useEffect(() => {
    const fetchSalesOrders = async () => {
      if (!erpnextClient.isAuthenticated()) return;

      setLoading(true);
      try {
        const filters = [["docstatus", "in", [0, 1]]];
        const fields = [
          "name",
          "customer",
          "customer_name",
          "docstatus",
          "status",
          "transaction_date",
          "grand_total",
          "currency",
        ];

        const orders = await erpnextClient.fetchResource("Sales Order", filters, fields);

        if (Array.isArray(orders)) setSalesOrders(orders);
        else if (orders && Array.isArray((orders as any).data))
          setSalesOrders((orders as any).data);
        else setSalesOrders([]);
      } catch (error) {
        console.error("Error fetching sales orders:", error);
        setSalesOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesOrders();
  }, []);

  // Filtered based on search query
  const filteredOrders = salesOrders.filter((order) => {
    const name = (order.name || "").toString().toLowerCase();
    const customer = (order.customer || order.customer_name || "").toString().toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || customer.includes(q);
  });

  // Open Sales Order modal
  const openSalesOrder = async (name: string) => {
    try {
      const doc = await erpnextClient.getDocument("Sales Order", name);
      setSelectedSO(doc);
      setModalOpen(true);
    } catch (error) {
      console.error("Error loading Sales Order:", error);
    }
  };

  return (
    <Layout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sales Orders</h1>
          <Button
            onClick={() => navigate("/selling/new-sales-order")}
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
            placeholder="Search sales orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-muted-foreground">Loading sales orders…</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-muted-foreground">No sales orders found.</p>
          ) : (
            filteredOrders.map((order) => {
              const name = order.name || "N/A";
              const customer = order.customer || order.customer_name || "N/A";
              const grandTotalNum =
                parseFloat(order.grand_total ?? 0) || 0;
              const currency = order.currency || "INR";
              const date = order.transaction_date || "N/A";
              const statusLabel = humanStatus(order);

              return (
                <Card
                  key={name}
                  className="shadow-card hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => openSalesOrder(name)}
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
                    <p className="text-sm text-muted-foreground mb-1">{customer}</p>
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

        {/* Sales Order Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          {selectedSO && (
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-bold">{selectedSO.name}</h2>
              <p>
                <strong>{selectedSO.customer_name || selectedSO.customer || "N/A"}</strong>
              </p>
              <p>Date: {selectedSO.transaction_date}</p>
              <p>Status: {selectedSO.status}</p>
              <p>Total: ₹{parseFloat(selectedSO.total || 0).toLocaleString()}</p>
              <p>Total Taxes: ₹{parseFloat(selectedSO.total_taxes_and_charges || 0).toLocaleString()}</p>
              <p>Grand Total: ₹{parseFloat(selectedSO.grand_total || 0).toLocaleString()}</p>

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
                    {selectedSO.items?.map((item: any, idx: number) => (
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

export default SalesOrderList;
