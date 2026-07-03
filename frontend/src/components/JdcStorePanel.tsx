import type { JdcStore } from "../types/airport";

export default function JdcStorePanel({
  stores,
  dataLimitations,
}: {
  stores: JdcStore[];
  dataLimitations?: string[];
}) {
  if (stores.length === 0) return null;
  return (
    <section>
      <h2>JDC 면세점 매장정보</h2>
      <p className="notice">출도 전 이용 가능한 JDC 면세점 매장입니다. (면세점 매장정보 안내 전용)</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
        {stores.map((s, i) => (
          <div key={i} className="card" style={{ margin: 0 }}>
            <strong>{s.store_name}</strong>
            <p style={{ margin: "0.4rem 0 0", fontSize: "0.9rem" }}>📍 {s.location}</p>
            {(s.open_time || s.close_time) && (
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.9rem" }}>
                🕒 {s.open_time ?? "-"} ~ {s.close_time ?? "-"}
              </p>
            )}
            {s.phone && <p style={{ margin: "0.2rem 0 0", fontSize: "0.9rem" }}>☎ {s.phone}</p>}
            <p className="notice" style={{ margin: "0.4rem 0 0" }}>출처: {s.source}</p>
          </div>
        ))}
      </div>

      <div
        className="card"
        style={{ marginTop: "0.75rem", background: "#f8fafc", borderStyle: "dashed" }}
      >
        <strong className="muted">JDC 데이터 한계</strong>
        <ul className="notice" style={{ margin: "0.4rem 0 0", paddingLeft: "1.1rem" }}>
          {(dataLimitations ?? [
            "JDC 데이터는 면세점 매장정보만 제공합니다.",
            "휠체어 대여·수유실·물품보관함 위치는 제공하지 않습니다.",
          ]).map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
