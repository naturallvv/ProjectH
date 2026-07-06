import type { Itinerary } from "../types/itinerary";

const PERIOD_ICON: Record<string, string> = {
  morning: "🌅",
  lunch: "🍽️",
  afternoon: "🏛️",
  pre_departure: "✈️",
};

export default function ItineraryTimeline({ itinerary }: { itinerary: Itinerary }) {
  const w = itinerary.weather_summary;
  return (
    <div>
      {/* 기상 + 조기 이동 요약 배너 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="text-2xl">🌦️</span>
          <div className="text-sm text-stone-700">
            <strong>오늘의 기상</strong>
            <span className="text-stone-500">
              {" "}
              — 강수 {w.rain_probability ?? "-"}% · 바람 {w.wind_speed ?? "-"}m/s
              {w.weather_alert ? ` · ${w.weather_alert}` : ""}
            </span>
          </div>
        </div>
        {itinerary.early_departure.recommended && (
          <div className="flex-1 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <span className="text-2xl">⏰</span>
            <div className="text-sm text-red-600">
              <strong>
                {itinerary.early_departure.recommended_airport_arrival_time ?? "-"} 공항 도착 권장
              </strong>
              <span className="text-red-400"> — 조기 이동</span>
            </div>
          </div>
        )}
      </div>

      {/* 타임라인 */}
      <ol className="list-none m-0 p-0 relative">
        {/* 연결선 */}
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-brand-100" aria-hidden />
        {itinerary.slots.map((slot, i) => (
          <li key={i} className="relative flex gap-4 pb-5">
            <div className="relative z-10 grid place-items-center w-10 h-10 shrink-0 rounded-full bg-white border-2 border-brand-200 text-lg shadow-sm">
              {PERIOD_ICON[slot.period] ?? "•"}
            </div>
            <div className="flex-1 bg-white rounded-2xl border border-brand-100 p-4 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between gap-2">
                <strong className="text-stone-800">{slot.title}</strong>
                <span className="text-xs font-semibold text-brand-500">{slot.time_hint}</span>
              </div>
              {slot.place_name && (
                <div className="mt-1 text-sm text-stone-700">
                  {slot.place_name}
                  {slot.is_alternative && (
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold align-middle">
                      날씨 대체
                    </span>
                  )}
                </div>
              )}
              <p className="m-0 mt-1 text-xs text-stone-400">{slot.reason}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* 주의사항 — 접기 */}
      <details className="group mt-1">
        <summary className="cursor-pointer list-none text-xs font-semibold text-stone-400 hover:text-stone-500 select-none">
          이용 시 주의사항 <span className="inline-block transition-transform group-open:rotate-180">▾</span>
        </summary>
        <ul className="mt-2 mb-0 pl-4 space-y-0.5 text-xs text-stone-400">
          {itinerary.cautions.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
