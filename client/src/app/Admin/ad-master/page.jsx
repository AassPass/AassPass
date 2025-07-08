"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { useRole } from "@/Context/RoleContext";
import { BACKEND_BUSINESS_URL, BACKEND_USER_URL } from "@/Utils/backendUrl";
import { useUser } from "@/Context/userContext";

const AdList = dynamic(() => import("./Component/AdList"), { ssr: false });
const AdListing = dynamic(() => import("./Component/AdListing"), {
  ssr: false,
});

export default function page() {
  const [ads, setAds] = useState([]);

  const [editingAd, setEditingAd] = useState(null);
  const [isAdEditing, setIsAdEditing] = useState(false);

  const [publishedCount, setPublishedCount] = useState(0); // 👈 track published ads count
const {userData} =useUser()
  const { businessId, role } = useRole(); // 👈 include role
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    // console.log(businessId, role);

    // if (role !== 'SUPER_ADMIN' || role !== "ADMIN") return;

    // console.log("dslfhsdofghpsodf");

    fetchedRef.current = true;

 const fetchAds = async () => {
  const token = localStorage.getItem("token");

  // Only allow for ADMIN or SUPER_ADMIN
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    setAds(userData?.businesses[0]?.ads||[])
    console.warn("Unauthorized: Ads fetching is only for admins.");
    return;
  }

  try {
    const url = `${BACKEND_BUSINESS_URL}/ads`;
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch ads");

    const data = await res.json();
    console.log(data?.data, "Fetched ads for admin");
    setAds(data?.data || []);
  } catch (error) {
    console.error("Error fetching ads:", error);
    setAds([]);
    setPublishedCount(0);
  }
};


    fetchAds();
  }, []);

  return (
    <div className="flex flex-col gap-2 px-4 py-2 w-full max-w-[1200px] mx-auto">
      <div className="mb-4">
        <AdListing
          ads={ads}
          setAds={setAds}
          editingAd={editingAd}
          setEditingAd={setEditingAd}
          isAdEditing={isAdEditing}
          setIsAdEditing={setIsAdEditing}
          publishedCount={publishedCount} // ✅ pass to child
          role={role} // ✅ pass to child
        />
      </div>

      <AdList
        ads={ads}
        setAds={setAds}
        editingAd={editingAd}
        setEditingAd={setEditingAd}
        isAdEditing={isAdEditing}
        setIsAdEditing={setIsAdEditing}
      />
    </div>
  );
}
