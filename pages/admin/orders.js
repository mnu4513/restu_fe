// AdminOrders.jsx (updated parts)
import { useEffect, useState, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import io from "socket.io-client";
import { BackendAPI } from "@/utils/api";

import { AnimatePresence } from "framer-motion";
import AdminOrderCard from "@/components/admin/AdminOrderCard";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminPagination from "@/components/admin/AdminPagination";

export default function AdminOrders() {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");

  const API = BackendAPI || "";

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (loading) return; // wait for any initial loading if applicable
    if (!user || user.role !== "admin") {
      // push to admin login or general login page
      router.replace("/login"); // change to whatever your login route is
    }
  }, [user, loading, router]);

  const fetchOrders = useCallback(async () => {
    if (!user || user.role !== "admin") {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API}/api/admin/orders?page=${page}&limit=20&search=${encodeURIComponent(
          search
        )}&t=${Date.now()}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOrders(data.orders || []);
      setPages(data.pages || 1);
    } catch (err) {
      console.error("Fetch orders error:", err);
      // optional: show toast
    } finally {
      setLoading(false);
    }
  }, [user, page, search, API]);

  useEffect(() => {
    fetchOrders();
    // when user becomes null, fetchOrders will early-return and setLoading(false)
  }, [fetchOrders]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const socketInstance = io(API, {
      // pass auth if your server expects token
      auth: { token: user.token },
    });

    const onConnect = () => {
      socketInstance.emit("joinAdmin");
    };
    socketInstance.on("connect", onConnect);

    const onOrderUpdated = (updatedOrder) => {
      setOrders((prev) => {
        const exists = prev.find((o) => o._id === updatedOrder._id);
        if (exists) {
          return prev.map((o) =>
            o._id === updatedOrder._id ? updatedOrder : o
          );
        } else {
          const audio = new Audio("/sounds/ding.mp3");
          audio.play().catch(() => {
            /* ignore autoplay errors */
          });
          toast.success(`📦 New Order ${updatedOrder._id.slice(-5)}`);
          return [updatedOrder, ...prev];
        }
      });
    };

    socketInstance.on("orderUpdated", onOrderUpdated);

    return () => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("orderUpdated", onOrderUpdated);
      socketInstance.disconnect();
    };
  }, [user, API]);

  const updateStatus = async (orderId, status) => {
    if (!user) {
      toast.error("Not authorized");
      return;
    }
    try {
      const { data } = await axios.put(
        `${API}/api/admin/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("Order status updated");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? data.order : o))
      );
    } catch (err) {
      console.error("Update status error:", err);
      toast.error("Error updating order");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">All Orders</h2>

      <AdminSearchBar search={search} setSearch={setSearch} onSearch={fetchOrders} />

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <AnimatePresence>
          {orders.map((order) => (
            <AdminOrderCard
              key={order._id}
              order={order}
              onUpdateStatus={updateStatus}
            />
          ))}
        </AnimatePresence>
      )}

      <AdminPagination page={page} pages={pages} setPage={setPage} />
    </div>
  );
}
