export default function RatingStars({ rating, count }: { rating: number; count?: number }) {
  const full = Math.round(Math.min(5, Math.max(0, rating)));
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span className="bg-green-700 text-white font-bold text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5">
        {rating.toFixed(1)} <span>★</span>
      </span>
      {typeof count === "number" && <span className="text-gray-500 text-xs">({count.toLocaleString("en-IN")})</span>}
      {typeof count !== "number" && (
        <span className="text-yellow-500 tracking-tighter">{"★".repeat(full)}{"☆".repeat(5 - full)}</span>
      )}
    </span>
  );
}
