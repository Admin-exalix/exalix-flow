import { useState } from "react";
import { Bell, Check, Trash2, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";

const notifications = [
  {
    id: 1,
    type: "Sales Order",
    title: "New Sales Order SO-2024-00125",
    message: "A new sales order has been created by John Doe for ₹45,000",
    timestamp: "5 minutes ago",
    read: false,
    priority: "high",
  },
  {
    id: 2,
    type: "Purchase Order",
    title: "Purchase Order PO-2024-00089 Approved",
    message: "Your purchase order has been approved by the manager",
    timestamp: "1 hour ago",
    read: false,
    priority: "medium",
  },
  {
    id: 3,
    type: "Stock",
    title: "Low Stock Alert: Item-A123",
    message: "Stock level for Item-A123 has fallen below minimum threshold",
    timestamp: "2 hours ago",
    read: true,
    priority: "high",
  },
  {
    id: 4,
    type: "Payment",
    title: "Payment Received",
    message: "Payment of ₹32,500 received from ABC Corp",
    timestamp: "3 hours ago",
    read: true,
    priority: "low",
  },
  {
    id: 5,
    type: "Leave",
    title: "Leave Request Approved",
    message: "Your leave request for 5-7 Feb has been approved",
    timestamp: "5 hours ago",
    read: true,
    priority: "medium",
  },
  {
    id: 6,
    type: "Task",
    title: "Task Assigned: Website Redesign",
    message: "You have been assigned to the Website Redesign project",
    timestamp: "1 day ago",
    read: true,
    priority: "medium",
  },
];

export default function Notifications() {
  const [selectedTab, setSelectedTab] = useState("all");

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Sales Order": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Purchase Order": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Stock": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Payment": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Leave": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case "Task": return "bg-pink-500/10 text-pink-600 border-pink-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = selectedTab === "all" 
    ? notifications 
    : notifications.filter(n => !n.read);

  return (
    <Layout>
      <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">View system and document notifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All
            <Badge variant="secondary" className="ml-2">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                You're all caught up! No new notifications to display.
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`p-4 hover:shadow-md transition-shadow ${
                  !notification.read ? "border-l-4 border-l-primary bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(notification.type)} variant="outline">
                        {notification.type}
                      </Badge>
                      {!notification.read && (
                        <Badge variant={getPriorityColor(notification.priority)}>
                          {notification.priority}
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.timestamp}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button variant="ghost" size="sm">
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
}
