import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import api from "@/utils/axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const { register } = useContext(AuthContext);
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
  });

  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      await api.post(`${API}/api/auth/send-otp`, {
        name: form.name,
        email: form.email,
      });

      toast.success("OTP sent to your email 📩");
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post(`${API}/api/auth/verify-otp`, {
        email: form.email,
        otp,
      });

      if (data.success) {
        await api.post(`${API}/api/auth/register`, {
          name: form.name,
          email: form.email,
          number: form.number,
          password: form.password,
        });

        toast.success("Account created 🎉 Please login");
        router.push("/login");
      } else {
        toast.error("OTP verification failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-white dark:bg-[#0b0f19] overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-120px] left-[-120px] w-72 h-72 bg-orange-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-120px] right-[-120px] w-72 h-72 bg-green-500/20 blur-3xl rounded-full" />
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="
          relative z-10
          w-full max-w-md mx-4
          rounded-3xl
          border border-gray-200 dark:border-white/10
          bg-white/70 dark:bg-white/[0.03]
          backdrop-blur-2xl
          shadow-2xl
          p-8
        "
      >

        {/* HEADER */}
        <h2 className="text-3xl font-black text-center text-gray-900 dark:text-white">
          Create Account 🍽️
        </h2>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          Join and enjoy fresh food daily
        </p>

        {/* STEP INDICATOR */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`
                h-2 w-16 rounded-full transition-all
                ${step >= s
                  ? "bg-gradient-to-r from-orange-500 to-green-500"
                  : "bg-gray-200 dark:bg-white/10"
                }
              `}
            />
          ))}
        </div>

        {/* FORM */}
        <AnimatePresence mode="wait">

          {/* STEP 1 */}
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOtp}
              className="mt-8 space-y-4"
            >
              <Input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <Input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <Input
                placeholder="Phone Number"
                value={form.number}
                onChange={(e) =>
                  setForm({ ...form, number: e.target.value })
                }
              />

              <Input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <button
                type="submit"
                className="
                  w-full py-3
                  rounded-2xl
                  font-semibold
                  text-white
                  bg-gradient-to-r from-orange-500 to-green-500
                  hover:scale-[1.02]
                  active:scale-95
                  transition
                "
              >
                Send OTP
              </button>
            </motion.form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOtp}
              className="mt-8 space-y-4"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                OTP sent to <strong>{form.email}</strong>
              </p>

              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                type="submit"
                className="
                  w-full py-3
                  rounded-2xl
                  font-semibold
                  text-white
                  bg-gradient-to-r from-green-500 to-orange-500
                  hover:scale-[1.02]
                  active:scale-95
                  transition
                "
              >
                Verify & Create Account
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="
                  w-full py-3
                  rounded-2xl
                  border border-gray-200 dark:border-white/10
                  text-gray-700 dark:text-gray-300
                  hover:bg-gray-100 dark:hover:bg-white/5
                  transition
                "
              >
                Back
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}

/* INPUT COMPONENT */
function Input({ ...props }) {
  return (
    <input
      {...props}
      className="
        w-full px-4 py-3
        rounded-2xl
        border border-gray-200 dark:border-white/10
        bg-white dark:bg-white/5
        text-gray-900 dark:text-white
        outline-none
        focus:ring-2 focus:ring-orange-500
        transition
      "
    />
  );
}