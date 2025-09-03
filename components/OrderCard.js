export default function OrderCard({ order, onReorder }) {
  return (
    <div className="border p-4 mb-4 rounded shadow bg-white dark:bg-gray-800">
      {/* ✅ Status + Date */}
      <p>
        <strong>Status:</strong>{" "}
        <span
          className={`ml-2 px-2 py-1 rounded text-white ${
            order.status === "Delivered"
              ? "bg-green-600"
              : order.status === "Cancelled"
              ? "bg-red-600"
              : "bg-yellow-500"
          }`}
        >
          {order.status}
        </span>
      </p>
      <p>
        <strong>Date:</strong> {order.createdAt.slice(0, 10)}{" "}
        <strong>Time:</strong> {order.createdAt.slice(11, 19)}
      </p>

      {/* ✅ Items */}
      <ul className="mt-2 text-sm">
        {order.items.map((i, idx) => (
          <li key={idx}>
            {i.quantity} × {i.menuItem?.name || "Item"}
          </li>
        ))}
      </ul>

      {/* ✅ Total */}
      <p className="mt-2 font-bold">Total: ₹{order.totalPrice}</p>

      {/* ✅ Address */}
      <div className="mt-3 text-sm text-gray-700">
        <p><strong>Deliver To:</strong></p>
        <p>{order.deliveryAddress?.label}</p>
        <p>
          {order.deliveryAddress?.addressLine}, {order.deliveryAddress?.city},{" "}
          {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
        </p>
      </div>

      {/* ✅ Reorder button */}
      <button
        onClick={() => onReorder(order)}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Reorder
      </button>
    </div>
  );
}
