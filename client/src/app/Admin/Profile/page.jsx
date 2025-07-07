"use client";

import { useUser } from "@/Context/userContext";
import { showToast } from "@/Utils/toastUtil";
import React, { useRef, useState } from "react";

const Page = () => {
  const { userData, loadingUser } = useUser(null);

  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const bannerInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const uploadImage = async (file, type) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", type);
  formData.append("userId", userData._id);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to upload");

    const data = await res.json();
    console.log(`${type} uploaded successfully:`, data);

    showToast(`${type === "logo" ? "Logo" : "Banner"} uploaded successfully`, "success");
  } catch (err) {
    console.error(`Error uploading ${type}:`, err);
    showToast(`Failed to upload ${type}`, "error");
  }
};


 const handleBannerChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const previewUrl = URL.createObjectURL(file);
    setBannerPreview(previewUrl);
    uploadImage(file, "banner");
  } else {
    showToast("No banner image selected", "warning");
  }
};

const handleLogoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    uploadImage(file, "logo");
  } else {
    showToast("No logo image selected", "warning");
  }
};


  if (loadingUser || !userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-[1200px] bg-gray-100 font-sans antialiased flex flex-col items-center">
      <div className="w-full overflow-hidden">
        {/* Banner Section */}
        {/* Banner Section */}
<div className="relative w-full h-16 sm:h-48 md:h-32 bg-gray-300">
  <img
    src={
      bannerPreview ||
      "https://placehold.co/1200x400/808080/FFFFFF?text=Company+Banner"
    }
    alt="Company Banner"
    className="w-full h-full object-cover"
  />

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
  <div
    className="absolute -top-16 left-6 md:left-8 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md"
  >
    {/* Image wrapper with overflow-hidden to clip image, not icon */}
    <div className="w-full h-full rounded-full overflow-hidden bg-blue-500">
      <img
        src={
          logoPreview ||
          `https://placehold.co/128x128/3B82F6/FFFFFF?text=${
            userData.name?.charAt(0) || "U"
          }`
        }
        alt="Profile"
        className="w-full h-full object-cover"
      />
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
