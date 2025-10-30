import { useState } from "react";
import { FolderKanban, Calendar, Users, Clock, Plus, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    status: "In Progress",
    progress: 65,
    team: ["John Doe", "Jane Smith"],
    deadline: "2024-02-15",
    tasks: { total: 20, completed: 13 },
  },
  {
    id: 2,
    name: "Mobile App Development",
    status: "In Progress",
    progress: 40,
    team: ["Mike Johnson", "Sarah Williams"],
    deadline: "2024-03-30",
    tasks: { total: 35, completed: 14 },
  },
  {
    id: 3,
    name: "ERP Implementation",
    status: "Planning",
    progress: 15,
    team: ["Robert Brown", "Emily Davis"],
    deadline: "2024-04-20",
    tasks: { total: 50, completed: 8 },
  },
  {
    id: 4,
    name: "Marketing Campaign Q1",
    status: "Completed",
    progress: 100,
    team: ["Lisa Anderson", "Tom Wilson"],
    deadline: "2024-01-31",
    tasks: { total: 15, completed: 15 },
  },
];

const tasks = [
  { id: 1, title: "Design mockups review", project: "Website Redesign", assignee: "John Doe", priority: "High", status: "In Progress" },
  { id: 2, title: "API integration", project: "Mobile App Development", assignee: "Mike Johnson", priority: "High", status: "In Progress" },
  { id: 3, title: "Database schema design", project: "ERP Implementation", assignee: "Robert Brown", priority: "Medium", status: "Pending" },
  { id: 4, title: "Content creation", project: "Marketing Campaign Q1", assignee: "Lisa Anderson", priority: "Low", status: "Completed" },
];

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "In Progress": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Planning": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
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

  return (
    <Layout>
      <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage projects, tasks, and timesheets</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects or tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <FolderKanban className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)} variant="outline">
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Tasks: {project.tasks.completed}/{project.tasks.total}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{project.deadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="flex gap-1 flex-wrap">
                      {project.team.map((member, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {member}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="space-y-2">
            {tasks.map((task) => (
              <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{task.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.project} • {task.assignee}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(task.priority)} variant="outline">
                      {task.priority}
                    </Badge>
                    <Badge className={getStatusColor(task.status)} variant="outline">
                      {task.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timesheets">
          <Card className="p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Timesheet Tracking</h3>
            <p className="text-muted-foreground">
              Track time spent on projects and tasks. Feature coming soon.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
}
