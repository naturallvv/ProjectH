"""관광지 추천 서비스.

mock 관광지 + 날씨를 점수화하여 이동가능성 순으로 정렬한 추천 목록을 만든다.
"""
from app.schemas.place import PlaceFacts, Recommendation
from app.schemas.user import UserProfile
from app.services import data_loader, scoring_service

GENERIC_CAUTION = "본 추천은 참고 정보이며 휠체어 접근 가능성이나 안전을 보장하지 않습니다."


def _build_warnings(place: dict, level: str) -> list[str]:
    warnings = scoring_service.accessibility_unknowns(place)
    if level == "not_recommended":
        warnings.append("오늘 조건에서는 이동 부담이 커 비추천입니다.")
    elif level == "conditional":
        warnings.append("조건부 추천입니다. 동반자 동행과 현장 확인을 권장합니다.")
    warnings.append(GENERIC_CAUTION)
    return warnings


def build_recommendations(
    user_profile: UserProfile, travel_date: str | None = None
) -> list[Recommendation]:
    weather = data_loader.load_weather()
    profile_dict = user_profile.model_dump()

    results: list[Recommendation] = []
    for place in data_loader.load_places():
        scores = scoring_service.calculate_mobility_feasibility_score(
            place, weather, profile_dict
        )
        results.append(
            Recommendation(
                place_id=place["id"],
                name=place["name"],
                category=place["category"],
                address=place.get("address"),
                image_urls=place.get("image_urls", []),
                warnings=_build_warnings(place, scores["recommendation_level"]),
                facts=PlaceFacts(
                    has_accessible_parking=place.get("has_accessible_parking"),
                    has_accessible_toilet=place.get("has_accessible_toilet"),
                    has_wheelchair_rental=place.get("has_wheelchair_rental"),
                    is_indoor=place.get("is_indoor"),
                ),
                **scores,
            )
        )

    results.sort(key=lambda r: r.mobility_feasibility_score, reverse=True)
    return results
