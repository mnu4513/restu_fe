// AdminOrders.jsx (relevant parts)
import { useEffect, useState, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import api from "@/utils/axios";
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
  // keep local search input in search bar component; we will pass searchValue to fetchOrders when user submits
  const [lastSearch, setLastSearch] = useState("");

  const API = BackendAPI || "";

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (loading) return; // wait for any initial loading if applicable
    if (!user || user.role !== "admin") {
      router.replace("/login"); // change to whatever your login route is
    }
  }, [user, loading, router]);

  // fetchOrders accepts an optional searchValue (string).
  const fetchOrders = useCallback(
    async (searchValue = "") => {
      if (!user || user.role !== "admin") {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const q = encodeURIComponent(searchValue || "");
        const { data } = await api.get(
          `${API}/api/admin/orders?page=${page}&limit=20&search=${q}&t=${Date.now()}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setOrders(data.orders || []);
        setPages(data.pages || 1);
      } catch (err) {
        console.error("Fetch orders error:", err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    },
    // Notice search is removed from deps so typing doesn't auto-trigger fetchOrders
    [user, page, API]
  );

  // initial load + reload when page changes
  useEffect(() => {
    // use lastSearch (empty by default) when page changes
    fetchOrders(lastSearch);
  }, [fetchOrders, page, lastSearch]);

  // Search handler (called by AdminSearchBar when user submits)
  const handleSearchSubmit = (searchValue) => {
    // update lastSearch so pagination + UI are in sync
    setLastSearch(searchValue || "");
    // reset to page 1 on new search
    setPage(1);
    // fetch with the provided search value
    fetchOrders(searchValue || "");
  };

  // ... socket logic unchanged (kept as-is) ...
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const socketInstance = io(API, {
      auth: { token: user.token },
    });

    const onConnect = () => socketInstance.emit("joinAdmin");
    socketInstance.on("connect", onConnect);

    const onOrderUpdated = (updatedOrder) => {
      setOrders((prev) => {
        const exists = prev.find((o) => o._id === updatedOrder._id);
        if (exists) {
          return prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o));
        } else {
          const audio = new Audio("/sounds/ding.mp3");
          audio.play().catch(() => {});
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
      const { data } = await api.put(
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
    <div className="p-6 max-w-7xl m-auto">
      <h2 className="text-3xl font-bold mb-6">All Orders</h2>

      {/* Pass handler to search bar; searchValue is only used when user submits */}
      <AdminSearchBar onSearch={handleSearchSubmit} initialValue={lastSearch} />

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
