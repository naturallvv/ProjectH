import { useState } from "react";
import AirportFlowPanel from "../components/AirportFlowPanel";
import AirportFacilityPanel from "../components/AirportFacilityPanel";
import JdcStorePanel from "../components/JdcStorePanel";
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
      setError("공항 동선 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-stone-900 mb-1">공항 출도 동선</h1>
      <p className="text-sm text-stone-400 mt-0 mb-5">
        출발 시간만 알려주시면 도착 시간부터 공항 안 동선까지 안내해 드려요.
      </p>

      <div className="flex items-end gap-3 bg-white rounded-2xl border border-brand-100 p-5 mb-6 shadow-[var(--shadow-soft)]">
        <label className="flex flex-col gap-1 text-xs font-semibold text-stone-500">
          출도(출발) 시간
          <input
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="px-3 py-2 rounded-xl border border-brand-100 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
        </label>
        <button
          onClick={loadPlan}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer"
        >
          {loading ? "불러오는 중…" : "동선 안내 받기"}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm p-4 mb-4">
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
          <JdcStorePanel stores={plan.jdc_stores} />

          {/* 주의사항 — 접기 (삭제 금지 고지) */}
          <details className="group mt-6">
            <summary className="cursor-pointer list-none text-xs font-semibold text-stone-400 hover:text-stone-500 select-none">
              이용 시 주의사항{" "}
              <span className="inline-block transition-transform group-open:rotate-180">▾</span>
            </summary>
            <ul className="mt-2 mb-0 pl-4 space-y-0.5 text-xs text-stone-400">
              {plan.cautions.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </details>
        </>
      )}
    </div>
  );
}
