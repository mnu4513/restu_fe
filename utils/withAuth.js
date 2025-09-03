import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function withAuth(Component, role = "user") {
  return function ProtectedPage(props) {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push("/login");
      } else if (role === "admin" && user.role !== "admin") {
        router.push("/");
      }
    }, [user]);

    if (!user) return <p className="p-6">Loading...</p>;
    return <Component {...props} />;
  };
}
