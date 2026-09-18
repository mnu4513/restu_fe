"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import ItemCard from "@/components/ItemCard";
import Loader from "@/components/Loader";

import api from "@/utils/axios";

import Link from "next/link";

export default function Store() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // ==================================================
  // FETCH STORE ITEMS
  // ==================================================

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const { data } = await api.get(`${API}/api/menu`);

        const storeItems = Array.isArray(data)
          ? data.filter((item) => item.category === "store")
          : [];

        setItems(storeItems);
      } catch (err) {
        console.error("Failed to load store:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [API]);

  // ==================================================
  // ANIMATION
  // ==================================================

  const gridVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="relative overflow-hidden bg-white dark:bg-[#0b0f19] transition-colors duration-500">

      {/* ==================================================
          BACKGROUND EFFECTS
      ================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Top Gradient Blob */}
        <div
          className="
            absolute top-[15%] left-[-150px]
            w-[300px] h-[300px]
            rounded-full
            bg-green-500/10
            blur-3xl
          "
        />

        {/* Bottom Gradient Blob */}
        <div
          className="
            absolute bottom-[10%] right-[-150px]
            w-[320px] h-[320px]
            rounded-full
            bg-orange-500/10
            blur-3xl
          "
        />

      </div>


      {/* ==================================================
          STORE SECTION
      ================================================== */}

      <section className="relative z-10 py-24">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">

            {/* LEFT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >

              {/* Badge */}
              <div
                className="
                  inline-flex items-center gap-2
                  px-4 py-2 mb-5
                  rounded-full
                  border border-green-200 dark:border-green-500/20
                  bg-green-50 dark:bg-green-500/10
                  text-green-600 dark:text-green-400
                  text-sm font-medium
                "
              >
                🛒 Everything You Need
              </div>


              {/* Heading */}
              <h1
                className="
                  text-4xl sm:text-5xl lg:text-6xl
                  font-black
                  leading-tight
                  text-gray-900 dark:text-white
                "
              >
                Explore

                <span
                  className="
                    block
                    bg-gradient-to-r
                    from-green-500
                    to-orange-500
                    bg-clip-text
                    text-transparent
                  "
                >
                  Our Store
                </span>
              </h1>


              {/* Description */}
              <p
                className="
                  mt-5
                  max-w-2xl
                  text-base sm:text-lg
                  leading-relaxed
                  text-gray-600 dark:text-gray-400
                "
              >
                Find groceries, personal care products, grooming
                essentials, stationery, toys, household items and more.
              </p>

            </motion.div>


            {/* FOOD BUTTON */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >

              <Link
                href="/food"
                className="
                  inline-flex items-center justify-center
                  px-7 py-4
                  rounded-2xl
                  border border-gray-200 dark:border-white/10
                  bg-white
                  dark:bg-white/[0.03]
                  text-gray-900 dark:text-white
                  font-semibold
                  hover:scale-105
                  active:scale-95
                  transition-all duration-300
                "
              >
                🍔 Browse Food →
              </Link>

            </motion.div>

          </div>


          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (

            <div className="py-24 flex justify-center">
              <Loader />
            </div>

          ) : items.length === 0 ? (

            /* ==================================================
                NO STORE ITEMS
            ================================================== */

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="
                py-24
                text-center
                rounded-[32px]
                border border-gray-200 dark:border-white/10
                bg-gray-50 dark:bg-white/[0.03]
                backdrop-blur-xl
              "
            >

              <div className="text-5xl mb-5">
                🛒
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Store Is Empty
              </h3>

              <p className="mt-3 text-gray-500 dark:text-gray-400">
                Please check again later.
              </p>

            </motion.div>

          ) : (

            /* ==================================================
                STORE GRID
            ================================================== */

            <motion.div
              initial="hidden"
              animate="show"
              variants={gridVariants}
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-6 lg:gap-8
              "
            >

              {items.map((item) => (

                <motion.div
                  key={item._id}
                  variants={cardVariants}
                  transition={{ duration: 0.5 }}
                >
                  <ItemCard item={item} />
                </motion.div>

              ))}

            </motion.div>

          )}


          {/* ==================================================
              BOTTOM CTA
          ================================================== */}

          {!loading && items.length > 0 && (

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="mt-24"
            >

              <div
                className="
                  relative overflow-hidden
                  rounded-[40px]
                  border border-gray-200 dark:border-white/10
                  bg-gradient-to-br
                  from-blue-300
                  via-green-400
                  to-blue-300
                  p-8 sm:p-12
                  shadow-2xl
                "
              >

                {/* Background Glow */}
                <div
                  className="
                    absolute -top-24 -right-24
                    w-72 h-72
                    rounded-full
                    bg-white/20
                    blur-3xl
                  "
                />


                {/* Content */}
                <div className="relative z-10 text-center">

                  <h3
                    className="
                      text-3xl sm:text-4xl
                      font-black
                      text-white
                    "
                  >
                    In the Mood for Food?
                  </h3>

                  <p
                    className="
                      mt-4
                      max-w-2xl mx-auto
                      text-white/90
                      text-base sm:text-lg
                    "
                  >
                    Take a break from shopping and enjoy something
                    delicious from our fresh food menu.
                  </p>

                  <Link
                    href="/food"
                    className="
                      group inline-flex items-center justify-center
                      mt-8
                      px-8 py-4
                      rounded-2xl
                      bg-white
                      text-gray-900
                      font-semibold
                      shadow-xl
                      hover:scale-105
                      active:scale-95
                      transition-all duration-300
                    "
                  >
                    🍔 Browse Food
                  </Link>

                </div>

              </div>

            </motion.div>

          )}

        </div>

      </section>

    </main>
  );
}