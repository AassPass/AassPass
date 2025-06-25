import { BACKEND_AUTH_URL } from "@/app/Utils/backendUrl";

export async function loginAdmin({ adminId, password }) {
  const res = await fetch(`${BACKEND_AUTH_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adminId, password }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || "Login failed");
  }

  return res.json();
}
export async function loginUser({ email, password }) {
  const res = await fetch(`${BACKEND_AUTH_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',   // <---- add this line
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || "Login failed");
  }

  return res.json();
}

export async function signupUser({ name, email, password }) {
  const res = await fetch(`${BACKEND_AUTH_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || "Signup failed");
  }

  return res.json();
}
