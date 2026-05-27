export default function OrderCard({ order, onReorder }) {
  return (
    <div
      className="
        group relative
        rounded-3xl
        border border-gray-200 dark:border-white/10
        bg-white/70 dark:bg-white/[0.03]
        backdrop-blur-2xl
        p-5 md:p-6
        shadow-sm
        hover:shadow-xl
        hover:scale-[1.01]
        transition-all duration-300
      "
    >
      {/* STATUS + DATE ROW */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        {/* STATUS */}
        <div className="flex items-center gap-3">
          <span
            className={`
              px-3 py-1.5
              rounded-full
              text-xs font-semibold
              tracking-wide
              text-white
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
          </span>

          <span className="text-xs text-gray-500 dark:text-gray-400">
            Order ID: #{order._id.slice(-9)}
          </span>
        </div>

        {/* DATE */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          📅 {order.createdAt.slice(0, 10)} &nbsp; ⏰{" "}
          {order.createdAt.slice(11, 19)}
        </div>
      </div>

      {/* ITEMS */}
{/* ITEMS (WITH IMAGE PREVIEW) */}
<div className="mt-5 space-y-3">
  {order.items.map((i, idx) => (
    <div
      key={idx}
      className="
        flex items-center justify-between
        gap-3
        p-2 rounded-xl
        bg-white/50 dark:bg-white/[0.02]
        border border-gray-100 dark:border-white/5
      "
    >
      {/* LEFT SIDE: IMAGE + NAME */}
      <div className="flex items-center gap-3">
        {/* IMAGE */}
        <img
          src={
            i.menuItem?.thumbnail ||
            i.menuItem?.images?.[0] ||
            "/placeholder-food.png"
          }
          alt={i.menuItem?.name}
          className="
            w-12 h-12
            rounded-xl
            object-cover
            border border-gray-200 dark:border-white/10
          "
        />

        {/* NAME */}
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            {i.menuItem?.name || "Item"}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Qty: {i.quantity}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="text-right">
  <p className="text-sm font-semibold text-green-600">
    ₹
    {(
      (i.menuItem?.price -
        (i.menuItem?.price * (i.menuItem?.discount || 0)) / 100) *
      i.quantity
    ).toFixed(2)}
  </p>

  <p className="text-[10px] text-gray-400">
    {i.quantity} × ₹
    {(
      i.menuItem?.price -
      (i.menuItem?.price * (i.menuItem?.discount || 0)) / 100
    ).toFixed(0)}
  </p>
</div>
    </div>
  ))}
</div>

      {/* TOTAL */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Total Amount
        </span>

        <span className="text-lg font-black text-green-600">
          ₹{order.totalPrice}
        </span>
      </div>

      {/* ADDRESS */}
      <div
        className="
          mt-5 p-4
          rounded-2xl
          border border-gray-200 dark:border-white/10
          bg-gray-50 dark:bg-white/[0.02]
        "
      >
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Deliver To
        </p>

        <p className="font-semibold text-gray-900 dark:text-white">
          {order.deliveryAddress?.label}
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {order.deliveryAddress?.addressLine},{" "}
          {order.deliveryAddress?.city},{" "}
          {order.deliveryAddress?.state} -{" "}
          {order.deliveryAddress?.pincode}
        </p>
      </div>

      {/* ACTION BUTTON */}
      <button
        onClick={() => onReorder(order)}
        className="
          mt-5 w-full
          py-3
          rounded-2xl
          font-semibold
          text-white
          bg-gradient-to-r from-blue-500 to-indigo-500
          hover:from-blue-600 hover:to-indigo-600
          hover:scale-[1.02]
          active:scale-95
          transition-all duration-300
        "
      >
        🔁 Reorder
      </button>

      {/* subtle hover glow */}
      <div
        className="
          absolute inset-0 rounded-3xl
          opacity-0 group-hover:opacity-100
          transition
          pointer-events-none
          bg-gradient-to-r from-blue-500/5 to-indigo-500/5
        "
      />
    </div>
  );
}