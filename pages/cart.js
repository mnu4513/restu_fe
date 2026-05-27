import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";
import api from "@/utils/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { BackendAPI } from "@/utils/api";
import CartItem from "@/components/CartItem";

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart } = useContext(CartContext);
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState({
    label: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [addingNew, setAddingNew] = useState(false);

  const API = BackendAPI || "";

  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast.error("Please login first");
      router.replace("/login");
      return;
    }

    if (user.role === "admin") {
      toast.error("Admin can't place order");
      router.replace("/admin");
    }

    api
      .get(`${API}/api/addresses`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setAddresses(res.data || []);
        const def = res.data?.find((a) => a.isDefault);
        if (def) setSelectedAddress(def._id);
      })
      .catch(() => toast.error("Failed to load addresses"));
  }, [user, loading]);

  const total = Number(
    cart
      .reduce(
        (sum, i) =>
          sum +
          (i.price - (i.price * (i.discount || 0)) / 100) *
            (i.quantity || 1),
        0
      )
      .toFixed(2)
  );

  const saveNewAddress = async () => {
    try {
      const { data } = await api.post(
        `${API}/api/addresses`,
        newAddress,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      toast.success("Address added");
      setAddresses([...addresses, data]);
      setSelectedAddress(data._id);
      setNewAddress({
        label: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
      });
      setAddingNew(false);
    } catch {
      toast.error("Failed to save address");
    }
  };

  const checkout = async () => {
    if (!selectedAddress) return toast.error("Select address first");

    try {
      const { data: orderData } = await api.post(
        `${API}/api/payment/create-order`,
        { amount: total * 100 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "MyRestaurant",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            await api.post(
              `${API}/api/payment/verify`,
              {
                ...response,
                items: cart,
                addressId: selectedAddress,
              },
              { headers: { Authorization: `Bearer ${user.token}` } }
            );

            toast.success("Order placed 🎉");
            clearCart();
            router.push("/orders");
          } catch {
            toast.error("Payment verification failed");
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#10b981" },
      };

      new window.Razorpay(options).open();
    } catch {
      toast.error("Payment init failed");
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0b0f19] relative overflow-hidden">
      
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-orange-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-80 h-80 bg-green-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">

        {/* HEADER */}
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-8">
          🛒 Checkout
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT: CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-gray-500 dark:text-gray-400">
                Your cart is empty 🛒
              </div>
            ) : (
              cart.map((item) => (
                <CartItem key={item._id} item={item} />
              ))
            )}
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="space-y-6">

            {/* ADDRESS BOX */}
            <div className="p-5 rounded-3xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                📍 Delivery Address
              </h3>

              {addresses.length > 0 && (
                <select
                  className="w-full p-3 rounded-2xl border dark:border-white/10 bg-white dark:bg-white/[0.02]"
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                >
                  <option value="">Select address</option>
                  {addresses.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.label} - {a.city}
                    </option>
                  ))}
                </select>
              )}

              {!addingNew ? (
                <button
                  onClick={() => setAddingNew(true)}
                  className="mt-3 w-full py-2 rounded-2xl bg-blue-500 text-white"
                >
                  + Add New Address
                </button>
              ) : (
                <div className="mt-3 space-y-2">
                  {["label", "addressLine", "city", "state", "pincode"].map(
                    (field) => (
                      <input
                        key={field}
                        placeholder={field}
                        value={newAddress[field]}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            [field]: e.target.value,
                          })
                        }
                        className="w-full p-2 rounded-xl border dark:border-white/10"
                      />
                    )
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={saveNewAddress}
                      className="flex-1 bg-green-600 text-white py-2 rounded-xl"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setAddingNew(false)}
                      className="flex-1 bg-gray-400 text-white py-2 rounded-xl"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* BILL */}
            <div className="p-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Bill Summary
              </h3>

              <div className="flex justify-between mt-4 text-gray-600 dark:text-gray-300">
                <span>Total</span>
                <span className="font-bold text-green-600">₹{total}</span>
              </div>

              <button
                onClick={checkout}
                disabled={!cart.length || !selectedAddress}
                className="mt-5 w-full py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-orange-500 disabled:opacity-50"
              >
                Pay & Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}