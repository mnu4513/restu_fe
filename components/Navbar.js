"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { CartContext } from "@/context/CartContext";
import DarkModeToggle from "@/components/DarkModeToggle";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  const cartCount = cart.reduce(
    (sum, i) => sum + i.quantity,
    0
  );

  // ================= ROLE CHECKS =================

  const isNormalUser =
    user?.role === "user";

  const isAdmin =
    user?.role === "admin";

  const isDelivery =
    user?.role === "delivery";

  return (
    <nav
      className="
        sticky top-0 z-50
        backdrop-blur-xl
        bg-white/70 dark:bg-[#0b0f19]/70
        border-b border-gray-200/50 dark:border-white/10
        transition-all duration-300
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ================= BRAND ================= */}
          <Link
            href="/"
            className="
              text-xl font-black
              bg-gradient-to-r
              from-orange-500
              to-green-500
              bg-clip-text
              text-transparent
              hover:scale-105
              transition
            "
          >
            🍴 MyRestaurant
          </Link>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden md:flex items-center gap-7">

            {/* FOOD */}
            <NavLink
              href="/food"
              active={router.pathname === "/food"}
            >
              Food
            </NavLink>

            {/* STORE */}
            <NavLink
              href="/store"
              active={router.pathname === "/store"}
            >
              Store
            </NavLink>

            {/* ================= NORMAL USER ONLY ================= */}

            {isNormalUser && (
              <>
                {/* CART */}
                <NavLink
                  href="/cart"
                  active={router.pathname === "/cart"}
                >
                  Cart{" "}
                  {cartCount > 0 && (
                    <span
                      className="
                        ml-1 px-2 py-[2px]
                        text-xs
                        rounded-full
                        bg-orange-500
                        text-white
                        shadow-lg
                        shadow-orange-500/30
                      "
                    >
                      {cartCount}
                    </span>
                  )}
                </NavLink>

                {/* ORDERS */}
                <NavLink
                  href="/orders"
                  active={router.pathname === "/orders"}
                >
                  Orders
                </NavLink>
              </>
            )}

            {/* ================= ADMIN ONLY ================= */}

            {isAdmin && (
              <NavLink
                href="/admin"
                active={
                  router.pathname.startsWith("/admin")
                }
              >
                Admin
              </NavLink>
            )}

            {/* ================= DELIVERY ONLY ================= */}

            {isDelivery && (
              <NavLink
                href="/delivery"
                active={
                  router.pathname.startsWith("/delivery")
                }
              >
                Delivery
              </NavLink>
            )}

            {/* ================= AUTH ================= */}

            {user ? (
              <div className="flex items-center gap-3">

                {/* PROFILE */}
                <Link href="/profile">
                  <div
                    className="
                      w-9 h-9
                      rounded-full
                      flex items-center justify-center
                      bg-gradient-to-br
                      from-orange-400
                      to-green-500
                      text-white
                      font-bold
                      shadow-md
                      hover:scale-110
                      transition
                      cursor-pointer
                    "
                  >
                    {user.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>
                </Link>

                {/* LOGOUT */}
                <button
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="
                    px-4 py-2
                    rounded-xl
                    bg-red-500/90
                    text-white
                    hover:bg-red-600
                    transition
                  "
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">

                {/* LOGIN */}
                <NavLink
                  href="/login"
                  active={router.pathname === "/login"}
                >
                  Login
                </NavLink>

                {/* REGISTER */}
                <NavLink
                  href="/register"
                  active={
                    router.pathname === "/register"
                  }
                >
                  Register
                </NavLink>
              </div>
            )}

            {/* DARK MODE */}
            <DarkModeToggle />
          </div>

          {/* ================= MOBILE BUTTON ================= */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              md:hidden
              relative
              w-10 h-10
              flex flex-col
              justify-center
              items-center
            "
          >
            <motion.span
              animate={{
                rotate: menuOpen ? 45 : 0,
                y: menuOpen ? 6 : 0,
              }}
              className="
                w-6 h-[2px]
                bg-gray-900
                dark:bg-white
                rounded
              "
            />

            <motion.span
              animate={{
                opacity: menuOpen ? 0 : 1,
              }}
              className="
                w-6 h-[2px]
                bg-gray-900
                dark:bg-white
                my-1
                rounded
              "
            />

            <motion.span
              animate={{
                rotate: menuOpen ? -45 : 0,
                y: menuOpen ? -6 : 0,
              }}
              className="
                w-6 h-[2px]
                bg-gray-900
                dark:bg-white
                rounded
              "
            />
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            className="
              md:hidden
              bg-white
              dark:bg-[#0b0f19]
              border-t
              border-gray-200
              dark:border-white/10
              px-6 py-6
              space-y-4
            "
          >

            {/* FOOD */}
            <MobileLink
              href="/food"
              setMenuOpen={setMenuOpen}
            >
              Food
            </MobileLink>

            {/* STORE */}
            <MobileLink
              href="/store"
              setMenuOpen={setMenuOpen}
            >
              Store
            </MobileLink>

            {/* ================= NORMAL USER ================= */}

            {isNormalUser && (
              <>
                {/* CART */}
                <MobileLink
                  href="/cart"
                  setMenuOpen={setMenuOpen}
                >
                  Cart{" "}
                  {cartCount > 0 &&
                    `(${cartCount})`}
                </MobileLink>

                {/* ORDERS */}
                <MobileLink
                  href="/orders"
                  setMenuOpen={setMenuOpen}
                >
                  Orders
                </MobileLink>
              </>
            )}

            {/* ================= ADMIN ================= */}

            {isAdmin && (
              <MobileLink
                href="/admin"
                setMenuOpen={setMenuOpen}
              >
                Admin
              </MobileLink>
            )}

            {/* ================= DELIVERY ================= */}

            {isDelivery && (
              <MobileLink
                href="/delivery"
                setMenuOpen={setMenuOpen}
              >
                Delivery
              </MobileLink>
            )}

            {/* ================= AUTH ================= */}

            {user ? (
              <>
                {/* PROFILE */}
                <MobileLink
                  href="/profile"
                  setMenuOpen={setMenuOpen}
                >
                  Profile
                </MobileLink>

                {/* LOGOUT */}
                <button
                  onClick={() => {
                    logout();
                    router.push("/login");
                    setMenuOpen(false);
                  }}
                  className="
                    w-full
                    text-left
                    px-4 py-2
                    rounded-xl
                    bg-red-500
                    text-white
                  "
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* LOGIN */}
                <MobileLink
                  href="/login"
                  setMenuOpen={setMenuOpen}
                >
                  Login
                </MobileLink>

                {/* REGISTER */}
                <MobileLink
                  href="/register"
                  setMenuOpen={setMenuOpen}
                >
                  Register
                </MobileLink>
              </>
            )}

            {/* DARK MODE */}
            <div className="pt-2">
              <DarkModeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ================= NAV LINK ================= */

function NavLink({
  href,
  children,
  active,
}) {
  return (
    <Link
      href={href}
      className="
        group
        relative
        text-gray-700
        dark:text-gray-300
        hover:text-orange-500
        transition
      "
    >
      {children}

      <span
        className={`
          absolute
          left-0
          -bottom-1
          h-[2px]
          bg-gradient-to-r
          from-orange-500
          to-green-500
          transition-all
          duration-300
          ${
            active
              ? "w-full"
              : "w-0 group-hover:w-full"
          }
        `}
      />
    </Link>
  );
}

/* ================= MOBILE LINK ================= */

function MobileLink({
  href,
  children,
  setMenuOpen,
}) {
  return (
    <Link
      href={href}
      onClick={() => setMenuOpen(false)}
      className="
        block
        py-2
        text-gray-700
        dark:text-gray-300
        hover:text-orange-500
        transition
      "
    >
      {children}
    </Link>
  );
}