from pydantic import BaseModel, Field

from app.schemas.user import UserProfile


class ItineraryRequest(BaseModel):
    user_profile: UserProfile
    travel_date: str | None = Field(default=None, examples=["2026-07-10"])


class WeatherSummary(BaseModel):
    rain_probability: int | None = None
    wind_speed: float | None = None
    weather_alert: str | None = None


class ItinerarySlot(BaseModel):
    period: str          # morning | lunch | afternoon | pre_departure
    time_hint: str       # "09:30" 등
    title: str
    place_name: str | None = None
    category: str | None = None
    reason: str
    is_alternative: bool = False  # 날씨로 실외 -> 실내 대체된 슬롯


class EarlyDeparture(BaseModel):
    recommended: bool
    recommended_airport_arrival_time: str | None = None
    reason: str


class ItineraryResponse(BaseModel):
    travel_date: str | None = None
    weather_summary: WeatherSummary
    slots: list[ItinerarySlot]
    early_departure: EarlyDeparture
    cautions: list[str]
