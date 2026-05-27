import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import api from "@/utils/axios";
import { AuthContext } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { BackendAPI } from "@/utils/api";
import AdminItemCard from "@/components/admin/AdminItemCard";
import MenuForm from "./MenuForm";
import { motion } from "framer-motion";

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

  // AUTH GUARD
  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "admin") {
      router.replace("/login");
      setLoading(false);
    }
  }, [user, authLoading, router]);

  // FETCH MENU
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    let mounted = true;

    const fetchMenu = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`${API}/api/menu`);
        if (mounted) setMenu(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load menu");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMenu();
    return () => (mounted = false);
  }, [user, API]);

  // SAVE MENU ITEM
  const saveMenuItem = async () => {
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discount: Number(form.discount || 0),
      };

      if (payload._id) {
        const { data } = await api.put(
          `${API}/api/menu/${payload._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        setMenu((prev) => prev.map((m) => (m._id === data._id ? data : m)));
        toast.success("Item updated");
      } else {
        const { data } = await api.post(`${API}/api/menu`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setMenu((prev) => [...prev, data]);
        toast.success("Item added");
      }

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
      console.error(err);
      toast.error("Save failed");
    }
  };

  // DELETE
  const deleteMenuItem = async (id) => {
    try {
      await api.delete(`${API}/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setMenu((prev) => prev.filter((m) => m._id !== id));
      toast.success("Deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  const handleEdit = (item) => {
    setForm({
      _id: item._id,
      name: item.name,
      description: item.description,
      thumbnail: item.thumbnail,
      images: item.images || [],
      price: item.price,
      discount: item.discount,
      category: item.category,
    });

    document.getElementById("menu-form")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  if (authLoading || loading) return <Loader />;
  if (!user || user.role !== "admin") return null;

  return (
    <main className="min-h-screen bg-white dark:bg-[#0b0f19] p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            p-6 rounded-3xl
            border border-gray-200 dark:border-white/10
            bg-white/70 dark:bg-white/[0.03]
            backdrop-blur-xl
          "
        >
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">
            🍔 Manage Menu
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create, update, and manage food items
          </p>
        </motion.div>

        {/* FORM SECTION */}
        <div id="menu-form">
          <MenuForm
            form={form}
            setForm={setForm}
            onSubmit={saveMenuItem}
            API={API}
            user={user}
          />
        </div>

        {/* MENU GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menu.map((item) => (
            <AdminItemCard
              key={item._id}
              item={item}
              onEdit={handleEdit}
              onDelete={deleteMenuItem}
            />
          ))}
        </div>

      </div>
    </main>
  );
}