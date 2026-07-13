"""관광지 추천 서비스.

mock 관광지 + 날씨를 점수화하여 이동가능성 순으로 정렬한 추천 목록을 만든다.
"""
from app.schemas.place import PlaceFacts, Recommendation
from app.schemas.user import UserProfile
from app.services import data_loader, scoring_service, weather_client

GENERIC_CAUTION = "본 추천은 참고 정보이며 휠체어 접근 가능성이나 안전을 보장하지 않습니다."


def _build_warnings(place: dict, level: str) -> list[str]:
    warnings = scoring_service.accessibility_unknowns(place)
    if level == "not_recommended":
        warnings.append("오늘 조건에서는 이동 부담이 커 비추천입니다.")
    elif level == "conditional":
        warnings.append("조건부 추천입니다. 동반자 동행과 현장 확인을 권장합니다.")
    warnings.append(GENERIC_CAUTION)
    return warnings


# 등급을 상대(백분위) 기준으로 부여해 다양성을 확보한다.
# 실데이터 특성상 절대 점수가 낮게 뭉쳐 절대 임계값(75/50)만으로는 대부분 비추천이 되므로,
# 이동가능성 순위 상위 REC_PCT 는 추천, 다음 COND_PCT 까지는 조건부로 분류한다.
# (실제 점수는 카드에 그대로 노출되어 정직성 유지)
REC_PCT = 0.15
COND_PCT = 0.55


def _relative_level(mobility: int, rec_cut: int, cond_cut: int) -> str:
    if mobility >= rec_cut:
        return "recommended"
    if mobility >= cond_cut:
        return "conditional"
    return "not_recommended"


def build_recommendations(
    user_profile: UserProfile, travel_date: str | None = None
) -> list[Recommendation]:
    weather = weather_client.get_weather()
    profile_dict = user_profile.model_dump()

    # 1) 모든 장소 점수화
    scored: list[tuple[dict, dict]] = []
    for place in data_loader.load_places():
        scores = scoring_service.calculate_mobility_feasibility_score(
            place, weather, profile_dict
        )
        scored.append((place, scores))

    # 2) 이동가능성 내림차순 정렬 후 백분위 컷오프 계산 (동점은 같은 등급으로 묶임)
    scored.sort(key=lambda x: x[1]["mobility_feasibility_score"], reverse=True)
    n = len(scored)
    mob_desc = [s["mobility_feasibility_score"] for _, s in scored]
    rec_cut = mob_desc[min(n - 1, int(n * REC_PCT))] if n else 0
    cond_cut = mob_desc[min(n - 1, int(n * COND_PCT))] if n else 0

    # 3) 상대 등급 부여 + 결과 구성
    results: list[Recommendation] = []
    for place, scores in scored:
        level = _relative_level(scores["mobility_feasibility_score"], rec_cut, cond_cut)
        scores = {**scores, "recommendation_level": level}
        results.append(
            Recommendation(
                place_id=place["id"],
                name=place["name"],
                category=place["category"],
                address=place.get("address"),
                lat=place.get("lat"),
                lon=place.get("lon"),
                image_urls=place.get("image_urls", []),
                warnings=_build_warnings(place, level),
                facts=PlaceFacts(
                    has_accessible_parking=place.get("has_accessible_parking"),
                    has_accessible_toilet=place.get("has_accessible_toilet"),
                    has_wheelchair_rental=place.get("has_wheelchair_rental"),
                    is_indoor=place.get("is_indoor"),
                ),
                **scores,
            )
        )
    return results
