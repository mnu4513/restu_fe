"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/utils/axios";
import toast from "react-hot-toast";
import { BackendAPI } from "@/utils/api";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = BackendAPI || "";

  // ✅ SAFE ROUTING HANDLING
  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      toast.error("Admin profile is handled in dashboard");
      router.replace("/admin");
    }
  }, [user, router]);

  // ✅ FETCH PROFILE
  useEffect(() => {
    if (!user) return;

    const fetchProfileData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const res = await api.get(`${API}/api/auth/profile/`, config);
        setProfile(res.data.user);
      } catch (err) {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  // ✅ SAFE REDIRECT (NO RENDER-TIME ROUTING)
  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [user, router]);

  // ================= LOADING =================
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0b0f19]">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-lg text-gray-700 dark:text-gray-300"
        >
          Loading profile...
        </motion.div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-white dark:bg-[#0b0f19] overflow-hidden">

      {/* ================= BACKGROUND ================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-120px] left-[-120px] w-72 h-72 bg-orange-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-72 h-72 bg-green-500/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 space-y-8">

        {/* ================= PROFILE CARD ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            flex flex-col md:flex-row items-center md:items-start gap-6
            p-8 rounded-3xl
            border border-gray-200 dark:border-white/10
            bg-white/70 dark:bg-white/[0.03]
            backdrop-blur-2xl
            shadow-xl
          "
        >
          {/* Avatar */}
          <div className="
            w-24 h-24 md:w-28 md:h-28
            rounded-full
            flex items-center justify-center
            text-3xl font-black text-white
            bg-gradient-to-br from-orange-400 via-yellow-400 to-green-500
            shadow-lg
          ">
            {profile?.name?.charAt(0)?.toUpperCase()}
          </div>

          {/* INFO */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              {profile?.name}
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {profile?.email}
            </p>

            <p className="text-gray-600 dark:text-gray-400">
              {profile?.number}
            </p>

            <span className="
              inline-block mt-3 px-3 py-1
              text-xs font-medium
              rounded-full
              bg-orange-500/10 text-orange-500
            ">
              Customer Account
            </span>
          </div>
        </motion.div>

        {/* ================= ACTION CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ADDRESS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="
              p-6 rounded-3xl
              border border-gray-200 dark:border-white/10
              bg-white/70 dark:bg-white/[0.03]
              backdrop-blur-2xl
              hover:scale-[1.02]
              transition
            "
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              🏠 Manage Addresses
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              Add or update your delivery locations.
            </p>

            <button
              onClick={() => router.push("/address")}
              className="
                mt-5 w-full
                py-3 rounded-2xl
                font-semibold text-white
                bg-gradient-to-r from-orange-500 to-green-500
                hover:scale-[1.02] active:scale-95
                transition
              "
            >
              Go to Address
            </button>
          </motion.div>

          {/* ORDERS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="
              p-6 rounded-3xl
              border border-gray-200 dark:border-white/10
              bg-white/70 dark:bg-white/[0.03]
              backdrop-blur-2xl
              hover:scale-[1.02]
              transition
            "
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              📦 Manage Orders
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
              Track your food orders and history.
            </p>

            <button
              onClick={() => router.push("/orders")}
              className="
                mt-5 w-full
                py-3 rounded-2xl
                font-semibold text-white
                bg-gradient-to-r from-green-500 to-orange-500
                hover:scale-[1.02] active:scale-95
                transition
              "
            >
              View Orders
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}