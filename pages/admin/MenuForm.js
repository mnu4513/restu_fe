import { motion } from "framer-motion";
import ImageSlot from "./ImageSlot";

export default function MenuForm({
  form,
  setForm,
  onSubmit,
  API,
  user,
}) {
  // 🔥 Safe fallback (VERY IMPORTANT for Vercel build)
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

  // 🔥 SSR Safe Guard
  if (typeof window === "undefined") return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-6 sm:p-8 overflow-hidden"
    >
      <h3 className="text-2xl font-bold mb-6">
        {safeForm?._id ? "Edit Menu Item" : "Create Menu Item"}
      </h3>

      {/* ================= BASIC INFO ================= */}
      <div className="grid md:grid-cols-2 gap-6">

        <input
          type="text"
          placeholder="Item Name"
          value={safeForm?.name || ""}
          onChange={(e) =>
            setForm?.((prev) => ({ ...prev, name: e.target.value }))
          }
          className="input-style"
        />

        <input
          type="number"
          placeholder="Price"
          value={safeForm?.price || ""}
          onChange={(e) =>
            setForm?.((prev) => ({ ...prev, price: e.target.value }))
          }
          className="input-style"
        />

        <input
          type="number"
          placeholder="Discount %"
          value={safeForm?.discount || ""}
          onChange={(e) =>
            setForm?.((prev) => ({ ...prev, discount: e.target.value }))
          }
          className="input-style"
        />

        <select
          value={safeForm?.category || "other"}
          onChange={(e) =>
            setForm?.((prev) => ({ ...prev, category: e.target.value }))
          }
          className="input-style"
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
          className="input-style md:col-span-2"
        />
      </div>

      {/* ================= THUMBNAIL ================= */}
      <div className="mt-10">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 
                        dark:from-gray-900 dark:to-gray-800 
                        border border-gray-200 dark:border-gray-700 
                        rounded-2xl p-6 shadow-lg">

          <h4 className="text-lg font-semibold mb-6">
            Item Thumbnail
          </h4>

          <div className="flex flex-col md:flex-row items-center gap-8">

            <div className="w-48 md:w-56">
              <ImageSlot
                label="Thumbnail Image"
                value={safeForm?.thumbnail || ""}
                API={API}
                user={user}
                onChange={(url) =>
                  setForm?.((prev) => ({ ...prev, thumbnail: url }))
                }
              />
            </div>

            <div className="flex-1 text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>✔ Appears in menu listings.</p>
              <p>✔ Recommended size: 800x800px.</p>
              <p>✔ Square images look best.</p>
            </div>

          </div>
        </div>
      </div>

      {/* ================= GALLERY ================= */}
      <div className="mt-10">
        <h4 className="font-semibold mb-4">Gallery Images (Max 4)</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

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
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all"
        >
          {safeForm?._id ? "Update Item" : "Create Item"}
        </button>
      </div>

    </motion.div>
  );
}
