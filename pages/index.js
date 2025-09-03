import { useEffect, useState } from "react";
import ItemCard from "@/components/ItemCard";
import Loader from "@/components/Loader";
import axios from "axios";
import Link from "next/link";   // ✅ import Link
import { BackendAPI } from "@/utils/api";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const API = BackendAPI || "";  // "" means relative

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await axios.get(
          `${API}/api/menu`
        );
        setItems(data.slice(0, 6)); // ✅ first 6 items
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
      {/* Hero Section */}
      <section className="h-[60vh] bg-green-500 text-white flex items-center justify-center flex-col text-center">
        <h1 className="text-5xl font-bold">Welcome to MyRestaurant 🍴</h1>
        <p className="mt-4 text-lg">
          Delicious food delivered to your doorstep
        </p>
      </section>

      {/* Menu Preview Section */}
      <section className="p-6">
        <h2 className="text-3xl font-bold mb-6">Popular Dishes</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
        <div className="text-center mt-6">
          <Link
            href="/menu"    // ✅ use Link instead of <a>
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            View Full Menu →
          </Link>
        </div>
      </section>
    </div>
  );
}
