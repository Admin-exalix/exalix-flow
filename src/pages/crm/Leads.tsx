import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, TrendingUp, Users, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Leads = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const kpis = [
    { title: "Open Opportunities", value: "24", icon: TrendingUp, change: "+8%" },
    { title: "Conversion Rate", value: "32%", icon: DollarSign, change: "+5%" },
    { title: "Total Leads", value: "156", icon: Users, change: "+12%" },
  ];

  const leads = [
    { id: 1, name: "John Doe", company: "Tech Corp", status: "New", email: "john@techcorp.com", phone: "+1234567890" },
    { id: 2, name: "Jane Smith", company: "Innovation Ltd", status: "Qualified", email: "jane@innovation.com", phone: "+1234567891" },
    { id: 3, name: "Bob Johnson", company: "Future Inc", status: "Contacted", email: "bob@future.com", phone: "+1234567892" },
  ];

  const opportunities = [
    { id: 1, title: "Cloud Migration Project", customer: "Tech Corp", value: "$50,000", stage: "Proposal", probability: "75%" },
    { id: 2, title: "Software License", customer: "Innovation Ltd", value: "$25,000", stage: "Negotiation", probability: "60%" },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new": return "bg-blue-500/10 text-blue-500";
      case "qualified": return "bg-success/10 text-success";
      case "contacted": return "bg-warning/10 text-warning";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase())
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
                  <p className="text-xs text-success mt-1">{kpi.change}</p>
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
              <Card key={lead.id} className="shadow-card cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{lead.name}</h3>
                        <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{lead.company}</p>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                        <p className="text-xs text-muted-foreground">{lead.phone}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-3 mt-4">
            {opportunities.map((opp) => (
              <Card key={opp.id} className="shadow-card cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground">{opp.title}</h3>
                      <span className="text-sm font-bold text-primary">{opp.value}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{opp.customer}</p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Badge variant="outline">{opp.stage}</Badge>
                      <span className="text-xs text-muted-foreground">Probability: {opp.probability}</span>
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
