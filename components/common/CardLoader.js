import Shimmer from "@/components/common/Shimmer";

export default function CardLoader() {
  return (
    <div className="p-4 border rounded-lg shadow-md space-y-3 w-full max-w-sm">
      <Shimmer className="w-full h-40 rounded-lg" /> {/* Image */}
      <Shimmer className="w-3/4 h-5" />             {/* Title */}
      <Shimmer className="w-full h-4" />            {/* Text */}
      <Shimmer className="w-2/3 h-4" />             {/* Text */}
    </div>
  );
}
