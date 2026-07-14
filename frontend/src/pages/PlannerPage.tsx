import { useRef, useState } from "react";
import PlannerConditionBar, { type PlannerValue } from "../components/PlannerConditionBar";
import PlaceCard from "../components/PlaceCard";
import PlaceMap, { type MapMarker } from "../components/PlaceMap";
import RagExplanationBox from "../components/RagExplanationBox";
import { postRecommendationsFull } from "../api/recommendation";
import { postRag, toCandidatePlaces } from "../api/rag";
import type { Recommendation, RecommendationLevel } from "../types/place";
import type { RagResponse } from "../types/rag";

const LEVEL_COLOR: Record<RecommendationLevel, string> = {
  recommended: "#16a34a",
  conditional: "#d97706",
  not_recommended: "#dc2626",
};

const TOP_N = 24;

function toMarkers(recs: Recommendation[]): MapMarker[] {
  return recs
    .filter((r) => r.lat != null && r.lon != null)
    .map((r) => ({
      id: r.place_id,
      lat: r.lat as number,
      lng: r.lon as number,
      label: `${r.name} (${r.mobility_feasibility_score})`,
      color: LEVEL_COLOR[r.recommendation_level],
    }));
}

export default function PlannerPage() {
  const [conditions, setConditions] = useState<PlannerValue | null>(null);
  const [recs, setRecs] = useState<Recommendation[] | null>(null);
  const [queryApplied, setQueryApplied] = useState(false);
  const [rag, setRag] = useState<RagResponse | null>(null);
  const [cart, setCart] = useState<Recommendation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const top = (recs ?? []).slice(0, TOP_N);

  async function handleSubmit(value: PlannerValue) {
    setLoading(true);
    setError(null);
    setRag(null);
    setSelectedId(null);
    setConditions(value);
    try {
      const result = await postRecommendationsFull({
        user_profile: value.profile,
        travel_date: value.travelDate,
        query: value.query || undefined,
      });
      setRecs(result.recommendations);
      setQueryApplied(result.query_applied);

      // 추천 근거를 RAG gateway 로 보내 자연어 설명을 받아온다 (미연결 시 mock)
      try {
        const explanation = await postRag({
          user_profile: value.profile as unknown as Record<string, unknown>,
          candidate_places: toCandidatePlaces(result.recommendations),
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

  function inCart(placeId: string): boolean {
    return cart.some((c) => c.place_id === placeId);
  }

  function toggleCart(rec: Recommendation) {
    setCart((prev) =>
      prev.some((c) => c.place_id === rec.place_id)
        ? prev.filter((c) => c.place_id !== rec.place_id)
        : [...prev, rec]
    );
  }

  function focusPlace(id: string) {
    setSelectedId(id);
    cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const steps = [
    { label: "① 조건·질문", done: conditions !== null },
    { label: "② 지도에서 추천", done: (recs?.length ?? 0) > 0 },
    { label: `③ 코스 담기${cart.length ? ` (${cart.length})` : ""}`, done: cart.length > 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-stone-900 mb-1">여행 플래너</h1>
      <p className="text-sm text-stone-400 mt-0 mb-4">
        질문 한 번으로 추천부터 일정·공항 동선까지 한 화면에서 준비하세요.
      </p>

      {/* 진행 단계 */}
      <div className="sticky top-14 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-[#fdfaf7]/90 backdrop-blur-sm border-b border-brand-100 mb-4">
        <div className="flex gap-1.5 overflow-x-auto">
          {steps.map((s) => (
            <span
              key={s.label}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                s.done ? "bg-brand-500 text-white" : "bg-white border border-brand-100 text-stone-400"
              }`}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <PlannerConditionBar onSubmit={handleSubmit} loading={loading} />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm p-4 mb-4">
          {error}
        </div>
      )}

      {recs && recs.length > 0 && (
        <section>
          {conditions?.query && (
            <p className="text-xs text-stone-500 mb-2">
              {queryApplied ? (
                <>
                  🔍 "<span className="font-semibold">{conditions.query}</span>" 와 관련된 무장애
                  정보를 랭킹에 반영했어요.
                </>
              ) : (
                <>질문과 직접 관련된 무장애 문서를 찾지 못해 기본 순위로 보여드려요.</>
              )}
            </p>
          )}

          <PlaceMap
            markers={toMarkers(top)}
            showLegend
            height="26rem"
            selectedId={selectedId}
            onMarkerClick={focusPlace}
          />

          <p className="text-xs text-stone-400 mb-2 mt-3">
            총 {recs.length}곳 중 상위 {top.length}곳 · 마음에 드는 곳을 "코스에 담기"로
            모아 일정을 만들 수 있어요
          </p>

          {top.map((rec) => (
            <div
              key={rec.place_id}
              ref={(el) => {
                cardRefs.current[rec.place_id] = el;
              }}
              onClick={() => setSelectedId(rec.place_id)}
            >
              <PlaceCard
                rec={rec}
                selected={selectedId === rec.place_id}
                actionSlot={
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCart(rec);
                    }}
                    className={`w-full sm:w-auto px-4 py-2 rounded-xl text-sm font-bold border transition-colors cursor-pointer ${
                      inCart(rec.place_id)
                        ? "bg-sea-500 border-sea-500 text-white hover:bg-sea-600"
                        : "bg-white border-brand-300 text-brand-600 hover:bg-brand-50"
                    }`}
                  >
                    {inCart(rec.place_id) ? "✓ 코스에 담김 (누르면 빼기)" : "➕ 코스에 담기"}
                  </button>
                }
              />
            </div>
          ))}

          {rag && <RagExplanationBox rag={rag} />}

          <p className="text-xs text-stone-400 mt-4">
            ※ 본 추천은 참고 정보이며 휠체어 접근 가능성이나 안전을 보장하지 않습니다. 확인되지
            않은 정보는 "정보 없음"으로 표시됩니다.
          </p>
        </section>
      )}

      {/* 담은 코스 요약 (하단 고정) */}
      {cart.length > 0 && (
        <div className="sticky bottom-3 z-10 mt-4">
          <div className="bg-white/95 backdrop-blur border border-brand-200 rounded-2xl shadow-[var(--shadow-lift)] px-4 py-3 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-extrabold text-stone-700">
              🧺 담은 코스 {cart.length}곳
            </span>
            <span className="text-xs text-stone-400 flex-1 min-w-0 truncate">
              {cart.map((c) => c.name).join(" → ")}
            </span>
            <button
              type="button"
              onClick={() => setCart([])}
              className="text-xs font-semibold text-stone-400 hover:text-red-500 cursor-pointer"
            >
              비우기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
