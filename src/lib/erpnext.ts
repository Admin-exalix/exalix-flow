// ERPNext API Configuration and Helper Functions

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
        headers: {
          "Content-Type": "application/json",
        },
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
        {
          headers: { Authorization: `Bearer ${this.authToken}` },
        }
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

  // ✅ Fetch ERPNext Report
  async fetchReport(reportName: string, filters: Record<string, any> = {}) {
    if (!this.isAuthenticated()) throw new Error("Not authenticated");

    try {
      const params = new URLSearchParams({
        report_name: reportName,
        filters: JSON.stringify(filters),
      });

      const response = await fetch(
        `${
          this.baseUrl
        }/method/frappe.desk.query_report.run?${params.toString()}`,
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

  // ✅ Download ERPNext Report (Excel/PDF)
  downloadReport(
    reportName: string,
    format: "Excel" | "PDF" = "Excel",
    filters: Record<string, any> = {}
  ) {
    if (!this.isAuthenticated()) throw new Error("Not authenticated");

    const url = `${
      this.baseUrl
    }/method/frappe.desk.query_report.export_report?report_name=${encodeURIComponent(
      reportName
    )}&file_format_type=${format}&filters=${encodeURIComponent(
      JSON.stringify(filters)
    )}`;

    window.open(url, "_blank");
  }
  async fetchDashboardChart(name: string, filters: Record<string, any> = {}) {
    if (!this.isAuthenticated()) throw new Error("Not authenticated");
    const params = new URLSearchParams({
      name: name,
      filters: JSON.stringify(filters),
    });
    const response = await fetch(
      `${
        this.baseUrl
      }/method/frappe.desk.doctype.dashboard_chart.dashboard_chart.get?${params.toString()}`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch dashboard chart");
    const result = await response.json();
    return result.message;
  }
}

export const erpnextClient = new ERPNextClient();
export type { ERPNextCredentials };
