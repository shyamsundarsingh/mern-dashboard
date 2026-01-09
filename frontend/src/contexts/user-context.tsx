'use client';

import * as React from "react";
import { authClient } from "@/lib/auth/client";

export const UserContext = React.createContext(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(null);

  // ✅ Session check function
  const checkSession = React.useCallback(async () => {
    try {
      const { data, error } = await authClient.getUser();
      if (error) throw new Error(error);

      // Handle both { user: {...} } or direct user object
      setUser(data.user || data);
    } catch (err) {
      console.error("Not logged in");
      setUser(null);
    }
  }, []);

  // ✅ Only check if token exists (stored in localStorage)
  React.useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) checkSession();
  }, [checkSession]);

  return (
    <UserContext.Provider value={{ user, checkSession }}>
      {children}
    </UserContext.Provider>
  );
}
