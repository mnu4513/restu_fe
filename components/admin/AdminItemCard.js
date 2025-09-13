import React from "react";
import Image from "next/image";


export default function AdminItemCard({ item, onEdit = () => {}, onDelete = () => {} }) {
  if (!item) return null;
  const { _id, name, description, image, price, discount = 0, category } = item;

  const showPrice = () => {
    const p = Number(price || 0);
    if (!p) return "—";
    if (!discount) return `₹${p}`;
    const discounted = (p - (p * Number(discount)) / 100).toFixed(2);
    return (
      <>
        <span className="font-semibold">₹{discounted}</span>
        <span className="text-sm line-through ml-2 text-gray-400">₹{p}</span>
        <span className="ml-2 text-red-500 text-sm">(-{discount}%)</span>
      </>
    );
  };
  console.log(image)

  return (
    <article className="border rounded p-4 bg-white dark:bg-slate-800 shadow-sm">
      {image ? (
        <div className="w-full h-48 mb-3 rounded overflow-hidden">
          <Image
            src={`https://res.cloudinary.com/dyjpzvstq/image/upload/v1709985632/${image}`}
            alt={name}
            width={360}
            height={360}
            className="object-cover w-full h-full rounded"
          />
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-slate-700 h-48 rounded mb-3 flex items-center justify-center">
          <span className="text-sm text-gray-500">No image</span>
        </div>
      )}

      <h4 className="text-lg font-bold mb-1">{name}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{description}</p>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-base">{showPrice()}</div>
          <div className="text-xs text-gray-500 mt-1">Category: {category}</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onEdit(item)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
            aria-label={`Edit ${name}`}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(_id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            aria-label={`Delete ${name}`}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
