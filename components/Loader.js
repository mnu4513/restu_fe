"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="relative flex flex-col items-center justify-center py-20 overflow-hidden">
      
      {/* Background Glow */}
      <div
        className="
          absolute
          w-72 h-72
          rounded-full
          bg-gradient-to-r
          from-orange-500/20
          via-yellow-400/20
          to-green-500/20
          blur-3xl
          animate-pulse
        "
      />

      {/* Spinner Wrapper */}
      <div className="relative flex items-center justify-center">
        
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "linear",
          }}
          className="
            absolute
            w-28 h-28
            rounded-full
            border-[3px]
            border-orange-500/20
            border-t-orange-500
            border-r-green-500
          "
        />

        {/* Middle Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "linear",
          }}
          className="
            absolute
            w-20 h-20
            rounded-full
            border-[3px]
            border-green-500/20
            border-t-green-500
            border-r-yellow-400
          "
        />

        {/* Center Glow */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
          }}
          className="
            flex items-center justify-center
            w-12 h-12
            rounded-full
            bg-gradient-to-r
            from-orange-500
            to-green-500
            shadow-2xl shadow-orange-500/40
          "
        >
          <motion.span
            animate={{
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="text-white text-lg"
          >
            🍴
          </motion.span>
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="mt-10 text-center"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Preparing Delicious Experience
        </h3>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Loading fresh dishes for you...
        </p>
      </motion.div>

      {/* Floating Dots */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: i * 0.2,
            }}
            className="
              w-3 h-3
              rounded-full
              bg-gradient-to-r
              from-orange-500
              to-green-500
            "
          />
        ))}
      </div>
    </div>
  );
}