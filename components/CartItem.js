import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

export default function CartItem({ item }) {
  const { updateQty, removeFromCart } = useContext(CartContext);

  const image =
    item.menuItem?.thumbnail ||
    item.thumbnail ||
    "/placeholder-food.png"; // fallback

  return (
    <div
      className="
        flex items-center gap-4
        border-b py-4
        dark:border-white/10
      "
    >
      {/* IMAGE */}
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5 flex-shrink-0">
        <img
          src={image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ITEM INFO */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          {item.name}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          ₹{item.price} × {item.quantity}
          {item.discount > 0 && (
            <span className="ml-2 text-red-500">
              (-{item.discount}%)
            </span>
          )}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQty(item._id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="
            w-8 h-8 rounded-lg
            bg-gray-200 dark:bg-white/10
            disabled:opacity-40
          "
        >
          -
        </button>

        <span className="min-w-[20px] text-center font-medium">
          {item.quantity}
        </span>

        <button
          onClick={() => updateQty(item._id, item.quantity + 1)}
          className="
            w-8 h-8 rounded-lg
            bg-gray-200 dark:bg-white/10
          "
        >
          +
        </button>

        <button
          onClick={() => removeFromCart(item._id)}
          className="ml-3 text-sm text-red-500 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}