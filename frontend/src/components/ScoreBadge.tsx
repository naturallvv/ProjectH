import type { RecommendationLevel } from "../types/place";

const LABELS: Record<RecommendationLevel, string> = {
  recommended: "추천",
  conditional: "조건부 추천",
  not_recommended: "비추천",
};

const COLORS: Record<RecommendationLevel, string> = {
  recommended: "#16a34a",
  conditional: "#d97706",
  not_recommended: "#dc2626",
};

export default function ScoreBadge({ level }: { level: RecommendationLevel }) {
  return (
    <span
      style={{
        background: COLORS[level],
        color: "#fff",
        padding: "0.2rem 0.7rem",
        borderRadius: "999px",
        fontSize: "0.85rem",
        fontWeight: 600,
      }}
    >
      {LABELS[level]}
    </span>
  );
}
