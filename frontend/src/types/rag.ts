export interface RagCandidatePlace {
  name: string;
  category?: string;
  accessibility_score?: number;
  weather_risk_score?: number;
  mobility_feasibility_score?: number;
  verified_facts?: string[];
  unknown_facts?: string[];
}

export interface RagRequest {
  user_profile?: Record<string, unknown>;
  weather_summary?: Record<string, unknown>;
  candidate_places: RagCandidatePlace[];
  airport_context?: Record<string, unknown>;
}

export interface RagResponse {
  summary: string;
  recommended_itinerary_reason: string;
  risk_explanation: string;
  airport_guidance: string;
  cautions: string[];
  source: string;
}
