import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { BackendAPI } from "@/utils/api";
import { useRouter } from "next/router";


export default function AddressPage() {
  const { user } = useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ label: "", addressLine: "", city: "", state: "", pincode: "" });
  const [editingId, setEditingId] = useState(null); // 👈 for editing mode
  const router = useRouter();

  const API = BackendAPI || "";  // "" means relative

  // ✅ Load addresses
  useEffect(() => {
      if (user?.role === "admin") {
    toast.error("Admin doesn't need to save address");
    router.replace("/admin");
  }
  
    if (user) {
      axios
        .get(`${API}/api/addresses`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setAddresses(Array.isArray(res.data) ? res.data : []))
        .catch(() => toast.error("Failed to load addresses"));
    }
  }, [user]);

  // ✅ Add or Update Address
  const saveAddress = async () => {
    try {
      if (editingId) {
        // Update existing
        const { data } = await axios.put(
          `${API}/api/addresses/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        toast.success("Address updated!");
        setAddresses(addresses.map((a) => (a._id === editingId ? data : a)));
      } else {
        // Add new
        const { data } = await axios.post(
          `${API}/api/addresses`,
          form,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        toast.success("Address added!");
        setAddresses([...addresses, data]);
      }
      setForm({ label: "", addressLine: "", city: "", state: "", pincode: "" });
      setEditingId(null);
    } catch {
      toast.error("Failed to save address");
    }
  };

  // ✅ Edit button handler
  const startEdit = (addr) => {
    setForm({
      label: addr.label,
      addressLine: addr.addressLine,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setEditingId(addr._id);
  };

  // ✅ Delete address
  const deleteAddress = async (id) => {
    try {
      await axios.delete(`${API}/api/addresses/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Address deleted!");
      setAddresses(addresses.filter((a) => a._id !== id));
    } catch {
      toast.error("Failed to delete address");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">My Addresses</h2>

      {/* Add/Edit Address Form */}
      <div className="border p-4 rounded mb-6">
        <input
          className="border w-full mb-2 p-2"
          placeholder="Label (Home, Work)"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
        <input
          className="border w-full mb-2 p-2"
          placeholder="Address Line"
          value={form.addressLine}
          onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
        />
        <input
          className="border w-full mb-2 p-2"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <input
          className="border w-full mb-2 p-2"
          placeholder="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />
        <input
          className="border w-full mb-2 p-2"
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) => setForm({ ...form, pincode: e.target.value })}
        />
        <button
          onClick={saveAddress}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Address" : "Save Address"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setForm({ label: "", addressLine: "", city: "", state: "", pincode: "" });
            }}
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* List addresses */}
      {Array.isArray(addresses) && addresses.length > 0 ? (
        addresses.map((a) => (
          <div key={a._id} className="border p-3 rounded mb-3 flex justify-between items-center">
            <div>
              <p><strong>{a.label}</strong></p>
              <p>{a.addressLine}, {a.city}, {a.state} - {a.pincode}</p>
            </div>
            <div className="flex gap-2">
  <button
    onClick={() => startEdit(a)}
    className="bg-blue-500 text-white px-3 py-1 rounded"
  >
    Edit
  </button>
  <button
    onClick={() => deleteAddress(a._id)}
    className="bg-red-500 text-white px-3 py-1 rounded"
  >
    Delete
  </button>
  {!a.isDefault && (
    <button
      onClick={async () => {
        try {
          const { data } = await axios.put(
            `${API}/api/addresses/${a._id}/default`,
            {},
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          toast.success("Default address updated!");
          setAddresses(addresses.map((addr) => ({
            ...addr,
            isDefault: addr._id === data._id
          })));
        } catch {
          toast.error("Failed to set default");
        }
      }}
      className="bg-yellow-500 text-white px-3 py-1 rounded"
    >
      Set as Default
    </button>
  )}
  {a.isDefault && (
    <span className="px-3 py-1 bg-green-600 text-white rounded">
      Default
    </span>
  )}
</div>

          </div>
        ))
      ) : (
        <p>No addresses saved yet</p>
      )}
    </div>
  );
}
