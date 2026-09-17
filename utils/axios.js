import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// ================= REQUEST INTERCEPTOR =================
// Automatically attach JWT token to authenticated requests
api.interceptors.request.use(
  (config) => {
    try {
      // localStorage is only available in the browser
      if (typeof window !== "undefined") {
        const rawUser = localStorage.getItem("user");

        if (rawUser) {
          const user = JSON.parse(rawUser);

          if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        }
      }
    } catch (error) {
      console.error("Axios auth token error:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => {
    if (response?.data?.success === false) {
      toast.error(
        response?.data?.message || "Operation failed"
      );
    }

    return response;
  },

  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    toast.error(message);

    return Promise.reject(error);
  }
);

export default api;