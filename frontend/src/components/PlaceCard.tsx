import type { PlaceFacts, Recommendation } from "../types/place";
import ScoreBadge from "./ScoreBadge";

const FACT_LABELS: Record<keyof PlaceFacts, string> = {
  has_accessible_parking: "장애인 주차장",
  has_accessible_toilet: "장애인 화장실",
  has_wheelchair_rental: "휠체어 대여",
  is_indoor: "실내 관광지",
};

function factText(value: boolean | null): { text: string; color: string } {
  if (value === true) return { text: "있음", color: "var(--ok)" };
  if (value === false) return { text: "없음", color: "var(--danger)" };
  return { text: "정보 없음", color: "var(--muted)" };
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function PlaceCard({ rec }: { rec: Recommendation }) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>{rec.name}</h3>
        <ScoreBadge level={rec.recommendation_level} />
      </div>
      <p className="muted" style={{ margin: "0.25rem 0 0.75rem" }}>
        {rec.category === "indoor" ? "실내" : "실외"} · 이동가능성 {rec.mobility_feasibility_score}점
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.25rem 1.5rem" }}>
        <ScoreRow label="접근성" value={rec.accessibility_score} />
        <ScoreRow label="날씨 위험도" value={rec.weather_risk_score} />
        <ScoreRow label="교통" value={rec.transport_score} />
        <ScoreRow label="공항 부담" value={rec.airport_burden_score} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", margin: "0.75rem 0" }}>
        {(Object.keys(FACT_LABELS) as (keyof PlaceFacts)[]).map((key) => {
          const f = factText(rec.facts[key]);
          return (
            <span
              key={key}
              style={{
                fontSize: "0.8rem",
                border: "1px solid var(--border)",
                borderRadius: "0.4rem",
                padding: "0.15rem 0.5rem",
              }}
            >
              {FACT_LABELS[key]}: <span style={{ color: f.color }}>{f.text}</span>
            </span>
          );
        })}
      </div>

      {rec.warnings.length > 0 && (
        <ul className="notice" style={{ margin: 0, paddingLeft: "1.1rem" }}>
          {rec.warnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
