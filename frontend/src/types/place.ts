export type RecommendationLevel =
  | "recommended"
  | "conditional"
  | "not_recommended";

export interface PlaceFacts {
  has_accessible_parking: boolean | null;
  has_accessible_toilet: boolean | null;
  has_wheelchair_rental: boolean | null;
  is_indoor: boolean | null;
}

export interface Recommendation {
  place_id: string;
  name: string;
  category: string;
  address?: string | null;
  lat?: number | null;
  lon?: number | null;
  image_urls?: string[];
  accessibility_score: number;
  weather_risk_score: number;
  transport_score: number;
  airport_burden_score: number;
  mobility_feasibility_score: number;
  recommendation_level: RecommendationLevel;
  warnings: string[];
  facts: PlaceFacts;
}
