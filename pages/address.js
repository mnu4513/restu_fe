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
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;

    api
      .get(`${API}/api/addresses`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setAddresses(res.data || []))
      .catch(() => toast.error("Failed to load addresses"));
  }, [user]);

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
    <main className="min-h-screen bg-white dark:bg-[#0b0f19] relative overflow-hidden">
      
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-orange-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-80 h-80 bg-green-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">

        {/* TITLE */}
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-8">
          🏠 My Addresses
        </h2>

        {/* FORM */}
        <AddressForm
          form={form}
          setForm={setForm}
          editingId={editingId}
          onSave={saveAddress}
          onCancel={resetForm}
        />

        {/* LIST */}
        <div className="space-y-4 mt-8">
          {addresses.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              No addresses saved yet
            </div>
          ) : (
            addresses.map((a) => (
              <div
                key={a._id}
                className="
                  group
                  rounded-3xl
                  border border-gray-200 dark:border-white/10
                  bg-white/70 dark:bg-white/[0.03]
                  backdrop-blur-xl
                  p-5 md:p-6
                  flex flex-col md:flex-row md:items-center md:justify-between
                  gap-4
                  hover:shadow-xl
                  transition
                "
              >
                {/* LEFT */}
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {a.label}
                    </h3>

                    {a.isDefault && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500 text-white">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {a.addressLine}, {a.city}, {a.state} - {a.pincode}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => startEdit(a)}
                    className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteAddress(a._id)}
                    className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Delete
                  </button>

                  {!a.isDefault && (
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
                      className="px-4 py-2 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 transition"
                    >
                      Set Default
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}