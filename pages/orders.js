import { useEffect, useState, useContext } from "react";
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
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const router = useRouter();

  const API = BackendAPI || "";

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${API}/api/order/my`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const socketInstance = io(`${API}`, { transports: ["websocket"] });
    socketInstance.on("connect", () => {
      socketInstance.emit("joinRoom", user._id.toString());
    });

    socketInstance.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
      if (updatedOrder.status === "Delivered")
        toast.success("🎉 Your order has been delivered!");
    });

    return () => socketInstance.disconnect();
  }, [user]);

  // ✅ Handle confirm reorder
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

  if (loading) return <Loader />;

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
