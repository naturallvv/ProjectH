import { client } from "./client";
import type { UserProfile } from "../types/user";
import type { Itinerary } from "../types/itinerary";

export async function postItinerary(
  user_profile: UserProfile,
  travel_date?: string
): Promise<Itinerary> {
  const { data } = await client.post<Itinerary>("/api/itinerary", {
    user_profile,
    travel_date,
  });
  return data;
}
