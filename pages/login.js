import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      toast.success("Welcome back 🍽️");
      router.push("/");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-white dark:bg-[#0b0f19] overflow-hidden">

      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-120px] left-[-120px] w-72 h-72 bg-orange-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-72 h-72 bg-green-500/20 blur-3xl rounded-full" />
      </div>

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="
          relative z-10
          w-full max-w-md
          mx-4
          rounded-3xl
          border border-gray-200 dark:border-white/10
          bg-white/70 dark:bg-white/[0.03]
          backdrop-blur-2xl
          shadow-2xl
          p-8
        "
      >

        {/* Title */}
        <h2 className="text-3xl font-black text-center text-gray-900 dark:text-white">
          Welcome Back 👋
        </h2>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          Login to continue your delicious journey
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin} className="mt-8 space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Email / Phone
            </label>

            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email or phone"
              className="
                mt-2 w-full
                px-4 py-3
                rounded-2xl
                border border-gray-200 dark:border-white/10
                bg-white dark:bg-white/5
                text-gray-900 dark:text-white
                outline-none
                focus:ring-2 focus:ring-orange-500
                transition
              "
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="
                mt-2 w-full
                px-4 py-3
                rounded-2xl
                border border-gray-200 dark:border-white/10
                bg-white dark:bg-white/5
                text-gray-900 dark:text-white
                outline-none
                focus:ring-2 focus:ring-green-500
                transition
              "
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="
              w-full
              py-3
              rounded-2xl
              font-semibold
              text-white
              bg-gradient-to-r from-orange-500 to-green-500
              shadow-lg shadow-orange-500/20
              hover:scale-[1.02]
              active:scale-95
              transition
            "
          >
            Login
          </button>
        </form>

        {/* FOOTER TEXT */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          Fresh food • Fast delivery • Secure login
        </p>
      </motion.div>
    </main>
  );
}