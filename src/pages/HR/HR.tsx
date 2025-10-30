import { useState } from "react";
import { Users, Calendar, FileText, Plus, Search, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatCard } from "@/components/ui/stat-card";
import { Layout } from "@/components/layout/Layout";

const employees = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    position: "Senior Developer",
    status: "Active",
    attendance: "95%",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    department: "Design",
    position: "UI/UX Designer",
    status: "Active",
    attendance: "98%",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.j@company.com",
    department: "Engineering",
    position: "DevOps Engineer",
    status: "Active",
    attendance: "92%",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.w@company.com",
    department: "Sales",
    position: "Sales Manager",
    status: "On Leave",
    attendance: "88%",
  },
];

const leaveRequests = [
  { id: 1, employee: "John Doe", type: "Sick Leave", from: "2024-02-01", to: "2024-02-03", status: "Pending", days: 3 },
  { id: 2, employee: "Sarah Williams", type: "Annual Leave", from: "2024-02-05", to: "2024-02-10", status: "Approved", days: 6 },
  { id: 3, employee: "Mike Johnson", type: "Casual Leave", from: "2024-02-15", to: "2024-02-15", status: "Pending", days: 1 },
];

const attendance = [
  { date: "2024-01-29", present: 45, absent: 3, late: 2, leave: 5 },
  { date: "2024-01-30", present: 47, absent: 2, late: 1, leave: 5 },
  { date: "2024-01-31", present: 46, absent: 1, late: 3, leave: 5 },
];

export default function HR() {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "On Leave": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Inactive": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Pending": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "Rejected": return "bg-red-500/10 text-red-600 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Human Resources</h1>
          <p className="text-muted-foreground mt-1">Manage employees, attendance, and leave requests</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value="55" icon={Users} />
        <StatCard title="Present Today" value="47" icon={Users} trend={{ value: "85% attendance", isPositive: true }} />
        <StatCard title="On Leave" value="5" icon={Calendar} />
        <StatCard title="Pending Requests" value="2" icon={FileText} />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave Requests</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="space-y-2">
            {employees.map((employee) => (
              <Card key={employee.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground">{employee.name}</h4>
                      <p className="text-sm text-muted-foreground">{employee.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{employee.department}</p>
                      <p className="text-sm text-muted-foreground">Attendance: {employee.attendance}</p>
                    </div>
                    <Badge className={getStatusColor(employee.status)} variant="outline">
                      {employee.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-foreground">Date</th>
                    <th className="text-left p-4 font-semibold text-foreground">Present</th>
                    <th className="text-left p-4 font-semibold text-foreground">Absent</th>
                    <th className="text-left p-4 font-semibold text-foreground">Late</th>
                    <th className="text-left p-4 font-semibold text-foreground">On Leave</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="p-4 text-foreground">{record.date}</td>
                      <td className="p-4 text-green-600 font-medium">{record.present}</td>
                      <td className="p-4 text-red-600 font-medium">{record.absent}</td>
                      <td className="p-4 text-yellow-600 font-medium">{record.late}</td>
                      <td className="p-4 text-muted-foreground">{record.leave}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <div className="space-y-2">
            {leaveRequests.map((request) => (
              <Card key={request.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-semibold text-foreground">{request.employee}</h4>
                        <p className="text-sm text-muted-foreground">{request.type} • {request.days} day(s)</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">From: {request.from}</p>
                      <p className="text-muted-foreground">To: {request.to}</p>
                    </div>
                    <Badge className={getLeaveStatusColor(request.status)} variant="outline">
                      {request.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Button className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Apply for Leave
          </Button>
        </TabsContent>

        <TabsContent value="payroll">
          <Card className="p-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Payroll Management</h3>
            <p className="text-muted-foreground">
              View salary slips, process payroll, and manage compensation. Feature coming soon.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
}
