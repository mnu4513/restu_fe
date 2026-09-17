"use client";

import Link from "next/link";
import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/axios";

export default function DeliveryOrders() {
  const { user, loading } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  /*
   * ============================
   * ACCESS CONTROL
   * ============================
   */

  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "delivery") {
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  /*
   * ============================
   * FETCH ORDERS
   * ============================
   */

  const fetchOrders = useCallback(async () => {
    if (!user || user.role !== "delivery") return;

    try {
      setOrdersLoading(true);
      setError("");

      const { data } = await api.get("/api/delivery/orders");

      if (!data?.success) {
        throw new Error(
          data?.message || "Failed to load deliveries"
        );
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error("Delivery orders error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load deliveries"
      );
    } finally {
      setOrdersLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "delivery") return;

    fetchOrders();
  }, [loading, user, fetchOrders]);

  /*
   * ============================
   * SOCKET UPDATE
   * ============================
   */

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "delivery") return;

    const socket = window.__APP_SOCKET__;

    if (!socket) return;

    const userId = user._id || user.id;

    if (userId) {
      socket.emit("joinRoom", userId);
    }

    const handleOrderUpdate = () => {
      fetchOrders();
    };

    socket.on("orderUpdated", handleOrderUpdate);

    return () => {
      socket.off("orderUpdated", handleOrderUpdate);
    };
  }, [loading, user, fetchOrders]);

  /*
   * ============================
   * LOADING
   * ============================
   */

  if (loading) {
    return <PageLoader text="Checking access..." />;
  }

  /*
   * ============================
   * ACCESS DENIED
   * ============================
   */

  if (!user || user.role !== "delivery") {
    return (
      <div
        className="
          min-h-screen
          flex items-center justify-center
          bg-gray-50
          dark:bg-[#0b0f19]
          px-5
        "
      >
        <AnimatePresence>
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="
              w-full
              max-w-sm
              rounded-3xl
              bg-white
              dark:bg-[#151a27]
              p-7
              text-center
              shadow-2xl
            "
          >
            <div
              className="
                mx-auto
                w-16 h-16
                rounded-full
                flex
                items-center
                justify-center
                bg-red-100
                dark:bg-red-500/10
                text-3xl
              "
            >
              🚫
            </div>

            <h2
              className="
                mt-5
                text-xl
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              Access Denied
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-gray-600
                dark:text-gray-400
              "
            >
              This area is only available for delivery
              personnel.
            </p>

            <p
              className="
                mt-4
                text-xs
                text-gray-500
                dark:text-gray-500
              "
            >
              Taking you back...
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  /*
   * ============================
   * FILTERS
   * ============================
   */

  const filters = [
    "All",
    "Assigned",
    "Accepted",
    "Picked Up",
    "Out for Delivery",
    "Delivered",
    "Rejected",
  ];

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter(
          (order) =>
            order.deliveryStatus === activeFilter
        );

  /*
   * ============================
   * COUNTS
   * ============================
   */

  const getCount = (status) => {
    if (status === "All") return orders.length;

    return orders.filter(
      (order) => order.deliveryStatus === status
    ).length;
  };

  /*
   * ============================
   * PAGE
   * ============================
   */

  return (
    <div
      className="
        min-h-screen
        bg-gray-50
        dark:bg-[#0b0f19]
        text-gray-900
        dark:text-white
      "
    >
      {/* ================= HEADER ================= */}

      <header
        className="
          sticky
          top-0
          z-40
          backdrop-blur-xl
          bg-white/80
          dark:bg-[#0b0f19]/80
          border-b
          border-gray-200/60
          dark:border-white/10
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            h-16
            flex
            items-center
            justify-between
          "
        >
          <div className="flex items-center gap-3">
            <Link
              href="/delivery"
              className="
                w-9
                h-9
                rounded-xl
                bg-gray-100
                dark:bg-white/10
                flex
                items-center
                justify-center
                text-lg
                hover:bg-gray-200
                dark:hover:bg-white/15
                transition
              "
            >
              ←
            </Link>

            <div>
              <h1 className="font-black text-lg">
                My Deliveries
              </h1>

              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Manage your assigned orders
              </p>
            </div>
          </div>

          <Link href="/delivery/profile">
            <div
              className="
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                bg-gradient-to-br
                from-orange-400
                to-green-500
                text-white
                font-bold
                shadow-md
              "
            >
              {user.name?.charAt(0).toUpperCase() || "D"}
            </div>
          </Link>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
          pb-28
        "
      >
        {/* ================= TITLE ================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <p
            className="
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Welcome back 👋
          </p>

          <h2 className="mt-1 text-2xl font-black">
            Your Deliveries
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-gray-600
              dark:text-gray-400
            "
          >
            View and manage all orders assigned to you.
          </p>
        </motion.div>

        {/* ================= FILTERS ================= */}

        <div
          className="
            mt-6
            overflow-x-auto
            scrollbar-hide
            -mx-4
            px-4
          "
        >
          <div className="flex gap-2 min-w-max">
            {filters.map((filter) => {
              const isActive =
                activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    setActiveFilter(filter)
                  }
                  className={`
                    px-4
                    py-2.5
                    rounded-full
                    text-sm
                    font-semibold
                    transition
                    whitespace-nowrap
                    ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-md"
                        : "bg-white dark:bg-[#151a27] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                    }
                  `}
                >
                  {filter}

                  <span
                    className={`
                      ml-1.5
                      ${
                        isActive
                          ? "text-white/80"
                          : "text-gray-400 dark:text-gray-500"
                      }
                    `}
                  >
                    ({getCount(filter)})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              mt-5
              rounded-2xl
              border
              border-red-200
              dark:border-red-500/20
              bg-red-50
              dark:bg-red-500/10
              p-4
            "
          >
            <p
              className="
                text-sm
                font-medium
                text-red-600
                dark:text-red-400
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={fetchOrders}
              className="
                mt-3
                text-sm
                font-semibold
                text-red-600
                dark:text-red-400
                hover:underline
              "
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* ================= ORDERS ================= */}

        <section className="mt-6">
          {ordersLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((item) => (
                <OrderSkeleton key={item} />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <EmptyState
              filter={activeFilter}
            />
          ) : (
            <div className="grid gap-4">
              {filteredOrders.map((order, index) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ================= MOBILE BOTTOM NAV ================= */}

      <nav
        className="
          md:hidden
          fixed
          bottom-0
          left-0
          right-0
          z-50
          bg-white/90
          dark:bg-[#0b0f19]/90
          backdrop-blur-xl
          border-t
          border-gray-200
          dark:border-white/10
          px-5
          py-3
        "
      >
        <div
          className="
            flex
            items-center
            justify-around
          "
        >
          <BottomNavLink
            href="/delivery"
            icon="🏠"
            label="Home"
          />

          <BottomNavLink
            href="/delivery/orders"
            icon="📦"
            label="Deliveries"
            active
          />

          <BottomNavLink
            href="/delivery/profile"
            icon="👤"
            label="Profile"
          />
        </div>
      </nav>
    </div>
  );
}

/* ================= ORDER CARD ================= */

function OrderCard({ order, index }) {
  const status = order.deliveryStatus || "Unknown";

  const style = getStatusStyle(status);

  const customerName =
    order.user?.name || "Customer";

  const customerPhone =
    order.user?.phone || "";

  const address = getAddress(order);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.05,
      }}
      className="
        rounded-3xl
        bg-white
        dark:bg-[#151a27]
        border
        border-gray-200
        dark:border-white/10
        p-5
        shadow-sm
        hover:shadow-md
        transition
      "
    >
      {/* HEADER */}

      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className="
              text-xs
              text-gray-500
              dark:text-gray-400
            "
          >
            Order
          </p>

          <h3 className="mt-1 text-lg font-black">
            #{getShortOrderId(order._id)}
          </h3>
        </div>

        <span
          className={`
            px-3
            py-1.5
            rounded-full
            text-xs
            font-semibold
            whitespace-nowrap
            ${style.bg}
            ${style.text}
          `}
        >
          {status}
        </span>
      </div>

      {/* CUSTOMER */}

      <div
        className="
          mt-5
          flex
          items-start
          gap-3
        "
      >
        <div
          className="
            w-10
            h-10
            rounded-xl
            bg-gray-100
            dark:bg-white/5
            flex
            items-center
            justify-center
            shrink-0
          "
        >
          👤
        </div>

        <div className="min-w-0">
          <p className="font-semibold truncate">
            {customerName}
          </p>

          {customerPhone && (
            <p
              className="
                mt-0.5
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              {customerPhone}
            </p>
          )}
        </div>
      </div>

      {/* ADDRESS */}

      <div
        className="
          mt-4
          rounded-2xl
          bg-gray-50
          dark:bg-white/5
          p-4
        "
      >
        <div className="flex items-start gap-2">
          <span className="text-sm">
            📍
          </span>

          <div>
            <p
              className="
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >
              Delivery Address
            </p>

            {order.deliveryAddress?.label && (
              <p className="mt-1 text-xs font-semibold">
                {order.deliveryAddress.label}
              </p>
            )}

            <p className="mt-1 text-sm font-medium">
              {address}
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <div>
          <p
            className="
              text-xs
              text-gray-500
              dark:text-gray-400
            "
          >
            Amount
          </p>

          <p className="mt-1 text-lg font-black">
            ₹
            {Number(
              order.totalPrice || 0
            ).toFixed(2)}
          </p>
        </div>

        <div className="text-right">
          <p
            className="
              text-xs
              text-gray-500
              dark:text-gray-400
            "
          >
            Items
          </p>

          <p className="mt-1 text-sm font-semibold">
            {getTotalQuantity(order)} item
            {getTotalQuantity(order) !== 1
              ? "s"
              : ""}
          </p>
        </div>
      </div>

      {/* ACTION */}

      <Link
        href={`/delivery/orders/${order._id}`}
        className="
          mt-5
          w-full
          flex
          items-center
          justify-center
          px-4
          py-3
          rounded-2xl
          bg-gradient-to-r
          from-orange-500
          to-green-500
          text-white
          text-sm
          font-semibold
          shadow-lg
          shadow-orange-500/20
          hover:scale-[1.01]
          transition
        "
      >
        View Order
      </Link>
    </motion.div>
  );
}

/* ================= STATUS STYLE ================= */

function getStatusStyle(status) {
  switch (status) {
    case "Assigned":
      return {
        bg: "bg-blue-100 dark:bg-blue-500/10",
        text: "text-blue-600 dark:text-blue-400",
      };

    case "Accepted":
      return {
        bg: "bg-purple-100 dark:bg-purple-500/10",
        text: "text-purple-600 dark:text-purple-400",
      };

    case "Picked Up":
      return {
        bg: "bg-yellow-100 dark:bg-yellow-500/10",
        text: "text-yellow-600 dark:text-yellow-400",
      };

    case "Out for Delivery":
      return {
        bg: "bg-orange-100 dark:bg-orange-500/10",
        text: "text-orange-600 dark:text-orange-400",
      };

    case "Delivered":
      return {
        bg: "bg-green-100 dark:bg-green-500/10",
        text: "text-green-600 dark:text-green-400",
      };

    case "Rejected":
      return {
        bg: "bg-red-100 dark:bg-red-500/10",
        text: "text-red-600 dark:text-red-400",
      };

    default:
      return {
        bg: "bg-gray-100 dark:bg-white/10",
        text: "text-gray-600 dark:text-gray-400",
      };
  }
}

/* ================= ADDRESS ================= */

function getAddress(order) {
  if (!order?.deliveryAddress) {
    return "Delivery address not available";
  }

  const address = order.deliveryAddress;

  return [
    address.addressLine,
    address.city,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}

/* ================= ORDER ID ================= */

function getShortOrderId(id) {
  if (!id) return "N/A";

  return id.toString().slice(-6).toUpperCase();
}

/* ================= TOTAL QUANTITY ================= */

function getTotalQuantity(order) {
  if (!Array.isArray(order?.items)) {
    return 0;
  }

  return order.items.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );
}

/* ================= EMPTY STATE ================= */

function EmptyState({ filter }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        rounded-3xl
        bg-white
        dark:bg-[#151a27]
        border
        border-gray-200
        dark:border-white/10
        p-10
        text-center
      "
    >
      <div className="text-5xl">
        {filter === "All" ? "📦" : "🔍"}
      </div>

      <h3 className="mt-5 text-lg font-bold">
        {filter === "All"
          ? "No Deliveries Yet"
          : `No ${filter} Deliveries`}
      </h3>

      <p
        className="
          mt-2
          text-sm
          text-gray-500
          dark:text-gray-400
        "
      >
        {filter === "All"
          ? "Orders assigned to you will appear here."
          : `You don't have any deliveries with ${filter.toLowerCase()} status.`}
      </p>
    </motion.div>
  );
}

/* ================= ORDER SKELETON ================= */

function OrderSkeleton() {
  return (
    <div
      className="
        rounded-3xl
        bg-white
        dark:bg-[#151a27]
        border
        border-gray-200
        dark:border-white/10
        p-5
        animate-pulse
      "
    >
      <div className="flex justify-between">
        <div>
          <div className="w-12 h-3 rounded bg-gray-200 dark:bg-white/10" />

          <div className="mt-2 w-20 h-5 rounded bg-gray-200 dark:bg-white/10" />
        </div>

        <div className="w-28 h-7 rounded-full bg-gray-200 dark:bg-white/10" />
      </div>

      <div className="mt-5 flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/10" />

        <div>
          <div className="w-32 h-4 rounded bg-gray-200 dark:bg-white/10" />

          <div className="mt-2 w-20 h-3 rounded bg-gray-200 dark:bg-white/10" />
        </div>
      </div>

      <div className="mt-4 h-20 rounded-2xl bg-gray-100 dark:bg-white/5" />

      <div className="mt-4 flex justify-between">
        <div>
          <div className="w-12 h-3 rounded bg-gray-200 dark:bg-white/10" />

          <div className="mt-2 w-20 h-5 rounded bg-gray-200 dark:bg-white/10" />
        </div>

        <div>
          <div className="w-12 h-3 rounded bg-gray-200 dark:bg-white/10" />

          <div className="mt-2 w-16 h-4 rounded bg-gray-200 dark:bg-white/10" />
        </div>
      </div>

      <div className="mt-5 h-11 rounded-2xl bg-gray-200 dark:bg-white/10" />
    </div>
  );
}

/* ================= PAGE LOADER ================= */

function PageLoader({ text }) {
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-50
        dark:bg-[#0b0f19]
      "
    >
      <div className="text-center">
        <div
          className="
            w-10
            h-10
            border-4
            border-orange-500
            border-t-transparent
            rounded-full
            animate-spin
            mx-auto
          "
        />

        <p
          className="
            mt-4
            text-gray-600
            dark:text-gray-300
          "
        >
          {text}
        </p>
      </div>
    </div>
  );
}

/* ================= BOTTOM NAV ================= */

function BottomNavLink({
  href,
  icon,
  label,
  active,
}) {
  return (
    <Link
      href={href}
      className={`
        flex
        flex-col
        items-center
        gap-1
        text-xs
        transition
        ${
          active
            ? "text-orange-500"
            : "text-gray-500 dark:text-gray-400"
        }
      `}
    >
      <span className="text-lg">
        {icon}
      </span>

      <span
        className={`
          font-medium
          ${active ? "font-bold" : ""}
        `}
      >
        {label}
      </span>
    </Link>
  );
}