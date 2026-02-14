import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axiosApi from "@/utils/axios";
import toast from "react-hot-toast";

/**
 * ImageUploader
 * Props:
 *  - api (string): base API url, e.g. BackendAPI or "" (default)
 *  - user (object): auth user object (used to attach token header). Optional if endpoint is public
 *  - initialImageId (string): already-uploaded Cloudinary public_id to show
 *  - uploadEndpoint (string): path under api to hit. default: "/api/image/upload/image"
 *  - onUploadComplete(publicId) - callback invoked with returned public_id
 *  - disabled (bool) - optional to disable controls
 */
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

  // keep currentImageId in sync if parent changes initialImageId
  useEffect(() => {
    setCurrentImageId(initialImageId || "");
  }, [initialImageId]);

  // cleanup preview objectURL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch (e) {
          // ignore
        }
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    if (!f) {
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch {}
      }
      setSelectedFile(null);
      setPreviewUrl("");
      return;
    }

    // revoke previous preview immediately to avoid leaking blobs
    if (previewUrl) {
      try {
        URL.revokeObjectURL(previewUrl);
      } catch {}
    }

    setSelectedFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const buildAbsoluteUrl = (maybeApi, maybeEndpoint) => {
    // Normalize inputs to strings
    const a = String(maybeApi || "");
    const e = String(maybeEndpoint || "");

    // If endpoint already looks like absolute, return it.
    if (/^https?:\/\//i.test(e)) return e;
    if (/^https?:\/\//i.test(a)) {
      // api looks absolute; combine safely
      // ensure api doesn't end with slash and endpoint starts with slash
      const apiClean = a.endsWith("/") ? a.slice(0, -1) : a;
      const epClean = e.startsWith("/") ? e : `/${e}`;
      return `${apiClean}${epClean}`;
    }

    // If api empty and endpoint starts with "/", make absolute using current origin
    if (!a && e.startsWith("/")) {
      return `${window.location.origin}${e}`;
    }

    // If api is relative (e.g. "/api" or ""), combine and make absolute
    const apiPart = a ? (a.endsWith("/") ? a.slice(0, -1) : a) : "";
    const epPart = e.startsWith("/") ? e : `/${e}`;
    // If apiPart already starts with '/', join relative to origin
    if (apiPart.startsWith("/")) {
      return `${window.location.origin}${apiPart}${epPart}`;
    }

    // fallback: just use origin + apiPart + epPart
    return `${window.location.origin}/${apiPart}${epPart}`.replace(/([^:]\/)\/+/g, "$1");
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("Select an image first");
    setUploading(true);
    setProgress(0);

    try {
      const fd = new FormData();
      fd.append("image", selectedFile);

      const endpoint = buildAbsoluteUrl(api, uploadEndpoint);

      // Debug: show endpoint in console so you can confirm it's what you expect
      console.log("ImageUploader: POST endpoint ->", endpoint);

      const config = {
        onUploadProgress: (ev) => {
          if (!ev.total) return;
          const pct = Math.round((ev.loaded * 100) / ev.total);
          if (isMounted.current) setProgress(pct);
        },
        headers: {
          // do not set Content-Type, browser will set the correct multipart boundary
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
      };

      const resp = await axiosApi.post(endpoint, fd, config);

      // Support multiple response shapes
      const cloudResult = resp?.data?.data || resp?.data;
      const publicId =
        cloudResult?.public_id || cloudResult?.publicId || cloudResult?.id || null;

      if (!publicId) {
        console.error("Upload response body:", resp?.data);
        throw new Error("No public_id returned from upload endpoint");
      }

      if (!isMounted.current) return;

      setCurrentImageId(publicId);
      onUploadComplete(publicId);
      toast.success("Image uploaded");

      // clear preview and selected file
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch {}
      }
      setPreviewUrl("");
      setSelectedFile(null);
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Image upload failed. See console for details.");
    } finally {
      if (isMounted.current) {
        setUploading(false);
        setProgress(0);
      }
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) {
      try {
        URL.revokeObjectURL(previewUrl);
      } catch {}
      setPreviewUrl("");
    }
    setCurrentImageId("");
    onUploadComplete("");
  };

  return (
    <div className="space-y-2">
      {/* preview existing cloudinary image */}
      {currentImageId ? (
        <div className="mb-2">
          <Image
            src={`https://res.cloudinary.com/dyjpzvstq/image/upload/v1709985632/${currentImageId}`}
            alt="uploaded image"
            width={600}
            height={360}
            className="object-cover rounded w-full h-48"
          />
          <div className="text-xs text-gray-500 mt-1">Image ID: {currentImageId}</div>
        </div>
      ) : null}

      {/* local preview (before upload) */}
      {previewUrl ? (
        <div className="mb-2">
          <img src={previewUrl} alt="preview" className="w-full h-48 object-cover rounded" />
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading || disabled}
          className="border px-2 py-1 rounded"
        />

        <button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || uploading || disabled}
          className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-60"
        >
          {uploading ? `Uploading (${progress}%)` : "Upload"}
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={uploading || disabled}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          Clear
        </button>
      </div>

      {uploading && (
        <div className="w-full bg-gray-100 rounded h-2 overflow-hidden mt-2">
          <div style={{ width: `${progress}%` }} className="h-full bg-blue-500" />
        </div>
      )}
    </div>
  );
}
