import { motion } from "framer-motion";

export default function AdminOrderCard({ order, onUpdateStatus }) {
  return (
    <motion.div
      key={order._id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      layout
      className="border p-4 mb-4 rounded shadow bg-white dark:bg-gray-800"
    >
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
              : "bg-yellow-500"}`}
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
                <span className="text-red-500"> (-{i.menuItem?.discount}%)</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-2 font-bold">Total: ₹{order.totalPrice}</p>

      {/* ✅ Status Update Dropdown */}
      <div className="mt-3">
        <label className="font-semibold mr-2">Change Status:</label>
        <select
          value={order.status}
          onChange={(e) => onUpdateStatus(order._id, e.target.value)}
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
      <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
        <p>
          <strong>Deliver To: </strong>
          {order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city},{" "}
          {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode},{" "}
          <span className="ml-2 px-2 py-1 rounded text-white bg-red-400">
            {order.deliveryAddress?.label}
          </span>
        </p>
      </div>
    </motion.div>
  );
}
