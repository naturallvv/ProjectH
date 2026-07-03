import { client } from "./client";
import type { UserProfile } from "../types/user";
import type { Recommendation } from "../types/place";

export interface RecommendationRequest {
  user_profile: UserProfile;
  travel_date?: string;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
}

export async function postRecommendations(
  payload: RecommendationRequest
): Promise<Recommendation[]> {
  const { data } = await client.post<RecommendationResponse>(
    "/api/recommendations",
    payload
  );
  return data.recommendations;
}
