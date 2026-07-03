import type { FloorMap } from "../types/airport";

export default function AirportFlowPanel({
  arrivalTime,
  reason,
  floorMaps,
}: {
  arrivalTime: string | null;
  reason: string;
  floorMaps: FloorMap[];
}) {
  return (
    <section>
      <div className="card" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
        <strong>✈ 공항 도착 권장 시간</strong>
        <p style={{ fontSize: "1.4rem", margin: "0.3rem 0", fontWeight: 700 }}>
          {arrivalTime ?? "-"}
        </p>
        <p className="notice" style={{ margin: 0 }}>{reason}</p>
      </div>

      <h2>제주국제공항 층별 도면</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem" }}>
        {floorMaps.map((m) => (
          <div key={m.floor} className="card" style={{ margin: 0 }}>
            <div
              style={{
                background: "#f1f5f9",
                border: "1px dashed var(--border)",
                borderRadius: "0.5rem",
                height: "90px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                color: "var(--muted)",
              }}
            >
              {m.floor} 도면
            </div>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem" }}>{m.description}</p>
            <p className="notice" style={{ margin: 0 }}>출처: {m.source}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
