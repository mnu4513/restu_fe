import axios from "axios";
import toast from "react-hot-toast";
import { BackendAPI } from "@/utils/api";

const api = axios.create({
  baseURL: BackendAPI,
});


// ✅ RESPONSE SUCCESS HANDLER
api.interceptors.response.use(
  (response) => {
    if (response?.data?.success === false) {
      toast.error(response?.data?.message || "Operation failed");
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
