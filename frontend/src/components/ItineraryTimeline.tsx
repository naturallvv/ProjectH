import type { Itinerary } from "../types/itinerary";

const PERIOD_ICON: Record<string, string> = {
  morning: "🌅",
  lunch: "🍽️",
  afternoon: "🏛️",
  pre_departure: "✈️",
};

export default function ItineraryTimeline({ itinerary }: { itinerary: Itinerary }) {
  const w = itinerary.weather_summary;
  return (
    <div>
      <div className="card" style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
        <strong>오늘의 기상</strong>
        <p style={{ margin: "0.4rem 0 0" }}>
          강수확률 {w.rain_probability ?? "-"}% · 풍속 {w.wind_speed ?? "-"}m/s
          {w.weather_alert ? ` · ${w.weather_alert}` : ""}
        </p>
      </div>

      {itinerary.early_departure.recommended && (
        <div className="card" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
          <strong style={{ color: "var(--danger)" }}>⚠ 공항 조기 이동 권장</strong>
          <p style={{ margin: "0.4rem 0 0" }}>
            {itinerary.early_departure.recommended_airport_arrival_time
              ? `${itinerary.early_departure.recommended_airport_arrival_time} 전후 공항 도착 권장 — `
              : ""}
            {itinerary.early_departure.reason}
          </p>
        </div>
      )}

      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {itinerary.slots.map((slot, i) => (
          <li key={i} className="card" style={{ display: "flex", gap: "1rem" }}>
            <div style={{ fontSize: "1.6rem" }}>{PERIOD_ICON[slot.period] ?? "•"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{slot.title}</strong>
                <span className="muted">{slot.time_hint}</span>
              </div>
              {slot.place_name && (
                <div style={{ margin: "0.25rem 0" }}>
                  {slot.place_name}
                  {slot.is_alternative && (
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        fontSize: "0.75rem",
                        background: "var(--warn)",
                        color: "#fff",
                        padding: "0.1rem 0.45rem",
                        borderRadius: "0.4rem",
                      }}
                    >
                      날씨 대체
                    </span>
                  )}
                </div>
              )}
              <p className="notice" style={{ margin: 0 }}>{slot.reason}</p>
            </div>
          </li>
        ))}
      </ol>

      <ul className="notice" style={{ paddingLeft: "1.1rem" }}>
        {itinerary.cautions.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  );
}
