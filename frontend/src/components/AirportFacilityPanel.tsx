import type { AirportFacility } from "../types/airport";

export default function AirportFacilityPanel({
  facilities,
}: {
  facilities: AirportFacility[];
}) {
  return (
    <section>
      <h2>공항 내 체류 가능 시설</h2>
      <p className="notice">카페·편의점·은행 등 출도 전 이용 가능한 시설입니다. (한국공항공사 층별 입점업체 현황)</p>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#f8fafc", textAlign: "left" }}>
              <th style={{ padding: "0.6rem" }}>시설</th>
              <th style={{ padding: "0.6rem" }}>구분</th>
              <th style={{ padding: "0.6rem" }}>위치</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((f, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                <td style={{ padding: "0.6rem" }}>{f.facility_name}</td>
                <td style={{ padding: "0.6rem" }}>{f.category}</td>
                <td style={{ padding: "0.6rem" }}>
                  {f.terminal} {f.floor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
