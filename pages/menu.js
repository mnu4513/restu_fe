import { useEffect, useState } from "react";
import ItemCard from "@/components/ItemCard";
import api from "@/utils/axios";
import { BackendAPI } from "@/utils/api";
import CardLoader from "@/components/common/CardLoader";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = BackendAPI || "";  // "" means relative

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await api.get(`${API}/api/menu`);
        setItems(data);
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
      <div className="p-6 max-w-7xl m-auto">
        <h2 className="text-3xl font-bold mb-6">Our Menu</h2>
        {loading ? (
          <CardLoader/>
          // <Loader />   // 👈 shows spinner while fetching
        ) : (
          items.length === 0 ? 
          <p> No item available....</p>
          : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
