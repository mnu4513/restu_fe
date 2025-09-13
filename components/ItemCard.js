import { useContext, useState } from "react";
import { CartContext } from "@/context/CartContext";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";

export default function ItemCard({ item }) {
  const { addToCart } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false); // ✅ button animation

  // ✅ Handle Add to Cart
  const handleAddToCart = () => {
    addToCart(item);
    toast.success(`${item.name} added to cart 🛒`);
    setAdding(true);
    setTimeout(() => setAdding(false), 700); // reset animation
  };

  console.log(item.image)
  return (
    <div
      className="p-4 border rounded-2xl shadow-md hover:shadow-xl 
                 transition-transform transform hover:-translate-y-2
                 flex flex-col items-center text-center"
    >
      {/* ✅ Food Image */}
      <div className="w-full h-48 md:h-56 relative overflow-hidden rounded-lg">
        <Image
          src={`https://res.cloudinary.com/dyjpzvstq/image/upload/v1709985632/${item.image}`}
          alt={item.name}
          fill
          className="object-cover rounded-lg hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* ✅ Food Info */}
      <h3 className="font-bold text-lg mt-3">{item?.name}</h3>
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item?.description}</p>

      {/* ✅ Price Section */}
      <p className="mt-2 text-xl font-semibold text-green-600">
        ₹{item?.price - (item?.price * (item?.discount || 0)) / 100}
        {item?.discount > 0 && (
          <span className="ml-2 line-through text-gray-400 text-base">
            ₹{item?.price}
          </span>
        )}
      </p>

      {/* ✅ Buttons */}
      <div className="flex gap-2 w-full mt-4">
        <button
          onClick={handleAddToCart}
          className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition 
            ${adding ? "bg-green-700 scale-95" : "bg-green-600 hover:bg-green-700"}`}
        >
          {adding ? "✔ Added!" : "🛒 Add to Cart"}
        </button>

        <button
          onClick={() => setOpen(true)}
          className="flex-1 px-4 py-2 rounded-lg font-medium border border-gray-400 hover:bg-gray-100 transition"
        >
          👀 View Details
        </button>
      </div>

      {/* ✅ Details Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        {/* Modal Content */}
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-blue-500 rounded-lg shadow-lg max-w-md w-full p-6">
            <Dialog.Title className="text-xl font-bold mb-2">{item.name}</Dialog.Title>
            <Image
              src={`https://res.cloudinary.com/dyjpzvstq/image/upload/v1709985632/${item.image}`}
              alt={item.name}
              width={400}
              height={250}
              className="object-cover rounded-lg mb-4"
            />
            <p className="text-gray-700 mb-3">{item.description}</p>
            <p className="font-semibold text-green-600 text-lg mb-4">
              ₹{item?.price - (item?.price * (item?.discount || 0)) / 100}
              {item?.discount > 0 && (
                <span className="ml-2 line-through text-gray-400 text-base">
                  ₹{item?.price}
                </span>
              )}
            </p>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleAddToCart();
                  setOpen(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                🛒 Add to Cart
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
