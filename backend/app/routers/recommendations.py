from fastapi import APIRouter

from app.schemas.recommendation import RecommendationRequest, RecommendationResponse
from app.services import recommendation_service

router = APIRouter(prefix="/api", tags=["recommendations"])


@router.post("/recommendations", response_model=RecommendationResponse)
def recommend(payload: RecommendationRequest) -> RecommendationResponse:
    recommendations = recommendation_service.build_recommendations(
        payload.user_profile, payload.travel_date
    )
    return RecommendationResponse(recommendations=recommendations)
