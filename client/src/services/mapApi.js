import { BACKEND_USER_URL } from "@/Utils/backendUrl";

export async function getNearbyBusinesses({ lat, lng, radius }) {
  try {
    const url = new URL(`${BACKEND_USER_URL}/businesses`);
    url.searchParams.append("lat", lat);
    url.searchParams.append("lng", lng);
    url.searchParams.append("radius", radius);

    const res = await fetch(url.toString(), { method: "GET" });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to fetch nearby businesses");
    }

    return await res.json();
  } catch (error) {
    console.error("Network or parsing error:", error);
    throw error; // rethrow for caller to handle
  }
}
