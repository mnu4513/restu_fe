import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        {/* Brand */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-white">🍴 MyRestaurant</h2>
          <p className="text-sm text-gray-400">
            Delicious food delivered to your doorstep.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row gap-4 mb-4 md:mb-0">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/menu" className="hover:text-white">Menu</Link>
          <Link href="/cart" className="hover:text-white">Cart</Link>
          <Link href="/orders" className="hover:text-white">Orders</Link>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} MyRestaurant. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
