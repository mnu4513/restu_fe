import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { BackendAPI } from "@/utils/api";
import CartItem from "@/components/CartItem";

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState({ label: "", addressLine: "", city: "", state: "", pincode: "" });
  const [addingNew, setAddingNew] = useState(false);

  const API = BackendAPI || "";  // "" means relative

  // ✅ Fetch addresses
  useEffect(() => {
    if (user) {
      axios.get(`${API}/api/addresses`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setAddresses(Array.isArray(res.data) ? res.data : []);
        const def = res.data.find((a) => a.isDefault);
        if (def) setSelectedAddress(def._id);
      })
      .catch(() => toast.error("Failed to load addresses"));
    }
  }, [user]);

  const total = cart.reduce(
    (sum, i) =>
      sum + (i.price - (i.price * (i.discount || 0)) / 100) * (i.quantity || 1),
    0
  );

  // ✅ Add new address inline
  const saveNewAddress = async () => {
    try {
      const { data } = await axios.post(
        `${API}/api/addresses`,
        newAddress,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("New address added!");
      setAddresses([...addresses, data]);
      setSelectedAddress(data._id);
      setNewAddress({ label: "", addressLine: "", city: "", state: "", pincode: "" });
      setAddingNew(false);
    } catch {
      toast.error("Failed to save address");
    }
  };

  // ✅ Checkout with Razorpay
  const checkout = async () => {
    if (!user) {
      toast.error("Please login first!");
      return;
    }
    if (!selectedAddress) {
      toast.error("Please select a delivery address!");
      return;
    }

    try {
      const { data: orderData } = await axios.post(
        `${API}/api/payment/create-order`,
        { amount: total * 100 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "MyRestaurant",
        description: "Food Order Payment",
        order_id: orderData.id,
        handler: async function (response) {
  try {
    await axios.post(
      `${API}/api/payment/verify`,
      {
        ...response,                // payment_id, order_id, signature
        items: cart,                // cart items
        addressId: selectedAddress, // delivery address
      },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    toast.success("Payment successful! 🎉 Order placed");
    clearCart();
    router.push("/orders");
  } catch (err) {
    console.error(err.response?.data || err.message);
    toast.error("Payment verification failed");
  }
},
        prefill: { name: user.name, email: user.email },
        theme: { color: "#10b981" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => toast.error("Payment failed, try again"));
      rzp.open();
    } catch {
      toast.error("Error starting payment");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      {/* ✅ Address Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Delivery Address</h3>

        {addresses.length > 0 && (
          <select
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          >
            <option value="">-- Select Address --</option>
            {addresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {addr.label}: {addr.addressLine}, {addr.city}
              </option>
            ))}
          </select>
        )}

        {!addingNew ? (
          <button
            onClick={() => setAddingNew(true)}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            + Add New Address
          </button>
        ) : (
          <div className="border p-4 rounded mt-3">
            <input
              className="border w-full mb-2 p-2"
              placeholder="Label (Home, Work)"
              value={newAddress.label}
              onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
            />
            <input
              className="border w-full mb-2 p-2"
              placeholder="Address Line"
              value={newAddress.addressLine}
              onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
            />
            <input
              className="border w-full mb-2 p-2"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            />
            <input
              className="border w-full mb-2 p-2"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
            />
            <input
              className="border w-full mb-2 p-2"
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
            />
            <div className="flex gap-2">
              <button
                onClick={saveNewAddress}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save Address
              </button>
              <button
                onClick={() => setAddingNew(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Cart Section */}
{cart.length === 0 ? (
  <p>Your cart is empty 🛒</p>
) : (
  <div>
    {cart.map((item) => (
      <CartItem key={item._id} item={item} />
    ))}

    <h3 className="text-xl font-bold mt-6">Total: ₹{total}</h3>

    {/* Checkout button */}
    <button
      onClick={checkout}
      disabled={cart.length === 0 || isNaN(total)}
      className={`mt-4 px-4 py-2 rounded-lg text-white ${
        cart.length === 0 || isNaN(total)
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >
      Pay & Checkout
    </button>
  </div>
)}
    </div>
  );
}
