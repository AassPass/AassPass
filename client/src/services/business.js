import { BACKEND_ADMIN_URL } from "@/Utils/backendUrl";

export async function saveBusiness(businessData, isEditing, token) {
  const url = isEditing
    ? `${BACKEND_ADMIN_URL}/update-business/${businessData.businessId}`
    : `${BACKEND_ADMIN_URL}/business`;

  const method = isEditing ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(businessData),
  });

  if (!response.status === 201) {
    const errData = await response.json();
    throw new Error(errData.message || "Failed to save business.");
  }

  const resJson = await response.json();
  return resJson.business;
}
