import { useEffect, useState, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import api from "@/utils/axios";
import { AuthContext } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import io from "socket.io-client";

import { AnimatePresence, motion } from "framer-motion";
import AdminOrderCard from "@/components/admin/AdminOrderCard";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminPagination from "@/components/admin/AdminPagination";

export default function AdminOrders() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [deliveryLoading, setDeliveryLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [lastSearch, setLastSearch] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL;

  // ================= AUTH GUARD =================
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // ================= FETCH ORDERS =================
  const fetchOrders = useCallback(
    async (searchValue = "") => {
      if (!user || user.role !== "admin") return;

      setLoading(true);

      try {
        const q = encodeURIComponent(searchValue || "");

        const { data } = await api.get(
          `${API}/api/admin/orders?page=${page}&limit=20&search=${q}&t=${Date.now()}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setOrders(data.orders || []);
        setPages(data.pages || 1);
      } catch (err) {
        console.error("Fetch orders error:", err);
        toast.error(
          err?.response?.data?.message || "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    },
    [user, page, API]
  );

  useEffect(() => {
    fetchOrders(lastSearch);
  }, [fetchOrders, page, lastSearch]);

  // ================= FETCH DELIVERY PERSONS =================
  const fetchDeliveryPersons = useCallback(async () => {
    if (!user || user.role !== "admin") return;

    setDeliveryLoading(true);

    try {
      const { data } = await api.get(
        `${API}/api/admin/users?t=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      /*
       * Admin users API may return:
       * { users: [...] }
       *
       * Keep this defensive so the UI doesn't break
       * if the API response contains another wrapper.
       */
      const users = Array.isArray(data?.users)
        ? data.users
        : Array.isArray(data)
        ? data
        : [];

      const deliveryUsers = users.filter(
        (u) => u?.role === "delivery"
      );

      setDeliveryPersons(deliveryUsers);
    } catch (err) {
      console.error("Fetch delivery persons error:", err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to load delivery persons"
      );

      setDeliveryPersons([]);
    } finally {
      setDeliveryLoading(false);
    }
  }, [user, API]);

  useEffect(() => {
    fetchDeliveryPersons();
  }, [fetchDeliveryPersons]);

  // ================= SEARCH =================
  const handleSearchSubmit = (value) => {
    setLastSearch(value || "");
    setPage(1);
    fetchOrders(value || "");
  };

  // ================= SOCKET =================
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const socketInstance = io(API, {
      auth: {
        token: user.token,
      },
    });

    const onOrderUpdated = (updatedOrder) => {
      if (!updatedOrder?._id) return;

      setOrders((prev) => {
        const exists = prev.find(
          (o) => o._id === updatedOrder._id
        );

        if (exists) {
          return prev.map((o) =>
            o._id === updatedOrder._id
              ? updatedOrder
              : o
          );
        }

        const audio = new Audio("/sounds/ding.mp3");
        audio.play().catch(() => {});

        toast.success(
          `📦 New Order ${updatedOrder._id.slice(-5)}`
        );

        return [updatedOrder, ...prev];
      });
    };

    socketInstance.on("orderUpdated", onOrderUpdated);

    return () => {
      socketInstance.off("orderUpdated", onOrderUpdated);
      socketInstance.disconnect();
    };
  }, [user, API]);

  // ================= STATUS UPDATE =================
  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await api.put(
        `${API}/api/admin/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success("Order updated");

      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? data.order : o
        )
      );
    } catch (err) {
      console.error("Update status error:", err);

      toast.error(
        err?.response?.data?.message ||
          "Error updating order"
      );
    }
  };

  // ================= ASSIGN DELIVERY =================
  const assignDeliveryPerson = async (
    orderId,
    deliveryPersonId
  ) => {
    if (!deliveryPersonId) {
      toast.error("Please select a delivery person");
      return;
    }

    try {
      const { data } = await api.put(
        `${API}/api/admin/orders/${orderId}/assign-delivery`,
        {
          deliveryPersonId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success(
        "Delivery person assigned successfully"
      );

      if (data?.order) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? data.order : o
          )
        );
      }
    } catch (err) {
      console.error("Assign delivery error:", err);

      toast.error(
        err?.response?.data?.message ||
          "Failed to assign delivery person"
      );
    }
  };

  // ================= LOADER =================
  if (loading) return <Loader />;

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            📦 All Orders
          </h2>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Pages: {pages}
          </div>
        </motion.div>

        {/* SEARCH */}
        <div
          className="
            bg-white/70 dark:bg-white/[0.03]
            backdrop-blur-xl
            border border-gray-200 dark:border-white/10
            rounded-2xl p-4
          "
        >
          <AdminSearchBar
            onSearch={handleSearchSubmit}
            initialValue={lastSearch}
          />
        </div>

        {/* ORDERS LIST */}
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No orders found
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <AdminOrderCard
                  key={order._id}
                  order={order}
                  onUpdateStatus={updateStatus}
                  deliveryPersons={deliveryPersons}
                  deliveryLoading={deliveryLoading}
                  onAssignDelivery={assignDeliveryPerson}
                />
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* PAGINATION */}
        <div
          className="
            bg-white/70 dark:bg-white/[0.03]
            backdrop-blur-xl
            border border-gray-200 dark:border-white/10
            rounded-2xl p-4
          "
        >
          <AdminPagination
            page={page}
            pages={pages}
            setPage={setPage}
          />
        </div>

      </div>
    </div>
  );
}