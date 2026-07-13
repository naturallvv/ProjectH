"""날씨 기반 일정 재구성 서비스.

- 이동가능성 상위 장소로 오전/오후 일정을 구성한다.
- 기상 위험이 높으면 실외 장소를 실내 장소로 대체한다.
- 출도 시간과 기상 상황을 고려해 공항 조기 이동을 권장한다.
"""
from app.schemas.itinerary import (
    EarlyDeparture,
    ItineraryResponse,
    ItinerarySlot,
    WeatherSummary,
)
from app.schemas.user import UserProfile
from app.services import recommendation_service, weather_client
from app.utils import constants as C


def shift_time(hhmm: str, minus_minutes: int) -> str | None:
    """"HH:MM" 에서 분을 빼서 "HH:MM" 으로 반환."""
    try:
        h, m = (int(x) for x in hhmm.split(":"))
    except (ValueError, AttributeError):
        return None
    total = h * 60 + m - minus_minutes
    total %= 24 * 60
    return f"{total // 60:02d}:{total % 60:02d}"


def is_weather_risky(weather: dict) -> bool:
    rain = weather.get("rain_probability") or 0
    wind = weather.get("wind_speed") or 0
    alert = weather.get("weather_alert")
    return bool(alert) or rain >= C.RAIN_HIGH or wind >= C.WIND_HIGH


def build_itinerary(
    user_profile: UserProfile, travel_date: str | None = None
) -> ItineraryResponse:
    weather = weather_client.get_weather()
    risky = is_weather_risky(weather)

    recs = recommendation_service.build_recommendations(user_profile, travel_date)
    visitable = [r for r in recs if r.recommendation_level != "not_recommended"]
    indoor = [r for r in visitable if r.category == "indoor"]

    # 날씨가 나쁘면 실내 우선, 아니면 이동가능성 상위 순
    ordered = (indoor + [r for r in visitable if r not in indoor]) if risky else visitable

    # 다양성: 오전/오후를 서로 다른 지역에서 뽑는다 (같은 박물관 군집 방지)
    def _region(rec) -> str | None:
        a = rec.address or ""
        return "서귀포시" if "서귀포" in a else "제주시" if "제주시" in a else None

    morning_rec = ordered[0] if ordered else None
    afternoon_rec = None
    if morning_rec:
        mr = _region(morning_rec)
        afternoon_rec = next(
            (r for r in ordered[1:] if _region(r) != mr), None
        ) or (ordered[1] if len(ordered) > 1 else None)

    slots: list[ItinerarySlot] = []

    def make_slot(period: str, time_hint: str, title: str, rec) -> None:
        if rec is not None:
            is_alt = risky and rec.category == "indoor"
            reason = (
                "기상 위험이 있어 실내 관광지로 배치했습니다."
                if is_alt
                else f"이동가능성 {rec.mobility_feasibility_score}점으로 오늘 조건에 적합합니다."
            )
            slots.append(
                ItinerarySlot(
                    period=period,
                    time_hint=time_hint,
                    title=title,
                    place_name=rec.name,
                    category=rec.category,
                    lat=rec.lat,
                    lon=rec.lon,
                    reason=reason,
                    is_alternative=is_alt,
                )
            )
        else:
            slots.append(
                ItinerarySlot(
                    period=period,
                    time_hint=time_hint,
                    title=title,
                    reason="오늘 조건에 맞는 추천 장소가 부족합니다. 실내 휴식을 권장합니다.",
                )
            )

    make_slot("morning", "09:30", "오전 관광", morning_rec)
    slots.append(
        ItinerarySlot(
            period="lunch",
            time_hint="12:30",
            title="점심 식사",
            reason="접근 가능한 식당에서 충분히 휴식한 뒤 오후 일정을 시작하세요.",
        )
    )
    make_slot("afternoon", "14:00", "오후 관광", afternoon_rec)

    # 공항 조기 이동 권장
    departure = user_profile.departure_time
    buffer_min = 150 if risky else 120  # 기상 악화 시 30분 추가 버퍼
    arrival = shift_time(departure, buffer_min) if departure else None
    early_reason = (
        "기상 악화로 이동 지연 가능성이 있어 평소보다 일찍 공항 도착을 권장합니다."
        if risky
        else "여유 있는 출도를 위해 출발 2시간 전 공항 도착을 권장합니다."
    )
    slots.append(
        ItinerarySlot(
            period="pre_departure",
            time_hint=arrival or "-",
            title="공항 이동 및 출도 준비",
            reason=early_reason,
        )
    )

    cautions = [
        "일정은 참고용이며 현장 상황과 최신 기상정보를 확인하세요.",
        "확인되지 않은 편의시설은 방문 전 개별 확인이 필요합니다.",
    ]

    return ItineraryResponse(
        travel_date=travel_date,
        weather_summary=WeatherSummary(
            rain_probability=weather.get("rain_probability"),
            wind_speed=weather.get("wind_speed"),
            weather_alert=weather.get("weather_alert"),
        ),
        slots=slots,
        early_departure=EarlyDeparture(
            recommended=risky,
            recommended_airport_arrival_time=arrival,
            reason=early_reason,
        ),
        cautions=cautions,
    )
