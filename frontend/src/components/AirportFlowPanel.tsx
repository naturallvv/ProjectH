import type { FloorMap } from "../types/airport";

export default function AirportFlowPanel({
  arrivalTime,
  reason,
  floorMaps,
}: {
  arrivalTime: string | null;
  reason: string;
  floorMaps: FloorMap[];
}) {
  return (
    <section>
      {/* 도착 권장 시간 — 히어로 카드 */}
      <div className="rounded-3xl bg-gradient-to-r from-sea-600 to-sea-500 px-6 py-7 text-center shadow-[var(--shadow-soft)] mb-6">
        <div className="text-xs font-bold text-white/70 tracking-wide">공항 도착 권장 시간</div>
        <div className="text-5xl font-extrabold text-white mt-1 tracking-tight">
          {arrivalTime ?? "-"}
        </div>
        <p className="m-0 mt-2 text-xs text-white/80 max-w-md mx-auto">{reason}</p>
      </div>

      {/* 층별 도면 */}
      <h2 className="text-lg font-extrabold text-stone-900 mb-3">공항 층별 도면</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {floorMaps.map((m) => (
          <div
            key={m.floor}
            className="bg-white rounded-2xl border border-brand-100 p-3 shadow-[var(--shadow-soft)]"
          >
            <div className="grid place-items-center h-20 rounded-xl bg-sea-50 border border-dashed border-sea-100 font-extrabold text-sea-600">
              {m.floor}
            </div>
            <p className="m-0 mt-2 text-xs text-stone-500">{m.description}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-stone-300 mt-2">
        출처: 한국공항공사 제주국제공항 도면 이미지 정보 (동선 참고용)
      </p>
    </section>
  );
}
