"""이동가능성 점수화 로직 (가이드 §9).

원칙:
- 데이터가 없으면(None) 있다고 가정하지 않는다. 가산하지 않고 unknown 으로 남긴다.
- 모든 점수는 0~100 으로 clamp 한다.
"""
from app.utils import constants as C


def _clamp(value: float) -> int:
    return int(max(0, min(100, round(value))))


# ─────────────────────────────────────────────────────────────
# 접근성 점수
# ─────────────────────────────────────────────────────────────
def calculate_accessibility_score(place: dict) -> int:
    score = 0
    if place.get("has_accessible_toilet") is True:
        score += C.ACC_TOILET
    if place.get("has_accessible_parking") is True:
        score += C.ACC_PARKING
    if place.get("has_wheelchair_rental") is True:
        score += C.ACC_RENTAL
    if place.get("has_ramp") is True:
        score += C.ACC_RAMP
    if place.get("surface_condition") == "good":
        score += C.ACC_SURFACE_GOOD
    if place.get("is_indoor") is True:
        score += C.ACC_INDOOR
    return _clamp(score)


def accessibility_unknowns(place: dict) -> list[str]:
    """데이터에서 확인되지 않은(None) 접근성 항목 목록."""
    labels = {
        "has_accessible_toilet": "장애인 화장실 여부 미확인",
        "has_accessible_parking": "장애인 주차장 여부 미확인",
        "has_wheelchair_rental": "휠체어 대여 여부 미확인",
        "has_ramp": "휠체어 접근 경로 여부 미확인",
    }
    return [msg for field, msg in labels.items() if place.get(field) is None]


# ─────────────────────────────────────────────────────────────
# 날씨 위험도 점수
# ─────────────────────────────────────────────────────────────
def _alert_weight(alert: str | None) -> float:
    if not alert:
        return 0.0
    if "태풍" in alert:
        weight = C.ALERT_TYPHOON
    elif "호우" in alert:
        weight = C.ALERT_HEAVY_RAIN
    elif "강풍" in alert:
        weight = C.ALERT_WIND
    else:
        return 0.0
    if "예비" in alert:  # 예비특보는 정식 특보의 절반
        weight *= C.PRELIMINARY_ALERT_FACTOR
    return weight


def calculate_weather_risk_score(weather: dict, place: dict) -> int:
    raw = 0.0

    rain = weather.get("rain_probability") or 0
    if rain >= C.RAIN_VERY_HIGH:
        raw += C.WEATHER_RAIN_VERY_HIGH
    elif rain >= C.RAIN_HIGH:
        raw += C.WEATHER_RAIN_HIGH

    wind = weather.get("wind_speed") or 0
    if wind >= C.WIND_VERY_HIGH:
        raw += C.WEATHER_WIND_VERY_HIGH
    elif wind >= C.WIND_HIGH:
        raw += C.WEATHER_WIND_HIGH

    if weather.get("heat_risk") in ("high", "warning", "severe", "danger"):
        raw += C.WEATHER_HEAT

    raw += _alert_weight(weather.get("weather_alert"))

    # 실내 관광지는 날씨 위험도 영향을 작게 받는다
    if place.get("is_indoor") is True:
        raw *= C.INDOOR_WEATHER_FACTOR

    return _clamp(raw)


# ─────────────────────────────────────────────────────────────
# 교통 접근성 점수
# ─────────────────────────────────────────────────────────────
def calculate_transport_score(place: dict) -> int:
    score = 0
    if place.get("near_low_floor_bus") is True:
        score += C.TR_LOW_FLOOR_BUS
        score += C.TR_BUS_STOP  # 저상버스가 있으면 인근 정류장도 있는 것으로 본다
    if place.get("has_accessible_parking") is True:
        score += C.TR_PARKING
    dist = place.get("distance_to_airport_km")
    if dist is not None and dist <= C.AIRPORT_NEAR_KM:
        score += C.TR_AIRPORT_NEAR
    if place.get("slope_level") == "low":
        score += C.TR_LOW_INTERNAL  # 완만한 경사 = 내부 이동 부담 낮음
    return _clamp(score)


# ─────────────────────────────────────────────────────────────
# 공항 출도 부담 점수
# ─────────────────────────────────────────────────────────────
def _departure_hour(departure_time: str | None) -> float | None:
    if not departure_time:
        return None
    try:
        h, m = departure_time.split(":")
        return int(h) + int(m) / 60.0
    except (ValueError, AttributeError):
        return None


def calculate_airport_burden_score(
    place: dict, departure_time: str | None, weather: dict
) -> int:
    """출도 부담 = 출도 시각의 이른 정도 + 공항까지 거리 + 기상 위험.

    출도 시각이 이르면 관광 가능 시간이 짧아 이동 압박이 커진다.
    (하루 관광이 실질적으로 어려워지는 정오/오후 3시를 기준으로 판단)
    """
    score = 0
    dep = _departure_hour(departure_time)
    if dep is not None:
        if dep < 12:
            score += C.BURDEN_DEP_UNDER_2H
        elif dep < 15:
            score += C.BURDEN_DEP_UNDER_3H

    dist = place.get("distance_to_airport_km")
    if dist is not None and dist >= C.AIRPORT_FAR_KM:
        score += C.BURDEN_FAR

    if calculate_weather_risk_score(weather, place) >= C.ALERT_WIND:
        score += C.BURDEN_WEATHER

    return _clamp(score)


# ─────────────────────────────────────────────────────────────
# 최종 이동가능성 점수 & 분류
# ─────────────────────────────────────────────────────────────
def classify(mobility_score: int) -> str:
    if mobility_score >= C.LEVEL_RECOMMENDED:
        return "recommended"
    if mobility_score >= C.LEVEL_CONDITIONAL:
        return "conditional"
    return "not_recommended"


def calculate_mobility_feasibility_score(
    place: dict, weather: dict, user_profile: dict | None = None
) -> dict:
    """모든 점수를 계산해 breakdown 딕셔너리로 반환한다."""
    departure_time = (user_profile or {}).get("departure_time")

    accessibility = calculate_accessibility_score(place)
    weather_risk = calculate_weather_risk_score(weather, place)
    transport = calculate_transport_score(place)
    airport_burden = calculate_airport_burden_score(place, departure_time, weather)

    mobility_raw = (
        accessibility * C.W_ACCESSIBILITY
        + transport * C.W_TRANSPORT
        - weather_risk * C.W_WEATHER
        - airport_burden * C.W_AIRPORT
    )
    mobility = _clamp(mobility_raw)

    return {
        "accessibility_score": accessibility,
        "weather_risk_score": weather_risk,
        "transport_score": transport,
        "airport_burden_score": airport_burden,
        "mobility_feasibility_score": mobility,
        "recommendation_level": classify(mobility),
    }
