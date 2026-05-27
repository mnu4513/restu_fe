import { Dialog } from "@headlessui/react";

export default function ReorderModal({ order, onClose, onConfirm, setOrder }) {
  if (!order) return null;

  const updateQty = (idx, delta) => {
    const updated = [...order.items];
    updated[idx].quantity = Math.max(1, updated[idx].quantity + delta);
    setOrder({ ...order, items: updated });
  };

  const removeItem = (idx) => {
    const updated = order.items.filter((_, j) => j !== idx);
    setOrder({ ...order, items: updated });
  };

  const total = order.items.reduce(
    (sum, i) =>
      sum +
      (i.menuItem?.price -
        (i.menuItem?.price * (i.menuItem?.discount || 0)) / 100) *
        i.quantity,
    0
  );

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Center Wrapper */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="
            w-full max-w-lg
            rounded-3xl
            bg-white/90 dark:bg-[#0b0f19]/90
            backdrop-blur-2xl
            border border-gray-200 dark:border-white/10
            shadow-2xl
            overflow-hidden
          "
        >
          {/* HEADER */}
          <div className="p-5 border-b border-gray-200 dark:border-white/10">
            <Dialog.Title className="text-xl font-black text-gray-900 dark:text-white">
              🔁 Reorder Items
            </Dialog.Title>

            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Adjust quantity or remove items before placing order
            </Dialog.Description>
          </div>

          {/* ITEMS */}
          <div className="max-h-[400px] overflow-y-auto p-5 space-y-4">
            {order.items.map((i, idx) => {
              const image =
                i.menuItem?.thumbnail || "/placeholder-food.png";

              return (
                <div
                  key={idx}
                  className="
                    flex items-center gap-3
                    p-3 rounded-2xl
                    bg-gray-50 dark:bg-white/[0.03]
                    border border-gray-100 dark:border-white/10
                  "
                >
                  {/* IMAGE */}
                  <img
                    src={image}
                    className="w-14 h-14 rounded-xl object-cover"
                    alt="item"
                  />

                  {/* INFO */}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {i.menuItem?.name || "Item"}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ₹{i.menuItem?.price}{" "}
                      {i.menuItem?.discount > 0 &&
                        `(-${i.menuItem.discount}%)`}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(idx, -1)}
                      className="w-7 h-7 rounded-lg bg-gray-400 dark:bg-white/10"
                    >
                      -
                    </button>

                    <span className="min-w-[20px] text-gray-400 text-center text-sm">
                      {i.quantity}
                    </span>

                    <button
                      onClick={() => updateQty(idx, 1)}
                      className="w-7 h-7 rounded-lg bg-gray-400 dark:bg-white/10"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeItem(idx)}
                      className="text-red-500 text-sm ml-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}

            {order.items.length === 0 && (
              <p className="text-center text-gray-500">
                No items left in reorder
              </p>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-5 border-t border-gray-200 dark:border-white/10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-lg font-black text-green-600">
                ₹{total.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="
                  flex-1 py-3 rounded-2xl
                  bg-gray-200 dark:bg-white/10
                  text-gray-700 dark:text-white
                "
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                disabled={order.items.length === 0}
                className="
                  flex-1 py-3 rounded-2xl
                  bg-gradient-to-r from-green-500 to-orange-500
                  text-white font-semibold
                  disabled:opacity-50
                "
              >
                Confirm Order
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}