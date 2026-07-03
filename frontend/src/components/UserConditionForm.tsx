import { useState } from "react";
import type { UserProfile, WheelchairType, WeatherSensitivity } from "../types/user";

export interface FormValue {
  profile: UserProfile;
  travelDate: string;
}

const PREFERRED_OPTIONS = [
  { value: "indoor", label: "실내" },
  { value: "nature", label: "자연" },
  { value: "culture", label: "문화" },
];

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
    <form className="card" onSubmit={submit}>
      <h2 style={{ marginTop: 0 }}>여행 조건 입력</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <label>
          출발지
          <input value={startLocation} onChange={(e) => setStartLocation(e.target.value)} />
        </label>
        <label>
          여행 날짜
          <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
        </label>
        <label>
          휠체어 종류
          <select value={wheelchairType} onChange={(e) => setWheelchairType(e.target.value as WheelchairType)}>
            <option value="manual">수동</option>
            <option value="electric">전동</option>
            <option value="unknown">미정</option>
          </select>
        </label>
        <label>
          출도(출발) 시간
          <input type="time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} />
        </label>
        <label>
          날씨 민감도
          <select value={sensitivity} onChange={(e) => setSensitivity(e.target.value as WeatherSensitivity)}>
            <option value="low">낮음</option>
            <option value="normal">보통</option>
            <option value="high">높음</option>
          </select>
        </label>
        <label style={{ flexDirection: "row", alignItems: "center", gap: "0.4rem", marginTop: "1.4rem" }}>
          <input type="checkbox" checked={hasCompanion} onChange={(e) => setHasCompanion(e.target.checked)} />
          동반자 있음
        </label>
      </div>

      <fieldset style={{ border: "none", padding: 0, margin: "0.75rem 0" }}>
        <legend className="muted" style={{ padding: 0 }}>선호 유형</legend>
        <div style={{ display: "flex", gap: "1rem" }}>
          {PREFERRED_OPTIONS.map((opt) => (
            <label key={opt.value} style={{ flexDirection: "row", alignItems: "center", gap: "0.3rem" }}>
              <input
                type="checkbox"
                checked={preferred.includes(opt.value)}
                onChange={() => togglePreferred(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <button className="primary" type="submit" disabled={loading}>
        {loading ? "분석 중…" : "이동가능성 추천 받기"}
      </button>
    </form>
  );
}
