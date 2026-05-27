import { motion } from "framer-motion";

export default function AdminPagination({ page, pages, setPage }) {
  const isFirst = page === 1;
  const isLast = page === pages;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        flex items-center justify-center gap-4 mt-10
        select-none
      "
    >
      {/* Pagination Box */}
      <div
        className="
          flex items-center gap-3
          px-4 py-2
          rounded-2xl
          border border-gray-200 dark:border-white/10
          bg-white/70 dark:bg-white/[0.03]
          backdrop-blur-xl
          shadow-sm
        "
      >
        {/* Prev */}
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={isFirst}
          className={`
            px-4 py-2 rounded-xl text-sm font-medium
            transition-all duration-300
            ${
              isFirst
                ? "opacity-40 cursor-not-allowed bg-gray-200 dark:bg-white/10"
                : "hover:scale-105 active:scale-95 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20"
            }
          `}
        >
          ← Prev
        </button>

        {/* Page Info */}
        <div
          className="
            px-4 py-2
            rounded-xl
            bg-gradient-to-r from-orange-500/10 to-green-500/10
            text-sm font-semibold
            text-gray-700 dark:text-gray-200
            border border-gray-200 dark:border-white/10
          "
        >
          Page <span className="text-orange-500">{page}</span> of{" "}
          <span className="text-green-500">{pages}</span>
        </div>

        {/* Next */}
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={isLast}
          className={`
            px-4 py-2 rounded-xl text-sm font-medium
            transition-all duration-300
            ${
              isLast
                ? "opacity-40 cursor-not-allowed bg-gray-200 dark:bg-white/10"
                : "hover:scale-105 active:scale-95 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20"
            }
          `}
        >
          Next →
        </button>
      </div>
    </motion.div>
  );
}