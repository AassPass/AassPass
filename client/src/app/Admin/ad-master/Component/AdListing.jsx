"use client";
import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { compressImage } from "@/Utils/imageCompresson";
import { showToast } from "@/Utils/toastUtil";
import { BACKEND_BUSINESS_URL } from "@/Utils/backendUrl";
import { validateAdForm } from "@/Utils/validations";

const adTypes = [
  "Deals & Discounts",
  "Events",
  "Services",
  "Products for Sale",
  "Job Openings",
  "Rentals & Properties",
  "Announcements",
  "Contests & Giveaways",
];

const Input = ({ label, error, ...props }) => (
  <div className="max-w-xs">
    {label && (
      <label className="block text-xs font-medium text-gray-700">
        {label}
      </label>
    )}
    <input
      {...props}
      className={`w-full px-2 py-1 text-sm rounded border ${
        error ? "border-red-500" : "border-gray-300"
      } text-black h-8 focus:outline-none focus:ring-2 ${
        error ? "focus:ring-red-500" : "focus:ring-blue-500"
      }`}
    />
    <p className="text-xs h-4 text-red-500">
      {error || "\u00A0" /* non-breaking space */}
    </p>
  </div>
);



export default function AdForm({ setAds }) {
  const [loading, setLoading] = useState(false);
  const [errors,setErrors] = useState({})
const [uploadingImages, setUploadingImages] = useState({});
  const [form, setForm] = useState({
    title: "",
    adType: "",
    visibleFrom: "",
    visibleTo: "",
    stage: "SAVED",
    reset: false,
    images: {},
    metadata: {},
  });
  const today = new Date().toISOString().split("T")[0];
  const [previewImages, setPreviewImages] = useState([]);
  const [imageSlot, setImageSlot] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [name]: value },
    }));
  };

  const openFileDialog = (slot) => {
    setImageSlot(slot);
    document.getElementById("imageUploadInput").click();
  };

 const handleImageUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploadingImages(prev => ({ ...prev, [imageSlot]: true }));

  try {
    const compressed = await compressImage(file, 1);
    const url = URL.createObjectURL(compressed);

    setPreviewImages((prev) => {
      const arr = [...prev];
      arr[imageSlot] = url;
      return arr;
    });

    setForm((prev) => ({
      ...prev,
      images: { ...prev.images, [imageSlot]: compressed },
    }));
  } catch {
    alert("Image compression failed.");
  } finally {
    setUploadingImages(prev => ({ ...prev, [imageSlot]: false }));
     e.target.value = null; 
  }
};


  useEffect(() => {
    return () => previewImages.forEach((url) => URL.revokeObjectURL(url));
  }, [previewImages]);

  const renderMetadataFields = (errors = {}) => {
  const { adType } = form;
  const md = form.metadata;

  switch (adType) {
    case "Deals & Discounts":
      return (
        <>
          <Input name="description" value={md.description || ""} label="Description" onChange={handleMetadataChange} error={errors.description} />
          <Input name="discountPercentage" type="number" value={md.discountPercentage || ""} label="Discount %" onChange={handleMetadataChange} error={errors.discountPercentage} />
          <Input name="validTill" type="date" value={md.validTill || ""} label="Valid Till" onChange={handleMetadataChange} error={errors.validTill} />
          <Input name="terms" value={md.terms || ""} label="Terms" onChange={handleMetadataChange} error={errors.terms} />
        </>
      );

    case "Events":
      return (
        <>
          <Input name="description" value={md.description || ""} label="Description" onChange={handleMetadataChange} error={errors.description} />
          <Input name="organizerName" value={md.organizerName || ""} label="Organizer Name" onChange={handleMetadataChange} error={errors.organizerName} />
          <Input name="location" value={md.location || ""} label="Event Location" onChange={handleMetadataChange} error={errors.location} />
          <Input name="time" value={md.time || ""} label="Time" onChange={handleMetadataChange} error={errors.time} />
          <Input name="rsvp" value={md.rsvp || ""} label="RSVP Info" onChange={handleMetadataChange} error={errors.rsvp} />
        </>
      );

    case "Services":
      return (
        <>
          <Input name="description" value={md.description || ""} label="Description" onChange={handleMetadataChange} error={errors.description} />
          <Input name="serviceType" value={md.serviceType || ""} label="Service Type" onChange={handleMetadataChange} error={errors.serviceType} />
          <Input name="contact" value={md.contact || ""} label="Contact" onChange={handleMetadataChange} error={errors.contact} />
          <Input name="radius" value={md.radius || ""} label="Service Radius" onChange={handleMetadataChange} error={errors.radius} />
        </>
      );

    case "Products for Sale":
      return (
        <>
          <Input name="description" value={md.description || ""} label="Description" onChange={handleMetadataChange} error={errors.description} />
          <Input name="price" type="number" value={md.price || ""} label="Price" onChange={handleMetadataChange} error={errors.price} />
          <Input name="quantityAvailable" type="number" value={md.quantityAvailable || ""} label="Quantity Available" onChange={handleMetadataChange} error={errors.quantityAvailable} />
          <Input name="deliveryOption" value={md.deliveryOption || ""} label="Delivery Option" onChange={handleMetadataChange} error={errors.deliveryOption} />
          <Input name="condition" value={md.condition || ""} label="Condition" onChange={handleMetadataChange} error={errors.condition} />
        </>
      );

    case "Job Openings":
      return (
        <>
          <Input name="jobDescription" value={md.jobDescription || ""} label="Job Description" onChange={handleMetadataChange} error={errors.jobDescription} />
          <Input name="jobType" value={md.jobType || ""} label="Job Type" onChange={handleMetadataChange} error={errors.jobType} />
          <Input name="salary" value={md.salary || ""} label="Salary" onChange={handleMetadataChange} error={errors.salary} />
          <Input name="hours" value={md.hours || ""} label="Hours" onChange={handleMetadataChange} error={errors.hours} />
          <Input name="location" value={md.location || ""} label="Location" onChange={handleMetadataChange} error={errors.location} />
          <Input name="qualifications" value={md.qualifications || ""} label="Qualifications" onChange={handleMetadataChange} error={errors.qualifications} />
        </>
      );

    case "Rentals & Properties":
      return (
        <>
          <Input name="description" value={md.description || ""} label="Description" onChange={handleMetadataChange} error={errors.description} />
          <Input name="sizeOrArea" value={md.sizeOrArea || ""} label="Size / Area" onChange={handleMetadataChange} error={errors.sizeOrArea} />
          <Input name="rent" value={md.rent || ""} label="Rent" onChange={handleMetadataChange} error={errors.rent} />
          <Input name="amenities" value={md.amenities || ""} label="Amenities" onChange={handleMetadataChange} error={errors.amenities} />
          <Input name="contact" value={md.contact || ""} label="Contact" onChange={handleMetadataChange} error={errors.contact} />
          <Input name="availableFrom" type="date" value={md.availableFrom || ""} label="Available From" onChange={handleMetadataChange} error={errors.availableFrom} />
        </>
      );

    case "Announcements":
      return (
        <>
          <Input name="description" value={md.description || ""} label="Description" onChange={handleMetadataChange} error={errors.description} />
          <Input name="announcementType" value={md.announcementType || ""} label="Type" onChange={handleMetadataChange} error={errors.announcementType} />
          <Input name="importanceLevel" value={md.importanceLevel || ""} label="Importance Level" onChange={handleMetadataChange} error={errors.importanceLevel} />
        </>
      );

    case "Contests & Giveaways":
      return (
        <>
          <Input name="description" value={md.description || ""} label="Description" onChange={handleMetadataChange} error={errors.description} />
          <Input name="participationRules" value={md.participationRules || ""} label="Participation Rules" onChange={handleMetadataChange} error={errors.participationRules} />
          <Input name="winnerAnnouncementDate" type="date" value={md.winnerAnnouncementDate || ""} label="Winner Announcement Date" onChange={handleMetadataChange} error={errors.winnerAnnouncementDate} />
          <Input name="rules" value={md.rules || ""} label="Rules" onChange={handleMetadataChange} error={errors.rules} />
          <Input name="endDate" type="date" value={md.endDate || ""} label="End Date" onChange={handleMetadataChange} error={errors.endDate} />
          <Input name="eligibility" value={md.eligibility || ""} label="Eligibility" onChange={handleMetadataChange} error={errors.eligibility} />
          <Input name="prize" value={md.prize || ""} label="Prize" onChange={handleMetadataChange} error={errors.prize} />
        </>
      );

    default:
      return (
        <p className="text-sm italic text-gray-500">
          Select an ad type to continue
        </p>
      );
  }
};


 const handleSubmit = async (e) => {
    e.preventDefault();
  const validationErrors = validateAdForm(form);
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) {
    showToast("Please fix the errors before submitting", "error");
    return;
  }
  setLoading(true); // Start loading
  const fd = new FormData();
  const {
    title,
    adType,
    visibleFrom,
    visibleTo,
    stage,
    reset,
    metadata,
    images,
  } = form;

  fd.append("title", title);
  fd.append("adType", adType);
  fd.append("visibleFrom", visibleFrom);
  fd.append("visibleTo", visibleTo);
  fd.append("stage", stage);
  fd.append("reset", reset.toString());

  Object.entries(metadata).forEach(([k, v]) => fd.append(k, v));
  Object.values(images).forEach((file) => fd.append("images", file));
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BACKEND_BUSINESS_URL}/new-ad`, {
      method: "POST",
      credentials: "include",
      body: fd,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
// console.log(data)
    if (!res.ok) {
      showToast(data.message || "Failed to create ad", "error");
      return;
    }

    showToast("Ad created successfully!", "success");
    setAds?.((prev) => [data.ad, ...prev]);
  } catch (err) {
    console.error(err);
    showToast("Error submitting form", "error");
  } finally {
      setForm({
        title: "",
        adType: "",
        visibleFrom: "",
        visibleTo: "",
        stage: "SAVED",
        reset: false,
        images: {},
        metadata: {},
      });
      setPreviewImages([]);
      setImageSlot(null);
    setLoading(false); // Stop loading
  }
};


  return (
    <div className="border bg-white rounded-2xl shadow-md text-gray-800 max-w-5xl mx-auto">
      <div className="bg-blue-400 p-4 rounded-t-2xl">
        <h2 className="text-white text-sm font-semibold">Create New Ad</h2>
      </div>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6"
        onSubmit={(e) => handleSubmit(e, "published")}
      >
        {/* Left Column: Independent/Common Fields */}
        <div className="grid grid-cols-2 gap-2">
        <Input
  name="title"
  value={form.title}
  label="Ad Title"
  onChange={handleChange}
  error={errors.title}
/>

        <div className="max-w-xs">
  <label className="block text-xs font-medium text-gray-700 ">Ad Type</label>
  <select
    name="adType"
    value={form.adType}
    onChange={handleChange}
    className={`w-full p-2 border text-sm rounded ${
      errors.adType ? "border-red-500" : "border-gray-300"
    }`}
  >
    <option value="">Select Ad Type</option>
    {adTypes.map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>
  <p className={`text-xs mt-1 h-4 ${errors.adType ? "text-red-500" : "invisible"}`}>
  {errors.adType || "placeholder"}
</p>
</div>
<div>
  <Input
  name="visibleFrom"
  type="date"
  value={form.visibleFrom}
  label="Visible From"
  onChange={handleChange}
  min={today}
  error={errors.visibleFrom}
/>

</div>
<div>
       <Input
  name="visibleTo"
  type="date"
  value={form.visibleTo}
  label="Visible To"
  onChange={handleChange}
  min={today}
  error={errors.visibleTo}
/>

</div>



          <div className="col-span-2">
            <input
              type="file"
              id="imageUploadInput"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            <div className="grid grid-cols-2 gap-2">
              {/* Banner at index 0 */}
              <div
  onClick={() => openFileDialog(0)}
  className="col-span-2 relative cursor-pointer rounded border-dashed border-2 border-gray-400 bg-white flex items-center justify-center overflow-hidden"
  style={{ aspectRatio: "4 / 1" }}
>
  {uploadingImages[0] ? (
    <svg
      className="animate-spin h-8 w-8 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  ) : previewImages[0] ? (
    <img
      src={previewImages[0]}
      alt="Banner Preview"
      className="w-full h-full object-cover"
    />
  ) : (
    <FiPlus className="text-gray-400 text-6xl" />
  )}
</div>


              {/* Small images at index 1 and 2 */}
            {[1, 2].map((i) => (
  <div
    key={i}
    onClick={() => openFileDialog(i)}
    className="relative cursor-pointer rounded border-dashed border-2 border-gray-400 bg-white flex items-center justify-center overflow-hidden"
    style={{ aspectRatio: "3 / 2" }}
  >
    {uploadingImages[i] ? (
      <svg
        className="animate-spin h-6 w-6 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    ) : previewImages[i] ? (
      <img
        src={previewImages[i]}
        alt={`Preview ${i}`}
        className="w-full h-full object-cover"
      />
    ) : (
      <FiPlus className="text-gray-400 text-4xl" />
    )}
    
  </div>
  
))}
<p className={`text-xs mt-1 h-4 ${errors.images ? "text-red-500" : "invisible"}`}>
  {errors.images || "placeholder"}
</p>

            </div>
          </div>

         <div className="md:col-span-2 flex justify-center space-x-3 w-full ">
  <button
    type="button"
    onClick={() => {
      setForm({
        title: "",
        adType: "",
        visibleFrom: "",
        visibleTo: "",
        stage: "SAVED",
        reset: false,
        images: {},
        metadata: {},
      });
      setPreviewImages([]);
      setImageSlot(null);
    }}
    className="px-4 py-2 border-gray-300 border-2 hover:text-white text-gray-300 rounded hover:bg-gray-300 cursor-pointer hidden md:block"
  >
    Cancel
  </button>

  <button
    type="submit"
    className="px-4 py-2 border-blue-400 border-2 text-blue-400 hover:text-white cursor-pointer rounded hover:bg-blue-400 flex items-center justify-center min-w-[100px] hidden md:block"
    disabled={loading}
  >
    {loading ? (
      <svg
        className="animate-spin h-5 w-5 text-blue-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    ) : (
      "Publish"
    )}
  </button>
</div>

        </div>

        {/* Right Column: Category-Specific Extra Fields + Image Upload */}
        <div className="p-6 rounded-md border overflow-y-auto space-y-2">
          <h4 className="text-xs font-semibold text-gray-600 mb-4">
            Additional Details
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {renderMetadataFields(errors) || (
              <p className="text-xs text-gray-400 italic">
                Select an Ad Type to see more
              </p>
            )}
          </div>
        </div>
        <div className="md:col-span-2 flex justify-center space-x-3 w-full ">
  <button
    type="button"
    onClick={() => {
      setForm({
        title: "",
        adType: "",
        visibleFrom: "",
        visibleTo: "",
        stage: "SAVED",
        reset: false,
        images: {},
        metadata: {},
      });
      setPreviewImages([]);
      setImageSlot(null);
    }}
    className="px-4 py-2 border-gray-300 border-2 hover:text-white text-gray-300 rounded hover:bg-gray-300 cursor-pointer block md:hidden"
  >
    Cancel
  </button>

  <button
    type="submit"
    className="px-4 py-2 border-blue-400 border-2 text-blue-400 hover:text-white cursor-pointer rounded hover:bg-blue-400 flex items-center justify-center min-w-[100px] block md:hidden"
    disabled={loading}
  >
    {loading ? (
      <svg
        className="animate-spin h-5 w-5 text-blue-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    ) : (
      "Publish"
    )}
  </button>
</div>

      </form>
    </div>
  );
}
