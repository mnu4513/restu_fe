"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { motion } from "framer-motion";
import api from "@/utils/axios";

export default function DeliveryOrderDetails() {
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);

  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

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
   * FETCH ORDER
   * ============================
   */

  const fetchOrder = useCallback(async () => {
    if (!user || user.role !== "delivery" || !id) {
      return;
    }

    try {
      setOrderLoading(true);
      setError("");

      const { data } = await api.get(
        `/api/delivery/orders/${id}`
      );

      if (!data?.success) {
        throw new Error(
          data?.message || "Failed to load order"
        );
      }

      setOrder(data.order);
    } catch (err) {
      console.error("Delivery order error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load order"
      );
    } finally {
      setOrderLoading(false);
    }
  }, [user, id]);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "delivery") return;
    if (!router.isReady) return;

    fetchOrder();
  }, [
    loading,
    user,
    router.isReady,
    fetchOrder,
  ]);

  /*
   * ============================
   * SOCKET UPDATE
   * ============================
   */

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "delivery") return;
    if (!router.isReady || !id) return;

    const socket = window.__APP_SOCKET__;

    if (!socket) return;

    const userId = user._id || user.id;

    if (userId) {
      socket.emit("joinRoom", userId);
    }

    const handleOrderUpdate = (updatedOrder) => {
      if (
        updatedOrder?._id?.toString() ===
        id?.toString()
      ) {
        setOrder(updatedOrder);
      } else {
        fetchOrder();
      }
    };

    socket.on("orderUpdated", handleOrderUpdate);

    return () => {
      socket.off(
        "orderUpdated",
        handleOrderUpdate
      );
    };
  }, [
    loading,
    user,
    router.isReady,
    id,
    fetchOrder,
  ]);

  /*
   * ============================
   * ACCEPT DELIVERY
   * ============================
   */

  const handleAccept = async () => {
    if (!order || actionLoading) return;

    try {
      setActionLoading(true);
      setError("");

      const { data } = await api.put(
        `/api/delivery/orders/${order._id}/accept`
      );

      if (!data?.success) {
        throw new Error(
          data?.message || "Failed to accept delivery"
        );
      }

      setOrder(data.order);
    } catch (err) {
      console.error("Accept delivery error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to accept delivery"
      );
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * ============================
   * REJECT DELIVERY
   * ============================
   */

  const handleReject = async () => {
    if (!order || actionLoading) return;

    const confirmed = window.confirm(
      "Are you sure you want to reject this delivery?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      const { data } = await api.put(
        `/api/delivery/orders/${order._id}/reject`
      );

      if (!data?.success) {
        throw new Error(
          data?.message || "Failed to reject delivery"
        );
      }

      setOrder(data.order);
    } catch (err) {
      console.error("Reject delivery error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reject delivery"
      );
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * ============================
   * UPDATE DELIVERY STATUS
   * ============================
   */

  const handleStatusUpdate = async (status) => {
    if (!order || actionLoading) return;

    try {
      setActionLoading(true);
      setError("");

      const { data } = await api.put(
        `/api/delivery/orders/${order._id}/status`,
        {
          status,
        }
      );

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to update delivery status"
        );
      }

      setOrder(data.order);
    } catch (err) {
      console.error(
        "Delivery status update error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update delivery status"
      );
    } finally {
      setActionLoading(false);
    }
  };

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
          flex
          items-center
          justify-center
          bg-gray-50
          dark:bg-[#0b0f19]
          px-5
        "
      >
        <div
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
          <div className="text-5xl">
            🚫
          </div>

          <h2 className="mt-5 text-xl font-bold">
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
            "
          >
            Taking you back...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ============================
   * ORDER LOADING
   * ============================
   */

  if (orderLoading) {
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
        <header className="border-b border-gray-200 dark:border-white/10">
          <div
            className="
              max-w-4xl
              mx-auto
              px-4
              h-16
              flex
              items-center
            "
          >
            <Link
              href="/delivery/orders"
              className="
                w-9
                h-9
                rounded-xl
                bg-gray-100
                dark:bg-white/10
                flex
                items-center
                justify-center
              "
            >
              ←
            </Link>

            <div
              className="
                ml-3
                w-32
                h-5
                rounded
                bg-gray-200
                dark:bg-white/10
                animate-pulse
              "
            />
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <OrderDetailsSkeleton />
        </div>
      </div>
    );
  }

  /*
   * ============================
   * ORDER ERROR
   * ============================
   */

  if (error && !order) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-gray-50
          dark:bg-[#0b0f19]
          px-5
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            bg-white
            dark:bg-[#151a27]
            border
            border-gray-200
            dark:border-white/10
            p-7
            text-center
            shadow-sm
          "
        >
          <div className="text-5xl">
            ⚠️
          </div>

          <h2 className="mt-5 text-xl font-bold">
            Unable to Load Order
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-gray-600
              dark:text-gray-400
            "
          >
            {error}
          </p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={fetchOrder}
              className="
                flex-1
                px-4
                py-3
                rounded-2xl
                bg-gradient-to-r
                from-orange-500
                to-green-500
                text-white
                text-sm
                font-semibold
              "
            >
              Try Again
            </button>

            <Link
              href="/delivery/orders"
              className="
                flex-1
                flex
                items-center
                justify-center
                px-4
                py-3
                rounded-2xl
                bg-gray-100
                dark:bg-white/10
                text-sm
                font-semibold
              "
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ============================
   * ORDER NOT FOUND
   * ============================
   */

  if (!order) {
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
          <div className="text-5xl">
            📦
          </div>

          <h2 className="mt-4 text-xl font-bold">
            Order Not Found
          </h2>

          <Link
            href="/delivery/orders"
            className="
              inline-flex
              mt-5
              px-5
              py-3
              rounded-2xl
              bg-gradient-to-r
              from-orange-500
              to-green-500
              text-white
              text-sm
              font-semibold
            "
          >
            Back to Deliveries
          </Link>
        </div>
      </div>
    );
  }

  /*
   * ============================
   * DERIVED DATA
   * ============================
   */

  const status = order.deliveryStatus || "Unknown";

  const statusStyle = getStatusStyle(status);

  const customerName =
    order.user?.name || "Customer";

  const customerPhone =
    order.user?.phone || "";

  const customerEmail =
    order.user?.email || "";

  const address = getAddress(order);

  const totalQuantity = getTotalQuantity(order);

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
            max-w-4xl
            mx-auto
            px-4
            sm:px-6
            h-16
            flex
            items-center
            justify-between
          "
        >
          <div className="flex items-center gap-3">
            <Link
              href="/delivery/orders"
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
              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Delivery
              </p>

              <h1 className="font-black">
                Order #{getShortOrderId(order._id)}
              </h1>
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
              {user.name?.charAt(0).toUpperCase() ||
                "D"}
            </div>
          </Link>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main
        className="
          max-w-4xl
          mx-auto
          px-4
          sm:px-6
          py-6
          pb-28
        "
      >
        {/* ================= ORDER STATUS ================= */}

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
          <div className="flex items-center justify-between gap-4">
            <div>
              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Delivery Status
              </p>

              <h2 className="mt-1 text-xl font-black">
                {status}
              </h2>
            </div>

            <span
              className={`
                px-4
                py-2
                rounded-full
                text-xs
                font-bold
                ${statusStyle.bg}
                ${statusStyle.text}
              `}
            >
              {status}
            </span>
          </div>

          {/* STATUS PROGRESS */}

          <StatusProgress status={status} />
        </motion.div>

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
          </motion.div>
        )}

        {/* ================= ACTIONS ================= */}

        <DeliveryActions
          status={status}
          actionLoading={actionLoading}
          onAccept={handleAccept}
          onReject={handleReject}
          onStatusUpdate={handleStatusUpdate}
        />

        {/* ================= CUSTOMER ================= */}

        <section className="mt-6">
          <SectionTitle title="Customer" />

          <div
            className="
              mt-3
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
            <div className="flex items-start gap-4">
              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-gray-100
                  dark:bg-white/5
                  flex
                  items-center
                  justify-center
                  text-xl
                  shrink-0
                "
              >
                👤
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-lg">
                  {customerName}
                </h3>

                {customerPhone && (
                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    📞 {customerPhone}
                  </p>
                )}

                {customerEmail && (
                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                      break-all
                    "
                  >
                    ✉️ {customerEmail}
                  </p>
                )}
              </div>
            </div>

            {customerPhone && (
              <a
                href={`tel:${customerPhone}`}
                className="
                  mt-5
                  w-full
                  flex
                  items-center
                  justify-center
                  px-4
                  py-3
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
                📞 Call Customer
              </a>
            )}
          </div>
        </section>

        {/* ================= ADDRESS ================= */}

        <section className="mt-6">
          <SectionTitle title="Delivery Address" />

          <div
            className="
              mt-3
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
            <div className="flex items-start gap-3">
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-orange-100
                  dark:bg-orange-500/10
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                📍
              </div>

              <div>
                {order.deliveryAddress?.label && (
                  <p className="font-bold">
                    {order.deliveryAddress.label}
                  </p>
                )}

                <p
                  className="
                    mt-1
                    text-sm
                    leading-6
                    text-gray-600
                    dark:text-gray-300
                  "
                >
                  {address}
                </p>
              </div>
            </div>

            {hasCoordinates(order) && (
              <a
                href={getGoogleMapsUrl(order)}
                target="_blank"
                rel="noopener noreferrer"
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
                🧭 Open Navigation
              </a>
            )}
          </div>
        </section>

        {/* ================= ITEMS ================= */}

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <SectionTitle title="Order Items" />

            <span
              className="
                text-xs
                font-semibold
                text-gray-500
                dark:text-gray-400
              "
            >
              {totalQuantity} item
              {totalQuantity !== 1 ? "s" : ""}
            </span>
          </div>

          <div
            className="
              mt-3
              rounded-3xl
              bg-white
              dark:bg-[#151a27]
              border
              border-gray-200
              dark:border-white/10
              overflow-hidden
              shadow-sm
            "
          >
            {Array.isArray(order.items) &&
            order.items.length > 0 ? (
              order.items.map((item, index) => (
                <OrderItem
                  key={`${item.menuItem?._id || index}-${index}`}
                  item={item}
                  isLast={
                    index ===
                    order.items.length - 1
                  }
                />
              ))
            ) : (
              <div className="p-5 text-sm text-gray-500">
                No item information available.
              </div>
            )}
          </div>
        </section>

        {/* ================= PAYMENT ================= */}

        <section className="mt-6">
          <SectionTitle title="Payment" />

          <div
            className="
              mt-3
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
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Payment Method
                </p>

                <p className="mt-1 font-semibold">
                  {getPaymentMethod(order)}
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
                  Total
                </p>

                <p className="mt-1 text-xl font-black">
                  ₹
                  {Number(
                    order.totalPrice || 0
                  ).toFixed(2)}
                </p>
              </div>
            </div>

            {order.paymentInfo?.status && (
              <div
                className="
                  mt-4
                  pt-4
                  border-t
                  border-gray-100
                  dark:border-white/10
                  flex
                  items-center
                  justify-between
                "
              >
                <span
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Payment Status
                </span>

                <span
                  className="
                    text-sm
                    font-semibold
                    text-green-600
                    dark:text-green-400
                  "
                >
                  {order.paymentInfo.status}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* ================= ORDER INFO ================= */}

        <section className="mt-6">
          <SectionTitle title="Order Information" />

          <div
            className="
              mt-3
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
            <InfoRow
              label="Order ID"
              value={order._id}
            />

            <InfoRow
              label="Order Status"
              value={order.status || "Unknown"}
            />

            <InfoRow
              label="Delivery Status"
              value={status}
            />

            <InfoRow
              label="Created"
              value={formatDate(order.createdAt)}
              last
            />
          </div>
        </section>
      </main>

      {/* ================= MOBILE NAV ================= */}

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

/* ================= ACTIONS ================= */

function DeliveryActions({
  status,
  actionLoading,
  onAccept,
  onReject,
  onStatusUpdate,
}) {
  if (status === "Assigned") {
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
          mt-6
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
        <p
          className="
            text-sm
            font-semibold
          "
        >
          New delivery assigned
        </p>

        <p
          className="
            mt-1
            text-xs
            text-gray-500
            dark:text-gray-400
          "
        >
          Accept the delivery to start the delivery process.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={actionLoading}
            onClick={onReject}
            className="
              px-4
              py-3
              rounded-2xl
              bg-red-50
              dark:bg-red-500/10
              text-red-600
              dark:text-red-400
              text-sm
              font-semibold
              disabled:opacity-50
              transition
            "
          >
            {actionLoading
              ? "Please wait..."
              : "Reject"}
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={onAccept}
            className="
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
              disabled:opacity-50
              transition
            "
          >
            {actionLoading
              ? "Please wait..."
              : "Accept Delivery"}
          </button>
        </div>
      </motion.div>
    );
  }

  if (status === "Accepted") {
    return (
      <ActionButton
        label="🛵 Mark as Picked Up"
        loadingLabel="Updating..."
        loading={actionLoading}
        onClick={() =>
          onStatusUpdate("Picked Up")
        }
      />
    );
  }

  if (status === "Picked Up") {
    return (
      <ActionButton
        label="🚴 Start Delivery"
        loadingLabel="Updating..."
        loading={actionLoading}
        onClick={() =>
          onStatusUpdate("Out for Delivery")
        }
      />
    );
  }

  if (status === "Out for Delivery") {
    return (
      <ActionButton
        label="✅ Mark as Delivered"
        loadingLabel="Updating..."
        loading={actionLoading}
        onClick={() =>
          onStatusUpdate("Delivered")
        }
      />
    );
  }

  if (status === "Delivered") {
    return (
      <div
        className="
          mt-6
          rounded-3xl
          bg-green-50
          dark:bg-green-500/10
          border
          border-green-200
          dark:border-green-500/20
          p-5
          text-center
        "
      >
        <div className="text-3xl">
          🎉
        </div>

        <p
          className="
            mt-2
            font-bold
            text-green-700
            dark:text-green-400
          "
        >
          Delivery Completed
        </p>

        <p
          className="
            mt-1
            text-xs
            text-green-600
            dark:text-green-500
          "
        >
          This order has been successfully delivered.
        </p>
      </div>
    );
  }

  if (status === "Rejected") {
    return (
      <div
        className="
          mt-6
          rounded-3xl
          bg-red-50
          dark:bg-red-500/10
          border
          border-red-200
          dark:border-red-500/20
          p-5
          text-center
        "
      >
        <div className="text-3xl">
          ❌
        </div>

        <p
          className="
            mt-2
            font-bold
            text-red-700
            dark:text-red-400
          "
        >
          Delivery Rejected
        </p>

        <p
          className="
            mt-1
            text-xs
            text-red-600
            dark:text-red-500
          "
        >
          This delivery has been rejected.
        </p>
      </div>
    );
  }

  return null;
}

/* ================= ACTION BUTTON ================= */

function ActionButton({
  label,
  loadingLabel,
  loading,
  onClick,
}) {
  return (
    <div className="mt-6">
      <button
        type="button"
        disabled={loading}
        onClick={onClick}
        className="
          w-full
          px-5
          py-4
          rounded-2xl
          bg-gradient-to-r
          from-orange-500
          to-green-500
          text-white
          font-bold
          shadow-lg
          shadow-orange-500/20
          hover:scale-[1.01]
          disabled:opacity-50
          disabled:hover:scale-100
          transition
        "
      >
        {loading ? loadingLabel : label}
      </button>
    </div>
  );
}

/* ================= STATUS PROGRESS ================= */

function StatusProgress({ status }) {
  const steps = [
    "Accepted",
    "Picked Up",
    "Out for Delivery",
    "Delivered",
  ];

  const currentIndex = steps.indexOf(status);

  return (
    <div className="mt-6">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const completed =
            currentIndex >= index;

          const isCurrent =
            currentIndex === index;

          return (
            <div
              key={step}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8
                    h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    text-xs
                    font-bold
                    ${
                      completed
                        ? "bg-gradient-to-r from-orange-500 to-green-500 text-white"
                        : "bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500"
                    }
                    ${
                      isCurrent
                        ? "ring-4 ring-orange-500/10"
                        : ""
                    }
                  `}
                >
                  {completed
                    ? "✓"
                    : index + 1}
                </div>

                <span
                  className="
                    mt-2
                    text-[10px]
                    sm:text-xs
                    text-center
                    text-gray-500
                    dark:text-gray-400
                    max-w-[70px]
                  "
                >
                  {step}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                    h-1
                    flex-1
                    mx-1
                    sm:mx-2
                    rounded-full
                    ${
                      currentIndex > index
                        ? "bg-gradient-to-r from-orange-500 to-green-500"
                        : "bg-gray-200 dark:bg-white/10"
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= ORDER ITEM ================= */

function OrderItem({ item, isLast }) {
  const product = item?.menuItem;

  const name =
    product?.name || "Menu Item";

  const thumbnail =
    product?.thumbnail || "";

  const quantity =
    Number(item?.quantity || 0);

  const price =
    Number(
      product?.finalPrice ??
        product?.price ??
        0
    );

  return (
    <div
      className={`
        p-4
        sm:p-5
        flex
        items-center
        gap-4
        ${
          !isLast
            ? "border-b border-gray-100 dark:border-white/10"
            : ""
        }
      `}
    >
      <div
        className="
          w-16
          h-16
          rounded-2xl
          overflow-hidden
          bg-gray-100
          dark:bg-white/5
          shrink-0
        "
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={name}
            className="
              w-full
              h-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              w-full
              h-full
              flex
              items-center
              justify-center
              text-xl
            "
          >
            🍽️
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="
            font-semibold
            truncate
          "
        >
          {name}
        </p>

        <p
          className="
            mt-1
            text-xs
            text-gray-500
            dark:text-gray-400
          "
        >
          ₹{price.toFixed(2)} × {quantity}
        </p>
      </div>

      <div className="text-right">
        <p className="font-bold">
          ₹{(price * quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}

/* ================= SECTION TITLE ================= */

function SectionTitle({ title }) {
  return (
    <h2 className="text-lg font-bold">
      {title}
    </h2>
  );
}

/* ================= INFO ROW ================= */

function InfoRow({
  label,
  value,
  last = false,
}) {
  return (
    <div
      className={`
        flex
        items-start
        justify-between
        gap-4
        py-3
        ${
          !last
            ? "border-b border-gray-100 dark:border-white/10"
            : ""
        }
      `}
    >
      <span
        className="
          text-sm
          text-gray-500
          dark:text-gray-400
        "
      >
        {label}
      </span>

      <span
        className="
          text-sm
          font-semibold
          text-right
          break-all
        "
      >
        {value}
      </span>
    </div>
  );
}

/* ================= ADDRESS ================= */

function getAddress(order) {
  if (!order?.deliveryAddress) {
    return "Delivery address not available";
  }

  const address =
    order.deliveryAddress;

  return [
    address.addressLine,
    address.city,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}

/* ================= COORDINATES ================= */

function hasCoordinates(order) {
  const location =
    order?.deliveryAddress?.location;

  return (
    location &&
    typeof location.lat === "number" &&
    typeof location.lng === "number"
  );
}

/* ================= GOOGLE MAPS ================= */

function getGoogleMapsUrl(order) {
  const location =
    order?.deliveryAddress?.location;

  if (!location) {
    return "#";
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
}

/* ================= PAYMENT ================= */

function getPaymentMethod(order) {
  if (
    order?.paymentInfo?.paymentId ||
    order?.paymentInfo?.status === "Paid"
  ) {
    return "Online Payment";
  }

  return "Cash on Delivery";
}

/* ================= QUANTITY ================= */

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

/* ================= SHORT ORDER ID ================= */

function getShortOrderId(id) {
  if (!id) return "N/A";

  return id.toString().slice(-6).toUpperCase();
}

/* ================= DATE ================= */

function formatDate(date) {
  if (!date) return "N/A";

  try {
    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  } catch {
    return "N/A";
  }
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

/* ================= SKELETON ================= */

function OrderDetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div
        className="
          rounded-3xl
          bg-white
          dark:bg-[#151a27]
          p-6
        "
      >
        <div className="w-24 h-4 rounded bg-gray-200 dark:bg-white/10" />

        <div className="mt-3 w-40 h-7 rounded bg-gray-200 dark:bg-white/10" />

        <div className="mt-6 h-3 rounded bg-gray-200 dark:bg-white/10" />
      </div>

      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="
            rounded-3xl
            bg-white
            dark:bg-[#151a27]
            p-6
          "
        >
          <div className="w-32 h-5 rounded bg-gray-200 dark:bg-white/10" />

          <div className="mt-5 h-16 rounded-2xl bg-gray-100 dark:bg-white/5" />
        </div>
      ))}
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