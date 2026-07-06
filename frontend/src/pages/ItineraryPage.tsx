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
      setError("일정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-stone-900 mb-1">오늘의 일정</h1>
      <p className="text-sm text-stone-400 mt-0 mb-5">
        기상이 나쁘면 실외 일정을 실내로 바꾸고 공항 조기 이동을 알려드려요.
      </p>

      <UserConditionForm onSubmit={handleSubmit} loading={loading} />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm p-4 mb-4">
          {error}
        </div>
      )}

      {itinerary && <ItineraryTimeline itinerary={itinerary} />}
    </div>
  );
}
