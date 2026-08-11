// lib/admin-auth.ts
import { currentUser } from "@clerk/nextjs/server";

// Reads ADMIN_EMAILS from .env — a comma-separated list, e.g.
// ADMIN_EMAILS="you@example.com,partner@example.com"
function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

// Returns the Clerk user if they're signed in AND their email is on the admin list, otherwise null.
export async function getAdminUser() {
  const user = await currentUser();
  if (!user) return null;

  const adminEmails = getAdminEmails();
  const userEmails = user.emailAddresses.map((e) => e.emailAddress.toLowerCase());
  const isAdmin = userEmails.some((email) => adminEmails.includes(email));

  return isAdmin ? user : null;
}

// Throws if not an admin — use at the top of every protected API route.
export async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) {
    const err = new Error("Not authorized") as Error & { status?: number };
    err.status = 403;
    throw err;
  }
  return admin;
}