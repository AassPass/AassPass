'use client';

import { useUser } from '@/Context/userContext';
import { BACKEND_USER_URL } from '@/Utils/backendUrl';
import React, { useEffect, useRef, useState } from 'react';

const Page = () => {
 const { userData, loadingUser } = useUser(null);
  
    const [bannerPreview, setBannerPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
const bannerInputRef = useRef(null);
  const logoInputRef = useRef(null);

  

 
  // Handle banner image selection
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);

      // TODO: upload file to server here or store for submission
    }
  };

  // Handle logo image selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);

      // TODO: upload file to server here or store for submission
    }
  };
  console.log(userData)
if (loadingUser || !userData) {
  return <div>Loading...</div>; // Show loading state or fallback UI
}

 

  return (
    <div className="w-full max-w-[1200px] bg-gray-100 font-sans antialiased flex flex-col items-center">
      <div className="w-full overflow-hidden">
        {/* Banner Section */}
          <div
          className="relative w-full h-16 sm:h-48 md:h-32 bg-gray-300 cursor-pointer"
          onClick={() => bannerInputRef.current.click()}
        >
          <img
            src={
              bannerPreview ||
              "https://placehold.co/1200x400/808080/FFFFFF?text=Company+Banner"
            }
            alt="Company Banner"
            className="w-full h-full object-cover"
          />
          {/* Hidden input for banner */}
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
          <div
            className="absolute -top-16 left-6 md:left-8 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-blue-500 border-4 border-white shadow-md overflow-hidden cursor-pointer"
            onClick={() => logoInputRef.current.click()}
          >
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
            {/* Hidden input for logo */}
            <input
              type="file"
              accept="image/*"
              ref={logoInputRef}
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>

          {/* Business Info and Verified Status */}
          <div className="pt-16 sm:pt-12 md:pt-8 pl-0 sm:pl-36 md:pl-40 flex sm:flex-row justify-between items-start sm:items-end">
            {/* Business Name and Email */}
            <div className="mb-4 sm:mb-0 text-start sm:text-left">
              <h1 className="text-xl font-extrabold text-gray-900 mb-1">
                {userData.name}
              </h1>
              <p className="text-md sm:text-xl text-gray-600">{userData.email}</p>
              <p className="text-sm text-gray-500">
                📞 {userData?.businesses[0]?.
phoneNumber || "No mobile number"}
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
    <span className="text-[8px] md:text-md">Verification Pending</span>
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
