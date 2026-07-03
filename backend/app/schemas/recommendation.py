from pydantic import BaseModel, Field

from app.schemas.place import Recommendation
from app.schemas.user import UserProfile


class RecommendationRequest(BaseModel):
    user_profile: UserProfile
    travel_date: str | None = Field(default=None, examples=["2026-07-10"])


class RecommendationResponse(BaseModel):
    recommendations: list[Recommendation]
