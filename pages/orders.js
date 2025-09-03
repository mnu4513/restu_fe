import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { CartContext } from "@/context/CartContext";
import axios from "axios";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { Dialog } from "@headlessui/react";   // 👈 Modal
import io from "socket.io-client";
import { BackendAPI } from "@/utils/api";


export default function Orders() {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // 👈 modal state
  const router = useRouter();

  const API = BackendAPI || "";  // "" means relative

useEffect(() => {
  if (!user) return;

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/order/my`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();

  
  // ✅ Ensure connection uses correct transport
  const socketInstance = io(`${API}`, {
    transports: ["websocket"], // force websocket (skip polling issues)
  });

 socketInstance.on("connect", () => {
  socketInstance.emit("joinRoom", user._id.toString()); // 👈 always string
});


  socketInstance.on("orderUpdated", (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
    );
    // ✅ Toast notifications
    if (updatedOrder.status === "Delivered") {
      toast.success("🎉 Your order has been delivered!");
      
    } else if (updatedOrder.status === "Out for Delivery") {
      toast("🚚 Your order is out for delivery!", { icon: "🚚" });
    } else if (updatedOrder.status === "Preparing") {
      toast("👨‍🍳 Your order is being prepared");
    }
  });

  return () => {
    socketInstance.disconnect();
  };
}, [user]);



  // ✅ Handle reorder confirm
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
      setSelectedOrder(null); // close modal
      router.push("/cart");   // redirect
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
          <div key={order._id} className="border p-4 mb-4 rounded">

            {/* ✅ Order Status Tracker */}
            <div className="mt-3">
              <h4 className="font-semibold mb-2">Order Status:</h4>
              <div className="flex items-center space-x-4">
                {["Pending", "Accepted", "Preparing", "Out for Delivery", "Delivered"].map((step, idx) => {
                  const currentIdx = ["Pending", "Accepted", "Preparing", "Out for Delivery", "Delivered"].indexOf(order.status);
                  const isCompleted = idx <= currentIdx;
                  return (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold ${
                          isCompleted ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="ml-2 text-sm">{step}</span>
                      {idx < 4 && (
                        <div className={`w-10 h-1 mx-2 ${isCompleted ? "bg-green-600" : "bg-gray-300"}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
              {order.status === "Cancelled" && (
                <p className="mt-2 text-red-600 font-semibold">
                  ❌ This order was cancelled
                </p>
              )}
            </div>

            <p><strong>Date:</strong> {order.createdAt.slice(0, 10)} <strong>Time:</strong> {order.createdAt.slice(11, 19)} </p>
            <p><strong>Total:</strong> ₹{order.totalPrice}</p>
            <ul className="mt-2">
              {order.items.map((i, idx) => (
                <li key={idx}>
                  {i.quantity} × {i.menuItem?.name || "Item"}
                </li>
              ))}
            </ul>

            {/* ✅ Delivery Address */}
            <div className="mt-3 text-sm text-gray-700">
              <p><strong>Deliver To:</strong></p>
              <p>{order.deliveryAddress?.label}</p>
              <p>
                {order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city},{" "}
                {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
              </p>
            </div>

            {/* ✅ Reorder Button (opens modal) */}
            <button
              onClick={() => setSelectedOrder(order)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Reorder
            </button>
          </div>
        ))
      )}

{/* ✅ Confirmation Modal with editable quantities & remove option */}
{selectedOrder && (
  <Dialog open={true} onClose={() => setSelectedOrder(null)} className="relative z-50">
    {/* Overlay */}
    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

    {/* Modal Box */}
    <div className="fixed inset-0 flex items-center justify-center">
      <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <Dialog.Title className="text-lg font-semibold">
          Reorder Confirmation
        </Dialog.Title>
        <Dialog.Description className="mt-2 text-gray-600">
          Adjust items if needed before reordering:
        </Dialog.Description>

        {/* ✅ Items Preview with Quantity Controls + Remove */}
        <div className="mt-3 border-t pt-3">
          <h4 className="font-medium mb-2">Items:</h4>
          <ul className="space-y-3 text-sm text-gray-700">
            {selectedOrder.items.map((i, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  {i.menuItem?.name || "Item"}{" "}
                  <span className="text-gray-500">
                    (₹{i.menuItem?.price}{" "}
                    {i.menuItem?.discount > 0 && `- ${i.menuItem.discount}%`})
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Quantity Controls */}
                  <button
                    onClick={() => {
                      const updated = [...selectedOrder.items];
                      if (updated[idx].quantity > 1) updated[idx].quantity -= 1;
                      setSelectedOrder({ ...selectedOrder, items: updated });
                    }}
                    className="px-2 bg-gray-300 rounded"
                  >
                    -
                  </button>
                  <span>{i.quantity}</span>
                  <button
                    onClick={() => {
                      const updated = [...selectedOrder.items];
                      updated[idx].quantity += 1;
                      setSelectedOrder({ ...selectedOrder, items: updated });
                    }}
                    className="px-2 bg-gray-300 rounded"
                  >
                    +
                  </button>

                  {/* ❌ Remove Button */}
                  <button
                    onClick={() => {
                      const updated = selectedOrder.items.filter(
                        (_, j) => j !== idx
                      );
                      setSelectedOrder({ ...selectedOrder, items: updated });
                    }}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* ✅ Updated Total */}
          <p className="mt-4 font-semibold">
            Total: ₹
            {selectedOrder.items.reduce(
              (sum, i) =>
                sum +
                (i.menuItem?.price -
                  (i.menuItem?.price * (i.menuItem?.discount || 0)) / 100) *
                  i.quantity,
              0
            )}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => setSelectedOrder(null)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmReorder}
            disabled={selectedOrder.items.length === 0} // ✅ prevent empty reorder
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
)}

    </div>
  );
}
