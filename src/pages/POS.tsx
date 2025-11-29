import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { erpnextClient } from "@/lib/erpnext";
import { Search, Plus, Minus, Printer, FileDown, Trash2, ShoppingCart } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Item {
  name: string;
  item_name: string;
  standard_rate: number;
  item_group?: string;
  stock_uom?: string;
}

interface InvoiceItem {
  item_code: string;
  item_name: string;
  qty: number;
  rate: number;
  amount: number;
}

export default function POS() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = items.filter(
        (item) =>
          item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchQuery, items]);

  const fetchItems = async () => {
    try {
      const data = await erpnextClient.fetchResource<Item>("Item", {}, [
        "name",
        "item_name",
        "standard_rate",
        "item_group",
        "stock_uom",
      ]);
      setItems(data);
      setFilteredItems(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch items",
        variant: "destructive",
      });
    }
  };

  const addItemToInvoice = (item: Item) => {
    const existingItem = invoiceItems.find((i) => i.item_code === item.name);
    if (existingItem) {
      updateQuantity(item.name, existingItem.qty + 1);
    } else {
      setInvoiceItems([
        ...invoiceItems,
        {
          item_code: item.name,
          item_name: item.item_name,
          qty: 1,
          rate: item.standard_rate,
          amount: item.standard_rate,
        },
      ]);
    }
  };

  const updateQuantity = (itemCode: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(itemCode);
      return;
    }
    setInvoiceItems(
      invoiceItems.map((item) =>
        item.item_code === itemCode
          ? { ...item, qty: newQty, amount: newQty * item.rate }
          : item
      )
    );
  };

  const removeItem = (itemCode: string) => {
    setInvoiceItems(invoiceItems.filter((item) => item.item_code !== itemCode));
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const createInvoice = async () => {
    if (!customerName) {
      toast({
        title: "Error",
        description: "Please enter customer name",
        variant: "destructive",
      });
      return;
    }

    if (invoiceItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to invoice",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const invoiceData = {
        doctype: "Sales Invoice",
        customer: customerName,
        items: invoiceItems.map((item) => ({
          item_code: item.item_code,
          item_name: item.item_name,
          qty: item.qty,
          rate: item.rate,
        })),
      };

      await erpnextClient.createDocument("Sales Invoice", invoiceData);
      
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });

      // Reset form
      setInvoiceItems([]);
      setCustomerName("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text("Sales Invoice", 14, 20);
    
    pdf.setFontSize(12);
    pdf.text(`Customer: ${customerName || "N/A"}`, 14, 30);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 14, 37);
    
    // Table
    const tableData = invoiceItems.map((item) => [
      item.item_name,
      item.qty.toString(),
      `₹${item.rate.toFixed(2)}`,
      `₹${item.amount.toFixed(2)}`,
    ]);

    autoTable(pdf, {
      startY: 45,
      head: [["Item", "Quantity", "Rate", "Amount"]],
      body: tableData,
      foot: [["", "", "Total:", `₹${calculateTotal().toFixed(2)}`]],
      headStyles: { fillColor: [0, 123, 255] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
    });

    pdf.save(`invoice_${new Date().getTime()}.pdf`);
  };

  return (
    <Layout>
      <div className="p-4 lg:p-6 space-y-6 print:p-8">
        <div className="flex items-center justify-between print:mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Point of Sale
          </h1>
          <div className="flex gap-2 print:hidden">
            <Button onClick={handlePrint} variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownloadPDF} variant="outline" size="sm">
              <FileDown className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Items Selection */}
          <Card className="shadow-glow animate-fade-in print:hidden">
            <CardHeader className="gradient-secondary rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-white">
                <ShoppingCart className="w-5 h-5" />
                Select Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 rounded-lg border hover:shadow-md transition-all cursor-pointer bg-card"
                    onClick={() => addItemToInvoice(item)}
                  >
                    <div>
                      <p className="font-medium">{item.item_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.item_group} • {item.stock_uom}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-primary">
                        ₹{item.standard_rate.toFixed(2)}
                      </span>
                      <Button size="sm" variant="ghost">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Invoice */}
          <Card className="shadow-glow-secondary animate-fade-in print:shadow-none">
            <CardHeader className="gradient-success rounded-t-lg print:bg-transparent">
              <CardTitle className="text-white print:text-foreground">Invoice</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="print:hidden">
                <Label htmlFor="customer">Customer Name</Label>
                <Input
                  id="customer"
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="print:block hidden mb-4">
                <p className="text-sm text-muted-foreground">Customer: {customerName}</p>
                <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Items</h3>
                {invoiceItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No items added yet
                  </p>
                ) : (
                  invoiceItems.map((item) => (
                    <div
                      key={item.item_code}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.item_name}</p>
                        <p className="text-sm text-muted-foreground">
                          ₹{item.rate.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2 print:gap-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateQuantity(item.item_code, item.qty - 1)}
                          className="print:hidden"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-semibold w-8 text-center">{item.qty}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateQuantity(item.item_code, item.qty + 1)}
                          className="print:hidden"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <span className="font-bold text-primary w-24 text-right">
                          ₹{item.amount.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.item_code)}
                          className="print:hidden text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {invoiceItems.length > 0 && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-primary">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={createInvoice}
                    disabled={loading}
                    className="w-full gradient-hero text-white print:hidden"
                    size="lg"
                  >
                    {loading ? "Creating..." : "Create Invoice"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
