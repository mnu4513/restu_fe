import { motion } from "framer-motion";
import ImageSlot from "./ImageSlot";

export default function MenuForm({ form, setForm, onSubmit, API, user }) {
  const safeForm = form || {
    _id: "",
    name: "",
    description: "",
    thumbnail: "",
    images: [],
    price: "",
    discount: 0,
    category: "other",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        relative
        bg-white/70 dark:bg-white/[0.03]
        backdrop-blur-2xl
        border border-gray-200 dark:border-white/10
        shadow-xl
        rounded-3xl
        p-6 sm:p-8
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {safeForm?._id ? "Edit Menu Item" : "Create Menu Item"}
        </h3>

        <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-500">
          Admin Panel
        </span>
      </div>

      {/* ================= FORM ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <input
          type="text"
          placeholder="Item Name"
          value={safeForm?.name || ""}
          onChange={(e) =>
            setForm?.((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="number"
          placeholder="Price"
          value={safeForm?.price || ""}
          onChange={(e) =>
            setForm?.((prev) => ({ ...prev, price: e.target.value }))
          }
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="number"
          placeholder="Discount %"
          value={safeForm?.discount || ""}
          onChange={(e) =>
            setForm?.((prev) => ({ ...prev, discount: e.target.value }))
          }
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          value={safeForm?.category || "other"}
          onChange={(e) =>
            setForm?.((prev) => ({ ...prev, category: e.target.value }))
          }
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="starter">Starter</option>
          <option value="main">Main</option>
          <option value="dessert">Dessert</option>
          <option value="beverage">Beverage</option>
          <option value="other">Other</option>
        </select>

        <textarea
          placeholder="Description"
          value={safeForm?.description || ""}
          onChange={(e) =>
            setForm?.((prev) => ({ ...prev, description: e.target.value }))
          }
          className="
            md:col-span-2
            w-full px-4 py-3
            rounded-xl
            border border-gray-200 dark:border-white/10
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-white
            outline-none
            focus:ring-2 focus:ring-green-500
            min-h-[120px]
          "
        />
      </div>

      {/* ================= THUMBNAIL ================= */}
      <div className="mt-10">
        <div className="
          rounded-2xl
          border border-gray-200 dark:border-white/10
          bg-gray-50 dark:bg-white/[0.02]
          p-5 sm:p-6
        ">
          <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Thumbnail Image
          </h4>

          <div className="flex flex-col md:flex-row gap-6 items-center">

            <div className="w-full md:w-56">
              <ImageSlot
                label="Thumbnail"
                value={safeForm?.thumbnail || ""}
                API={API}
                user={user}
                onChange={(url) =>
                  setForm?.((prev) => ({ ...prev, thumbnail: url }))
                }
              />
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>✔ Used in menu cards</p>
              <p>✔ Recommended: 800×800</p>
              <p>✔ Square format works best</p>
            </div>

          </div>
        </div>
      </div>

      {/* ================= GALLERY ================= */}
      <div className="mt-10">
        <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Gallery Images (Max 4)
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((index) => (
            <ImageSlot
              key={index}
              label={`Image ${index + 1}`}
              value={safeForm?.images?.[index] || ""}
              API={API}
              user={user}
              onChange={(url) => {
                setForm?.((prev) => {
                  const updated = [...(prev?.images || [])];
                  updated[index] = url;
                  return { ...prev, images: updated };
                });
              }}
            />
          ))}
        </div>
      </div>

      {/* ================= SUBMIT ================= */}
      <div className="mt-10 flex justify-end">
        <button
          onClick={onSubmit}
          className="
            px-8 py-3
            rounded-2xl
            font-semibold text-white
            bg-gradient-to-r from-green-500 to-emerald-600
            hover:scale-[1.02]
            active:scale-95
            transition-all
          "
        >
          {safeForm?._id ? "Update Item" : "Create Item"}
        </button>
      </div>

      {/* glow background */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 blur-3xl rounded-full pointer-events-none" />
    </motion.div>
  );
}