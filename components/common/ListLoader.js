import Shimmer from "@/components/common/Shimmer";

export function ListLoader() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Shimmer className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Shimmer className="w-3/4 h-4" />
            <Shimmer className="w-1/2 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
