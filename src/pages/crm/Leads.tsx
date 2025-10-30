import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, TrendingUp, Users, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { erpnextClient } from "@/lib/erpnext";

interface Lead {
  name: string;
  lead_name: string;
  company_name?: string;
  email_id?: string;
  phone?: string;
  status?: string;
}

interface Opportunity {
  name: string;
  opportunity_title: string;
  customer_name: string;
  opportunity_amount?: number;
  probability?: number;
  stage?: string;
}

const Leads = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [kpis, setKpis] = useState([
    { title: "Open Opportunities", value: "0", icon: TrendingUp, change: "" },
    { title: "Conversion Rate", value: "0%", icon: IndianRupee, change: "" },
    { title: "Total Leads", value: "0", icon: Users, change: "" },
  ]);

  useEffect(() => {
    fetchCRMData();
  }, []);

  async function fetchCRMData() {
    try {
      // ✅ Ensure logged in
      await erpnextClient.login({ usr: "admin@example.com", pwd: "yourpassword" });

      // ✅ Fetch Leads
      const fetchedLeads = await erpnextClient.fetchResource<Lead>(
        "Lead",
        { status: ["!=", "Converted"] },
        ["name", "lead_name", "company_name", "email_id", "phone", "status"]
      );

      // ✅ Fetch Opportunities
      const fetchedOpportunities = await erpnextClient.fetchResource<Opportunity>(
        "Opportunity",
        {},
        ["name", "opportunity_title", "customer_name", "opportunity_amount", "probability", "stage"]
      );

      // ✅ KPIs Calculation
      const openOpp = fetchedOpportunities.length;
      const totalLeads = fetchedLeads.length;

      const convertedLeads = await erpnextClient.fetchResource<Lead>(
        "Lead",
        { status: "Converted" },
        ["name"]
      );

      const conversionRate = totalLeads
        ? ((convertedLeads.length / totalLeads) * 100).toFixed(1)
        : "0";

      setKpis([
        { title: "Open Opportunities", value: openOpp.toString(), icon: TrendingUp, change: "" },
        { title: "Conversion Rate", value: `${conversionRate}%`, icon: IndianRupee, change: "" },
        { title: "Total Leads", value: totalLeads.toString(), icon: Users, change: "" },
      ]);

      setLeads(fetchedLeads);
      setOpportunities(fetchedOpportunities);
    } catch (err) {
      console.error("CRM data fetch error:", err);
    }
  }

  const getStatusColor = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "new": return "bg-blue-500/10 text-blue-500";
      case "qualified": return "bg-success/10 text-success";
      case "contacted": return "bg-warning/10 text-warning";
      case "converted": return "bg-green-500/10 text-green-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.lead_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">CRM</h1>
            <p className="text-sm text-muted-foreground">Manage leads and opportunities</p>
          </div>
          <Button onClick={() => navigate("/crm/new-lead")}>
            <Plus className="h-4 w-4 mr-1" />
            New Lead
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          {kpis.map((kpi, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="pt-4">
                <div className="flex flex-col items-center text-center">
                  <kpi.icon className="h-5 w-5 text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">{kpi.title}</p>
                  <p className="text-xl font-bold text-foreground mt-1">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-3 mt-4">
            {filteredLeads.map((lead) => (
              <Card
                key={lead.name}
                className="shadow-card cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {lead.lead_name || "Unnamed Lead"}
                        </h3>
                        <Badge className={getStatusColor(lead.status || "New")}>
                          {lead.status || "New"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {lead.company_name || "No Company"}
                      </p>
                      <div className="space-y-1">
                        {lead.email_id && (
                          <p className="text-xs text-muted-foreground">{lead.email_id}</p>
                        )}
                        {lead.phone && (
                          <p className="text-xs text-muted-foreground">{lead.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-3 mt-4">
            {opportunities.map((opp) => (
              <Card
                key={opp.name}
                className="shadow-card cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground">
                        {opp.opportunity_title || "Untitled Opportunity"}
                      </h3>
                      <span className="text-sm font-bold text-primary">
                        ₹{(opp.opportunity_amount || 0).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {opp.customer_name || "No Customer"}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Badge variant="outline">{opp.stage || "Unknown"}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Probability: {opp.probability || 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Leads;
