"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import ItemCard from "@/components/ItemCard";
import Loader from "@/components/Loader";

import api from "@/utils/axios";
import { BackendAPI } from "@/utils/api";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = BackendAPI || "";

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await api.get(`${API}/api/menu`);
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-white dark:bg-[#0b0f19] transition-colors duration-500">

      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute top-0 left-[-150px] w-[320px] h-[320px] rounded-full bg-orange-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-[-150px] w-[320px] h-[320px] rounded-full bg-green-500/10 blur-3xl" />

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-white/5 dark:bg-white/[0.02] blur-3xl" />
      </div>

      {/* ================= HEADER ================= */}
      <section className="relative z-10 pt-28 pb-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              inline-flex items-center gap-2
              px-4 py-2
              rounded-full
              border border-orange-200 dark:border-orange-500/20
              bg-orange-50 dark:bg-orange-500/10
              text-orange-600 dark:text-orange-400
              text-sm font-medium
              backdrop-blur-xl
            "
          >
            🍽️ Explore Freshly Made Dishes
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="
              mt-6
              text-5xl sm:text-6xl lg:text-7xl
              font-black
              leading-tight
              text-gray-900 dark:text-white
            "
          >
            Our
            <span className="block bg-gradient-to-r from-orange-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
              Signature Menu
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Discover chef-crafted meals made with premium ingredients and
            delivered fresh to your table.
          </motion.p>

        </div>
      </section>

      {/* ================= MENU SECTION ================= */}
      <section className="relative z-10 pb-24">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ================= LOADING ================= */}
          {loading ? (
            <div className="min-h-[60vh] flex items-center justify-center">
              <Loader />
            </div>
          ) : items.length === 0 ? (

            /* ================= EMPTY ================= */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="
                py-28 text-center
                rounded-[40px]
                border border-gray-200 dark:border-white/10
                bg-white/70 dark:bg-white/[0.03]
                backdrop-blur-2xl
              "
            >
              <div className="text-6xl mb-4">🍽️</div>

              <h3 className="text-3xl font-black text-gray-900 dark:text-white">
                No Dishes Available
              </h3>

              <p className="mt-3 text-gray-500 dark:text-gray-400">
                Please check back later.
              </p>
            </motion.div>

          ) : (

            /* ================= GRID ================= */
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-3
                gap-6 lg:gap-8
              "
            >
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <ItemCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}