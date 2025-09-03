import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import Image from "next/image"

export default function ItemCard({ item }) {
  const { addToCart } = useContext(CartContext);


  return (
    <div className="p-4 border rounded shadow-md">
       <Image
        src={`https://res.cloudinary.com/dyjpzvstq/image/upload/v1709985632/${item.image}`}
        alt={item.name}
        width={200}
        height={200}
        className="object-cover rounded mb-2"
      />
      <h3 className="font-bold mt-2">{item?.name}</h3>
      <p className="text-sm text-gray-600">{item?.description}</p>
      <p className="mt-1 font-semibold">
        ₹{item?.price - (item?.price * (item?.discount || 0)) / 100}{" "}
        {item?.discount > 0 && <span className="line-through text-gray-400">₹{item?.price}</span>}
      </p>
      <button
        onClick={() => addToCart(item)}
        className="bg-green-600 text-white px-4 py-2 mt-2 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}
