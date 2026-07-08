from typing import Literal

from pydantic import BaseModel

RecommendationLevel = Literal["recommended", "conditional", "not_recommended"]


class PlaceFacts(BaseModel):
    """데이터에서 확인된 사실. 확인되지 않은 값은 None(정보 없음)으로 유지한다."""

    has_accessible_parking: bool | None = None
    has_accessible_toilet: bool | None = None
    has_wheelchair_rental: bool | None = None
    is_indoor: bool | None = None


class Recommendation(BaseModel):
    place_id: str
    name: str
    category: str
    address: str | None = None
    image_urls: list[str] = []
    accessibility_score: int
    weather_risk_score: int
    transport_score: int
    airport_burden_score: int
    mobility_feasibility_score: int
    recommendation_level: RecommendationLevel
    warnings: list[str] = []
    facts: PlaceFacts
