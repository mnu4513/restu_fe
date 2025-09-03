import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
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
  );
}

export default MyApp;
