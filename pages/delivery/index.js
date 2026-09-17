"use client";

import Link from "next/link";
import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/axios";

export default function DeliveryHome() {
  const { user, loading } = useContext(AuthContext);

  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  /*
   * ============================
   * ACCESS CONTROL
   * ============================
   */

  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "delivery") {
      setShowAccessDenied(true);

      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  /*
   * ============================
   * FETCH DASHBOARD
   * ============================
   */

  const fetchDashboard = useCallback(async () => {
    if (!user || user.role !== "delivery") return;

    try {
      setDashboardLoading(true);
      setDashboardError("");

      const { data } = await api.get("/api/delivery/dashboard");

      if (!data?.success) {
        throw new Error(
          data?.message || "Failed to load delivery dashboard"
        );
      }

      setDashboard(data);
    } catch (error) {
      console.error("Delivery dashboard error:", error);

      setDashboardError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setDashboardLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "delivery") return;

    fetchDashboard();
  }, [loading, user, fetchDashboard]);

  /*
   * ============================
   * SOCKET UPDATE
   * ============================
   *
   * If your application already creates
   * window.__APP_SOCKET__, join the delivery
   * user's room and refresh dashboard whenever
   * an order update is received.
   */

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "delivery") return;

    const socket = window.__APP_SOCKET__;

    if (!socket) {
      return;
    }

    const userId = user._id || user.id;

    if (userId) {
      socket.emit("joinRoom", userId);
    }

    const handleOrderUpdate = () => {
      fetchDashboard();
    };

    socket.on("orderUpdated", handleOrderUpdate);

    return () => {
      socket.off("orderUpdated", handleOrderUpdate);
    };
  }, [loading, user, fetchDashboard]);

  /*
   * ============================
   * LOADING
   * ============================
   */

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          flex items-center justify-center
          bg-gray-50 dark:bg-[#0b0f19]
        "
      >
        <div className="text-center">
          <div
            className="
              w-10 h-10
              border-4
              border-orange-500
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Checking access...
          </p>
        </div>
      </div>
    );
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
          bg-gray-50 dark:bg-[#0b0f19]
        "
      >
        <AnimatePresence>
          {showAccessDenied && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="
                fixed inset-0
                z-[100]
                flex items-center justify-center
                bg-black/50
                backdrop-blur-sm
                px-5
              "
            >
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                className="
                  w-full max-w-sm
                  rounded-3xl
                  bg-white dark:bg-[#151a27]
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
                    flex items-center justify-center
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
                    leading-6
                    text-gray-600
                    dark:text-gray-400
                  "
                >
                  You can't access the delivery dashboard.
                  This area is only available for delivery
                  personnel.
                </p>

                <p
                  className="
                    mt-5
                    text-xs
                    text-gray-500
                    dark:text-gray-500
                  "
                >
                  Taking you back to the homepage...
                </p>

                <div
                  className="
                    mt-4
                    h-1
                    w-full
                    overflow-hidden
                    rounded-full
                    bg-gray-200
                    dark:bg-gray-700
                  "
                >
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.2 }}
                    className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-orange-500
                      to-green-500
                    "
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /*
   * ============================
   * DASHBOARD DATA
   * ============================
   */

  const stats = dashboard?.stats || {};

  const activeDelivery = dashboard?.activeDelivery || null;

  const assigned = stats.assigned ?? 0;
  const pickedUp = stats.pickedUp ?? 0;
  const outForDelivery = stats.outForDelivery ?? 0;
  const delivered = stats.delivered ?? 0;

  /*
   * ============================
   * STATUS HELPERS
   * ============================
   */

  const getStatusStyle = (status) => {
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
  };

  const statusStyle = getStatusStyle(
    activeDelivery?.deliveryStatus
  );

  /*
   * ============================
   * DELIVERY ADDRESS
   * ============================
   */

  const getAddress = (order) => {
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
  };

  /*
   * ============================
   * PAYMENT
   * ============================
   */

  const getPaymentText = (order) => {
    if (!order?.paymentInfo) {
      return "Payment information unavailable";
    }

    if (
      order.paymentInfo.status === "Paid" ||
      order.paymentInfo.paymentId
    ) {
      return "Online Payment";
    }

    return "Cash on Delivery";
  };

  /*
   * ============================
   * DASHBOARD
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
          sticky top-0 z-40
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
            px-4 sm:px-6 lg:px-8
            h-16
            flex items-center justify-between
          "
        >
          {/* BRAND */}

          <Link
            href="/delivery"
            className="
              text-xl
              font-black
              bg-gradient-to-r
              from-orange-500
              to-green-500
              bg-clip-text
              text-transparent
            "
          >
            🚴 Delivery
          </Link>

          {/* PROFILE */}

          <Link href="/delivery/profile">
            <div
              className="
                w-10 h-10
                rounded-full
                flex items-center justify-center
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
          px-4 sm:px-6 lg:px-8
          py-6
          pb-28
        "
      >
        {/* GREETING */}

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
            Good morning 👋
          </p>

          <h1
            className="
              mt-1
              text-2xl
              sm:text-3xl
              font-black
            "
          >
            {user.name || "Delivery Partner"}
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-gray-600
              dark:text-gray-400
            "
          >
            Here’s your delivery overview for today.
          </p>
        </motion.div>

        {/* ================= STATUS ================= */}

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
            delay: 0.1,
          }}
          className="
            mt-6
            rounded-2xl
            bg-white
            dark:bg-[#151a27]
            border
            border-gray-200
            dark:border-white/10
            p-4
            flex items-center justify-between
            shadow-sm
          "
        >
          <div className="flex items-center gap-3">
            <span
              className="
                w-3 h-3
                rounded-full
                bg-green-500
                shadow-lg
                shadow-green-500/40
              "
            />

            <div>
              <p className="font-semibold">
                You're Online
              </p>

              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Ready to receive deliveries
              </p>
            </div>
          </div>

          <button
            type="button"
            className="
              text-sm
              font-semibold
              text-orange-500
              hover:text-orange-600
            "
          >
            Change
          </button>
        </motion.div>

        {/* ================= DASHBOARD ERROR ================= */}

        {dashboardError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              mt-5
              rounded-2xl
              border border-red-200
              dark:border-red-500/20
              bg-red-50
              dark:bg-red-500/10
              p-4
            "
          >
            <p
              className="
                text-sm
                text-red-600
                dark:text-red-400
                font-medium
              "
            >
              {dashboardError}
            </p>

            <button
              type="button"
              onClick={fetchDashboard}
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

        {/* ================= TODAY STATS ================= */}

        <section className="mt-7">
          <h2 className="text-lg font-bold">
            Today's Summary
          </h2>

          {dashboardLoading ? (
            <div
              className="
                mt-4
                grid
                grid-cols-2
                lg:grid-cols-4
                gap-3
              "
            >
              {[1, 2, 3, 4].map((item) => (
                <StatSkeleton key={item} />
              ))}
            </div>
          ) : (
            <div
              className="
                mt-4
                grid
                grid-cols-2
                lg:grid-cols-4
                gap-3
              "
            >
              <StatCard
                icon="📦"
                label="Assigned"
                value={assigned}
              />

              <StatCard
                icon="🛵"
                label="Picked Up"
                value={pickedUp}
              />

              <StatCard
                icon="🚴"
                label="Out for Delivery"
                value={outForDelivery}
              />

              <StatCard
                icon="✅"
                label="Delivered"
                value={delivered}
              />
            </div>
          )}
        </section>

        {/* ================= ACTIVE DELIVERY ================= */}

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">
              Active Delivery
            </h2>

            <Link
              href="/delivery/orders"
              className="
                text-sm
                font-semibold
                text-orange-500
                hover:text-orange-600
              "
            >
              View All
            </Link>
          </div>

          {dashboardLoading ? (
            <ActiveDeliverySkeleton />
          ) : !activeDelivery ? (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                mt-4
                rounded-3xl
                bg-white
                dark:bg-[#151a27]
                border
                border-gray-200
                dark:border-white/10
                p-8
                shadow-sm
                text-center
              "
            >
              <div className="text-4xl">
                📦
              </div>

              <h3 className="mt-4 text-lg font-bold">
                No Active Delivery
              </h3>

              <p
                className="
                  mt-2
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                You don't have any active delivery right now.
              </p>

              <Link
                href="/delivery/orders"
                className="
                  inline-flex
                  mt-5
                  px-5 py-3
                  rounded-2xl
                  bg-gradient-to-r
                  from-orange-500
                  to-green-500
                  text-white
                  text-sm
                  font-semibold
                "
              >
                View Deliveries
              </Link>
            </motion.div>
          ) : (
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
                delay: 0.2,
              }}
              className="
                mt-4
                rounded-3xl
                bg-white
                dark:bg-[#151a27]
                border
                border-gray-200
                dark:border-white/10
                p-5
                shadow-sm
              "
            >
              {/* ORDER HEADER */}

              <div className="flex items-center justify-between gap-3">
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

                  <h3 className="text-lg font-bold">
                    #{getShortOrderId(activeDelivery._id)}
                  </h3>
                </div>

                <span
                  className={`
                    px-3 py-1
                    rounded-full
                    text-xs
                    font-semibold
                    whitespace-nowrap
                    ${statusStyle.bg}
                    ${statusStyle.text}
                  `}
                >
                  {activeDelivery.deliveryStatus || "Unknown"}
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
                    w-10 h-10
                    rounded-xl
                    bg-gray-100
                    dark:bg-white/5
                    flex
                    items-center
                    justify-center
                  "
                >
                  👤
                </div>

                <div className="min-w-0">
                  <p className="font-semibold">
                    {activeDelivery.user?.name ||
                      "Customer"}
                  </p>

                  {activeDelivery.user?.phone && (
                    <p
                      className="
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {activeDelivery.user.phone}
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
                <p
                  className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Delivery Address
                </p>

                {activeDelivery.deliveryAddress?.label && (
                  <p className="mt-1 text-xs font-semibold">
                    {activeDelivery.deliveryAddress.label}
                  </p>
                )}

                <p className="mt-1 text-sm font-medium">
                  {getAddress(activeDelivery)}
                </p>
              </div>

              {/* AMOUNT */}

              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-between
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
                    Payment
                  </p>

                  <p className="text-sm font-semibold">
                    {getPaymentText(activeDelivery)}
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
                    Amount
                  </p>

                  <p className="text-lg font-black">
                    ₹{Number(
                      activeDelivery.totalPrice || 0
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}

              <div
                className="
                  mt-5
                  grid
                  grid-cols-2
                  gap-3
                "
              >
                <Link
                  href={`/delivery/orders/${activeDelivery._id}`}
                  className="
                    flex
                    items-center
                    justify-center
                    px-4 py-3
                    rounded-2xl
                    bg-gray-100
                    dark:bg-white/10
                    text-sm
                    font-semibold
                    hover:bg-gray-200
                    dark:hover:bg-white/15
                    transition
                  "
                >
                  View Order
                </Link>

                {activeDelivery.deliveryAddress?.location
                  ?.lat &&
                activeDelivery.deliveryAddress?.location
                  ?.lng ? (
                  <a
                    href={getGoogleMapsUrl(activeDelivery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      flex
                      items-center
                      justify-center
                      px-4 py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-orange-500
                      to-green-500
                      text-white
                      text-sm
                      font-semibold
                      shadow-lg
                      shadow-orange-500/20
                      hover:scale-[1.02]
                      transition
                    "
                  >
                    🧭 Navigate
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="
                      flex
                      items-center
                      justify-center
                      px-4 py-3
                      rounded-2xl
                      bg-gray-200
                      dark:bg-white/10
                      text-gray-400
                      dark:text-gray-500
                      text-sm
                      font-semibold
                      cursor-not-allowed
                    "
                  >
                    🧭 Navigate
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </section>

        {/* ================= QUICK ACTIONS ================= */}

        <section className="mt-8">
          <h2 className="text-lg font-bold">
            Quick Actions
          </h2>

          <div
            className="
              mt-4
              grid
              grid-cols-2
              gap-3
            "
          >
            <Link
              href="/delivery/orders"
              className="
                rounded-2xl
                bg-white
                dark:bg-[#151a27]
                border
                border-gray-200
                dark:border-white/10
                p-5
                hover:scale-[1.02]
                transition
              "
            >
              <div className="text-2xl">
                📦
              </div>

              <p className="mt-3 font-bold">
                My Deliveries
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                View assigned orders
              </p>
            </Link>

            <Link
              href="/delivery/profile"
              className="
                rounded-2xl
                bg-white
                dark:bg-[#151a27]
                border
                border-gray-200
                dark:border-white/10
                p-5
                hover:scale-[1.02]
                transition
              "
            >
              <div className="text-2xl">
                👤
              </div>

              <p className="mt-3 font-bold">
                My Profile
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Manage your details
              </p>
            </Link>
          </div>
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
            active
          />

          <BottomNavLink
            href="/delivery/orders"
            icon="📦"
            label="Deliveries"
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

/* ================= STAT CARD ================= */

function StatCard({ icon, label, value }) {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      className="
        rounded-2xl
        bg-white
        dark:bg-[#151a27]
        border
        border-gray-200
        dark:border-white/10
        p-4
        shadow-sm
      "
    >
      <div className="text-xl">
        {icon}
      </div>

      <p
        className="
          mt-3
          text-2xl
          font-black
        "
      >
        {value}
      </p>

      <p
        className="
          mt-1
          text-xs
          text-gray-500
          dark:text-gray-400
        "
      >
        {label}
      </p>
    </motion.div>
  );
}

/* ================= STAT SKELETON ================= */

function StatSkeleton() {
  return (
    <div
      className="
        rounded-2xl
        bg-white
        dark:bg-[#151a27]
        border
        border-gray-200
        dark:border-white/10
        p-4
        shadow-sm
        animate-pulse
      "
    >
      <div className="w-6 h-6 rounded bg-gray-200 dark:bg-white/10" />

      <div className="mt-3 w-12 h-7 rounded bg-gray-200 dark:bg-white/10" />

      <div className="mt-2 w-20 h-3 rounded bg-gray-200 dark:bg-white/10" />
    </div>
  );
}

/* ================= ACTIVE DELIVERY SKELETON ================= */

function ActiveDeliverySkeleton() {
  return (
    <div
      className="
        mt-4
        rounded-3xl
        bg-white
        dark:bg-[#151a27]
        border
        border-gray-200
        dark:border-white/10
        p-5
        shadow-sm
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
          <div className="w-28 h-4 rounded bg-gray-200 dark:bg-white/10" />
          <div className="mt-2 w-20 h-3 rounded bg-gray-200 dark:bg-white/10" />
        </div>
      </div>

      <div className="mt-4 h-20 rounded-2xl bg-gray-100 dark:bg-white/5" />

      <div className="mt-4 flex justify-between">
        <div>
          <div className="w-14 h-3 rounded bg-gray-200 dark:bg-white/10" />
          <div className="mt-2 w-24 h-4 rounded bg-gray-200 dark:bg-white/10" />
        </div>

        <div>
          <div className="w-14 h-3 rounded bg-gray-200 dark:bg-white/10" />
          <div className="mt-2 w-20 h-5 rounded bg-gray-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}

/* ================= ORDER ID ================= */

function getShortOrderId(id) {
  if (!id) return "N/A";

  return id.toString().slice(-6).toUpperCase();
}

/* ================= GOOGLE MAPS ================= */

function getGoogleMapsUrl(order) {
  const location = order?.deliveryAddress?.location;

  if (!location?.lat || !location?.lng) {
    return "#";
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
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