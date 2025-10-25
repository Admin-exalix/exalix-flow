import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

const mockInvoices = [
  { id: "SINV-2024-089", customer: "ABC Corp", amount: "$5,400", status: "Paid", date: "2024-01-15" },
  { id: "SINV-2024-090", customer: "XYZ Ltd", amount: "$8,200", status: "Unpaid", date: "2024-01-14" },
  { id: "PINV-2024-045", supplier: "Tech Supplies", amount: "$3,600", status: "Paid", date: "2024-01-13" },
];

const AccountsOverview = () => {
  const getStatusColor = (status: string) => {
    return status === "Paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning";
  };

  return (
    <Layout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <h1 className="text-2xl font-bold">Accounts</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-3">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-lg font-bold text-foreground">$89,400</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-warning/10 p-3">
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Outstanding</p>
                  <p className="text-lg font-bold text-foreground">$12,340</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="invoices" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invoices" className="space-y-3 mt-4">
            {mockInvoices.map((invoice) => (
              <Card key={invoice.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{invoice.id}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {invoice.customer || invoice.supplier}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{invoice.amount}</span>
                    <span className="text-xs text-muted-foreground">{invoice.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-3 mt-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Total Received</span>
                  <span className="text-sm font-semibold text-success">$76,800</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Total Paid</span>
                  <span className="text-sm font-semibold text-foreground">$45,200</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Net Cash Flow</span>
                  <span className="text-sm font-semibold text-success">$31,600</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AccountsOverview;
