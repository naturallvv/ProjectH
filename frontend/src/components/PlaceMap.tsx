import { useEffect, useRef, useState } from "react";
import { JEJU_AIRPORT, KAKAO_KEY, loadKakaoSdk } from "../lib/kakao";

export interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  color?: string; // 마커 색 (등급 등)
  order?: number; // 숫자 마커 (일정 순서)
}

const LEVEL_HINT =
  "🟢 추천  🟠 조건부  🔴 비추천";

function pin(color: string, order?: number) {
  const inner =
    order != null
      ? `<div style="color:#fff;font-weight:800;font-size:12px;line-height:24px;text-align:center;">${order}</div>`
      : "";
  return `<div style="width:24px;height:24px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);">${inner}</div>`;
}

export default function PlaceMap({
  markers,
  connect = false,
  showAirport = true,
  showLegend = false,
  height = "18rem",
}: {
  markers: MapMarker[];
  connect?: boolean; // order 순서대로 선 연결 (일정 동선)
  showAirport?: boolean;
  showLegend?: boolean;
  height?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!KAKAO_KEY) {
      setError("no-key");
      return;
    }
    let cancelled = false;
    loadKakaoSdk()
      .then((kakao) => {
        if (cancelled || !ref.current) return;
        const pts = markers.filter((m) => m.lat && m.lng);
        const center = pts[0]
          ? new kakao.maps.LatLng(pts[0].lat, pts[0].lng)
          : new kakao.maps.LatLng(JEJU_AIRPORT.lat, JEJU_AIRPORT.lng);
        const map = new kakao.maps.Map(ref.current, { center, level: 8 });
        const bounds = new kakao.maps.LatLngBounds();

        pts.forEach((m) => {
          const pos = new kakao.maps.LatLng(m.lat, m.lng);
          bounds.extend(pos);
          new kakao.maps.CustomOverlay({
            map,
            position: pos,
            content: pin(m.color ?? "#f4633a", m.order),
            yAnchor: 0.5,
          });
          const iw = new kakao.maps.InfoWindow({
            content: `<div style="padding:4px 8px;font-size:12px;white-space:nowrap;">${m.label}</div>`,
          });
          kakao.maps.event.addListener(map, "click", () => iw.close());
        });

        if (showAirport) {
          const ap = new kakao.maps.LatLng(JEJU_AIRPORT.lat, JEJU_AIRPORT.lng);
          bounds.extend(ap);
          new kakao.maps.CustomOverlay({
            map,
            position: ap,
            content:
              '<div style="padding:2px 8px;background:#0d9488;color:#fff;border-radius:999px;font-size:11px;font-weight:800;box-shadow:0 1px 4px rgba(0,0,0,.35);">✈ 공항</div>',
            yAnchor: 0.5,
          });
        }

        if (connect && pts.length > 1) {
          const path = [...pts]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((m) => new kakao.maps.LatLng(m.lat, m.lng));
          if (showAirport) path.push(new kakao.maps.LatLng(JEJU_AIRPORT.lat, JEJU_AIRPORT.lng));
          new kakao.maps.Polyline({
            map,
            path,
            strokeWeight: 3,
            strokeColor: "#f4633a",
            strokeOpacity: 0.8,
            strokeStyle: "shortdash",
          });
        }

        if (pts.length > 0) map.setBounds(bounds);
      })
      .catch((e) => setError(e.message === "no-key" ? "no-key" : "load-fail"));
    return () => {
      cancelled = true;
    };
  }, [markers, connect, showAirport]);

  if (error === "no-key") return null; // 키 없으면 지도 생략
  if (markers.filter((m) => m.lat && m.lng).length === 0) return null;

  return (
    <div>
      <div
        ref={ref}
        style={{ height }}
        className="w-full rounded-2xl overflow-hidden border border-brand-100 bg-stone-100"
      />
      {showLegend && <p className="text-[11px] text-stone-400 mt-1">{LEVEL_HINT}</p>}
      {error === "load-fail" && (
        <p className="text-xs text-red-500 mt-1">지도를 불러오지 못했습니다.</p>
      )}
    </div>
  );
}
