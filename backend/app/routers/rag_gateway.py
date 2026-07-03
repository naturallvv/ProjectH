from fastapi import APIRouter

from app.schemas.rag import RagRequest, RagResponse
from app.services import rag_client

router = APIRouter(prefix="/api/rag", tags=["rag"])


@router.post("/recommend", response_model=RagResponse)
def recommend(payload: RagRequest) -> RagResponse:
    """RAG 팀원 서버로의 gateway. 미연결 시 mock 설명을 반환한다."""
    return rag_client.get_recommendation(payload)
