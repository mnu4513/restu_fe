import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 ">
            {/* Navbar always at top */}
            <Navbar />

            {/* Main content grows to fill space */}
            <main className="flex-grow">
              <Component {...pageProps} />
            </main>

            {/* Sticky footer at bottom */}
            <Footer />

            <Toaster position="top-right" />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
