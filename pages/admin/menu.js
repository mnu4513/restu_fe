import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import Image from "next/image"
import { BackendAPI } from "@/utils/api";

export default function AdminMenu() {
  const { user } = useContext(AuthContext);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = BackendAPI || "";  // "" means relative

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    discount: 0,
    category: "other",
  });

  // ✅ Fetch menu items
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchMenu = async () => {
      try {
        const { data } = await axios.get(
          `${API}/api/menu`
        );
        setMenu(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [user]);

  // ✅ Add / Update Menu Item
  const saveMenuItem = async () => {
    try {
      if (form._id) {
        // Update
        const { data } = await axios.put(
          `${API}/api/menu/${form._id}`,
          form,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setMenu(menu.map((m) => (m._id === data._id ? data : m)));
        toast.success("Item updated");
      } else {
        // Add
        const { data } = await axios.post(
          `${API}/api/menu`,
          form,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setMenu([...menu, data]);
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
      toast.error("Error saving item");
    }
  };

  // ✅ Delete Menu Item
  const deleteMenuItem = async (id) => {
    try {
      await axios.delete(
        `${API}/api/menu/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMenu(menu.filter((m) => m._id !== id));
      toast.success("Item deleted");
    } catch (err) {
      toast.error("Error deleting item");
    }
  };

  if (loading) return <Loader />;

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
                <Image
  src={`https://res.cloudinary.com/dyjpzvstq/image/upload/v1709985632/${item.image}`}
  alt={item.name}
  width={300}
  height={200}
  className="object-cover rounded mb-2"
/>
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
