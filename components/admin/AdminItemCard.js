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

  // 🔥 Only use images array
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
      whileHover={{ y: -4 }}
      className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* IMAGE */}
      <div className="relative w-full h-40 bg-slate-800">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            No Image
          </div>
        )}

        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-white truncate">
          {name}
        </h3>

        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
          {description}
        </p>

        <div className="mt-2 text-sm text-green-400 font-medium">
          ₹{finalPrice}
          {discount > 0 && (
            <span className="line-through text-slate-500 text-xs ml-2">
              ₹{price}
            </span>
          )}
        </div>

        <div className="text-[11px] text-slate-500 mt-1 capitalize">
          {category}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black text-xs py-1.5 rounded-md transition"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(_id)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1.5 rounded-md transition"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}
