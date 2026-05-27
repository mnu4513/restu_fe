import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axiosApi from "@/utils/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ImageUploader({
  api = "",
  user = null,
  initialImageId = "",
  uploadEndpoint = "/api/image/upload/image",
  onUploadComplete = () => {},
  disabled = false,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentImageId, setCurrentImageId] = useState(initialImageId || "");

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setCurrentImageId(initialImageId || "");
  }, [initialImageId]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;

    if (!f) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSelectedFile(null);
      setPreviewUrl("");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("Select an image first");

    setUploading(true);
    setProgress(0);

    try {
      const fd = new FormData();
      fd.append("image", selectedFile);

      const endpoint = api + uploadEndpoint;

      const resp = await axiosApi.post(endpoint, fd, {
        onUploadProgress: (ev) => {
          if (!ev.total) return;
          const pct = Math.round((ev.loaded * 100) / ev.total);
          if (isMounted.current) setProgress(pct);
        },
        headers: {
          ...(user?.token && { Authorization: `Bearer ${user.token}` }),
        },
      });

      const cloudResult = resp?.data?.data || resp?.data;
      const publicId =
        cloudResult?.public_id ||
        cloudResult?.publicId ||
        cloudResult?.id ||
        null;

      if (!publicId) throw new Error("No public_id returned");

      setCurrentImageId(publicId);
      onUploadComplete(publicId);

      toast.success("Image uploaded");

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      if (isMounted.current) {
        setUploading(false);
        setProgress(0);
      }
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setCurrentImageId("");
    onUploadComplete("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        w-full
        rounded-3xl
        border border-gray-200 dark:border-white/10
        bg-white/70 dark:bg-white/[0.03]
        backdrop-blur-xl
        p-5
        space-y-4
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200">
          Image Upload
        </h2>

        {uploading && (
          <span className="text-xs text-blue-500 font-medium">
            Uploading {progress}%
          </span>
        )}
      </div>

      {/* CURRENT IMAGE */}
      {currentImageId && (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10">
          <Image
            src={`https://res.cloudinary.com/dyjpzvstq/image/upload/v1709985632/${currentImageId}`}
            alt="uploaded"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* PREVIEW */}
      {previewUrl && (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden">
          <img
            src={previewUrl}
            alt="preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* FILE INPUT */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading || disabled}
          className="
            w-full
            text-sm
            border border-gray-300 dark:border-white/10
            bg-white dark:bg-gray-900
            rounded-xl
            px-3 py-2
            text-gray-700 dark:text-gray-200
          "
        />

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="
              flex-1 sm:flex-none
              px-4 py-2
              rounded-xl
              font-semibold text-white
              bg-gradient-to-r from-blue-500 to-indigo-500
              hover:from-blue-600 hover:to-indigo-600
              disabled:opacity-50
              transition
            "
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

          <button
            onClick={handleClear}
            disabled={uploading}
            className="
              flex-1 sm:flex-none
              px-4 py-2
              rounded-xl
              font-semibold
              text-gray-700 dark:text-gray-200
              bg-gray-100 dark:bg-white/10
              hover:bg-gray-200 dark:hover:bg-white/20
              transition
            "
          >
            Clear
          </button>
        </div>
      </div>

      {/* PROGRESS BAR */}
      {uploading && (
        <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* IMAGE ID */}
      {currentImageId && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          ID: {currentImageId}
        </p>
      )}
    </motion.div>
  );
}