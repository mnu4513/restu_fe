import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer
      className="
        relative mt-20
        border-t border-gray-200 dark:border-white/10
        bg-white/70 dark:bg-[#0b0f19]/70
        backdrop-blur-2xl
        text-gray-700 dark:text-gray-300
      "
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-10 w-72 h-72 bg-orange-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-green-500/10 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-14">
        
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-orange-500 to-green-500 bg-clip-text text-transparent">
              🍴 MyRestaurant
            </h2>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Fresh ingredients, rich flavors, and unforgettable dining
              experiences delivered straight to your doorstep.
            </p>

            <div className="mt-5 flex gap-3">
              {["🍕", "🍔", "🥗"].map((icon, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="
                    w-10 h-10
                    flex items-center justify-center
                    rounded-xl
                    bg-white dark:bg-white/5
                    border border-gray-200 dark:border-white/10
                    shadow-sm
                  "
                >
                  {icon}
                </motion.div>
              ))}
            </div>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/menu">Menu</FooterLink>
              <FooterLink href="/cart">Cart</FooterLink>
              <FooterLink href="/orders">Orders</FooterLink>
            </div>
          </div>

          {/* INFO */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Experience
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              We serve premium quality meals made by expert chefs. Fast
              delivery, secure checkout, and customer-first service.
            </p>

            <div className="mt-5 text-sm text-gray-500">
              📍 100% Fresh Ingredients <br />
              🚀 Fast Delivery <br />
              ⭐ Top Rated Restaurant
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div
          className="
            mt-12 pt-6
            border-t border-gray-200 dark:border-white/10
            flex flex-col md:flex-row
            items-center justify-between
            gap-4
            text-sm
          "
        >
          <p className="text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} MyRestaurant. All rights reserved.
          </p>

          <div className="flex gap-4 text-gray-500 dark:text-gray-400">
            <span className="hover:text-orange-500 transition cursor-pointer">
              Privacy
            </span>
            <span className="hover:text-orange-500 transition cursor-pointer">
              Terms
            </span>
            <span className="hover:text-orange-500 transition cursor-pointer">
              Support
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* LINK COMPONENT */
function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="
        text-sm
        text-gray-600 dark:text-gray-400
        hover:text-orange-500
        transition
        relative
        w-fit
      "
    >
      {children}

      <span
        className="
          absolute left-0 -bottom-1
          w-0 h-[1px]
          bg-gradient-to-r from-orange-500 to-green-500
          transition-all duration-300
          hover:w-full
        "
      />
    </Link>
  );
}