import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/utils/axios";
import toast from "react-hot-toast";
import { BackendAPI } from "@/utils/api";
import { useRouter } from "next/router";
import AddressForm from "@/components/address/AddressForm";

export default function AddressPage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    label: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [editingId, setEditingId] = useState(null);

  const API = BackendAPI || "";

  // ✅ AUTH GUARD
  useEffect(() => {
    if (loading) return;

    if (!user) {
      toast.error("Please login first");
      router.replace("/login");
      return;
    }

    if (user.role === "admin") {
      toast.error("Admin doesn't need address");
      router.replace("/admin");
    }
  }, [user, loading, router]);

  // ✅ LOAD ADDRESSES
  useEffect(() => {
    if (!user) return;

    api
      .get(`${API}/api/addresses`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setAddresses(res.data || []))
      .catch(() => toast.error("Failed to load addresses"));
  }, [user]);

  // ✅ SAVE ADDRESS
  const saveAddress = async () => {
    try {
      if (editingId) {
        const { data } = await api.put(
          `${API}/api/addresses/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        setAddresses(addresses.map((a) => (a._id === editingId ? data : a)));
        toast.success("Address updated");
      } else {
        const { data } = await api.post(`${API}/api/addresses`, form, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setAddresses([...addresses, data]);
        toast.success("Address added");
      }

      resetForm();
    } catch {
      toast.error("Failed to save address");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      label: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
    });
  };

  const startEdit = (addr) => {
    setForm(addr);
    setEditingId(addr._id);
  };

  const deleteAddress = async (id) => {
    try {
      await api.delete(`${API}/api/addresses/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAddresses(addresses.filter((a) => a._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Addresses</h2>

      <AddressForm
        form={form}
        setForm={setForm}
        editingId={editingId}
        onSave={saveAddress}
        onCancel={resetForm}
      />

      {addresses.length === 0 ? (
        <p>No addresses saved yet</p>
      ) : (
        addresses.map((a) => (
          <div
            key={a._id}
            className="border p-4 rounded mb-3 flex justify-between items-center"
          >
            <div>
              <strong>{a.label}</strong>
              <p>
                {a.addressLine}, {a.city}, {a.state} - {a.pincode}
              </p>
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

              {a.isDefault ? (
                <span className="px-3 py-1 bg-green-600 text-white rounded">
                  Default
                </span>
              ) : (
                <button
                  onClick={async () => {
                    const { data } = await api.put(
                      `${API}/api/addresses/${a._id}/default`,
                      {},
                      { headers: { Authorization: `Bearer ${user.token}` } }
                    );

                    setAddresses(
                      addresses.map((addr) => ({
                        ...addr,
                        isDefault: addr._id === data._id,
                      }))
                    );
                    toast.success("Default updated");
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Set Default
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
