import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AdminSearchBar({
  onSearch = () => {},
  initialValue = "",
}) {
  const [q, setQ] = useState(initialValue || "");

  useEffect(() => {
    setQ(initialValue || "");
  }, [initialValue]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onSearch(q.trim());
  };

  const handleReset = () => {
    setQ("");
    onSearch("");
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        flex flex-col sm:flex-row gap-3
        mb-5
        p-3 sm:p-4
        rounded-2xl
        border border-gray-200 dark:border-white/10
        bg-white/70 dark:bg-white/[0.03]
        backdrop-blur-xl
        shadow-sm
      "
    >
      {/* INPUT */}
      <input
        type="text"
        placeholder="Search orders (id, customer, phone...)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="
          flex-1
          px-4 py-3
          rounded-xl
          border border-gray-300 dark:border-white/10
          bg-white dark:bg-gray-900
          text-gray-800 dark:text-gray-200
          outline-none
          focus:ring-2 focus:ring-blue-500
          transition
        "
      />

      {/* BUTTONS */}
      <div className="flex gap-2 w-full sm:w-auto">
        <button
          type="submit"
          className="
            flex-1 sm:flex-none
            px-5 py-3
            rounded-xl
            font-semibold
            text-white
            bg-gradient-to-r from-blue-500 to-indigo-500
            hover:from-blue-600 hover:to-indigo-600
            active:scale-95
            transition
          "
        >
          Search
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="
            flex-1 sm:flex-none
            px-5 py-3
            rounded-xl
            font-semibold
            text-gray-700 dark:text-gray-200
            bg-gray-100 dark:bg-white/10
            hover:bg-gray-200 dark:hover:bg-white/20
            active:scale-95
            transition
          "
        >
          Reset
        </button>
      </div>
    </motion.form>
  );
}