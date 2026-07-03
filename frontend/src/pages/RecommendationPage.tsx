import { useState } from "react";
import UserConditionForm, { type FormValue } from "../components/UserConditionForm";
import PlaceCard from "../components/PlaceCard";
import RagExplanationBox from "../components/RagExplanationBox";
import { postRecommendations } from "../api/recommendation";
import { postRag, toCandidatePlaces } from "../api/rag";
import type { Recommendation } from "../types/place";
import type { RagResponse } from "../types/rag";

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
      setError("추천 결과를 불러오지 못했습니다. 백엔드 서버(localhost:8000)가 실행 중인지 확인하세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>관광지 추천</h1>
      <UserConditionForm onSubmit={handleSubmit} loading={loading} />

      {error && (
        <div className="card" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}>
          {error}
        </div>
      )}

      {rag && <RagExplanationBox rag={rag} />}

      {recs && recs.length > 0 && (
        <>
          <p className="notice">
            이동가능성 점수가 높은 순으로 정렬했습니다. 확인되지 않은 정보는 "정보 없음"으로 표시됩니다.
          </p>
          {recs.map((rec) => (
            <PlaceCard key={rec.place_id} rec={rec} />
          ))}
        </>
      )}
    </div>
  );
}
