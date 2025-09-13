// pages/admin/menu.js
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { BackendAPI } from "@/utils/api";
import AdminItemCard from "@/components/admin/AdminItemCard";
import ImageUploader from "@/components/admin/ImageUploader";

export default function AdminMenu() {
  const router = useRouter();
  const { user, loading: authLoading } = useContext(AuthContext);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = BackendAPI || "";

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
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
        const { data } = await axios.get(`${API}/api/menu`);
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
      image: form.image ? String(form.image) : "",
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
        const { data } = await axios.put(`${endpointBase}/${payload._id}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        // backend expected to return the updated item
        setMenu((prev) => prev.map((m) => (m._id === data._id ? data : m)));
        toast.success("Item updated");
      } else {
        // Create
        const { data } = await axios.post(endpointBase, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        // backend expected to return the created item
        setMenu((prev) => [...prev, data]);
        toast.success("Item added");
      }

      // reset form
      setForm({
        name: "",
        description: "",
        image: "",
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
      await axios.delete(`${API}/api/menu/${id}`, {
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
      image: item.image || "",
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
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Manage Menu</h2>

      {/* Form */}
      <div id="menu-form" className="border p-4 mb-6 rounded">
        <h3 className="text-xl font-semibold mb-4">
          {form._id ? "Edit Item" : "Add New Item"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border px-3 py-2 rounded"
          />

          {/* ImageUploader replaces the Image ID input — it sets form.image via onUploadComplete */}
          <div className="col-span-1 md:col-span-2">
            <ImageUploader
              api={API}
              user={user}
              initialImageId={form.image}
              uploadEndpoint="/api/image/upload/image"
              onUploadComplete={(publicId) => setForm((prev) => ({ ...prev, image: publicId }))}
            />
          </div>

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            placeholder="Discount %"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
            className="border px-3 py-2 rounded"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border px-3 py-2 rounded"
          >
            <option value="starter">Starter</option>
            <option value="main">Main</option>
            <option value="dessert">Dessert</option>
            <option value="beverage">Beverage</option>
            <option value="other">Other</option>
          </select>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border px-3 py-2 rounded col-span-1 md:col-span-2"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={saveMenuItem}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {form._id ? "Update Item" : "Add Item"}
          </button>
          {form._id && (
            <button
              onClick={() =>
                setForm({
                  name: "",
                  description: "",
                  image: "",
                  price: "",
                  discount: 0,
                  category: "other",
                })
              }
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Menu List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Menu Items</h3>
        {menu.length === 0 ? (
          <p>No items yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menu.map((item) => (
              <AdminItemCard
                key={item._id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
