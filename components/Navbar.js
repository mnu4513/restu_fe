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

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-green-600/90 backdrop-blur-md text-white dark:bg-gray-900 shadow-lg ">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">

        {/* Brand */}
        <Link
          href="/"
          className="font-bold text-xl tracking-wide hover:scale-105 transition"
        >
          🍴 MyRestaurant
        </Link>

        {/* Hamburger */}
        <button
          className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <motion.span
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
            className="w-6 h-[2px] bg-white mb-1 rounded"
          />
          <motion.span
            animate={{ opacity: menuOpen ? 0 : 1 }}
            className="w-6 h-[2px] bg-white mb-1 rounded"
          />
          <motion.span
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
            className="w-6 h-[2px] bg-white rounded"
          />
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6 font-medium">

          <NavLink href="/menu">Menu</NavLink>

          {user?.role !== "admin" && (
            <NavLink href="/cart">
              Cart ({cartCount})
            </NavLink>
          )}

          {user && user.role !== "admin" && (
            <NavLink href="/orders">Orders</NavLink>
          )}

          {user && user.role === "admin" && (
            <NavLink href="/admin">Admin</NavLink>
          )}

          {user ? (
            <>
                {/* Profile Icon */}
    <Link href="/profile">
  <div className="
    w-10 h-10 rounded-full
    bg-gradient-to-br from-yellow-400 to-orange-500
    text-black flex items-center justify-center
    font-semibold cursor-pointer
    shadow-md hover:shadow-lg
    hover:scale-110 transition duration-300
  ">
    {user.name?.charAt(0).toUpperCase()}
  </div>
</Link>

            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
            </>
          ) : (
            <>
              <NavLink href="/login">Login</NavLink>
              <NavLink href="/register">Register</NavLink>
            </>
          )}

          <DarkModeToggle />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-green-700 dark:bg-gray-800 px-6 py-6 space-y-4"
          >
            <MobileLink href="/menu" setMenuOpen={setMenuOpen}>
              Menu
            </MobileLink>

            {user?.role !== "admin" && (
              <MobileLink href="/cart" setMenuOpen={setMenuOpen}>
                Cart ({cartCount})
              </MobileLink>
            )}

            {user && user.role !== "admin" && (
              <MobileLink href="/orders" setMenuOpen={setMenuOpen}>
                Orders
              </MobileLink>
            )}

            {user && user.role === "admin" && (
              <MobileLink href="/admin" setMenuOpen={setMenuOpen}>
                Admin
              </MobileLink>
            )}

            {user ? (
              <>
               <Link
    href="/profile"
    onClick={() => setMenuOpen(false)}
    className="block hover:text-yellow-300 transition"
  >
    Profile
  </Link>
             
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                  setMenuOpen(false);
                }}
                className="block w-full text-left bg-red-500 px-3 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
               </>
            ) : (
              <>
                <MobileLink href="/login" setMenuOpen={setMenuOpen}>
                  Login
                </MobileLink>
                <MobileLink href="/register" setMenuOpen={setMenuOpen}>
                  Register
                </MobileLink>
              </>
            )}

            <DarkModeToggle />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* Animated NavLink */
function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="relative hover:text-yellow-300 transition"
    >
      {children}
      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}

/* Mobile Link */
function MobileLink({ href, children, setMenuOpen }) {
  return (
    <Link
      href={href}
      onClick={() => setMenuOpen(false)}
      className="block hover:text-yellow-300 transition"
    >
      {children}
    </Link>
  );
}
