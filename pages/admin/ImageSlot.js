import { useState } from "react";
import axios from "axios";
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
    if (!file) {
      toast.error("Please select file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        `${API}/api/image/upload/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("Upload response:", res.data);

      // ✅ Correct extraction
      const imageUrl = res.data?.data?.secure_url;

      if (!imageUrl) {
        toast.error("Upload response invalid");
        return;
      }

      onChange(imageUrl); // store full URL directly

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
    <div className="border rounded-xl p-3 bg-gray-50 dark:bg-gray-800">
      <p className="text-sm font-medium mb-2">{label}</p>

      {/* Preview */}
      <div className="w-full aspect-square border rounded-lg flex items-center justify-center overflow-hidden mb-3 bg-white dark:bg-gray-900">
        {value ? (
          <img
            src={value}
            alt="preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>

      {/* Browse */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full text-sm mb-2"
      />

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={uploadImage}
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        <button
          onClick={() => onChange("")}
          className="flex-1 bg-gray-400 text-white py-2 rounded-lg text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
