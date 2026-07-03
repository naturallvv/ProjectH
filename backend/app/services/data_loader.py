"""mock JSON 데이터 로더.

MVP는 DB 대신 data/mock/*.json 을 읽어 메모리에 캐시한다.
실 공공데이터 연동 단계에서는 각 *_client.py 가 이 로더를 fallback 으로 사용한다.
"""
import json
from functools import lru_cache
from typing import Any

from app.config import MOCK_DIR


def _load_json(filename: str) -> Any:
    path = MOCK_DIR / filename
    with path.open(encoding="utf-8") as f:
        return json.load(f)


@lru_cache
def load_places() -> list[dict]:
    return _load_json("mock_places.json")


@lru_cache
def load_weather() -> dict:
    return _load_json("mock_weather.json")


@lru_cache
def load_airport_floor_maps() -> list[dict]:
    return _load_json("mock_airport_floor_maps.json")


@lru_cache
def load_airport_facilities() -> list[dict]:
    return _load_json("mock_airport_facilities.json")


@lru_cache
def load_jdc_stores() -> list[dict]:
    return _load_json("mock_jdc_stores.json")


def get_place_by_id(place_id: str) -> dict | None:
    return next((p for p in load_places() if p["id"] == place_id), None)
