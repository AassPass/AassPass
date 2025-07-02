import { BACKEND_USER_URL } from "@/Utils/backendUrl";

export async function GetRandomAds() {
  try {
    const n=5;
    const response = await fetch(`${BACKEND_USER_URL}/get-ads?n=${n}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ads: ${response.status}`);
    }

    const data = await response.json();
    return data.ads;
  } catch (error) {
    console.error("Error fetching random ads:", error);
    return [];
  }
}
