import { motion } from "framer-motion";
import ImageUploader from "@/components/admin/ImageUploader";
import ImageSlot from "./ImageSlot";



export default function MenuForm({
  form,
  setForm,
  onSubmit,
  API,
  user,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-6 sm:p-8 overflow-hidden"
    >
      <h3 className="text-2xl font-bold mb-6">
        {form._id ? "Edit Menu Item" : "Create Menu Item"}
      </h3>

      {/* Basic Info */}
      <div className="grid md:grid-cols-2 gap-6">

        <input
          type="text"
          placeholder="Item Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input-style"
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="input-style"
        />

        <input
          type="number"
          placeholder="Discount %"
          value={form.discount}
          onChange={(e) => setForm({ ...form, discount: e.target.value })}
          className="input-style"
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
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
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-style md:col-span-2"
        />
      </div>

      {/* Thumbnail Upload */}
<div className="mt-10">
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 
                  dark:from-gray-900 dark:to-gray-800 
                  border border-gray-200 dark:border-gray-700 
                  rounded-2xl p-6 shadow-lg">

    <h4 className="text-lg font-semibold mb-6">
      Item Thumbnail
    </h4>

    <div className="flex flex-col md:flex-row items-center gap-8">

      {/* Thumbnail Box */}
      <div className="w-48 md:w-56">
        <ImageSlot
          label="Thumbnail Image"
          value={form.thumbnail}
          API={API}
          user={user}
          onChange={(publicId) =>
            setForm((prev) => ({ ...prev, thumbnail: publicId }))
          }
        />
      </div>

      {/* Info Side Panel */}
      <div className="flex-1 text-sm text-gray-600 dark:text-gray-400 space-y-2">
        <p>
          ✔ This image will appear in menu listings.
        </p>
        <p>
          ✔ Recommended size: 800x800px.
        </p>
        <p>
          ✔ Square images look best.
        </p>
      </div>

    </div>

  </div>
</div>



{/* Gallery Grid Upload */}
<div className="mt-10">
  <h4 className="font-semibold mb-4">Gallery Images (Max 4)</h4>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

    {[0, 1, 2, 3].map((index) => (
      <ImageSlot
        key={index}
        label={`Image ${index + 1}`}
        value={form.images[index] || ""}
        API={API}
        user={user}
        onChange={(publicId) => {
          const updated = [...form.images];
          updated[index] = publicId;
          setForm((prev) => ({
            ...prev,
            images: updated,
          }));
        }}
      />
    ))}

  </div>
</div>



<div className="mt-10 flex justify-end">
  <button
    onClick={onSubmit}
    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all"
  >
    {form._id ? "Update Item" : "Create Item"}
  </button>
</div>

    </motion.div>
  );
}
