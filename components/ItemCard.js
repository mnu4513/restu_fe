"use client";

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

  // Normalize image
  const normalizeImage = (img) => {
    if (!img) return null;

    if (img.startsWith("http")) return img;

    return `${process.env.NEXT_PUBLIC_IMG_URI}${img}`;
  };

  // Images
  const images =
    item?.images?.length > 0
      ? item.images.map(normalizeImage)
      : item?.thumbnail
      ? [normalizeImage(item.thumbnail)]
      : [];

  // Auto carousel
  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [images]);

  // Add to cart
  const handleAddToCart = () => {
    addToCart(item);

    toast.success(`${item.name} added to cart 🛒`);

    setAdding(true);

    setTimeout(() => {
      setAdding(false);
    }, 700);
  };

  // Final price
  const finalPrice =
    item?.price - (item?.price * (item?.discount || 0)) / 100;

  return (
    <>
      {/* ================= CARD ================= */}
      <motion.div
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 180 }}
        className="
          group relative overflow-hidden
          rounded-[28px]
          border border-gray-200/70 dark:border-white/10
          bg-white/80 dark:bg-white/[0.03]
          backdrop-blur-xl
          shadow-lg shadow-black/5 dark:shadow-black/20
          hover:shadow-2xl hover:shadow-orange-500/10
          transition-all duration-500
        "
      >
        {/* IMAGE SECTION */}
        <div className="relative h-60 sm:h-64 overflow-hidden">
          {/* Image Carousel */}
          {images.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={images[currentIndex]}
                  alt={item.name}
                  fill
                  className="
                    object-cover
                    group-hover:scale-110
                    transition duration-700
                  "
                />
              </motion.div>
            </AnimatePresence>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          {/* Discount Badge */}
          {item?.discount > 0 && (
            <div
              className="
                absolute top-4 left-4
                px-3 py-1
                rounded-full
                bg-red-500/90
                backdrop-blur-md
                text-white text-xs font-semibold
                shadow-lg
              "
            >
              {item.discount}% OFF
            </div>
          )}

          {/* Floating Price */}
          <div
            className="
              absolute bottom-4 left-4
              px-4 py-2
              rounded-2xl
              bg-white/15 dark:bg-black/20
              backdrop-blur-xl
              border border-white/20
            "
          >
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">
                ₹{finalPrice}
              </span>

              {item?.discount > 0 && (
                <span className="text-sm text-gray-300 line-through">
                  ₹{item.price}
                </span>
              )}
            </div>
          </div>

          {/* Floating Add Button */}
          {user?.role !== "admin" && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="
                absolute bottom-4 right-4
                h-12 w-12
                rounded-2xl
                bg-gradient-to-r
                from-blue-500
                to-green-500
                text-white
                text-xl
                font-bold
                flex items-center justify-center
                shadow-xl
                hover:scale-110
                transition
              "
            >
              {adding ? "✔" : "+"}
            </motion.button>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-5">
          {/* Title + Rating */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3
                className="
                  text-lg sm:text-xl
                  font-bold
                  text-gray-900 dark:text-white
                  line-clamp-1
                "
              >
                {item.name}
              </h3>

              <p className="mt-1 text-xs font-medium text-orange-500">
                Chef Recommended
              </p>
            </div>

            <div
              className="
                px-2 py-1 rounded-xl
                bg-orange-100 dark:bg-orange-500/10
                text-orange-600 dark:text-orange-400
                text-xs font-semibold
              "
            >
              ★ 4.9
            </div>
          </div>

          {/* Description */}
          <p
            className="
              mt-3
              text-sm leading-relaxed
              text-gray-600 dark:text-gray-400
              line-clamp-2
            "
          >
            {item.description}
          </p>

          {/* Bottom Buttons */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            {/* View Button */}
            <button
              onClick={() => setOpen(true)}
              className="
                flex-1
                py-3 rounded-2xl
               
                bg-gradient-to-r
                  from-green-500
                  to-red-300
                  
                hover:bg-gray-100 dark:hover:bg-white/[0.06]
                text-sm font-bold
text-white
                transition-all duration-300
              "
            >
              View Details
            </button>

            {/* Add To Cart */}
            {user?.role !== "admin" && (
              <button
                onClick={handleAddToCart}
                className="
                  flex-1
                  py-3 rounded-2xl
                  bg-gradient-to-r
                  from-blue-500
                  to-green-500
                  text-white
                  text-sm font-semibold
                  shadow-lg shadow-orange-500/20
                  hover:scale-[1.02]
                  active:scale-95
                  transition-all duration-300
                "
              >
                {adding ? "Added ✔" : "Add Cart"}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ================= MODAL ================= */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />

        {/* Modal Wrapper */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel
            as={motion.div}
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="
              relative overflow-hidden
              w-full max-w-2xl
              rounded-[32px]
              border border-gray-200 dark:border-white/10
              bg-white/90 dark:bg-[#111827]/90
              backdrop-blur-2xl
              shadow-2xl
            "
          >
            {/* IMAGE */}
            {images.length > 0 && (
              <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                <Image
                  src={images[currentIndex]}
                  alt={item.name}
                  fill
                  className="object-cover"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Floating Title */}
                <div className="absolute bottom-6 left-6">
                  <Dialog.Title className="text-3xl font-bold text-white">
                    {item.name}
                  </Dialog.Title>

                  <p className="text-orange-300 mt-1 text-sm">
                    Premium Taste Experience
                  </p>
                </div>
              </div>
            )}

            {/* CONTENT */}
            <div className="p-6 sm:p-8">
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.description}
              </p>

              {/* Price + Action */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                {/* Price */}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-green-600">
                      ₹{finalPrice}
                    </span>

                    {item?.discount > 0 && (
                      <span className="line-through text-gray-400">
                        ₹{item.price}
                      </span>
                    )}
                  </div>

                  {item?.discount > 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      Save {item.discount}% today
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setOpen(false)}
                    className="
                      px-5 py-3 rounded-2xl
                      bg-gradient-to-r
                        from-blue-500
                        to-red-500
                        text-white font-semibold
                      hover:bg-gray-200 dark:hover:bg-white/[0.08]
                      transition
                    "
                  >
                    Close
                  </button>

                  {user?.role !== "admin" && (
                    <button
                      onClick={() => {
                        handleAddToCart();
                        setOpen(false);
                      }}
                      className="
                        px-6 py-3 rounded-2xl
                        bg-gradient-to-r
                        from-blue-500
                        to-green-500
                        text-white font-semibold
                        shadow-lg shadow-orange-500/20
                        hover:scale-105
                        active:scale-95
                        transition-all duration-300
                      "
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}