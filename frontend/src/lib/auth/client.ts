'use client';

const API_BASE = "http://localhost:5000/api";

// ============================
// 🔹 Auth Client Class
// ============================
class AuthClient {
  // 🟢 SIGN UP
  async signUp(values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<{ message?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Signup failed" };
      }

      // If backend returns a token (after signup)
      if (data.token) {
        localStorage.setItem("auth-token", data.token);
      }

      return { message: data.message || "User registered successfully" };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // 🟢 LOGIN
  async signInWithPassword(params: {
    email: string;
    password: string;
  }): Promise<{ error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("auth-token", data.token);
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // 🟢 GET USER (Protected)
  async getUser(): Promise<{ data?: any; error?: string }> {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) throw new Error("Not logged in");

      const res = await fetch(`${API_BASE}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch user");

      return { data };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // 🟢 LOGOUT
  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem("auth-token");
    return {};
  }
}

// Export single instance
export const authClient = new AuthClient();
