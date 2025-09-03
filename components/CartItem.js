import { useContext } from "react";
import { CartContext } from "@/context/CartContext";

export default function CartItem({ item }) {
  const { updateQty, removeFromCart } = useContext(CartContext);

  return (
    <div className="flex items-center justify-between border-b py-4">
      {/* Item Info */}
      <div>
        <h3 className="font-semibold">{item.name}</h3>
        <p>
          ₹{item.price} × {item.quantity}
          {item.discount > 0 && (
            <span className="ml-2 text-red-500">(-{item.discount}%)</span>
          )}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 items-center">
        <button
          onClick={() => updateQty(item._id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="px-2 bg-gray-300 rounded disabled:opacity-50"
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => updateQty(item._id, item.quantity + 1)}
          className="px-2 bg-gray-300 rounded"
        >
          +
        </button>
        <button
          onClick={() => removeFromCart(item._id)}
          className="ml-4 text-red-500 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
