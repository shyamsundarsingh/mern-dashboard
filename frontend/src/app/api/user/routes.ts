import { NextResponse } from "next/server";

export async function GET() {
  // Simulate a logged-in user (replace with real logic later)
  const token = typeof window !== "undefined" ? localStorage.getItem("custom-auth-token") : null;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Hardcoded user data (same as your client.ts)
  const user = {
    id: "USR-000",
    avatar: "/assets/avatar.png",
    firstName: "Sofia",
    lastName: "Rivers",
    email: "sofia@devias.io",
  };

  return NextResponse.json(user);
}
