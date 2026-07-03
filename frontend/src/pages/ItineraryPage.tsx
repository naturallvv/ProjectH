import { useState } from "react";
import UserConditionForm, { type FormValue } from "../components/UserConditionForm";
import ItineraryTimeline from "../components/ItineraryTimeline";
import { postItinerary } from "../api/itinerary";
import type { Itinerary } from "../types/itinerary";

export default function ItineraryPage() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(value: FormValue) {
    setLoading(true);
    setError(null);
    try {
      setItinerary(await postItinerary(value.profile, value.travelDate));
    } catch {
      setError("일정을 불러오지 못했습니다. 백엔드 서버(localhost:8000)를 확인하세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>날씨 기반 일정 재구성</h1>
      <p className="muted">
        기상 위험이 높으면 실외 일정을 실내로 대체하고 공항 조기 이동을 권장합니다.
      </p>
      <UserConditionForm onSubmit={handleSubmit} loading={loading} />

      {error && (
        <div className="card" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}>
          {error}
        </div>
      )}

      {itinerary && <ItineraryTimeline itinerary={itinerary} />}
    </div>
  );
}
