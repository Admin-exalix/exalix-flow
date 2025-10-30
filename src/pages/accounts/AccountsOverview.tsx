import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, AlertCircle, X } from "lucide-react";
import { erpnextClient } from "@/lib/erpnext";

// Types for ERPNext resources used on this page
type SalesInvoice = {
  name: string;
  customer?: string;
  grand_total?: string | number;
  outstanding_amount?: string | number;
  posting_date?: string;
  status?: string;
};

type PurchaseInvoice = {
  name: string;
  supplier?: string;
  grand_total?: string | number;
  outstanding_amount?: string | number;
  posting_date?: string;
  status?: string;
};

type PaymentEntry = {
  name: string;
  payment_type?: string;
  paid_amount?: string | number;
};

// Modal component
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

const AccountsOverview = () => {
  // States
  const [salesInvoices, setSalesInvoices] = useState<any[]>([]);
  const [purchaseInvoices, setPurchaseInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [outstandingSales, setOutstandingSales] = useState(0);
  const [outstandingPurchase, setOutstandingPurchase] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const getStatusColor = (status: string) =>
    status === "Paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning";

  const openInvoice = async (doctype: string, name: string) => {
    const doc = await erpnextClient.getDocument(doctype, name);
    setSelectedInvoice(doc);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchAccountsData = async () => {
      if (!erpnextClient.isAuthenticated()) return;

      try {
        // SALES
        const sales = await erpnextClient.fetchResource<SalesInvoice>(
          "Sales Invoice",
          { docstatus: 1 },
          ["name", "customer", "grand_total", "outstanding_amount", "posting_date", "status"]
        );
        setSalesInvoices(sales);
        setRevenue(sales.reduce((acc, inv) => acc + Number(inv.grand_total ?? 0), 0));
        setOutstandingSales(
          sales.reduce((acc, inv) => acc + Number(inv.outstanding_amount ?? 0), 0)
        );

        // PURCHASE
        const purchases = await erpnextClient.fetchResource<PurchaseInvoice>(
          "Purchase Invoice",
          { docstatus: 1 },
          ["name", "supplier", "grand_total", "outstanding_amount", "posting_date", "status"]
        );
        setPurchaseInvoices(purchases);
        setExpenses(purchases.reduce((acc, inv) => acc + Number(inv.grand_total ?? 0), 0));
        setOutstandingPurchase(
          purchases.reduce((acc, inv) => acc + Number(inv.outstanding_amount ?? 0), 0)
        );

        // PAYMENTS
        const paymentEntries = await erpnextClient.fetchResource<PaymentEntry>(
          "Payment Entry",
          { docstatus: 1 },
          ["name", "payment_type", "paid_amount"]
        );
        setPayments(paymentEntries);

        const received = paymentEntries
          .filter((p) => p.payment_type === "Receive")
          .reduce((acc, p) => acc + Number(p.paid_amount ?? 0), 0);

        const paid = paymentEntries
          .filter((p) => p.payment_type === "Pay")
          .reduce((acc, p) => acc + Number(p.paid_amount ?? 0), 0);

        setTotalReceived(received);
        setTotalPaid(paid);
      } catch (error) {
        console.error("Error fetching accounts data:", error);
      }
    };

    fetchAccountsData();
  }, []);

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Accounts Overview</h1>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-3 p-4">
              <TrendingUp className="h-10 w-10 text-success bg-success/10 rounded-lg p-2" />
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-lg font-bold text-foreground">₹{revenue.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-10 w-10 text-warning bg-warning/10 rounded-lg p-2" />
              <div>
                <p className="text-xs text-muted-foreground">Outstanding (Sales)</p>
                <p className="text-lg font-bold text-foreground">
                  ₹{outstandingSales.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="flex items-center gap-3 p-4">
              <TrendingUp className="h-10 w-10 text-foreground bg-muted/20 rounded-lg p-2" />
              <div>
                <p className="text-xs text-muted-foreground">Expenses</p>
                <p className="text-lg font-bold text-foreground">₹{expenses.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="h-10 w-10 text-warning bg-warning/20 rounded-lg p-2" />
              <div>
                <p className="text-xs text-muted-foreground">Outstanding (Purchase)</p>
                <p className="text-lg font-bold text-foreground">
                  ₹{outstandingPurchase.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TABS */}
        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sales">Sales Invoices</TabsTrigger>
            <TabsTrigger value="purchase">Purchase Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* SALES */}
          <TabsContent value="sales" className="space-y-3 mt-4">
            {salesInvoices.length === 0 ? (
              <p className="text-muted-foreground">No sales invoices found.</p>
            ) : (
              salesInvoices.map((inv) => {
                const total = parseFloat(inv.grand_total || 0);
                const outstanding = parseFloat(inv.outstanding_amount || 0);
                const date = inv.posting_date || "N/A";

                return (
                  <Card
                    key={inv.name}
                    className="shadow-card cursor-pointer"
                    onClick={() => openInvoice("Sales Invoice", inv.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">{inv.name}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                            inv.status
                          )}`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{inv.customer || "N/A"}</p>
                      <div className="flex justify-between">
                        <span>Total: ₹{total.toLocaleString()}</span>
                        <span className="text-warning">Outstanding: ₹{outstanding.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Date: {date}</div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* PURCHASE */}
          <TabsContent value="purchase" className="space-y-3 mt-4">
            {purchaseInvoices.length === 0 ? (
              <p className="text-muted-foreground">No purchase invoices found.</p>
            ) : (
              purchaseInvoices.map((inv) => {
                const total = parseFloat(inv.grand_total || 0);
                const outstanding = parseFloat(inv.outstanding_amount || 0);
                const date = inv.posting_date || "N/A";

                return (
                  <Card
                    key={inv.name}
                    className="shadow-card cursor-pointer"
                    onClick={() => openInvoice("Purchase Invoice", inv.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">{inv.name}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                            inv.status
                          )}`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{inv.supplier || "N/A"}</p>
                      <div className="flex justify-between">
                        <span>Total: ₹{total.toLocaleString()}</span>
                        <span className="text-warning">Outstanding: ₹{outstanding.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Date: {date}</div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* PAYMENTS */}
          <TabsContent value="payments" className="space-y-3 mt-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                  <span>Total Received</span>
                  <span className="font-semibold text-success">₹{totalReceived.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                  <span>Total Paid</span>
                  <span className="font-semibold">₹{totalPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                  <span>Net Cash Flow</span>
                  <span className="font-semibold text-success">
                    ₹{(totalReceived - totalPaid).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* INVOICE DETAIL MODAL */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          {selectedInvoice && (
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-bold">{selectedInvoice.name}</h2>
              <p>
                <strong>
                  {selectedInvoice.customer || selectedInvoice.supplier || "N/A"}
                </strong>
              </p>
              <p>Posting Date: {selectedInvoice.posting_date}</p>
              <p>Status: {selectedInvoice.status}</p>
              <p>Total: ₹{parseFloat(selectedInvoice.total || 0).toLocaleString()}</p>
              <p>Total Taxes (GST): ₹{parseFloat(selectedInvoice.total_taxes_and_charges || 0).toLocaleString()}</p>
              <p>Grand Total: ₹{parseFloat(selectedInvoice.grand_total || 0).toLocaleString()}</p>
              <p>Outstanding: ₹{parseFloat(selectedInvoice.outstanding_amount || 0).toLocaleString()}</p>

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
                    {selectedInvoice.items?.map((item: any, idx: number) => (
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

export default AccountsOverview;
