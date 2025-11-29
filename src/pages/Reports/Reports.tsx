import { useEffect, useState } from "react";
import { FileText, Download, Filter, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";
import { erpnextClient } from "@/lib/erpnext";
import { useToast } from "@/components/ui/use-toast";

interface ERPReport {
  name: string;
  ref_doctype: string;
  module: string;
  report_type: string;
}

export default function Reports() {
  const [reports, setReports] = useState<ERPReport[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportColumns, setReportColumns] = useState<string[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);
  const [reportLoading, setReportLoading] = useState(false);
  const { toast } = useToast();

  // ✅ Fetch all available reports on load
  useEffect(() => {
    (async () => {
      try {
        if (!erpnextClient.isAuthenticated()) {
          await erpnextClient.login({
            usr: "admin@exalixtech.com",
            pwd: "admin", // replace with real credentials
          });
        }

        const data = await erpnextClient.fetchReportsList();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast({
          title: "Error",
          description: "Failed to load reports",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "sales":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "purchase":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "stock":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "accounts":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredReports =
    selectedCategory === "all"
      ? reports
      : reports.filter((r) =>
          r.module?.toLowerCase().includes(selectedCategory)
        );

  // ✅ Fetch selected report data and display in table
  async function handleGenerate(reportName: string) {
    try {
      setReportLoading(true);
      setSelectedReport(reportName);
      toast({
        title: "Fetching Report...",
        description: `Loading ${reportName} data`,
      });

      const response = await erpnextClient.fetchReport(reportName);
      if (!response || !response.result) throw new Error("No data received");

      const cols = response.columns.map(
        (col: any) => col.label || col.fieldname || col
      );

      // Normalize rows to array format
      let rows = response.result;
      if (Array.isArray(rows) && rows.length > 0 && !Array.isArray(rows[0])) {
        // if first item is object -> convert to array of values
        rows = rows.map((r: any) => Object.values(r));
      }

      setReportColumns(cols);
      setReportData(rows);

      toast({
        title: "Report Loaded",
        description: `${reportName} displayed successfully!`,
      });
    } catch (error) {
      console.error("Report fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch report",
        variant: "destructive",
      });
    } finally {
      setReportLoading(false);
    }
  }

  // ✅ Download report as Excel or PDF
  function handleDownload(reportName: string, format: "Excel" | "PDF" = "Excel") {
    try {
      erpnextClient.downloadReport(reportName, format);
    } catch {
      toast({
        title: "Error",
        description: "Download failed",
        variant: "destructive",
      });
    }
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {!selectedReport ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Reports</h1>
                <p className="text-muted-foreground mt-1">
                  View and generate reports from ERPNext
                </p>
              </div>
            </div>

            <Card className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Category:
                </span>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="stock">Stock</SelectItem>
                    <SelectItem value="accounts">Accounts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading reports...
              </div>
            ) : (
              <Tabs defaultValue="available" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="available">Available Reports</TabsTrigger>
                </TabsList>

                <TabsContent
                  value="available"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                >
                  {filteredReports.map((report) => (
                    <Card
                      key={report.name}
                      className="p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {report.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Type: {report.report_type} | Doctype:{" "}
                            {report.ref_doctype || "—"}
                          </p>
                        </div>
                        <Badge
                          className={getCategoryColor(report.module)}
                          variant="outline"
                        >
                          {report.module}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="flex-1"
                          size="sm"
                          onClick={() => handleGenerate(report.name)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(report.name, "Excel")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            )}
          </>
        ) : (
          // ✅ Selected report display
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedReport(null)}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <h2 className="text-xl font-semibold">
                  {selectedReport} Report
                </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleDownload(selectedReport, "Excel")}
                >
                  <Download className="h-4 w-4 mr-2" /> Excel
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(selectedReport, "PDF")}
                >
                  <Download className="h-4 w-4 mr-2" /> PDF
                </Button>
              </div>
            </div>

            {reportLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading report data...
              </div>
            ) : reportData.length > 0 ? (
              <div className="overflow-auto border rounded-lg">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      {reportColumns.map((col, idx) => (
                        <th
                          key={idx}
                          className="border px-3 py-2 text-left font-medium text-foreground"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-muted/30">
                        {row.map((cell: any, cIdx: number) => (
                          <td
                            key={cIdx}
                            className="border px-3 py-2 text-foreground/80"
                          >
                            {cell ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No data available for this report.
              </p>
            )}
          </Card>
        )}
      </div>
    </Layout>
  );
}
