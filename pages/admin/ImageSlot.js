import { useState } from "react";
import api from "@/utils/axios";
import toast from "react-hot-toast";

export default function ImageSlot({
  value,
  onChange,
  API,
  user,
  label,
}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadImage = async () => {
    if (!file) return toast.error("Please select a file");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post(
        `${API}/api/image/upload/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      console.log("Upload response:", res.data);

      // ✅ safer extraction (handles multiple backend formats)
      const imageUrl =
        res.data?.data?.secure_url ||
        res.data?.data?.url ||
        res.data?.secure_url ||
        res.data?.url ||
        "";

      if (!imageUrl) {
        toast.error("Upload response invalid");
        return;
      }

      onChange(imageUrl);
      toast.success("Image uploaded");

      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        group
        rounded-2xl
        border border-gray-200 dark:border-white/10
        bg-white/70 dark:bg-white/[0.03]
        backdrop-blur-xl
        p-3
        shadow-sm
        hover:shadow-lg
        transition-all
      "
    >
      {/* Label */}
      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
        {label}
      </p>

      {/* Preview */}
      <div
        className="
          w-full aspect-square
          rounded-xl
          overflow-hidden
          border border-gray-200 dark:border-white/10
          bg-gray-50 dark:bg-gray-900
          flex items-center justify-center
          mb-3
        "
      >
        {value ? (
          <img
            src={value}
            alt="preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-xs">No Image</span>
        )}
      </div>

      {/* File input */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0])}
        className="
          w-full text-xs
          text-gray-600 dark:text-gray-300
          mb-3
        "
      />

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={uploadImage}
          disabled={loading || !file}
          className="
            flex-1
            py-2
            rounded-xl
            text-xs font-semibold
            text-white
            bg-gradient-to-r from-green-500 to-emerald-600
            hover:scale-[1.02]
            active:scale-95
            disabled:opacity-50
            transition
          "
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        <button
          onClick={() => {
            setFile(null);
            onChange("");
          }}
          className="
            flex-1
            py-2
            rounded-xl
            text-xs font-semibold
            bg-gray-200 dark:bg-white/10
            text-gray-700 dark:text-gray-200
            hover:scale-[1.02]
            active:scale-95
            transition
          "
        >
          Clear
        </button>
      </div>

      {/* loading bar */}
      {loading && (
        <div className="mt-3 h-1 w-full bg-gray-200 dark:bg-white/10 rounded overflow-hidden">
          <div className="h-full bg-green-500 animate-pulse w-full" />
        </div>
      )}
    </div>
  );
}