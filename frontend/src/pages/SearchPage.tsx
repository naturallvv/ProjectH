import { useState } from "react";
import { postRagAsk } from "../api/rag";
import type { RetrievedDocument } from "../types/rag";

const EXAMPLES = [
  "휠체어로 갈만한 해안 산책로",
  "경사가 완만한 관광지",
  "장애인 화장실 있는 박물관",
  "주차 편한 무장애 여행지",
];

function riskBadge(level: string | null) {
  if (level === "high") return { text: "주의 필요", cls: "bg-red-100 text-red-600" };
  if (level === "medium") return { text: "보통", cls: "bg-amber-100 text-amber-700" };
  if (level === "low") return { text: "양호", cls: "bg-green-100 text-green-700" };
  return null;
}

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [docs, setDocs] = useState<RetrievedDocument[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search(question: string) {
    const query = question.trim();
    if (!query) return;
    setQ(query);
    setLoading(true);
    setError(null);
    try {
      const res = await postRagAsk({ question: query, top_k: 8 });
      setDocs(res.retrieved_documents);
    } catch {
      setError("검색에 실패했습니다. RAG 벡터DB가 준비됐는지 확인하세요.");
      setDocs(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-stone-900 mb-1">무장애 정보 검색</h1>
      <p className="text-sm text-stone-400 mt-0 mb-4">
        자연어로 물어보면 제주 무장애여행 문서에서 관련 장소를 찾아드려요.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          search(q);
        }}
        className="flex gap-2 mb-3"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="예: 휠체어로 갈만한 해안 산책로"
          className="flex-1 px-4 py-2.5 rounded-xl border border-brand-100 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer"
        >
          {loading ? "검색 중…" : "검색"}
        </button>
      </form>

      {/* 예시 질문 */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => search(ex)}
            className="px-3 py-1 rounded-full text-xs font-semibold border border-brand-200 text-stone-500 bg-white hover:bg-brand-50 cursor-pointer"
          >
            {ex}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm p-4 mb-4">
          {error}
        </div>
      )}

      {docs && (
        <>
          <p className="text-xs text-stone-400 mb-2">
            "{q}" 검색 결과 {docs.length}건 (유사도 순)
          </p>
          {docs.map((d, i) => {
            const risk = riskBadge(d.risk_level);
            return (
              <div
                key={d.doc_id ?? i}
                className="bg-white rounded-2xl border border-brand-100 p-4 mb-3 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-stone-800">
                    {d.place_name ?? "이름 미상"}
                  </strong>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {risk && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${risk.cls}`}>
                        {risk.text}
                      </span>
                    )}
                    <span className="text-[10px] text-stone-400">
                      유사도 {(d.score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                {d.category && (
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 font-semibold">
                    {d.category}
                  </span>
                )}
                <p className="mt-2 mb-0 text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                  {d.text}
                </p>
                {d.source && (
                  <p className="mt-2 mb-0 text-[10px] text-stone-300">출처: {d.source}</p>
                )}
              </div>
            );
          })}
          {docs.length === 0 && (
            <p className="text-sm text-stone-400 py-6 text-center">관련 문서를 찾지 못했어요.</p>
          )}
        </>
      )}
    </div>
  );
}
