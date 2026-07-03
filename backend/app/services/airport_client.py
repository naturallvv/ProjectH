"""한국공항공사 공항 데이터 조회 (mock).

- 제주국제공항 도면 이미지 정보
- 제주공항 층별 입점업체 현황

실 연동 단계에서는 API 호출 후 실패 시 이 mock 을 fallback 으로 사용한다.
"""
from app.schemas.airport import AirportFacility, FloorMap
from app.services import data_loader


def get_floor_maps() -> list[FloorMap]:
    return [FloorMap(**m) for m in data_loader.load_airport_floor_maps()]


def get_facilities() -> list[AirportFacility]:
    return [
        AirportFacility(
            facility_name=f["facility_name"],
            terminal=f["terminal"],
            floor=f["floor"],
            category=f["category"],
            location_hint=f.get("location_hint"),
            source=f["source"],
        )
        for f in data_loader.load_airport_facilities()
    ]
