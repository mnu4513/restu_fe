// AdminDashboard.jsx
import Link from "next/link";
import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    // Wait until the AuthProvider has finished initializing
    if (authLoading) return;

    // Now we know auth has been checked; redirect if not admin
    if (!user || user.role !== "admin") {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  // Show nothing (or Loader) until auth is loaded
  if (authLoading) return null; // or <Loader />

  if (!user || user.role !== "admin") return null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <ul className="space-y-4">
        <li>
          <Link href="/admin/orders" className="text-blue-600 hover:underline">
            Manage Orders
          </Link>
        </li>
        <li>
          <Link href="/admin/menu" className="text-blue-600 hover:underline">
            Manage Menu
          </Link>
        </li>
      </ul>
    </div>
  );
}
