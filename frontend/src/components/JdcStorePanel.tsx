import type { JdcStore } from "../types/airport";

const CATEGORY_LABEL: Record<string, string> = {
  cosmetics: "💄 화장품",
  liquor: "🍶 주류·담배",
  fashion: "👜 패션",
  food: "🍫 식품",
};

export default function JdcStorePanel({
  stores,
  dataLimitations,
}: {
  stores: JdcStore[];
  dataLimitations?: string[];
}) {
  if (stores.length === 0) return null;

  const limits =
    dataLimitations ??
    Array.from(new Set(stores.map((s) => s.data_limit).filter((d): d is string => !!d)));

  return (
    <section className="mt-8">
      <h2 className="text-lg font-extrabold text-stone-900 mb-1">JDC 면세점</h2>
      <p className="text-xs text-stone-400 mt-0 mb-3">
        출도 전 이용 가능한 면세점 매장이에요. (매장정보 안내 전용)
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {stores.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-brand-100 p-4 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-center justify-between gap-2">
              <strong className="text-sm text-stone-800">{s.store_name}</strong>
              {s.category && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 font-bold shrink-0">
                  {CATEGORY_LABEL[s.category] ?? s.category}
                </span>
              )}
            </div>
            <div className="mt-2 space-y-1 text-xs text-stone-500">
              <div>📍 {s.location}</div>
              {(s.open_time || s.close_time) && (
                <div>
                  🕒 {s.open_time ?? "-"} ~ {s.close_time ?? "-"}
                </div>
              )}
              {s.phone && <div>☎ {s.phone}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* JDC 데이터 한계 — 접기 (삭제 금지 고지) */}
      <details className="group mt-3">
        <summary className="cursor-pointer list-none text-xs font-semibold text-stone-400 hover:text-stone-500 select-none">
          JDC 데이터 한계 보기{" "}
          <span className="inline-block transition-transform group-open:rotate-180">▾</span>
        </summary>
        <ul className="mt-2 mb-0 pl-4 space-y-0.5 text-xs text-stone-400">
          {limits.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
          <li>출처: JDC 제주국제공항 면세점 매장정보 API</li>
        </ul>
      </details>
    </section>
  );
}
