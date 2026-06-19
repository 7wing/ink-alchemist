interface SimilarityBadgeProps {
  score: number;
}

const getStyles = (score: number) => {
  if (score >= 80) {
    return "bg-emerald-900/30 text-emerald-200 border-emerald-700/40";
  }
  if (score >= 50) {
    return "bg-yellow-900/30 text-yellow-200 border-yellow-700/40";
  }
  return "bg-red-900/30 text-red-200 border-red-700/40";
};

const SimilarityBadge = ({ score }: SimilarityBadgeProps) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-label ${getStyles(
      score
    )}`}
  >
    {score}% similar · possible dupe
  </span>
);

export default SimilarityBadge;
