import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { CartContext } from "@/context/CartContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-green-600 text-white">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="font-bold text-xl">
          🍴 MyRestaurant
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Links */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute md:static top-16 left-0 w-full md:w-auto bg-green-700 md:bg-transparent md:flex space-y-4 md:space-y-0 md:space-x-6 px-6 md:px-0 py-4 md:py-0`}
        >
          <Link href="/menu" onClick={() => setMenuOpen(false)}>Menu</Link>
          <Link className="ml-3" href="/cart" onClick={() => setMenuOpen(false)}>
            Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
          </Link>
          {user ? (
            <>
              <Link className="ml-3" href="/orders" onClick={() => setMenuOpen(false)}>Orders</Link>
              {user.role === "admin" && (
                <Link className="ml-3" href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="ml-3 bg-red-500 px-3 py-1 rounded md:ml-4"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="ml-3" href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link className="ml-3" href="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
