"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Hero from "@/components/Hero";
import ItemCard from "@/components/ItemCard";
import Loader from "@/components/Loader";

import api from "@/utils/axios";

import Link from "next/link";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  // ==================================================
  // FETCH MENU
  // ==================================================

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await api.get(`${API}/api/menu`);

        // Keep all items.
        // We will filter Food and Store separately below.
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load menu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [API]);

  // ==================================================
  // FILTER HOME PAGE ITEMS
  // ==================================================

  // Show only 3 Food items
  const foodItems = items
    .filter((item) => item.category === "food")
    .slice(0, 3);

  // Show only 6 Store items
  const storeItems = items
    .filter((item) => item.category === "store")
    .slice(0, 6);

  // ==================================================
  // ANIMATION
  // ==================================================

  const gridVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 40,
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
          HERO
      ================================================== */}

      <Hero />


      {/* ==================================================
          BACKGROUND EFFECTS
      ================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Top Gradient Blob */}
        <div
          className="
            absolute top-[20%] left-[-150px]
            w-[300px] h-[300px]
            rounded-full
            bg-orange-500/10
            blur-3xl
          "
        />

        {/* Bottom Gradient Blob */}
        <div
          className="
            absolute bottom-[10%] right-[-150px]
            w-[320px] h-[320px]
            rounded-full
            bg-green-500/10
            blur-3xl
          "
        />

      </div>


      {/* ==================================================
          MENU SECTION
      ================================================== */}

      <section className="relative z-10 py-24">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          {/* ==================================================
              SECTION HEADER
          ================================================== */}

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">

            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >

              {/* Small Badge */}
              <div
                className="
                  inline-flex items-center gap-2
                  px-4 py-2 mb-5
                  rounded-full
                  border border-orange-200 dark:border-orange-500/20
                  bg-orange-50 dark:bg-orange-500/10
                  text-orange-600 dark:text-orange-400
                  text-sm font-medium
                "
              >
                🍴 Popular Choices
              </div>


              {/* Heading */}
              <h2
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
                    from-red-500
                    via-blue-400
                    to-green-500
                    bg-clip-text
                    text-transparent
                  "
                >
                  Food & Store
                </span>
              </h2>


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
                Discover delicious food and everyday essentials,
                carefully selected for you.
              </p>

            </motion.div>


            {/* RIGHT BUTTON */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >

              <Link
                href="/food"
                className="
                  group relative overflow-hidden
                  inline-flex items-center justify-center
                  px-7 py-4
                  rounded-2xl
                  bg-gradient-to-r
                
                  from-blue-400
                  to-green-500
                  text-white
                  font-semibold
                  shadow-xl shadow-orange-500/20
                  hover:scale-105
                  active:scale-95
                  transition-all duration-300
                "
              >

                {/* Shine Effect */}
                <span
                  className="
                    absolute top-0 left-[-120%]
                    h-full w-[120%]
                    bg-gradient-to-r
                    from-transparent
                    via-white/30
                    to-transparent
                    skew-x-12
                    group-hover:left-[120%]
                    transition-all duration-1000
                  "
                />

                <span className="relative z-10 flex items-center gap-2">
                  🍔 Explore Food Menu →
                </span>

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

          ) : (

            <>

              {/* ==================================================
                  FOOD SECTION
              ================================================== */}

              {foodItems.length > 0 && (

                <section className="mb-24">

                  {/* Food Header */}
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">

                    <div>

                      <div className="flex items-center gap-3">

                        <span
                          className="
                            flex items-center justify-center
                            w-11 h-11
                            rounded-2xl
                            bg-orange-500/10
                            text-2xl
                          "
                        >
                          🍔
                        </span>

                        <div>

                          <h3 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                            Food
                          </h3>

                          <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Fresh and delicious food for you
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* View All Food */}
                    <Link
                      href="/food"
                      className="
                        inline-flex items-center
                        text-sm font-semibold
                        text-orange-600 dark:text-orange-400
                        hover:gap-3
                        transition-all
                      "
                    >
                      View All Food →
                    </Link>

                  </div>


                  {/* Food Grid */}
                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={gridVariants}
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      xl:grid-cols-3
                      gap-6 lg:gap-8
                    "
                  >

                    {foodItems.map((item) => (

                      <motion.div
                        key={item._id}
                        variants={cardVariants}
                        transition={{ duration: 0.6 }}
                      >
                        <ItemCard item={item} />
                      </motion.div>

                    ))}

                  </motion.div>

                </section>

              )}


              {/* ==================================================
                  STORE SECTION
              ================================================== */}

              {storeItems.length > 0 && (

                <section className="mb-24">

                  {/* Store Header */}
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">

                    <div>

                      <div className="flex items-center gap-3">

                        <span
                          className="
                            flex items-center justify-center
                            w-11 h-11
                            rounded-2xl
                            bg-green-500/10
                            text-2xl
                          "
                        >
                          🛒
                        </span>

                        <div>

                          <h3 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                            Store
                          </h3>

                          <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Everyday essentials at your convenience
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* View All Store */}
                    <Link
                      href="/store"
                      className="
                        inline-flex items-center
                        text-sm font-semibold
                        text-green-600 dark:text-green-400
                        hover:gap-3
                        transition-all
                      "
                    >
                      View All Store →
                    </Link>

                  </div>


                  {/* Store Grid */}
                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={gridVariants}
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      lg:grid-cols-3
                      xl:grid-cols-3
                      gap-6 lg:gap-8
                    "
                  >

                    {storeItems.map((item) => (

                      <motion.div
                        key={item._id}
                        variants={cardVariants}
                        transition={{ duration: 0.6 }}
                      >
                        <ItemCard item={item} />
                      </motion.div>

                    ))}

                  </motion.div>

                </section>

              )}


              {/* ==================================================
                  NO ITEMS
              ================================================== */}

              {foodItems.length === 0 &&
                storeItems.length === 0 && (

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

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      No Items Available
                    </h3>

                    <p className="mt-3 text-gray-500 dark:text-gray-400">
                      Please check again later.
                    </p>

                  </motion.div>

                )}

            </>

          )}


          {/* ==================================================
              BOTTOM CTA
          ================================================== */}

          {!loading &&
            (foodItems.length > 0 || storeItems.length > 0) && (

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
                    from-blue-500
                    
                    via-green-400
                    to-blue-500
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
                      Hungry or Need Something?
                    </h3>


                    <p
                      className="
                        mt-4
                        max-w-2xl mx-auto
                        text-white/90
                        text-base sm:text-lg
                      "
                    >
                      Explore our complete food menu and store
                      collection. Find everything you need in one place.
                    </p>


                    <Link
                      href="/store"
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

                      <span className="flex items-center gap-2">
                        Browse Store 🛍️
                      </span>

                    </Link>

                  </div>

                </div>

              </motion.div>

            )}

        </div>

      </section>

    </main>
  );
};