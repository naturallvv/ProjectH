"""JDC 제주국제공항 면세점 매장정보 조회 (mock).

원칙: JDC 데이터는 면세점 매장정보 안내에만 사용한다.
공항 편의시설 위치·이용 가능 여부(휠체어 대여, 수유실, 물품보관함 등)는 제공하지 않는다.
"""
from app.schemas.airport import JdcStore
from app.services import data_loader

DATA_LIMITATIONS = [
    "JDC 데이터는 면세점 매장정보만 제공합니다.",
    "JDC 데이터로 편의시설 위치나 이용 가능 여부를 판단하지 않습니다.",
    "공항 시설 안내는 한국공항공사 층별 입점업체 현황을 사용합니다.",
]


def get_stores() -> list[JdcStore]:
    return [
        JdcStore(
            store_name=s["store_name"],
            location=s["location"],
            category=s.get("category"),
            open_time=s.get("open_time"),
            close_time=s.get("close_time"),
            phone=s.get("phone"),
            source=s["source"],
            data_limit=s.get("data_limit"),
        )
        for s in data_loader.load_jdc_stores()
    ]
