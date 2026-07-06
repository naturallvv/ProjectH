import { useState } from "react";
import type { UserProfile, WheelchairType, WeatherSensitivity } from "../types/user";

export interface FormValue {
  profile: UserProfile;
  travelDate: string;
}

const PREFERRED_OPTIONS = [
  { value: "indoor", label: "🏛 실내" },
  { value: "nature", label: "🌿 자연" },
  { value: "culture", label: "🎨 문화" },
];

const inputCls =
  "w-full px-3 py-2 rounded-xl border border-brand-100 bg-white text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-300";
const labelCls = "flex flex-col gap-1 text-xs font-semibold text-stone-500";

export default function UserConditionForm({
  onSubmit,
  loading,
}: {
  onSubmit: (value: FormValue) => void;
  loading: boolean;
}) {
  const [startLocation, setStartLocation] = useState("제주시 연동");
  const [wheelchairType, setWheelchairType] = useState<WheelchairType>("manual");
  const [hasCompanion, setHasCompanion] = useState(true);
  const [preferred, setPreferred] = useState<string[]>(["indoor"]);
  const [departureTime, setDepartureTime] = useState("18:30");
  const [sensitivity, setSensitivity] = useState<WeatherSensitivity>("high");
  const [travelDate, setTravelDate] = useState("2026-07-10");

  function togglePreferred(value: string) {
    setPreferred((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      profile: {
        start_location: startLocation,
        wheelchair_type: wheelchairType,
        has_companion: hasCompanion,
        preferred_type: preferred,
        departure_time: departureTime,
        weather_sensitivity: sensitivity,
      },
      travelDate,
    });
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-2xl border border-brand-100 p-5 mb-5 shadow-[var(--shadow-soft)]"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <label className={labelCls}>
          출발지
          <input
            className={inputCls}
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
          />
        </label>
        <label className={labelCls}>
          여행 날짜
          <input
            type="date"
            className={inputCls}
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
          />
        </label>
        <label className={labelCls}>
          출도 시간
          <input
            type="time"
            className={inputCls}
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
          />
        </label>
        <label className={labelCls}>
          휠체어 종류
          <select
            className={inputCls}
            value={wheelchairType}
            onChange={(e) => setWheelchairType(e.target.value as WheelchairType)}
          >
            <option value="manual">수동</option>
            <option value="electric">전동</option>
            <option value="unknown">미정</option>
          </select>
        </label>
        <label className={labelCls}>
          날씨 민감도
          <select
            className={inputCls}
            value={sensitivity}
            onChange={(e) => setSensitivity(e.target.value as WeatherSensitivity)}
          >
            <option value="low">낮음</option>
            <option value="normal">보통</option>
            <option value="high">높음</option>
          </select>
        </label>
        <label className="flex flex-row items-center gap-2 text-sm font-medium text-stone-600 mt-5">
          <input
            type="checkbox"
            className="w-4 h-4 accent-brand-500"
            checked={hasCompanion}
            onChange={(e) => setHasCompanion(e.target.checked)}
          />
          동반자 있음
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <span className="text-xs font-semibold text-stone-500">선호 유형</span>
        {PREFERRED_OPTIONS.map((opt) => {
          const active = preferred.includes(opt.value);
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => togglePreferred(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                active
                  ? "bg-brand-500 border-brand-500 text-white"
                  : "bg-white border-brand-200 text-stone-500 hover:bg-brand-50"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer"
      >
        {loading ? "분석 중…" : "이동가능성 추천 받기"}
      </button>
    </form>
  );
}
