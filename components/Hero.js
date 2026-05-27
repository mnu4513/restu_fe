"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#0f1115] transition-colors duration-500">
      
      {/* Background Blur Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-[-100px] left-[-80px] w-[220px] sm:w-[320px] h-[220px] sm:h-[320px] rounded-full bg-orange-400/20 dark:bg-orange-500/20 blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
          }}
        />

        <motion.div
          className="absolute bottom-[-100px] right-[-80px] w-[220px] sm:w-[320px] h-[220px] sm:h-[320px] rounded-full bg-green-400/20 dark:bg-green-500/20 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center py-24">
        
        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-14 items-center w-full">
          
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-300/40 dark:border-orange-500/30 bg-orange-100/40 dark:bg-white/5 backdrop-blur-md"
            >
              <span className="text-orange-500">🔥</span>

              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Fast Delivery & Premium Taste
              </span>
            </motion.div>

            {/* HEADING */}
            <motion.h1
              className="mt-6 text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black leading-[1.1] text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Delicious Food
              <span className="block bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
                Delivered Fresh
              </span>
            </motion.h1>

            {/* DESCRIPTION */}
            <motion.p
              className="mt-5 text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Experience restaurant-quality meals crafted with fresh
              ingredients and delivered straight to your doorstep.
            </motion.p>

            {/* BUTTONS */}
            <motion.div
              className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Link
                href="/menu"
                className="w-full sm:w-auto text-center px-7 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-green-500 text-white font-semibold shadow-xl hover:scale-105 active:scale-95 transition duration-300"
              >
                Explore Menu
              </Link>

              <Link
                href="/reservation"
                className="w-full sm:w-auto text-center px-7 py-4 rounded-2xl border border-gray-300 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl text-gray-900 dark:text-white hover:bg-white dark:hover:bg-white/10 transition duration-300"
              >
                Book Table
              </Link>
            </motion.div>

            {/* STATS */}
            <motion.div
              className="mt-10 grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {[
                ["500+", "Dishes"],
                ["4.9★", "Reviews"],
                ["30min", "Delivery"],
              ].map(([value, label]) => (
                <div key={label} className="text-center lg:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {value}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-green-500/20 blur-3xl rounded-full" />

            {/* Main Image */}
            <motion.div
              whileHover={{
                y: -8,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
              }}
              className="relative overflow-hidden rounded-[28px] sm:rounded-[40px] border border-white/20 dark:border-white/10 shadow-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl w-full max-w-[500px]"
            >
              <Image
                src="/hero_image.webp"
                alt="Food"
                width={700}
                height={700}
                priority
                className="w-full h-[340px] sm:h-[480px] md:h-[550px] object-cover"
              />
            </motion.div>

            {/* Floating Card */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="absolute bottom-[-20px] sm:bottom-[-30px] left-1/2 -translate-x-1/2 lg:left-[-30px] lg:translate-x-0 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl px-5 py-4"
            >
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Chef’s Special
              </p>

              <h4 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                Truffle Pasta 🍝
              </h4>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}