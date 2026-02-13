import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Custom404() {
  const router = useRouter();

  return (
    <div
      className="relative min-h-screen overflow-hidden
      bg-[#9fa5b4] dark:bg-[#050505]
      transition-colors duration-300"
    >

      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-30 dark:opacity-0
        bg-[linear-gradient(#6366f11a_1px,transparent_1px),
        linear-gradient(90deg,#6366f11a_1px,transparent_1px)]
        bg-[size:60px_60px]"
      />

      {/* ORBS */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px]
        bg-purple-400/30 dark:bg-purple-700/20
        rounded-full blur-[120px]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px]
        bg-blue-400/30 dark:bg-blue-700/20
        rounded-full blur-[120px]"
        animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
      />

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[120px] md:text-[170px] font-black
          bg-gradient-to-r from-purple-600 to-blue-600
          text-transparent bg-clip-text"
        >
          404
        </motion.h1>

        <motion.h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Lost Between the Planets 🌍
        </motion.h2>

        <p className="bg-gradient-to-r from-purple-600 to-blue-600
          text-transparent bg-clip-text mt-2 text-center max-w-md font-semibold">
          This page is orbiting somewhere unknown. Let’s bring you back safely.
        </p>

        {/* BUTTONS */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">

          <Link
            href="/"
            className="px-8 py-3 rounded-xl font-medium
            bg-gradient-to-r from-purple-600 to-blue-600
            hover:from-purple-500 hover:to-blue-500
            text-white transition-all duration-300"
          >
            Return Home
          </Link>

          <button
            onClick={() => router.back()}
            className="px-8 py-3 rounded-xl font-medium
            bg-white/70 dark:bg-white/10
            text-gray-800 dark:text-white"
          >
            Go Back
          </button>

        </div>
      </div>
    </div>
  );
}
