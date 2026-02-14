// pages/admin/menu.js
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import api from "@/utils/axios";
import { AuthContext } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { BackendAPI } from "@/utils/api";
import AdminItemCard from "@/components/admin/AdminItemCard";
import ImageUploader from "@/components/admin/ImageUploader";
import MenuForm from "./MenuForm";

export default function AdminMenu() {
  const router = useRouter();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = BackendAPI || "";

 const [form, setForm] = useState({
  _id: "",
  name: "",
  description: "",
  thumbnail: "",
  images: [],
  price: "",
  discount: 0,
  category: "other",
});


  // Redirect if not admin (note authLoading included in deps)
  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") {
      router.replace("/login");
      setLoading(false);
    }
  }, [user, authLoading, router]);

  // Fetch menu items
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    let mounted = true;
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`${API}/api/menu`);
        if (mounted) setMenu(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch menu error:", err);
        toast.error("Failed to load menu");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMenu();
    return () => {
      mounted = false;
    };
  }, [user, API]);

  // Improved Save (create/update) with validation + better error logging
  const saveMenuItem = async () => {
    if (!user || user.role !== "admin") {
      toast.error("Not authorized");
      return;
    }

    // Basic validation
    if (!form.name || !String(form.name).trim()) {
      toast.error("Name is required");
      return;
    }

    // Normalize payload
    const payload = {
      ...form,
      name: String(form.name).trim(),
      description: form.description ? String(form.description).trim() : "",
      thumbnail: form.thumbnail || "",
      images: Array.isArray(form.images) ? form.images : [],
      category: form.category ? String(form.category) : "other",
      price: form.price === "" || form.price === null ? null : Number(form.price),
      discount:
        form.discount === "" || form.discount === null ? 0 : Number(form.discount),
    };

    if (payload.price !== null && Number.isNaN(payload.price)) {
      toast.error("Price must be a number");
      return;
    }
    if (Number.isNaN(payload.discount)) {
      toast.error("Discount must be a number");
      return;
    }

    const endpointBase = `${API}/api/menu`;
    console.log("saveMenuItem -> endpoint:", endpointBase, "payload:", payload);

    try {
      if (payload._id) {
        // Update
        const { data } = await api.put(`${endpointBase}/${payload._id}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        // backend expected to return the updated item
        setMenu((prev) => prev.map((m) => (m._id === data._id ? data : m)));
        toast.success("Item updated");
      } else {
        // Create
        const { data } = await api.post(endpointBase, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        // backend expected to return the created item
        setMenu((prev) => [...prev, data]);
        toast.success("Item added");
      }

      // reset form
      setForm({
  _id: "",
  name: "",
  description: "",
  thumbnail: "",
  images: [],
  price: "",
  discount: 0,
  category: "other",
});

    } catch (err) {
      console.error("Save menu error:", err);

      // try to read server message
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (err?.response?.data ? JSON.stringify(err.response.data) : null);

      if (serverMsg) {
        toast.error(`Server: ${serverMsg}`);
      } else if (err?.response?.status) {
        toast.error(`Request failed: ${err.response.status}`);
      } else {
        toast.error("Error saving item (see console)");
      }
    }
  };

  // Delete Menu Item
  const deleteMenuItem = async (id) => {
    if (!user || user.role !== "admin") {
      toast.error("Not authorized");
      return;
    }
    try {
      await api.delete(`${API}/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMenu((prev) => prev.filter((m) => m._id !== id));
      toast.success("Item deleted");
    } catch (err) {
      console.error("Delete menu error:", err);
      toast.error("Error deleting item");
    }
  };

  // ---- Handlers to pass to AdminItemCard ----
  const handleEdit = (item) => {
    setForm({
      _id: item._id,
      name: item.name || "",
      description: item.description || "",
      thumbnail: item.thumbnail || "",
images: item.images || [],
      price: item.price || "",
      discount: item.discount || 0,
      category: item.category || "other",
    });
    document.getElementById("menu-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    deleteMenuItem(id);
  };
  // ------------------------------------------------

  if (loading) return <Loader />;

  if (!user || user.role !== "admin") return null;

  return (
    <div className="p-6 max-w-7xl m-auto">
      <h2 className="text-3xl font-bold mb-6">Manage Menu</h2>

      {/* Form */}
      <MenuForm
  form={form}
  setForm={setForm}
  onSubmit={saveMenuItem}
  API={API}
  user={user}
/>


      {/* Menu List */}
    <div className="max-w-6xl mx-auto px-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {menu.map((item) => (
      <AdminItemCard
        key={item._id}
        item={item}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ))}
  </div>
</div>

    </div>
  );
}
