"use client";
import React, { useRef, useState } from "react";
import { useUser } from "@/Context/userContext";
import { showToast } from "@/Utils/toastUtil";
import { BACKEND_USER_URL } from "@/Utils/backendUrl";
import { compressImage } from "@/Utils/imageCompresson";
import Image from "next/image";
import { FaImage, FaUserCircle } from "react-icons/fa";

const Page=() => {
  const { userData } = useUser(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const bannerInputRef = useRef(null);
  const logoInputRef = useRef(null);

  // 🚫 Browser APIs are inside handlers only
  const uploadImage = async (file, fieldName) => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) { showToast("Not authenticated", "error"); return; }

    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const res = await fetch(`${BACKEND_USER_URL}/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      showToast(
        `${fieldName === "profilePicture" ? "Logo" : "Banner"} uploaded successfully`,
        "success"
      );
    } catch {
      showToast(`Failed to upload ${fieldName}`, "error");
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return showToast("No banner image selected", "warning");
    const compressed = await compressImage(file, 0.2);
    setBannerPreview(URL.createObjectURL(compressed));
    uploadImage(compressed, "bannerPicture");
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return showToast("No logo image selected", "warning");
    const compressed = await compressImage(file, 0.2);
    setLogoPreview(URL.createObjectURL(compressed));
    uploadImage(compressed, "profilePicture");
  };

  if (!userData) return null;


  return (
    <div className="w-full max-w-[1200px] bg-gray-100 font-sans antialiased flex flex-col items-center">
      <div className="w-full overflow-hidden">
        {/* Banner Section */}
        {/* Banner Section */}
        <div className="relative w-full h-16 sm:h-48 md:h-32 bg-gray-300">
        {(bannerPreview || userData.bannerPicture) ? (
    <Image
      src={bannerPreview || userData.bannerPicture}
      alt="Company Banner"
      width={1200}
      height={400}
      className="w-full h-full object-cover"
      onError={(e) => {
        // Hide broken image
        e.currentTarget.style.display = "none";
      }}
    />
  ) : (
    <div className="flex items-center justify-center w-full h-full bg-gray-300">
      <FaImage className="text-gray-500" size={48} />
    </div>
  )}

          {/* Edit Icon */}
          <div
            className="absolute top-2 right-2 bg-white rounded-full p-1 cursor-pointer shadow-md"
            onClick={() => bannerInputRef.current.click()}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536M9 11l6.293-6.293a1 1 0 011.414 0l2.586 2.586a1 1 0 010 1.414L13 15H9v-4z"
              />
            </svg>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={bannerInputRef}
            className="hidden"
            onChange={handleBannerChange}
          />
        </div>

        <div className="relative px-6 pb-6">
          {/* Profile Image */}
          <div className="relative">
            {/* Outer Wrapper (no overflow-hidden!) */}
            <div className="absolute -top-16 left-6 md:left-8 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md">
              {/* Image wrapper with overflow-hidden to clip image, not icon */}
              <div className="w-full h-full rounded-full overflow-hidden bg-blue-500">
                <div className="w-full h-full rounded-full overflow-hidden bg-blue-500 flex items-center justify-center">
  {logoPreview || userData.profilePicture ? (
    <Image
      src={logoPreview || userData.profilePicture}
      alt="Profile"
      width={128}
      height={128}
      className="w-full h-full object-cover"
      onError={(e) => {
        // Fallback to icon if image fails to load
        e.currentTarget.style.display = "none";
      }}
    />
  ) : (
    <FaUserCircle className="text-gray-200" size={80} />
  )}
</div>
              </div>

              {/* ✅ Edit Icon — no longer clipped */}
              <div
                className="absolute top-1 right-1 z-20 bg-white rounded-full p-1 cursor-pointer shadow-md"
                onClick={() => logoInputRef.current.click()}
              >
                <svg
                  className="w-4 h-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536M9 11l6.293-6.293a1 1 0 011.414 0l2.586 2.586a1 1 0 010 1.414L13 15H9v-4z"
                  />
                </svg>
              </div>

              <input
                type="file"
                accept="image/*"
                ref={logoInputRef}
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
          </div>

          {/* Business Info and Verified Status */}
          <div className="pt-16 sm:pt-12 md:pt-8 pl-0 sm:pl-36 md:pl-40 flex sm:flex-row justify-between items-start sm:items-end">
            {/* Business Name and Email */}
            <div className="mb-4 sm:mb-0 text-start sm:text-left">
              <h1 className="text-xl font-extrabold text-gray-900 mb-1">
                {userData.name}
              </h1>
              <p className="text-md sm:text-xl text-gray-600">
                {userData.email}
              </p>
              <p className="text-sm text-gray-500">
                📞 {userData?.businesses[0]?.phoneNumber || "No mobile number"}
              </p>
              <p className="text-sm text-gray-500">🛡️ Role: {userData.role}</p>
            </div>

            {/* Verified Status */}
            {userData.businesses?.[0]?.verificationStatus === "PENDING" && (
              <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-1 md:px-4 md:py-2 font-semibold text-sm sm:text-base shadow-sm">
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                  ></path>
                </svg>
                <span className="text-[8px] md:text-md">
                  Verification Pending
                </span>
              </div>
            )}

            {userData.businesses?.[0]?.verificationStatus === "VERIFIED" && (
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-1 md:px-4 md:py-2 font-semibold text-sm sm:text-base shadow-sm">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="text-[8px] md:text-md">Verified Business</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
