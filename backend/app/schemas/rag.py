from typing import Any

from pydantic import BaseModel


class RagCandidatePlace(BaseModel):
    name: str
    category: str | None = None
    accessibility_score: int | None = None
    weather_risk_score: int | None = None
    mobility_feasibility_score: int | None = None
    verified_facts: list[str] = []
    unknown_facts: list[str] = []


class RagRequest(BaseModel):
    """RAG 팀원 서버로 전달할 근거 데이터 (가이드 §8.1)."""

    user_profile: dict[str, Any] | None = None
    weather_summary: dict[str, Any] | None = None
    candidate_places: list[RagCandidatePlace] = []
    airport_context: dict[str, Any] | None = None


class RagResponse(BaseModel):
    """RAG 모듈이 반환하는 자연어 설명 (가이드 §8.1)."""

    summary: str
    recommended_itinerary_reason: str
    risk_explanation: str
    airport_guidance: str
    cautions: list[str]
    source: str = "mock"  # mock | rag-server, 응답 출처 표시용
