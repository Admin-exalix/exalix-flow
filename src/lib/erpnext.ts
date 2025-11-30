// ERPNext API Configuration and Helper Functions

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_BASE_URL = "https://exalixtech.com/api";

interface ERPNextCredentials {
  usr: string;
  pwd: string;
}

interface ERPNextResponse<T> {
  data: T;
  message?: string;
}

class ERPNextClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.authToken = localStorage.getItem("erpnext_token");
  }

  async login(credentials: ERPNextCredentials): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/method/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        this.authToken = data.message || "authenticated";
        localStorage.setItem("erpnext_token", this.authToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  logout() {
    this.authToken = null;
    localStorage.removeItem("erpnext_token");
  }

  isAuthenticated(): boolean {
    return this.authToken !== null;
  }

  async fetchResource<T>(
    doctype: string,
    filters?: Record<string, any>,
    fields?: string[]
  ): Promise<T[]> {
    if (!this.isAuthenticated()) throw new Error("Not authenticated");

    try {
      const params = new URLSearchParams();
      if (filters) params.append("filters", JSON.stringify(filters));
      if (fields) params.append("fields", JSON.stringify(fields));

      const response = await fetch(
        `${this.baseUrl}/resource/${doctype}?${params.toString()}`,
        {
          credentials: "include",
          headers: { Authorization: `Bearer ${this.authToken}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch resource");

      const result: ERPNextResponse<T[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error fetching ${doctype}:`, error);
      return [];
    }
  }

  async getDocument<T>(doctype: string, name: string): Promise<T | null> {
    if (!this.isAuthenticated()) throw new Error("Not authenticated");

    try {
      const response = await fetch(
        `${this.baseUrl}/resource/${doctype}/${name}`,
        { headers: { Authorization: `Bearer ${this.authToken}` } }
      );

      if (!response.ok) throw new Error("Failed to fetch document");

      const result: ERPNextResponse<T> = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error fetching ${doctype} ${name}:`, error);
      return null;
    }
  }

  async createDocument<T>(
    doctype: string,
    data: Partial<T>
  ): Promise<T | null> {
    if (!this.isAuthenticated()) throw new Error("Not authenticated");

    try {
      const response = await fetch(`${this.baseUrl}/resource/${doctype}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to create document");

      const result: ERPNextResponse<T> = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error creating ${doctype}:`, error);
      return null;
    }
  }

  async get(url: string): Promise<any> {
    try {
      const res = await fetch(`${this.baseUrl}${url}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`Failed to fetch ${url}`);
      return await res.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  async fetchReportsList() {
    if (!this.isAuthenticated()) throw new Error("Not authenticated");

    try {
      const response = await fetch(
        `${this.baseUrl}/resource/Report?fields=["name","ref_doctype","report_type","is_standard","module"]`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch reports list");

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching reports list:", error);
      throw error;
    }
  }

  // ✅ Fetch ERPNext Report
  async fetchReport(reportName: string, filters: Record<string, any> = {}) {
    if (!this.isAuthenticated()) throw new Error("Not authenticated");

    try {
      const params = new URLSearchParams({
        report_name: reportName,
        filters: JSON.stringify(filters),
      });

      const response = await fetch(
        `${this.baseUrl}/method/frappe.desk.query_report.run?${params.toString()}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch report");

      const result = await response.json();
      return result.message;
    } catch (error) {
      console.error(`Error fetching report ${reportName}:`, error);
      throw error;
    }
  }

  // ✅ Download ERPNext Report (Excel / PDF)
  async downloadReport(
    reportName: string,
    format: "Excel" | "PDF" = "Excel",
    filters: Record<string, any> = {}
  ) {
    if (!this.isAuthenticated()) throw new Error("Not authenticated");

    const response = await fetch(
      `${this.baseUrl}/method/frappe.desk.query_report.run`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${this.authToken}`,
        },
        body: JSON.stringify({ report_name: reportName, filters }),
      }
    );

    if (!response.ok) throw new Error("Failed to fetch report data");

    const result = await response.json();
    const data = result.message?.result || [];
    const columns = result.message?.columns?.map((c: any) => c.label) || [];

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No valid data found for this report");
    }

    // 🧠 Flatten the data properly to match column order
    const tableData = data.map((row: Record<string, any>) =>
      columns.map((col: string) => {
        const key =
          Object.keys(row).find(
            (k) => k.toLowerCase() === col.toLowerCase()
          ) || "";
        return row[key] ?? "";
      })
    );

    if (format === "Excel") {
      const ws = XLSX.utils.aoa_to_sheet([columns, ...tableData]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, reportName);
      XLSX.writeFile(wb, `${reportName}.xlsx`);
    } else {
      const pdf = new jsPDF();
      pdf.text(reportName, 14, 15);
      autoTable(pdf, {
        head: [columns],
        body: tableData,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
      });
      pdf.save(`${reportName}.pdf`);
    }
  }

  async getDocMeta(doctype: string) {
    const res = await fetch(
      `${this.baseUrl}/method/frappe.desk.form.load.getdoctype?doctype=${doctype}`,
      { 
        credentials: "include",
        headers: { Authorization: `Bearer ${this.authToken}` }
      }
    );
    if (!res.ok) throw new Error("Failed to fetch DocType metadata");
    const json = await res.json();
    return json.docs?.[0] || {};
  }
}

export const erpnextClient = new ERPNextClient();
export type { ERPNextCredentials };
