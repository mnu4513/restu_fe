import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import api from "@/utils/axios";
import { BackendAPI } from "@/utils/api";

export default function Register() {
  const { register } = useContext(AuthContext);
  const router = useRouter();

  const [step, setStep] = useState(1); // 1=form, 2=otp
  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    password: "",
  });

  const API = BackendAPI || "";

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await api.post(`${API}/api/auth/send-otp`, { name: form.name, email: form.email });
      toast.success("OTP sent via E-mail");
      setStep(2);
    } catch (err) {
      console.error("Send OTP error:", err);
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

      // ⭐ Only create account (no login)
      await api.post(`${API}/api/auth/register`, {
        name: form.name,
        email: form.email,
        number: form.number,
        password: form.password,
      });

      toast.success("Account created successfully! Please login.");
      router.push("/login");

    } else {
      toast.error("OTP verification failed");
    }

  } catch (err) {
    console.error("Verify OTP error:", err);
    toast.error(err?.response?.data?.message || "OTP verification failed");
  }
};


  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-4">Register</h2>

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="text"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            placeholder="Phone (with country code, e.g. +919876543210)"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Send OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-gray-600">
            We’ve sent an OTP to <strong>{form.email}</strong>. Enter it below:
          </p>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Verify & Register
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full bg-gray-300 py-2 rounded"
          >
            Back
          </button>
        </form>
      )}
    </div>
  );
}
