import { Dialog } from "@headlessui/react";

export default function ReorderModal({ order, onClose, onConfirm, setOrder }) {
  if (!order) return null;

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Modal Box */}
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <Dialog.Title className="text-lg font-semibold">
            Reorder Confirmation
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-gray-600">
            Adjust items if needed before reordering:
          </Dialog.Description>

          {/* Items Preview with Quantity Controls + Remove */}
          <div className="mt-3 border-t pt-3">
            <h4 className="font-medium mb-2">Items:</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              {order.items.map((i, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    {i.menuItem?.name || "Item"}{" "}
                    <span className="text-gray-500">
                      (₹{i.menuItem?.price}{" "}
                      {i.menuItem?.discount > 0 && `- ${i.menuItem.discount}%`})
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const updated = [...order.items];
                        if (updated[idx].quantity > 1) updated[idx].quantity -= 1;
                        setOrder({ ...order, items: updated });
                      }}
                      className="px-2 bg-gray-300 rounded"
                    >
                      -
                    </button>
                    <span>{i.quantity}</span>
                    <button
                      onClick={() => {
                        const updated = [...order.items];
                        updated[idx].quantity += 1;
                        setOrder({ ...order, items: updated });
                      }}
                      className="px-2 bg-gray-300 rounded"
                    >
                      +
                    </button>

                    <button
                      onClick={() => {
                        const updated = order.items.filter((_, j) => j !== idx);
                        setOrder({ ...order, items: updated });
                      }}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ❌
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Updated Total */}
            <p className="mt-4 font-semibold">
              Total: ₹
              {order.items.reduce(
                (sum, i) =>
                  sum +
                  (i.menuItem?.price -
                    (i.menuItem?.price * (i.menuItem?.discount || 0)) / 100) *
                    i.quantity,
                0
              )}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={order.items.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Confirm
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
