import { motion } from "framer-motion";

export default function OrderCard({ order, onReorder }) {
  const deliverySteps = [
    "Assigned",
    "Accepted",
    "Picked Up",
    "Out for Delivery",
    "Delivered",
  ];

  const deliveryStatus = order.deliveryStatus || "Unassigned";

  const currentStepIndex = deliverySteps.indexOf(deliveryStatus);

  const isCancelled = order.status === "Cancelled";

  const getDeliveryStepState = (stepIndex) => {
    if (isCancelled) return "inactive";

    if (currentStepIndex === -1) return "inactive";

    if (stepIndex < currentStepIndex) return "completed";

    if (stepIndex === currentStepIndex) return "current";

    return "upcoming";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
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
        overflow-hidden
      "
    >
      {/* STATUS + DATE ROW */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        {/* STATUS */}
        <div className="flex items-center gap-3 flex-wrap">
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
            Order ID: #{order._id?.slice(-9)}
          </span>
        </div>

        {/* DATE */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          📅 {order.createdAt?.slice(0, 10)} &nbsp; ⏰{" "}
          {order.createdAt?.slice(11, 19)}
        </div>
      </div>

      {/* ================= DELIVERY TRACKING ================= */}
      {!isCancelled && (
        <div
          className="
            mt-6
            p-4 md:p-5
            rounded-2xl
            bg-gray-50 dark:bg-white/[0.02]
            border border-gray-200 dark:border-white/10
          "
        >
          {/* TRACKING HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                🚴 Delivery Tracking
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {deliveryStatus === "Unassigned"
                  ? "Waiting for delivery person assignment"
                  : deliveryStatus === "Assigned"
                  ? "Delivery person has been assigned"
                  : deliveryStatus === "Accepted"
                  ? "Delivery person accepted your order"
                  : deliveryStatus === "Picked Up"
                  ? "Your order has been picked up"
                  : deliveryStatus === "Out for Delivery"
                  ? "Your order is on the way"
                  : deliveryStatus === "Delivered"
                  ? "Your order has been delivered"
                  : "Tracking order status"}
              </p>
            </div>

            {/* CURRENT DELIVERY STATUS */}
            <span
              className={`
                px-3 py-1.5
                rounded-full
                text-xs font-semibold
                w-fit
                ${
                  deliveryStatus === "Delivered"
                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                    : deliveryStatus === "Out for Delivery"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
                    : deliveryStatus === "Picked Up"
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                    : deliveryStatus === "Accepted"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                    : deliveryStatus === "Assigned"
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300"
                    : "bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-300"
                }
              `}
            >
              {deliveryStatus}
            </span>
          </div>

          {/* UNASSIGNED */}
          {deliveryStatus === "Unassigned" ? (
            <div
              className="
                flex items-center gap-3
                p-3
                rounded-xl
                bg-orange-50 dark:bg-orange-500/[0.06]
                border border-orange-100 dark:border-orange-500/20
              "
            >
              <div className="text-2xl">
                ⏳
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  Finding a delivery person
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Your order is being prepared for delivery.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* DELIVERY PROGRESS */}
              <div className="relative">

                {/* DESKTOP PROGRESS LINE */}
                <div
                  className="
                    hidden md:block
                    absolute
                    left-[10%]
                    right-[10%]
                    top-5
                    h-1
                    rounded-full
                    bg-gray-200 dark:bg-white/10
                  "
                />

                {/* ACTIVE LINE */}
                {currentStepIndex >= 0 && (
                  <div
                    className="
                      hidden md:block
                      absolute
                      left-[10%]
                      top-5
                      h-1
                      rounded-full
                      bg-green-500
                      transition-all duration-500
                    "
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(
                          100,
                          (currentStepIndex /
                            (deliverySteps.length - 1)) *
                            80
                        )
                      )}%`,
                    }}
                  />
                )}

                {/* STEPS */}
                <div className="relative flex justify-between gap-2">

                  {deliverySteps.map((step, index) => {
                    const state =
                      getDeliveryStepState(index);

                    const stepIcons = {
                      Assigned: "📋",
                      Accepted: "✅",
                      "Picked Up": "📦",
                      "Out for Delivery": "🚴",
                      Delivered: "🎉",
                    };

                    return (
                      <div
                        key={step}
                        className="
                          flex-1
                          flex flex-col
                          items-center
                          text-center
                        "
                      >
                        {/* ICON */}
                        <div
                          className={`
                            w-10 h-10
                            rounded-full
                            flex items-center justify-center
                            text-sm
                            border-2
                            transition-all duration-500
                            relative z-10
                            ${
                              state === "completed"
                                ? "bg-green-500 border-green-500 text-white"
                                : state === "current"
                                ? "bg-blue-500 border-blue-500 text-white scale-110 shadow-lg"
                                : "bg-white dark:bg-[#111827] border-gray-200 dark:border-white/10 text-gray-400"
                            }
                          `}
                        >
                          {state === "completed"
                            ? "✓"
                            : stepIcons[step]}
                        </div>

                        {/* LABEL */}
                        <p
                          className={`
                            mt-2
                            text-[10px] md:text-xs
                            leading-tight
                            ${
                              state === "current"
                                ? "font-bold text-blue-600 dark:text-blue-400"
                                : state === "completed"
                                ? "font-semibold text-green-600 dark:text-green-400"
                                : "text-gray-400 dark:text-gray-500"
                            }
                          `}
                        >
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* DELIVERY PERSON */}
          {order.deliveryPerson &&
            typeof order.deliveryPerson === "object" && (
              <div
                className="
                  mt-5
                  flex flex-col sm:flex-row
                  sm:items-center
                  sm:justify-between
                  gap-3
                  p-3
                  rounded-xl
                  bg-white/70 dark:bg-white/[0.04]
                  border border-gray-200 dark:border-white/10
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-10 h-10
                      rounded-full
                      bg-blue-100 dark:bg-blue-500/20
                      flex items-center justify-center
                      text-lg
                    "
                  >
                    🚴
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      Delivery Partner
                    </p>

                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {order.deliveryPerson.name ||
                        "Delivery Person"}
                    </p>

                    {order.deliveryPerson.phone && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        📞 {order.deliveryPerson.phone}
                      </p>
                    )}
                  </div>
                </div>

                {order.deliveryPerson.phone && (
                  <a
                    href={`tel:${order.deliveryPerson.phone}`}
                    className="
                      px-4 py-2
                      rounded-xl
                      bg-green-500
                      hover:bg-green-600
                      text-white
                      text-xs
                      font-semibold
                      text-center
                      transition
                    "
                  >
                    📞 Call
                  </a>
                )}
              </div>
            )}
        </div>
      )}

      {/* CANCELLED */}
      {isCancelled && (
        <div
          className="
            mt-5
            p-4
            rounded-2xl
            bg-red-50 dark:bg-red-500/[0.05]
            border border-red-100 dark:border-red-500/20
          "
        >
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            ❌ Order Cancelled
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This order is no longer active.
          </p>
        </div>
      )}

      {/* ITEMS */}
      <div className="mt-5 space-y-3">
        <p className="text-sm font-semibold text-gray-800 dark:text-white">
          Items
        </p>

        {order.items?.map((i, idx) => (
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
            {/* LEFT SIDE */}
            <div className="flex items-center gap-3 min-w-0">

              {/* IMAGE */}
              <img
                src={
                  i.menuItem?.thumbnail ||
                  i.menuItem?.images?.[0] ||
                  "/placeholder-food.png"
                }
                alt={i.menuItem?.name || "Item"}
                className="
                  w-12 h-12
                  rounded-xl
                  object-cover
                  border border-gray-200 dark:border-white/10
                  flex-shrink-0
                "
              />

              {/* NAME */}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {i.menuItem?.name || "Item"}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Qty: {i.quantity}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-green-600">
                ₹
                {(
                  (
                    i.menuItem?.price -
                    (i.menuItem?.price *
                      (i.menuItem?.discount || 0)) /
                      100
                  ) * i.quantity
                ).toFixed(2)}
              </p>

              <p className="text-[10px] text-gray-400">
                {i.quantity} × ₹
                {(
                  i.menuItem?.price -
                  (i.menuItem?.price *
                    (i.menuItem?.discount || 0)) /
                    100
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
          {order.deliveryAddress?.label ||
            "Delivery Address"}
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {order.deliveryAddress?.addressLine || ""}
          {order.deliveryAddress?.city
            ? `, ${order.deliveryAddress.city}`
            : ""}
          {order.deliveryAddress?.state
            ? `, ${order.deliveryAddress.state}`
            : ""}
          {order.deliveryAddress?.pincode
            ? ` - ${order.deliveryAddress.pincode}`
            : ""}
        </p>
      </div>

      {/* REORDER BUTTON */}
      <button
        onClick={() => onReorder(order)}
        disabled={isCancelled}
        className="
          mt-5 w-full
          py-3
          rounded-2xl
          font-semibold
          text-white
          bg-gradient-to-r
          from-blue-500
          to-indigo-500
          hover:from-blue-600
          hover:to-indigo-600
          hover:scale-[1.02]
          active:scale-95
          transition-all duration-300
          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:hover:scale-100
        "
      >
        🔁 Reorder
      </button>

      {/* HOVER GLOW */}
      <div
        className="
          absolute inset-0 rounded-3xl
          opacity-0 group-hover:opacity-100
          transition
          pointer-events-none
          bg-gradient-to-r
          from-blue-500/5
          to-indigo-500/5
        "
      />
    </motion.div>
  );
}