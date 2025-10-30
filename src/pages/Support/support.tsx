import { useState } from "react";
import { MessageSquare, Plus, Search, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/ui/stat-card";
import { Layout } from "@/components/layout/Layout";

const tickets = [
  {
    id: 1,
    ticketNo: "TICKET-2024-001",
    subject: "Unable to create sales order",
    description: "Getting an error when trying to submit sales order form",
    status: "Open",
    priority: "High",
    createdBy: "John Doe",
    createdOn: "2024-01-30 10:30 AM",
    lastUpdated: "2024-01-30 02:15 PM",
    assignedTo: "Support Team",
  },
  {
    id: 2,
    ticketNo: "TICKET-2024-002",
    subject: "Stock sync issue",
    description: "Stock levels not updating after purchase order submission",
    status: "In Progress",
    priority: "Medium",
    createdBy: "Jane Smith",
    createdOn: "2024-01-29 03:20 PM",
    lastUpdated: "2024-01-30 09:00 AM",
    assignedTo: "Technical Team",
  },
  {
    id: 3,
    ticketNo: "TICKET-2024-003",
    subject: "Report generation slow",
    description: "Sales summary report taking too long to generate",
    status: "Open",
    priority: "Low",
    createdBy: "Mike Johnson",
    createdOn: "2024-01-28 11:45 AM",
    lastUpdated: "2024-01-29 04:30 PM",
    assignedTo: "Support Team",
  },
  {
    id: 4,
    ticketNo: "TICKET-2024-004",
    subject: "Payment entry not reflecting",
    description: "Payment entry submitted but not showing in ledger",
    status: "Resolved",
    priority: "High",
    createdBy: "Sarah Williams",
    createdOn: "2024-01-27 09:15 AM",
    lastUpdated: "2024-01-28 11:00 AM",
    assignedTo: "Technical Team",
  },
];

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "In Progress": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Resolved": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Closed": return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Low": return "bg-green-500/10 text-green-600 border-green-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const openTickets = tickets.filter(t => t.status === "Open").length;
  const inProgressTickets = tickets.filter(t => t.status === "In Progress").length;
  const resolvedTickets = tickets.filter(t => t.status === "Resolved").length;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Support</h1>
            <p className="text-muted-foreground mt-1">Manage support tickets and requests</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Ticket
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Tickets" 
            value={tickets.length.toString()} 
            icon={MessageSquare} 
          />
          <StatCard 
            title="Open" 
            value={openTickets.toString()} 
            icon={AlertCircle} 
            trend={{ value: "Needs attention", isPositive: false }}
          />
          <StatCard 
            title="In Progress" 
            value={inProgressTickets.toString()} 
            icon={Clock} 
          />
          <StatCard 
            title="Resolved" 
            value={resolvedTickets.toString()} 
            icon={CheckCircle} 
            trend={{ value: "This week", isPositive: true }}
          />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-2">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {ticket.ticketNo}
                        </span>
                        <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                          {ticket.priority}
                        </Badge>
                        <Badge className={getStatusColor(ticket.status)} variant="outline">
                          {ticket.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {ticket.subject}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Created by: {ticket.createdBy}</span>
                        <span>•</span>
                        <span>{ticket.createdOn}</span>
                        <span>•</span>
                        <span>Assigned to: {ticket.assignedTo}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="open" className="space-y-4">
            <div className="space-y-2">
              {tickets.filter(t => t.status === "Open").map((ticket) => (
                <Card key={ticket.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {ticket.ticketNo}
                        </span>
                        <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                          {ticket.priority}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {ticket.subject}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Created by: {ticket.createdBy}</span>
                        <span>•</span>
                        <span>{ticket.createdOn}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            <div className="space-y-2">
              {tickets.filter(t => t.status === "In Progress").map((ticket) => (
                <Card key={ticket.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {ticket.ticketNo}
                        </span>
                        <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                          {ticket.priority}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {ticket.subject}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Assigned to: {ticket.assignedTo}</span>
                        <span>•</span>
                        <span>Last updated: {ticket.lastUpdated}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            <div className="space-y-2">
              {tickets.filter(t => t.status === "Resolved").map((ticket) => (
                <Card key={ticket.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {ticket.ticketNo}
                        </span>
                        <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                          {ticket.priority}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {ticket.subject}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {ticket.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Resolved by: {ticket.assignedTo}</span>
                        <span>•</span>
                        <span>{ticket.lastUpdated}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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
