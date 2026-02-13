import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { BackendAPI } from "@/utils/api";
import { useRouter } from "next/router";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = BackendAPI || "";

  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      toast.error("Admin profile is handled in dashboard");
      router.replace("/admin");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const [profileRes] = await Promise.all([
          axios.get(`${API}/api/auth/profile/`, config),
        ]);
console.log(profileRes);

        setProfile(profileRes.data.user);
      } catch (err) {
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

//   if (!user) return <div className="p-6">Please login first.</div>;
if (user === null) router.replace("/login"); // not logged in — go to login
  if (loading) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 max-w-7xl m-auto">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ===== PROFILE HEADER ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex items-center gap-6">

          {/* Avatar */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-400 via-blue-400 to-orange-500 flex items-center justify-center text-4xl font-bold text-slate-300">
            {profile?.name?.charAt(0)?.toUpperCase()}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {profile?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {profile?.email}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {profile?.number}
            </p>
          </div>
        </div>

        {/* ===== ADDRESS BUTTON ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Manage Addresses
          </h2>

          <button
            onClick={() => router.push("/address")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Go to Address Page
          </button>
        </div>

        {/* ===== ORDERS SECTION ===== */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Manage Orders
          </h2>

          <button
            onClick={() => router.push("/orders")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Go to Order Page
          </button>
        </div>
      </div>
    </div>
  );
}
