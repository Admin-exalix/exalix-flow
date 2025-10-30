import { useEffect, useState } from "react";
import { FileText, Download, Filter, Calendar, TrendingUp, Package, DollarSign, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";
import { erpnextClient } from "@/lib/erpnext";
import { useToast } from "@/components/ui/use-toast";

const reports = [
  { id: 1, name: "Sales Summary Report", category: "Sales", description: "Overall sales performance", lastRun: "2024-01-30", frequency: "Daily", icon: DollarSign },
  { id: 2, name: "Purchase Analytics", category: "Purchase", description: "Supplier and purchase order insights", lastRun: "2024-01-29", frequency: "Weekly", icon: TrendingUp },
  { id: 3, name: "Stock Valuation Report", category: "Stock", description: "Current stock levels and valuation", lastRun: "2024-01-30", frequency: "Daily", icon: Package },
  { id: 4, name: "Customer Ledger", category: "Accounts", description: "Outstanding balances and payment history", lastRun: "2024-01-28", frequency: "Monthly", icon: Users },
  { id: 5, name: "Profit & Loss Statement", category: "Accounts", description: "Income and expenses with profit margins", lastRun: "2024-01-30", frequency: "Monthly", icon: TrendingUp },
  { id: 6, name: "Inventory Movement", category: "Stock", description: "Stock in/out and transfers tracking", lastRun: "2024-01-29", frequency: "Weekly", icon: Package },
];

const savedReports = [
  { id: 1, name: "Q4 Sales Analysis", date: "2024-01-28", size: "2.4 MB", format: "PDF" },
  { id: 2, name: "December Purchase Report", date: "2024-01-15", size: "1.8 MB", format: "Excel" },
  { id: 3, name: "Year End Stock Report", date: "2024-01-10", size: "3.2 MB", format: "PDF" },
];

export default function Reports() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      if (!erpnextClient.isAuthenticated()) {
        await erpnextClient.login({
          usr: "admin@exalixtech.com",
          pwd: "admin", // change to actual
        });
      }
    })();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Sales": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Purchase": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Stock": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Accounts": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredReports = selectedCategory === "all"
    ? reports
    : reports.filter(r => r.category.toLowerCase() === selectedCategory);

  async function handleGenerate(reportName: string) {
    try {
      toast({ title: "Generating Report...", description: `Fetching ${reportName} from ERPNext.` });
      const data = await erpnextClient.fetchReport(reportName);
      console.log("Report Data:", data);
      toast({ title: "Report Ready", description: `${reportName} fetched successfully!` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch report", variant: "destructive" });
    }
  }

  function handleDownload(reportName: string, format: "Excel" | "PDF" = "Excel") {
    try {
      erpnextClient.downloadReport(reportName, format);
    } catch (error) {
      toast({ title: "Error", description: "Download failed", variant: "destructive" });
    }
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground mt-1">View and generate reports from ERPNext</p>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filters:</span>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
                <SelectItem value="accounts">Accounts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList>
            <TabsTrigger value="available">Available Reports</TabsTrigger>
            <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredReports.map((report) => {
                const Icon = report.icon;
                return (
                  <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{report.name}</h3>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                        </div>
                      </div>
                      <Badge className={getCategoryColor(report.category)} variant="outline">
                        {report.category}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Last run: {report.lastRun}</span>
                      </div>
                      <Badge variant="secondary">{report.frequency}</Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm" onClick={() => handleGenerate(report.name)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload(report.name, "Excel")}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            <div className="space-y-2">
              {savedReports.map((report) => (
                <Card key={report.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.date} • {report.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{report.format}</Badge>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
