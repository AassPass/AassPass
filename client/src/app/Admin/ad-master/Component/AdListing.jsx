'use client';
import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { compressImage } from '@/Utils/imageCompresson';
import { showToast } from '@/Utils/toastUtil';
import { BACKEND_BUSINESS_URL } from '@/Utils/backendUrl';

const adTypes = [
  'Deals & Discounts',
  'Events',
  'Services',
  'Products for Sale',
  'Job Openings',
  'Rentals & Properties',
  'Announcements',
  'Contests & Giveaways',
];

const Input = ({ label, ...props }) => (
  <div className="max-w-xs">
    {label && <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>}
    <input
      {...props}
      className="w-full px-2 py-1 text-sm rounded border border-gray-300 text-black h-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default function AdForm({ setAds }) {
  const [form, setForm] = useState({
    title: '',
    adType: '',
    visibleFrom: '',
    visibleTo: '',
    stage: 'SAVED',
    reset: false,
    images: {},
    metadata: {},
  });
const today = new Date().toISOString().split('T')[0]; 
  const [previewImages, setPreviewImages] = useState([]);
  const [imageSlot, setImageSlot] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
    document.getElementById('imageUploadInput').click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
      alert('Image compression failed.');
    }
  };

  useEffect(() => {
    return () => previewImages.forEach((url) => URL.revokeObjectURL(url));
  }, [previewImages]);

  const renderMetadataFields = () => {
    const { adType } = form;
    const md = form.metadata;

    switch (adType) {
      case 'Deals & Discounts':
        return (
          <>
            <Input name="description" value={md.description || ''} label="Description" onChange={handleMetadataChange} />
            <Input name="discountPercentage" type="number" value={md.discountPercentage || ''} label="Discount %" onChange={handleMetadataChange} />
            <Input name="validTill" type="date" value={md.validTill || ''} label="Valid Till" onChange={handleMetadataChange} />
            <Input name="terms" value={md.terms || ''} label="Terms" onChange={handleMetadataChange} />
          </>
        );
      case 'Events':
        return (
          <>
            <Input name="description" value={md.description || ''} label="Description" onChange={handleMetadataChange} />
            <Input name="organizerName" value={md.organizerName || ''} label="Organizer Name" onChange={handleMetadataChange} />
            <Input name="location" value={md.location || ''} label="Event Location" onChange={handleMetadataChange} />
            <Input name="time" value={md.time || ''} label="Time" onChange={handleMetadataChange} />
            <Input name="rsvp" value={md.rsvp || ''} label="RSVP Info" onChange={handleMetadataChange} />
          </>
        );
      case 'Services':
        return (
          <>
            <Input name="description" value={md.description || ''} label="Description" onChange={handleMetadataChange} />
            <Input name="serviceType" value={md.serviceType || ''} label="Service Type" onChange={handleMetadataChange} />
            <Input name="contact" value={md.contact || ''} label="Contact" onChange={handleMetadataChange} />
            <Input name="radius" value={md.radius || ''} label="Service Radius" onChange={handleMetadataChange} />
          </>
        );
      case 'Products for Sale':
        return (
          <>
            <Input name="description" value={md.description || ''} label="Description" onChange={handleMetadataChange} />
            <Input name="price" type="number" value={md.price || ''} label="Price" onChange={handleMetadataChange} />
            <Input name="quantityAvailable" type="number" value={md.quantityAvailable || ''} label="Quantity Available" onChange={handleMetadataChange} />
            <Input name="deliveryOption" value={md.deliveryOption || ''} label="Delivery Option" onChange={handleMetadataChange} />
            <Input name="condition" value={md.condition || ''} label="Condition" onChange={handleMetadataChange} />
          </>
        );
      case 'Job Openings':
        return (
          <>
            <Input name="jobDescription" value={md.jobDescription || ''} label="Job Description" onChange={handleMetadataChange} />
            <Input name="jobType" value={md.jobType || ''} label="Job Type" onChange={handleMetadataChange} />
            <Input name="salary" value={md.salary || ''} label="Salary" onChange={handleMetadataChange} />
            <Input name="hours" value={md.hours || ''} label="Hours" onChange={handleMetadataChange} />
            <Input name="location" value={md.location || ''} label="Location" onChange={handleMetadataChange} />
            <Input name="qualifications" value={md.qualifications || ''} label="Qualifications" onChange={handleMetadataChange} />
          </>
        );
      case 'Rentals & Properties':
        return (
          <>
            <Input name="description" value={md.description || ''} label="Description" onChange={handleMetadataChange} />
            <Input name="sizeOrArea" value={md.sizeOrArea || ''} label="Size / Area" onChange={handleMetadataChange} />
            <Input name="rent" value={md.rent || ''} label="Rent" onChange={handleMetadataChange} />
            <Input name="amenities" value={md.amenities || ''} label="Amenities" onChange={handleMetadataChange} />
            <Input name="contact" value={md.contact || ''} label="Contact" onChange={handleMetadataChange} />
            <Input name="availableFrom" type="date" value={md.availableFrom || ''} label="Available From" onChange={handleMetadataChange} />
          </>
        );
      case 'Announcements':
        return (
          <>
            <Input name="description" value={md.description || ''} label="Description" onChange={handleMetadataChange} />
            <Input name="announcementType" value={md.announcementType || ''} label="Type" onChange={handleMetadataChange} />
            <Input name="importanceLevel" value={md.importanceLevel || ''} label="Importance Level" onChange={handleMetadataChange} />
          </>
        );
      case 'Contests & Giveaways':
        return (
          <>
            <Input name="description" value={md.description || ''} label="Description" onChange={handleMetadataChange} />
            <Input name="participationRules" value={md.participationRules || ''} label="Participation Rules" onChange={handleMetadataChange} />
            <Input name="winnerAnnouncementDate" type="date" value={md.winnerAnnouncementDate || ''} label="Winner Announcement Date" onChange={handleMetadataChange} />
            <Input name="rules" value={md.rules || ''} label="Rules" onChange={handleMetadataChange} />
            <Input name="endDate" type="date" value={md.endDate || ''} label="End Date" onChange={handleMetadataChange} />
            <Input name="eligibility" value={md.eligibility || ''} label="Eligibility" onChange={handleMetadataChange} />
            <Input name="prize" value={md.prize || ''} label="Prize" onChange={handleMetadataChange} />
          </>
        );
      default:
        return <p className="text-sm italic text-gray-500">Select an ad type to continue</p>;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    const { title, adType, visibleFrom, visibleTo, stage, reset, metadata, images } = form;

    fd.append('title', title);
    fd.append('adType', adType);
    fd.append('visibleFrom', visibleFrom);
    fd.append('visibleTo', visibleTo);
    fd.append('stage', stage);
    fd.append('reset', reset.toString());

    Object.entries(metadata).forEach(([k, v]) => fd.append(k, v));
    Object.values(images).forEach((file) => fd.append('images', file));
const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${BACKEND_BUSINESS_URL}/new-ad`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || 'Failed to create ad', 'error');
        return;
      }

      showToast('Ad created successfully!', 'success');
      setAds?.((prev) => [data.ad, ...prev]);
    } catch (err) {
      console.error(err);
      showToast('Error submitting form', 'error');
    }
  };

  return (
    <div className="border bg-white rounded-2xl shadow-md text-gray-800 max-w-5xl mx-auto">
      <div className="bg-blue-400 p-4 rounded-t-2xl">
        <h2 className="text-white text-sm font-semibold">Create New Ad</h2>
      </div>
  
<form
  className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 items-center"
   onSubmit={(e) => handleSubmit(e, 'published')}
>
  {/* Left Column: Independent/Common Fields */}
  <div className="grid grid-cols-2 gap-2">
     <Input name="title" value={form.title} label="Ad Title" onChange={handleChange} />
      
    <div className="max-w-xs">
      <label className="block text-xs font-medium text-gray-700 ">Ad Type</label>
       <select name="adType" value={form.adType} onChange={handleChange} className="w-full max-w-xs p-2 border text-sm rounded">
        <option value="">Select Ad Type</option>
        {adTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
   
    <Input
  name="visibleFrom"
  type="date"
  value={form.visibleFrom}
  label="Visible From"
  onChange={handleChange}
  min={today}
/>

<Input
  name="visibleTo"
  type="date"
  value={form.visibleTo}
  label="Visible To"
  onChange={handleChange}
  min={today}
/>
  
 <div className="col-span-2" >
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
    style={{ aspectRatio: '4 / 1' }}
  >
    {previewImages[0] ? (
      <img src={previewImages[0]} alt="Banner Preview" className="w-full h-full object-cover" />
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
      style={{ aspectRatio: '3 / 2' }}
    >
      {previewImages[i] ? (
        <img src={previewImages[i]} alt={`Preview ${i}`} className="w-full h-full object-cover" />
      ) : (
        <FiPlus className="text-gray-400 text-4xl" />
      )}
    </div>
  ))}
</div>

 </div>
   
    

    
    

    <div className="md:col-span-2 flex justify-center space-x-3 w-full ">
      <button
        type="button"
        onClick={() => setIsAdEditing(false)}
        className="px-4 py-2 border-gray-300 border-2 hover:text-white text-gray-300 rounded hover:bg-gray-300 cursor-pointer"
      >
        Cancel
      </button>
      {/* <button
        type="button"
        onClick={() => handleSubmit('draft')}
        className="px-4 py-2 border-yellow-400 hover:text-white border-2 rounded cursor-pointer text-yellow-400 hover:bg-yellow-400"
      >
        Save as Draft
      </button> */}
      <button
        type="submit"
        className="px-4 py-2 border-blue-400 border-2 text-blue-400 hover:text-white cursor-pointer rounded hover:bg-blue-400"
      >
        Publish
      </button>
    </div>
  </div>

  {/* Right Column: Category-Specific Extra Fields + Image Upload */}
  <div className="p-6 rounded-md border max-h-[700px] overflow-y-auto space-y-2">
    <h4 className="text-xs font-semibold text-gray-600 mb-4">Additional Details</h4>
    <div className="grid grid-cols-2 gap-2">
      {renderMetadataFields()|| (
        <p className="text-xs text-gray-400 italic">Select an Ad Type to see more</p>
      )}
    </div>

   
  </div>
</form>

    </div>
  );
} 