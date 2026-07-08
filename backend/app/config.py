"""애플리케이션 설정. .env 에서 환경변수를 읽는다."""
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent  # backend/
MOCK_DIR = BASE_DIR / "data" / "mock"


class Settings(BaseSettings):
    app_env: str = "development"
    cors_origins: str = "http://localhost:5173"

    # RAG 연동 (별도 팀원 서버). 비어 있으면 mock fallback.
    rag_server_url: str = ""
    rag_timeout_seconds: float = 5.0

    # 공공데이터 API 키 (Step 14 실연동)
    kma_api_key: str = ""
    jdc_api_key: str = ""
    data_go_kr_api_key: str = ""

    # JDC 면세점 매장정보 API (data.go.kr B551391). serviceKey 는 Decoding 키.
    # 제공기관 공지에 따른 변경 후 URL(복수형). 구 URL(jdcdutyfreeshop/brands)은 90일 후 중지.
    jdc_api_url: str = "https://apis.data.go.kr/B551391/jdcdutyfreeshops"
    public_api_timeout_seconds: float = 10.0

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
