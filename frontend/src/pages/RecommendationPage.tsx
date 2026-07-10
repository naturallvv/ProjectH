import { useState } from "react";
import UserConditionForm, { type FormValue } from "../components/UserConditionForm";
import PlaceCard from "../components/PlaceCard";
import PlaceMap, { type MapMarker } from "../components/PlaceMap";
import RagExplanationBox from "../components/RagExplanationBox";
import type { RecommendationLevel } from "../types/place";
import { postRecommendations } from "../api/recommendation";
import { postRag, toCandidatePlaces } from "../api/rag";
import type { Recommendation } from "../types/place";
import type { RagResponse } from "../types/rag";

const LEVEL_COLOR: Record<RecommendationLevel, string> = {
  recommended: "#16a34a",
  conditional: "#d97706",
  not_recommended: "#dc2626",
};

function toMarkers(recs: Recommendation[]): MapMarker[] {
  return recs
    .filter((r) => r.lat != null && r.lon != null)
    .map((r) => ({
      lat: r.lat as number,
      lng: r.lon as number,
      label: `${r.name} (${r.mobility_feasibility_score})`,
      color: LEVEL_COLOR[r.recommendation_level],
    }));
}

export default function RecommendationPage() {
  const [recs, setRecs] = useState<Recommendation[] | null>(null);
  const [rag, setRag] = useState<RagResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(value: FormValue) {
    setLoading(true);
    setError(null);
    setRag(null);
    try {
      const result = await postRecommendations({
        user_profile: value.profile,
        travel_date: value.travelDate,
      });
      setRecs(result);

      // 추천 근거를 RAG gateway 로 보내 자연어 설명을 받아온다 (미연결 시 mock)
      try {
        const explanation = await postRag({
          user_profile: value.profile as unknown as Record<string, unknown>,
          candidate_places: toCandidatePlaces(result),
          airport_context: { departure_time: value.profile.departure_time },
        });
        setRag(explanation);
      } catch {
        setRag(null);
      }
    } catch {
      setError("추천 결과를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-stone-900 mb-1">관광지 추천</h1>
      <p className="text-sm text-stone-400 mt-0 mb-5">
        조건을 입력하면 오늘 이동 가능한 곳을 점수 순으로 보여드려요.
      </p>

      <UserConditionForm onSubmit={handleSubmit} loading={loading} />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm p-4 mb-4">
          {error}
        </div>
      )}

      {rag && <RagExplanationBox rag={rag} />}

      {recs && recs.length > 0 && (
        <>
          <PlaceMap markers={toMarkers(recs.slice(0, 24))} showLegend />
          <p className="text-xs text-stone-400 mb-2 mt-3">
            총 {recs.length}곳 중 이동가능성 상위 {Math.min(recs.length, 24)}곳
          </p>
          {recs.slice(0, 24).map((rec) => (
            <PlaceCard key={rec.place_id} rec={rec} />
          ))}
          <p className="text-xs text-stone-400 mt-4">
            ※ 본 추천은 참고 정보이며 휠체어 접근 가능성이나 안전을 보장하지 않습니다. 확인되지
            않은 정보는 "정보 없음"으로 표시됩니다.
          </p>
        </>
      )}
    </div>
  );
}
