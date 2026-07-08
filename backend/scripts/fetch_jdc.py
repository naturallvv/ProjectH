"""JDC 면세점 매장정보 실 API 원본 수집 스크립트.

사용법:
    conda activate projecth
    cd backend
    python scripts/fetch_jdc.py

- backend/.env 의 JDC_API_KEY 를 사용한다.
- 원본 응답을 data/raw/jdc_brands_raw.json 에, 정규화 결과를 data/processed/jdc_stores.json 에 저장한다.
- 키가 아직 전파되지 않았거나 제공기관 오류면 실패 메시지를 출력한다(앱은 mock 으로 계속 동작).
"""
import json
import sys
from pathlib import Path

# backend 를 import 경로에 추가
BACKEND = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND))

import requests  # noqa: E402

from app.config import get_settings  # noqa: E402
from app.services import jdc_client  # noqa: E402

RAW_DIR = BACKEND / "data" / "raw"
PROCESSED_DIR = BACKEND / "data" / "processed"


def main() -> int:
    settings = get_settings()
    if not settings.jdc_api_key.strip():
        print("JDC_API_KEY 가 설정되지 않았습니다. backend/.env 를 확인하세요.")
        return 1

    print(f"호출: {settings.jdc_api_url}")
    try:
        resp = requests.get(
            settings.jdc_api_url,
            params={"serviceKey": settings.jdc_api_key},
            timeout=settings.public_api_timeout_seconds,
        )
        resp.raise_for_status()
    except Exception as exc:  # noqa: BLE001
        print(f"[실패] {exc}")
        print("키가 방금 발급되었다면 전파(활성화)까지 최대 1시간~1일 걸릴 수 있습니다. 나중에 다시 시도하세요.")
        return 2

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    (RAW_DIR / "jdc_brands_raw.txt").write_text(resp.text, encoding="utf-8")

    stores = jdc_client.fetch_live_stores()
    processed = [s.model_dump() for s in stores]
    (PROCESSED_DIR / "jdc_stores.json").write_text(
        json.dumps(processed, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"[성공] 매장 {len(stores)}건 저장 → data/processed/jdc_stores.json")
    for s in stores[:5]:
        print(f"  - {s.store_name} | {s.category} | {s.phone}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
