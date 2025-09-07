// pages/orders.js
import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";
import { CartContext } from "@/context/CartContext";
import axios from "axios";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import io from "socket.io-client";
import { BackendAPI } from "@/utils/api";
import ReorderModal from "@/components/ReorderModal";
import OrderCard from "@/components/OrderCard";

export default function Orders() {
  const { user, loading: authLoading } = useContext(AuthContext); // <- need loading here
  const { addToCart } = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // page-level fetch loading
  const [selectedOrder, setSelectedOrder] = useState(null);
  const router = useRouter();
  const API = BackendAPI || "";
  const socketRef = useRef(null);

  // Redirect when auth resolved and user is not logged in
  useEffect(() => {
    if (authLoading) return;              // still checking auth — do nothing
    if (user === null) router.replace("/login"); // not logged in — go to login
  }, [user, authLoading, router]);

  // Fetch orders and setup socket (only when user exists)
  useEffect(() => {
    if (authLoading) return; // wait for auth check
    if (!user) return;       // user === null or undefined -> don't run

    let mounted = true;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/api/order/my`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (mounted) setOrders(data);
      } catch (err) {
        console.error("fetchOrders error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();

    // Create socket AFTER user confirmed
    const socket = io(`${API}`, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      // join user's personal room
      socket.emit("joinRoom", user._id?.toString?.() || user._id);
    });

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) => prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)));
      // optional toast on certain transitions
      if (updatedOrder.status === "Delivered") toast.success("🎉 Your order has been delivered!");
    });

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, authLoading, API]);

  // Reorder handler
  const handleConfirmReorder = () => {
    if (selectedOrder) {
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
      toast.success("Items added to cart!");
      setSelectedOrder(null);
      router.push("/cart");
    }
  };

  // show loader while either auth is being checked or fetching page data
  if (authLoading || loading) return <Loader />;

  // If not user (should have redirected) keep a safe fallback
  if (!user) return null;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            onReorder={(o) => setSelectedOrder(o)}
          />
        ))
      )}

      {selectedOrder && (
        <ReorderModal
          order={selectedOrder}
          setOrder={setSelectedOrder}
          onClose={() => setSelectedOrder(null)}
          onConfirm={handleConfirmReorder}
        />
      )}
    </div>
  );
}
