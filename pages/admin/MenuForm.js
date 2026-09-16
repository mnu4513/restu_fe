import { motion } from "framer-motion";
import ImageSlot from "./ImageSlot";

// Major category -> Sub-categories
const categorySubCategories = {
  food: [
    { value: "starter", label: "Starter" },
    { value: "main", label: "Main Course" },
    { value: "snack", label: "Snack" },
    { value: "dessert", label: "Dessert" },
    { value: "sweet", label: "Sweet" },
    { value: "beverage", label: "Beverage" },
  ],

  store: [
    { value: "grocery", label: "Grocery" },
    { value: "personal_care", label: "Personal Care" },
    { value: "grooming", label: "Grooming" },
    { value: "stationery", label: "Stationery" },
    { value: "toys", label: "Toys" },
    { value: "clothing", label: "Clothing" },
    { value: "footwear", label: "Footwear" },
    { value: "household", label: "Household" },
    { value: "electronics", label: "Electronics" },
    { value: "other", label: "Other" },
  ],
};

export default function MenuForm({
  form,
  setForm,
  onSubmit,
  API,
  user,
}) {
  const safeForm = form || {
    _id: "",
    name: "",
    description: "",
    thumbnail: "",
    images: [],
    price: "",
    discount: 0,
    category: "food",
    subCategory: "main",
  };

  // Get sub-categories according to selected category
  const availableSubCategories =
    categorySubCategories[safeForm.category] || [];


  // Handle major category change
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;

    // Automatically select the first valid sub-category
    // for the newly selected major category
    const firstSubCategory =
      categorySubCategories[newCategory]?.[0]?.value || "";

    setForm?.((prev) => ({
      ...prev,
      category: newCategory,
      subCategory: firstSubCategory,
    }));
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

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {safeForm?._id
            ? "Edit Menu Item"
            : "Create Menu Item"}
        </h3>

        <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-500">
          Admin Panel
        </span>
      </div>


      {/* ================= FORM ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* NAME */}

        <input
          type="text"
          placeholder="Item Name"
          value={safeForm?.name || ""}
          onChange={(e) =>
            setForm?.((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          className="
            w-full px-4 py-3 rounded-xl
            border border-gray-200 dark:border-white/10
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-white
            outline-none
            focus:ring-2 focus:ring-green-500
          "
        />


        {/* PRICE */}

        <input
          type="number"
          placeholder="Price"
          value={safeForm?.price || ""}
          onChange={(e) =>
            setForm?.((prev) => ({
              ...prev,
              price: e.target.value,
            }))
          }
          className="
            w-full px-4 py-3 rounded-xl
            border border-gray-200 dark:border-white/10
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-white
            outline-none
            focus:ring-2 focus:ring-green-500
          "
        />


        {/* DISCOUNT */}

        <input
          type="number"
          placeholder="Discount %"
          value={safeForm?.discount ?? ""}
          min="0"
          max="100"
          onChange={(e) =>
            setForm?.((prev) => ({
              ...prev,
              discount: e.target.value,
            }))
          }
          className="
            w-full px-4 py-3 rounded-xl
            border border-gray-200 dark:border-white/10
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-white
            outline-none
            focus:ring-2 focus:ring-green-500
          "
        />


        {/* ================= MAJOR CATEGORY ================= */}

        <select
          value={safeForm?.category || "food"}
          onChange={handleCategoryChange}
          className="
            w-full px-4 py-3 rounded-xl
            border border-gray-200 dark:border-white/10
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-white
            outline-none
            focus:ring-2 focus:ring-green-500
          "
        >
          <option value="food">Food</option>
          <option value="store">Store</option>
        </select>


        {/* ================= SUB CATEGORY ================= */}

        <select
          value={safeForm?.subCategory || ""}
          onChange={(e) =>
            setForm?.((prev) => ({
              ...prev,
              subCategory: e.target.value,
            }))
          }
          className="
            w-full px-4 py-3 rounded-xl
            border border-gray-200 dark:border-white/10
            bg-white dark:bg-gray-900
            text-gray-900 dark:text-white
            outline-none
            focus:ring-2 focus:ring-green-500
          "
        >
          <option value="" disabled>
            Select Sub-category
          </option>

          {availableSubCategories.map((subCategory) => (
            <option
              key={subCategory.value}
              value={subCategory.value}
            >
              {subCategory.label}
            </option>
          ))}
        </select>


        {/* ================= DESCRIPTION ================= */}

        <textarea
          placeholder="Description"
          value={safeForm?.description || ""}
          onChange={(e) =>
            setForm?.((prev) => ({
              ...prev,
              description: e.target.value,
            }))
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

        <div
          className="
            rounded-2xl
            border border-gray-200 dark:border-white/10
            bg-gray-50 dark:bg-white/[0.02]
            p-5 sm:p-6
          "
        >

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
                  setForm?.((prev) => ({
                    ...prev,
                    thumbnail: url,
                  }))
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

                  const updated = [
                    ...(prev?.images || []),
                  ];

                  updated[index] = url;

                  return {
                    ...prev,
                    images: updated,
                  };

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
          {safeForm?._id
            ? "Update Item"
            : "Create Item"}
        </button>

      </div>


      {/* ================= GLOW ================= */}

      <div
        className="
          absolute -top-20 -right-20
          w-64 h-64
          bg-green-500/10
          blur-3xl
          rounded-full
          pointer-events-none
        "
      />

    </motion.div>
  );
}
