import { useEffect, useState } from "react";
import ItemCard from "@/components/ItemCard";
import Loader from "@/components/Loader";
import axios from "axios";
import { BackendAPI } from "@/utils/api";

export default function Menu() {
  const [items, setItems] = useState([{_id: '68b3520a96c9cb3b729febff', name: 'Samosa1', description: 'Samosa is: askdfds', image: 'ndqmvqhhh96vp8x80lkf', price: 100},
{_id: '68b3522c96c9cb3b729fec06', name: 'Samosa1', description: 'Samosa is: askdfds', image: 'ndqmvqhhh96vp8x80lkf', price: 100},
{_id: '68b3522d96c9cb3b729fec08', name: 'Samosa1', description: 'Samosa is: askdfds', image: 'ndqmvqhhh96vp8x80lkf', price: 100},
{_id: '68b3522e96c9cb3b729fec0a', name: 'Samosa1', description: 'Samosa is: askdfds', image: 'ndqmvqhhh96vp8x80lkf', price: 100}]);
  const [loading, setLoading] = useState(true);

  const API = BackendAPI || "";  // "" means relative

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await axios.get(`${API}/api/menu`);
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
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">Our Menu</h2>
        {loading ? (
          <Loader />   // 👈 shows spinner while fetching
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
