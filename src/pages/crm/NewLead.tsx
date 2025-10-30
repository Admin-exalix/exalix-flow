import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { erpnextClient } from "@/lib/erpnext";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const leadSchema = z.object({
  lead_name: z.string().min(1, "Lead name is required"),
  email_id: z.string().email("Valid email is required"),
  mobile_no: z.string().optional(),
  company_name: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  source: z.string().optional(),
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

const NewLead = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      await erpnextClient.createDocument("Lead", data);
      toast({
        title: "Success",
        description: "Lead created successfully",
      });
      navigate("/crm");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/crm")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">New Lead</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lead_name">Lead Name *</Label>
            <Input id="lead_name" {...register("lead_name")} />
            {errors.lead_name && <p className="text-sm text-destructive">{errors.lead_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email_id">Email *</Label>
            <Input id="email_id" type="email" {...register("email_id")} />
            {errors.email_id && <p className="text-sm text-destructive">{errors.email_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile_no">Mobile Number</Label>
            <Input id="mobile_no" {...register("mobile_no")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input id="company_name" {...register("company_name")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select onValueChange={(value) => setValue("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Replied">Replied</SelectItem>
                <SelectItem value="Opportunity">Opportunity</SelectItem>
                <SelectItem value="Quotation">Quotation</SelectItem>
                <SelectItem value="Lost Quotation">Lost Quotation</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
                <SelectItem value="Do Not Contact">Do Not Contact</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select onValueChange={(value) => setValue("source", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Existing Customer">Existing Customer</SelectItem>
                <SelectItem value="Reference">Reference</SelectItem>
                <SelectItem value="Advertisement">Advertisement</SelectItem>
                <SelectItem value="Cold Calling">Cold Calling</SelectItem>
                <SelectItem value="Exhibition">Exhibition</SelectItem>
                <SelectItem value="Supplier Reference">Supplier Reference</SelectItem>
                <SelectItem value="Mass Mailing">Mass Mailing</SelectItem>
                <SelectItem value="Customer's Vendor">Customer's Vendor</SelectItem>
                <SelectItem value="Campaign">Campaign</SelectItem>
                <SelectItem value="Walk In">Walk In</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register("notes")} />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Lead"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/crm")}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewLead;
