import { createContext, useContext, useEffect, useState } from "react";

interface UserInfo {
  name: string;
  full_name: string;
  user_image?: string;
}

interface UserContextType {
  user: UserInfo | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const cached = localStorage.getItem("exalix_user");
      if (cached) setUser(JSON.parse(cached));

      const res = await fetch("/api/method/frappe.auth.get_logged_user", {
        credentials: "include",
      });
      const data = await res.json();
      const userId = data.message;

      const userRes = await fetch(`/api/resource/User/${userId}`, {
        credentials: "include",
      });
      const userData = await userRes.json();

      setUser(userData.data);
      localStorage.setItem("exalix_user", JSON.stringify(userData.data));
    } catch (err) {
      console.error("User fetch failed:", err);
      setUser(null);
      localStorage.removeItem("exalix_user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
