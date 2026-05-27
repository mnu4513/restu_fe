import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";
import { CartContext } from "@/context/CartContext";
import api from "@/utils/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { BackendAPI } from "@/utils/api";

import ReorderModal from "@/components/ReorderModal";
import OrderCard from "@/components/OrderCard";
import OrderLoading from "@/components/common/OrderLoading";
import { motion } from "framer-motion";

export default function Orders() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const router = useRouter();
  const API = BackendAPI || "";
  const socketRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;
    if (user === null) router.replace("/login");

    if (user?.role === "admin") {
      toast.error("Admin can't place order");
      router.replace("/admin");
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (authLoading || !user) return;

    let mounted = true;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`${API}/api/order/my`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (mounted) setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();

    const socket = io(`${API}`, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinRoom", user._id?.toString?.() || user._id);
    });

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === updatedOrder._id ? updatedOrder : o
        )
      );

      if (updatedOrder.status === "Delivered") {
        toast.success("🎉 Order delivered!");
      }
    });

    return () => {
      mounted = false;
      socketRef.current?.disconnect();
    };
  }, [user, authLoading]);

  const handleConfirmReorder = () => {
    if (!selectedOrder) return;

    selectedOrder.items.forEach((i) => {
      if (i.menuItem) {
        addToCart({
          _id: i.menuItem._id,
          name: i.menuItem.name,
          price: i.menuItem.price,
          discount: i.menuItem.discount,
          quantity: i.quantity,
        });
      }
    });

    toast.success("Items added to cart 🚀");
    setSelectedOrder(null);
    router.push("/cart");
  };

  if (authLoading || loading) return <OrderLoading />;

  if (!user) return null;

  return (
    <main className="relative min-h-screen bg-white dark:bg-[#0b0f19] overflow-hidden">

      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-120px] left-[-120px] w-72 h-72 bg-orange-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-72 h-72 bg-green-500/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-14">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">
            My Orders 📦
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your delicious journey in real time
          </p>
        </motion.div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="
            text-center py-24
            border border-gray-200 dark:border-white/10
            bg-white/70 dark:bg-white/[0.03]
            backdrop-blur-2xl
            rounded-3xl
          ">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              No Orders Yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Start ordering your favorite meals
            </p>

            <button
              onClick={() => router.push("/menu")}
              className="
                mt-6 px-6 py-3
                rounded-2xl
                text-white
                bg-gradient-to-r from-orange-500 to-green-500
                hover:scale-105 active:scale-95
                transition
              "
            >
              Explore Menu
            </button>
          </div>
        ) : (
          /* ORDERS GRID */
          <div className="space-y-5">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onReorder={(o) => setSelectedOrder(o)}
              />
            ))}
          </div>
        )}

        {/* MODAL */}
        {selectedOrder && (
          <ReorderModal
            order={selectedOrder}
            setOrder={setSelectedOrder}
            onClose={() => setSelectedOrder(null)}
            onConfirm={handleConfirmReorder}
          />
        )}
      </div>
    </main>
  );
}