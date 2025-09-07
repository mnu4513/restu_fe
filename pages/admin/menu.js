import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import Image from "next/image";
import { BackendAPI } from "@/utils/api";

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

  // Redirect if not admin
  useEffect(() => {
    // Wait until auth state is known
  if (authLoading) return;
    // Wait until initial load resolves (if you have loading state on auth provider you can check that instead)
    if (!user || user.role !== "admin") {
      // replace so user can't go back to protected page with back button
      router.replace("/login");
      setLoading(false);
    }
  }, [user, router]);

  // Fetch menu items (public endpoint in your example)
  useEffect(() => {
    // If user check is required for this endpoint, gate it here
    if (!user || user.role !== "admin") {
      return;
    }

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

  // Add / Update Menu Item
  const saveMenuItem = async () => {
    if (!user || user.role !== "admin") {
      toast.error("Not authorized");
      return;
    }

    try {
      if (form._id) {
        // Update
        const { data } = await axios.put(
          `${API}/api/menu/${form._id}`,
          form,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setMenu((prev) => prev.map((m) => (m._id === data._id ? data : m)));
        toast.success("Item updated");
      } else {
        // Add
        const { data } = await axios.post(
          `${API}/api/menu`,
          form,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setMenu((prev) => [...prev, data]);
        toast.success("Item added");
      }
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
      toast.error("Error saving item");
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

  if (loading) return <Loader />;

  // If not admin, don't render UI (router.replace will have run)
  if (!user || user.role !== "admin") return null;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Manage Menu</h2>

      {/* Form */}
      <div className="border p-4 mb-6 rounded">
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
          <input
            type="text"
            placeholder="Image ID"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="border px-3 py-2 rounded"
          />
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
        <button
          onClick={saveMenuItem}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          {form._id ? "Update Item" : "Add Item"}
        </button>
      </div>

      {/* Menu List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Menu Items</h3>
        {menu.length === 0 ? (
          <p>No items yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menu.map((item) => (
              <div key={item._id} className="border p-4 rounded">
                {item.image ? (
                  <Image
                    src={`https://res.cloudinary.com/dyjpzvstq/image/upload/v1709985632/${item.image}`}
                    alt={item.name}
                    width={300}
                    height={200}
                    className="object-cover rounded mb-2"
                  />
                ) : (
                  <div className="bg-gray-100 h-48 w-full rounded mb-2 flex items-center justify-center">
                    <span className="text-sm text-gray-500">No image</span>
                  </div>
                )}

                <h4 className="text-lg font-bold">{item.name}</h4>
                <p>{item.description}</p>
                <p>
                  ₹{item.price}{" "}
                  {item.discount > 0 && (
                    <span className="text-red-500">(-{item.discount}%)</span>
                  )}
                </p>
                <p className="text-sm text-gray-500">Category: {item.category}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setForm(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMenuItem(item._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
