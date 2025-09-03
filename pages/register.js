import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      toast.success("Account created!");
      router.push("/");
    } catch (err) {
      toast.error("Error creating account");
    }
  };

  return (
    <div>
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-4">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Name" className="w-full border px-3 py-2 rounded" required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" className="w-full border px-3 py-2 rounded" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" className="w-full border px-3 py-2 rounded" required />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
