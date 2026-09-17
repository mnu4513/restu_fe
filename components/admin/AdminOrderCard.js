import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AdminOrderCard({
  order,
  onUpdateStatus,
  deliveryPersons = [],
  deliveryLoading = false,
  onAssignDelivery,
}) {
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] =
    useState("");

  const [assigning, setAssigning] = useState(false);

  // ================= CURRENT DELIVERY PERSON =================
  useEffect(() => {
    setSelectedDeliveryPerson(
      order?.deliveryPerson?._id ||
        order?.deliveryPerson ||
        ""
    );
  }, [order?.deliveryPerson]);

  // ================= ASSIGN =================
  const handleAssign = async () => {
    if (!selectedDeliveryPerson) return;

    try {
      setAssigning(true);

      await onAssignDelivery(
        order._id,
        selectedDeliveryPerson
      );
    } finally {
      setAssigning(false);
    }
  };

  const isClosedOrder =
    order.status === "Delivered" ||
    order.status === "Cancelled";

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
        overflow-hidden
      "
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            👤 Customer
          </p>

          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {order.user?.name || "Unknown Customer"}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {order.user?.email || "No email"}
          </p>

          {order.user?.phone && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              📞 {order.user.phone}
            </p>
          )}
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
        <span>
          📅 {order.createdAt?.slice(0, 10)}
        </span>

        <span>
          ⏰ {order.createdAt?.slice(11, 19)}
        </span>

        <span className="font-medium text-gray-700 dark:text-gray-300">
          Order #{order._id?.slice(-8)}
        </span>
      </div>

      {/* ITEMS */}
      <div className="bg-gray-50 dark:bg-white/[0.02] rounded-2xl p-4">
        <p className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
          Items
        </p>

        <div className="space-y-2">
          {order.items?.map((i, idx) => (
            <div
              key={idx}
              className="
                flex justify-between gap-4
                text-sm
                text-gray-700 dark:text-gray-300
              "
            >
              <span>
                {i.quantity} ×{" "}
                {i.menuItem?.name || "Item unavailable"}
              </span>

              <span className="text-gray-500 whitespace-nowrap">
                ₹
                {i.menuItem?.finalPrice ??
                  i.menuItem?.price ??
                  0}

                {i.menuItem?.discount > 0 && (
                  <span className="text-red-500 ml-1">
                    (-{i.menuItem.discount}%)
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* TOTAL */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Total
        </span>

        <span className="text-xl font-black text-green-600">
          ₹{order.totalPrice}
        </span>
      </div>

      {/* STATUS UPDATE */}
      <div
        className="
          flex flex-col md:flex-row
          md:items-center gap-2
        "
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Update Status:
        </span>

        <select
          value={order.status}
          onChange={(e) =>
            onUpdateStatus(
              order._id,
              e.target.value
            )
          }
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
          <option value="Out for Delivery">
            Out for Delivery
          </option>
          <option value="Delivered">
            Delivered
          </option>
          <option value="Cancelled">
            Cancelled
          </option>
        </select>
      </div>

      {/* DELIVERY ASSIGNMENT */}
      <div
        className="
          rounded-2xl
          border border-blue-100 dark:border-blue-500/20
          bg-blue-50/60 dark:bg-blue-500/[0.05]
          p-4
        "
      >
        <div className="flex flex-col gap-3">

          {/* TITLE */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                🚴 Delivery Assignment
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Assign a delivery person to this order.
              </p>
            </div>

            {/* DELIVERY STATUS */}
            {order.deliveryStatus && (
              <span
                className={`
                  px-2.5 py-1
                  rounded-full
                  text-xs font-semibold
                  w-fit
                  ${
                    order.deliveryStatus === "Delivered"
                      ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                      : order.deliveryStatus === "Rejected"
                      ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                      : order.deliveryStatus === "Out for Delivery"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
                      : order.deliveryStatus === "Picked Up"
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                      : order.deliveryStatus === "Accepted"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                      : order.deliveryStatus === "Assigned"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300"
                      : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300"
                  }
                `}
              >
                {order.deliveryStatus}
              </span>
            )}
          </div>

          {/* CURRENT DELIVERY PERSON */}
          {order.deliveryPerson &&
            typeof order.deliveryPerson === "object" && (
              <div
                className="
                  rounded-xl
                  bg-white/70 dark:bg-white/[0.04]
                  border border-gray-200 dark:border-white/10
                  px-3 py-2
                "
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Currently Assigned
                </p>

                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  {order.deliveryPerson.name ||
                    "Delivery Person"}
                </p>

                {order.deliveryPerson.email && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {order.deliveryPerson.email}
                  </p>
                )}

                {order.deliveryPerson.phone && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    📞 {order.deliveryPerson.phone}
                  </p>
                )}
              </div>
            )}

          {/* SELECT + BUTTON */}
          <div className="flex flex-col md:flex-row gap-2">

            <select
              value={selectedDeliveryPerson}
              onChange={(e) =>
                setSelectedDeliveryPerson(
                  e.target.value
                )
              }
              disabled={
                deliveryLoading ||
                assigning ||
                isClosedOrder
              }
              className="
                flex-1
                px-3 py-2.5
                rounded-xl
                border border-gray-200 dark:border-white/10
                bg-white dark:bg-[#111827]
                text-gray-800 dark:text-white
                focus:outline-none
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              <option value="">
                {deliveryLoading
                  ? "Loading delivery persons..."
                  : deliveryPersons.length === 0
                  ? "No delivery person available"
                  : "Select delivery person"}
              </option>

              {deliveryPersons.map((person) => (
                <option
                  key={person._id}
                  value={person._id}
                >
                  {person.name || "Unnamed"}{" "}
                  {person.email
                    ? `— ${person.email}`
                    : ""}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleAssign}
              disabled={
                !selectedDeliveryPerson ||
                deliveryLoading ||
                assigning ||
                isClosedOrder
              }
              className="
                px-5 py-2.5
                rounded-xl
                font-semibold
                text-white
                bg-blue-600
                hover:bg-blue-700
                active:scale-[0.98]
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
                whitespace-nowrap
              "
            >
              {assigning
                ? "Assigning..."
                : order.deliveryPerson
                ? "Reassign"
                : "Assign Delivery"}
            </button>
          </div>

          {/* CLOSED ORDER MESSAGE */}
          {isClosedOrder && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Delivery assignment is disabled for{" "}
              {order.status.toLowerCase()} orders.
            </p>
          )}

          {/* NO DELIVERY PERSON */}
          {!deliveryLoading &&
            deliveryPersons.length === 0 && (
              <p className="text-xs text-orange-600 dark:text-orange-400">
                No users with the delivery role are
                currently available.
              </p>
            )}
        </div>
      </div>

      {/* ADDRESS */}
      <div
        className="
          p-4 rounded-2xl
          bg-gray-50 dark:bg-white/[0.02]
          border border-gray-100 dark:border-white/10
        "
      >
        <p className="text-xs text-gray-500 mb-1">
          Delivery Address
        </p>

        <p className="text-sm text-gray-800 dark:text-white font-medium">
          {order.deliveryAddress?.addressLine ||
            "Address not available"}
        </p>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {order.deliveryAddress?.city || ""}
          {order.deliveryAddress?.city &&
          order.deliveryAddress?.state
            ? ", "
            : ""}
          {order.deliveryAddress?.state || ""}
          {order.deliveryAddress?.pincode
            ? ` - ${order.deliveryAddress.pincode}`
            : ""}
        </p>

        {order.deliveryAddress?.label && (
          <span
            className="
              inline-block mt-2
              px-2 py-1
              text-xs rounded-full
              bg-orange-500 text-white
            "
          >
            {order.deliveryAddress.label}
          </span>
        )}
      </div>

      {/* HOVER GLOW */}
      <div
        className="
          absolute inset-0
          rounded-3xl
          opacity-0
          group-hover:opacity-100
          transition
          pointer-events-none
          bg-gradient-to-r
          from-green-500/5
          to-orange-500/5
        "
      />
    </motion.div>
  );
}