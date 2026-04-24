import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  // Middleware protects /admin/* (except /admin/login), so if we're here we're authenticated.
  redirect("/admin/dashboard");
}

