import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="h-[70vh] bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-center text-center relative overflow-hidden">
      <div className="max-w-3xl px-6">
        {/* Animated Heading */}
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to <span className="text-yellow-300">MyRestaurant</span> 🍴
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-4 text-lg text-white/90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Delicious food, delivered fast & fresh at your doorstep.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link
            href="/menu"
            className="bg-yellow-400 text-green-900 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-300 transition"
          >
            View Menu
          </Link>
          <Link
            href="/cart"
            className="bg-white/90 text-green-700 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-white transition"
          >
            Order Now
          </Link>
        </motion.div>
      </div>

      {/* Floating food emojis */}
      <motion.div
        className="absolute top-10 left-10 text-4xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        🍕
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10 text-4xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 3, delay: 1 }}
      >
        🍔
      </motion.div>
      <motion.div
        className="absolute top-20 right-1/4 text-4xl"
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
      >
        🥗
      </motion.div>
    </section>
  );
}
