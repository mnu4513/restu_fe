// components/common/Shimmer.jsx
import React from "react";
import clsx from "clsx";

/**
 * Shimmer (Skeleton Loader)
 * Props:
 *  - className: string (to control width/height/shape)
 *  - rounded: string (e.g. "rounded-lg", "rounded-full")
 */
export default function Shimmer({ className = "", rounded = "rounded-md" }) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden bg-gray-200 dark:bg-gray-700",
        "animate-pulse",
        rounded,
        className
      )}
    >
      {/* Gradient shimmer effect */}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] 
        bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
    </div>
  );
}

// Tailwind keyframes (add this to your globals.css if needed)
// @keyframes shimmer {
//   100% {
//     transform: translateX(100%);
//   }
// }
