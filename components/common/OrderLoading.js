import { motion } from "framer-motion";

export default function OrderLoading() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-5">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
          className="
            p-5 rounded-3xl
            border border-gray-200 dark:border-white/10
            bg-white/70 dark:bg-white/[0.03]
            backdrop-blur-2xl
          "
        >
          <div className="flex justify-between items-center">
            <div className="space-y-2 w-1/2">
              <div className="h-4 w-40 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
            </div>

            <div className="h-6 w-24 bg-orange-200 dark:bg-orange-500/20 rounded-full animate-pulse" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className="h-16 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}