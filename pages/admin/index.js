import Link from "next/link";

export default function AdminDashboard() {
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
