import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { erpnextClient } from "@/lib/erpnext";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const employeeSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional(),
  employee_name: z.string().min(1, "Employee name is required"),
  gender: z.string().min(1, "Gender is required"),
  date_of_birth: z.string().optional(),
  date_of_joining: z.string().min(1, "Date of joining is required"),
  company: z.string().min(1, "Company is required"),
  department: z.string().optional(),
  designation: z.string().optional(),
  personal_email: z.string().email("Valid email is required").optional(),
  cell_number: z.string().optional(),
  status: z.string().min(1, "Status is required"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

const NewEmployee = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      await erpnextClient.createDocument("Employee", data);
      toast({
        title: "Success",
        description: "Employee created successfully",
      });
      navigate("/hr");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create employee",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/hr")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">New Employee</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <Input id="first_name" {...register("first_name")} />
            {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" {...register("last_name")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee_name">Full Name *</Label>
            <Input id="employee_name" {...register("employee_name")} />
            {errors.employee_name && <p className="text-sm text-destructive">{errors.employee_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select onValueChange={(value) => setValue("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input id="date_of_birth" type="date" {...register("date_of_birth")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_joining">Date of Joining *</Label>
            <Input id="date_of_joining" type="date" {...register("date_of_joining")} />
            {errors.date_of_joining && <p className="text-sm text-destructive">{errors.date_of_joining.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input id="company" {...register("company")} placeholder="e.g. Exalix Tech" />
            {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" {...register("department")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <Input id="designation" {...register("designation")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personal_email">Personal Email</Label>
            <Input id="personal_email" type="email" {...register("personal_email")} />
            {errors.personal_email && <p className="text-sm text-destructive">{errors.personal_email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cell_number">Cell Number</Label>
            <Input id="cell_number" {...register("cell_number")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select onValueChange={(value) => setValue("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Left">Left</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Employee"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/hr")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewEmployee;
