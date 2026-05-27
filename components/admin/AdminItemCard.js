import Image from "next/image";
import { motion } from "framer-motion";

export default function AdminItemCard({
  item,
  onEdit = () => {},
  onDelete = () => {},
}) {
  if (!item) return null;

  const {
    _id,
    name,
    description,
    images = [],
    price,
    discount = 0,
    category,
  } = item;

  const displayImage =
    images.length > 0 && images[0]?.startsWith("http")
      ? images[0]
      : null;

  const finalPrice =
    discount > 0
      ? (price - (price * discount) / 100).toFixed(2)
      : price;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      className="
        group relative
        rounded-3xl
        overflow-hidden
        border border-gray-200 dark:border-white/10
        bg-white/70 dark:bg-white/[0.03]
        backdrop-blur-2xl
        shadow-sm hover:shadow-2xl
        transition-all duration-300
        flex flex-col
      "
    >
      {/* IMAGE */}
      <div className="relative w-full h-44 bg-gray-100 dark:bg-white/5 overflow-hidden">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No Image Available
          </div>
        )}

        {/* DISCOUNT BADGE */}
        {discount > 0 && (
          <div
            className="
              absolute top-3 left-3
              px-3 py-1
              text-xs font-semibold
              rounded-full
              bg-red-500 text-white
              shadow-md
            "
          >
            {discount}% OFF
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-1">
        {/* NAME */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
          {name}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {description}
        </p>

        {/* PRICE */}
        <div className="mt-3 flex items-end gap-2">
          <span className="text-xl font-black text-green-600">
            ₹{finalPrice}
          </span>

          {discount > 0 && (
            <span className="text-sm line-through text-gray-400">
              ₹{price}
            </span>
          )}
        </div>

        {/* CATEGORY */}
        <div className="mt-2 text-xs text-gray-500 uppercase tracking-wide">
          {category}
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => onEdit(item)}
            className="
              flex-1 py-2 rounded-xl
              font-semibold text-sm
              bg-gradient-to-r from-yellow-400 to-orange-400
              text-black
              hover:scale-[1.02]
              active:scale-95
              transition
            "
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(_id)}
            className="
              flex-1 py-2 rounded-xl
              font-semibold text-sm
              bg-gradient-to-r from-red-500 to-pink-500
              text-white
              hover:scale-[1.02]
              active:scale-95
              transition
            "
          >
            Delete
          </button>
        </div>
      </div>

      {/* HOVER GLOW */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-r from-orange-500/5 to-green-500/5 rounded-3xl" />
    </motion.div>
  );
}