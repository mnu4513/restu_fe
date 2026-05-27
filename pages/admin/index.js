import Link from "next/link";
import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "admin") {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading) return null;
  if (!user || user.role !== "admin") return null;

  return (
    <main className="min-h-screen bg-white dark:bg-[#0b0f19] p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            p-6 rounded-3xl
            border border-gray-200 dark:border-white/10
            bg-white/70 dark:bg-white/[0.03]
            backdrop-blur-xl
            shadow-sm
          "
        >
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your restaurant operations
          </p>
        </motion.div>

        {/* GRID CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ORDERS CARD */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="
              p-6 rounded-3xl
              border border-gray-200 dark:border-white/10
              bg-gradient-to-br from-blue-500/10 to-indigo-500/10
              backdrop-blur-xl
              shadow-sm
            "
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              📦 Orders Management
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              Track, update and manage customer orders in real time.
            </p>

            <Link
              href="/admin/orders"
              className="
                inline-block mt-5
                px-5 py-3
                rounded-2xl
                font-semibold text-white
                bg-gradient-to-r from-blue-500 to-indigo-500
                hover:from-blue-600 hover:to-indigo-600
                transition
              "
            >
              Manage Orders
            </Link>
          </motion.div>

          {/* MENU CARD */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="
              p-6 rounded-3xl
              border border-gray-200 dark:border-white/10
              bg-gradient-to-br from-orange-500/10 to-green-500/10
              backdrop-blur-xl
              shadow-sm
            "
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              🍔 Menu Management
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              Add, edit, and organize food items and categories.
            </p>

            <Link
              href="/admin/menu"
              className="
                inline-block mt-5
                px-5 py-3
                rounded-2xl
                font-semibold text-white
                bg-gradient-to-r from-green-500 to-orange-500
                hover:from-green-600 hover:to-orange-600
                transition
              "
            >
              Manage Menu
            </Link>
          </motion.div>

        </div>
      </div>
    </main>
  );
}