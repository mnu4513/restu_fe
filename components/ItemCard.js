import { useContext, useState, useEffect } from "react";
import { CartContext } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function ItemCard({ item }) {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🔥 Normalize Image (supports public_id or full URL)
  const normalizeImage = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `${process.env.NEXT_PUBLIC_IMG_URI}${img}`;
  };

  const images =
    item?.images?.length > 0
      ? item.images.map(normalizeImage)
      : item?.thumbnail
      ? [normalizeImage(item.thumbnail)]
      : [];

  // 🔥 Auto Carousel
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [images]);

  const handleAddToCart = () => {
    addToCart(item);
    toast.success(`${item.name} added to cart 🛒`);
    setAdding(true);
    setTimeout(() => setAdding(false), 700);
  };

  const finalPrice =
    item?.price - (item?.price * (item?.discount || 0)) / 100;

  return (
    <>
      {/* ================= CARD ================= */}
      <motion.div
        whileHover={{ y: -8 }}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >
        {/* ===== IMAGE CAROUSEL ===== */}
        <div className="relative w-full h-56 overflow-hidden">
          {images.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[currentIndex]}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          )}

          {/* Discount Badge */}
          {item?.discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
              {item.discount}% OFF
            </div>
          )}
        </div>

        {/* ===== CONTENT ===== */}
        <div className="p-5">
          <h3 className="text-lg font-bold">{item.name}</h3>

          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {item.description}
          </p>

          {/* Price */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xl font-semibold text-green-600">
              ₹{finalPrice}
            </span>

            {item?.discount > 0 && (
              <span className="line-through text-gray-400 text-sm">
                ₹{item.price}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-5">
            {user?.role !== "admin" && (
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-2 rounded-xl text-white font-medium transition 
                ${
                  adding
                    ? "bg-green-700 scale-95"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {adding ? "✔ Added!" : "Add to Cart"}
              </button>
            )}

            <button
              onClick={() => setOpen(true)}
              className="flex-1 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              View
            </button>
          </div>
        </div>
      </motion.div>

      {/* ================= MODAL ================= */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full p-6">
            <Dialog.Title className="text-2xl font-bold mb-4">
              {item.name}
            </Dialog.Title>

            {images.length > 0 && (
              <Image
                src={images[currentIndex]}
                alt={item.name}
                width={600}
                height={400}
                className="rounded-xl object-cover mb-4"
              />
            )}

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {item.description}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-green-600">
                ₹{finalPrice}
              </span>

              {user?.role !== "admin" && (
                <button
                  onClick={() => {
                    handleAddToCart();
                    setOpen(false);
                  }}
                  className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
