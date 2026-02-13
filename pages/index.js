import { useEffect, useState } from "react";
import ItemCard from "@/components/ItemCard";
import Loader from "@/components/Loader";
import axios from "axios";
import Link from "next/link";
import { BackendAPI } from "@/utils/api";
import Hero from "@/components/Hero";   // 👈 Fancy animated Hero

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = BackendAPI || ""; // "" means relative

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await axios.get(`${API}/api/menu`);
        setItems(data.slice(0, 6)); // ✅ Show only first 6 items
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  return (
    <div>
      {/* ✅ Fancy Hero Section */}
      <Hero />

      {/* ✅ Menu Preview Section */}
      <section className="p-6 max-w-7xl m-auto">
        <h2 className="text-3xl font-bold mb-6">Popular Dishes</h2>
        {loading ? (
          <Loader />
        ) : (
          items.length === 0 ? 
          <p>No item available...</p>
          : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}

        {/* ✅ Button with Next.js Link (no ESLint error) */}
        <div className="text-center mt-6">
          <Link
            href="/menu"
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            View Full Menu →
          </Link>
        </div>
      </section>
    </div>
  );
}
