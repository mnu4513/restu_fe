import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Login successful!");
      router.push("/");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="max-w-7xl m-auto">
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email / Phone" className="w-full border px-3 py-2 rounded" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" className="w-full border px-3 py-2 rounded" required />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
