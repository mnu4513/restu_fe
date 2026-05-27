import { motion } from "framer-motion";

export default function AdminOrderCard({ order, onUpdateStatus }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      layout
      className="
        group relative
        rounded-3xl
        border border-gray-200 dark:border-white/10
        bg-white/70 dark:bg-white/[0.03]
        backdrop-blur-2xl
        shadow-sm hover:shadow-2xl
        transition-all duration-300
        p-5 md:p-6
        flex flex-col gap-4
      "
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            👤 Customer
          </p>

          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {order.user?.name}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {order.user?.email}
          </p>
        </div>

        {/* STATUS BADGE */}
        <div
          className={`
            px-3 py-1.5
            rounded-full
            text-xs font-semibold
            text-white
            w-fit
            ${
              order.status === "Delivered"
                ? "bg-green-500"
                : order.status === "Cancelled"
                ? "bg-red-500"
                : "bg-yellow-500"
            }
          `}
        >
          {order.status}
        </div>
      </div>

      {/* DATE + TIME */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span>📅 {order.createdAt?.slice(0, 10)}</span>
        <span>⏰ {order.createdAt?.slice(11, 19)}</span>
        <span className="font-medium text-gray-700 dark:text-gray-300">
          Order #{order._id.slice(-8)}
        </span>
      </div>

      {/* ITEMS */}
      <div className="bg-gray-50 dark:bg-white/[0.02] rounded-2xl p-4">
        <p className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
          Items
        </p>

        <div className="space-y-2">
          {order.items.map((i, idx) => (
            <div
              key={idx}
              className="flex justify-between text-sm text-gray-700 dark:text-gray-300"
            >
              <span>
                {i.quantity} × {i.menuItem?.name}
              </span>

              <span className="text-gray-500">
                ₹{i.menuItem?.price}
                {i.menuItem?.discount > 0 && (
                  <span className="text-red-500 ml-1">
                    (-{i.menuItem?.discount}%)
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TOTAL */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Total</span>
        <span className="text-xl font-black text-green-600">
          ₹{order.totalPrice}
        </span>
      </div>

      {/* STATUS UPDATE */}
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Update Status:
        </span>

        <select
          value={order.status}
          onChange={(e) => onUpdateStatus(order._id, e.target.value)}
          className="
            w-full md:w-auto
            px-3 py-2 rounded-xl
            border border-gray-200 dark:border-white/10
            bg-white dark:bg-white/[0.05]
            text-gray-800 dark:text-white
            focus:outline-none
          "
        >
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Preparing">Preparing</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* ADDRESS */}
      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/10">
        <p className="text-xs text-gray-500 mb-1">Delivery Address</p>

        <p className="text-sm text-gray-800 dark:text-white font-medium">
          {order.deliveryAddress?.addressLine}
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {order.deliveryAddress?.city}, {order.deliveryAddress?.state} -{" "}
          {order.deliveryAddress?.pincode}
        </p>

        <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-orange-500 text-white">
          {order.deliveryAddress?.label}
        </span>
      </div>

      {/* HOVER GLOW */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-r from-green-500/5 to-orange-500/5" />
    </motion.div>
  );
}