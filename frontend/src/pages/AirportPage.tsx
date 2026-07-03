import { useState } from "react";
import AirportFlowPanel from "../components/AirportFlowPanel";
import AirportFacilityPanel from "../components/AirportFacilityPanel";
import { postAirportPlan } from "../api/airport";
import type { AirportPlan } from "../types/airport";

export default function AirportPage() {
  const [departureTime, setDepartureTime] = useState("18:30");
  const [plan, setPlan] = useState<AirportPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPlan() {
    setLoading(true);
    setError(null);
    try {
      setPlan(await postAirportPlan({ departure_time: departureTime }));
    } catch {
      setError("공항 동선 정보를 불러오지 못했습니다. 백엔드 서버(localhost:8000)를 확인하세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>공항 출도 동선</h1>
      <div className="card" style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
        <label>
          출도(출발) 시간
          <input type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} />
        </label>
        <button className="primary" onClick={loadPlan} disabled={loading}>
          {loading ? "불러오는 중…" : "동선 안내 받기"}
        </button>
      </div>

      {error && (
        <div className="card" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}>
          {error}
        </div>
      )}

      {plan && (
        <>
          <AirportFlowPanel
            arrivalTime={plan.recommended_airport_arrival_time}
            reason={plan.reason}
            floorMaps={plan.airport_floor_maps}
          />
          <AirportFacilityPanel facilities={plan.airport_facilities} />
          <ul className="notice" style={{ paddingLeft: "1.1rem" }}>
            {plan.cautions.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
