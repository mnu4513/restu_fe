import { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import io from "socket.io-client";
import { BackendAPI } from "@/utils/api";

export default function AdminOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination + search state
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");

  const API = BackendAPI || "";  // "" means relative

  // 🔹 Fetch orders (runs when page/search changes)
  const fetchOrders = useCallback( async () => {
    if (!user || user.role !== "admin") return;
    try {
      const { data } = await axios.get(
        `${API}/api/admin/orders?page=${page}&limit=20&search=${search}&t=${Date.now()}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setOrders(data.orders || []);
      setPages(data.pages || 1);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  });

  // 🔹 Effect for fetching data
  useEffect(() => {
    fetchOrders();
  }, [user, page, search]);

  // 🔹 Effect for socket connection (only once per login)
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const socketInstance = io(`${API}`);

    socketInstance.on("connect", () => {
      console.log("⚡ Admin connected:", socketInstance.id);
      socketInstance.emit("joinAdmin");
    });

    socketInstance.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) => {
        const exists = prev.find((o) => o._id === updatedOrder._id);
        if (exists) {
          // Update existing order
          return prev.map((o) =>
            o._id === updatedOrder._id ? updatedOrder : o
          );
        } else {
          // 🔔 Play sound for new order
          const audio = new Audio("/sounds/ding.mp3");
          audio.play();
          toast.success(`📦 New Order ${updatedOrder._id.slice(-5)}`);

          // Add new order on top
          return [updatedOrder, ...prev];
        }
      });
    });

    return () => socketInstance.disconnect();
  }, [user]);

  // 🔹 Update order status
  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await axios.put(
        `${API}/api/admin/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("Order status updated");
      setOrders(orders.map((o) => (o._id === orderId ? data.order : o)));
    } catch (err) {
      toast.error("Error updating order");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">All Orders</h2>

      {/* 🔍 Search Bar */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by Order ID or User ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-1/3"
        />
        <button
          onClick={() => {
            setPage(1); // reset page
            fetchOrders(); // re-fetch
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {!orders || orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 mb-4 rounded">
            <p>
              <strong>User:</strong> {order.user?.name} ({order.user?.email})
            </p>
            <p>
              <strong>Status:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded text-white 
        ${order.status === "Delivered"
                  ? "bg-green-600"
                  : order.status === "Cancelled"
                  ? "bg-red-600"
                  : "bg-yellow-500"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p>
              <strong>Date:</strong> {order.createdAt?.slice(0, 10)}{" "}
              <strong>Time:</strong> {order.createdAt?.slice(11, 19)}
            </p>

            {/* ✅ Ordered items */}
            <div className="mt-3">
              <h4 className="font-semibold">Items:</h4>
              <ul className="list-disc list-inside">
                {order.items.map((i, idx) => (
                  <li key={idx}>
                    {i.quantity} × {i.menuItem?.name} @ ₹{i.menuItem?.price}
                    {i.menuItem?.discount > 0 && (
                      <span className="text-red-500">
                        {" "}
                        (-{i.menuItem?.discount}%)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* ✅ Final total */}
            <p className="mt-2 font-bold">Total: ₹{order.totalPrice}</p>

            {/* ✅ Status Update Dropdown */}
            <div className="mt-3">
              <label className="font-semibold mr-2">Change Status:</label>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="border px-3 py-1 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Preparing">Preparing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* ✅ Delivery Address */}
            <div className="mt-3 text-sm text-gray-700">
              <p><strong>Deliver To: </strong>
                {order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city},{" "}
                {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}, <span className="ml-2 px-2 py-1 rounded text-white bg-red-400">{order.deliveryAddress?.label}</span>
              </p>
            </div>
          </div>
        ))
      )}

      {/* 📄 Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-1">
          Page {page} of {pages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === pages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
