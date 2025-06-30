'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { BACKEND_BUSINESS_URL } from '@/app/Utils/backendUrl';
import { useRole } from '@/Context/RoleContext';
import { compressImage } from '@/Utils/imageCompresson';
import { showToast } from '@/Utils/toastUtil';

const categories = [
  'Discounts and Deals',
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
    {label && (
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
    )}
    <input
      {...props}
      className="w-full px-2 py-1 text-sm rounded border border-gray-300 text-black h-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default function AdListing( {setIsAdEditing, editingAd, isAdEditing, setAds, ads, publishedCount, role }) {
  const { businessId, businessName, location: businessLocation } = useRole();

  const initialAddData = {
    businessName: businessName || '',
    adType: '',
    title: '',
    priceRate: '',
    discountType: '',
    discountedPrice: '',
    startDate: '',
    endDate: '',
    websiteLink: '',
    bookingLink: '',
    location: businessLocation || '',
    contactNo: '',
    images: {}, // keyed by image slot
    extra: {
      discountValue: '',
      terms: '',
      description: '',
      organizerName: '',
      quantityAvailable: '',
      jobDescription: '',
      jobType: '',
      sizeArea: '',
      participationRules: '',
      winnerAnnouncementDate: '',
    },
    reset: false,
    stage: 'DRAFT',
  };

  const [form, setForm] = useState(initialAddData);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageSlot, setImageSlot] = useState(null);

  // Initialize form when editing or resetting
 useEffect(() => {
  if (isAdEditing && editingAd) {
    const metadata = editingAd.metadata || {};

    setForm({
      businessName: editingAd.businessName || businessName || '',
      adType: editingAd.adType || '', // ✅ Corrected here
      title: editingAd.title || '',
      priceRate: editingAd.priceRate || '',
      discountType: editingAd.discountType || '',
      discountedPrice: editingAd.discountedPrice || '',
      startDate: editingAd.visibleFrom?.split('T')[0] || '',
      endDate: editingAd.visibleTo?.split('T')[0] || '',
      websiteLink: editingAd.websiteLink || '',
      bookingLink: editingAd.bookingLink || '',
      location: editingAd.location || businessLocation || '',
      contactNo: editingAd.contactNo || '',
      images: {},
      extra: {
        discountValue: metadata.discountValue || '',
        terms: metadata.terms || '',
        description: metadata.description || '',
        organizerName: metadata.organizerName || '',
        quantityAvailable: metadata.quantityAvailable || '',
        jobDescription: metadata.jobDescription || '',
        jobType: metadata.jobType || '',
        sizeArea: metadata.sizeArea || '',
        participationRules: metadata.participationRules || '',
        winnerAnnouncementDate: metadata.winnerAnnouncementDate || '',
      },
      reset: editingAd.reset || false,
      stage: editingAd.stage || 'DRAFT',
    });

    setPreviewImages(editingAd.imageUrls || []);
  } else {
    setForm({ ...initialAddData, businessName: businessName || '', location: businessLocation || '' });
    setPreviewImages([]);
  }
}, [isAdEditing, editingAd, businessName, businessLocation]);

  // Handle normal input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }, []);

  // Handle extra inputs
  const handleExtraChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      extra: {
        ...prev.extra,
        [name]: value,
      },
    }));
  }, []);

  const openFileDialog = (slot) => {
    setImageSlot(slot);
    document.getElementById('imageUploadInput').click();
  };

 const handleImageUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const compressed = await compressImage(file, 1); // compress under 1MB
    const url = URL.createObjectURL(compressed);

    setPreviewImages((prev) => {
      const arr = [...prev];
      arr[imageSlot] = url;
      return arr;
    });

    setForm((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [imageSlot]: compressed,
      },
    }));
  } catch (err) {
    alert('Image compression failed. Please try a different file.');
  }
};

  // Auto calculate discounted price if needed
  useEffect(() => {
    if (!form.priceRate) {
      setForm((prev) => ({ ...prev, discountedPrice: '' }));
      return;
    }
    const price = parseFloat(form.priceRate) || 0;
    const discountRaw = parseFloat(form.extra.discountValue) || 0;

    let discounted = price;

    if (form.discountType === 'Flat') discounted = price - discountRaw;
    else if (form.discountType === 'Percentage') discounted = price - (price * discountRaw) / 100;
    else if (form.discountType === 'Same') discounted = price;

    if (discounted < 0) discounted = 0;

    setForm((prev) => ({ ...prev, discountedPrice: discounted.toFixed(2) }));
  }, [form.priceRate, form.discountType, form.extra.discountValue]);

  // Dynamic labels for Ad Title and Price Rate depending on Ad Type
  const getTitleLabel = () => {
    switch (form.adType) {
      case 'Discounts and Deals': return 'Deal Name';
      case 'Job Openings': return 'Job Description';
      default: return 'Ad Title';
    }
  };

  const getPriceRateLabel = () => {
    switch (form.adType) {
      case 'Discounts and Deals': return 'Price/Rate';
      case 'Job Openings': return 'Salary/Rate';
      case 'Rentals & Properties': return 'Price/Rate';
      case 'Products for Sale': return 'Price/Rate';
      case 'Services': return 'Price/Rate';
      default: return 'Price/Rate';
    }
  };

  // Render dynamic extra fields based on category
  const renderExtraFields = () => {
    switch (form.adType) {
      case 'Discounts and Deals':
        return (
          <>
            <Input
              label="Discount Flat/Percentage/Same"
              name="discountValue"
              value={form.extra.discountValue}
              onChange={handleExtraChange}
            />
            <Input
              label="Terms"
              name="terms"
              value={form.extra.terms}
              onChange={handleExtraChange}
            />
            <Input
              label="Description"
              name="description"
              value={form.extra.description}
              onChange={handleExtraChange}
            />
          </>
        );
      case 'Events':
        return (
          <>
            <Input
              label="Description"
              name="description"
              value={form.extra.description}
              onChange={handleExtraChange}
            />
            <Input
              label="Organizer Name"
              name="organizerName"
              value={form.extra.organizerName}
              onChange={handleExtraChange}
            />
          </>
        );
      case 'Services':
        return (
          <>
            <Input
              label="Description"
              name="description"
              value={form.extra.description}
              onChange={handleExtraChange}
            />
          </>
        );
      case 'Products for Sale':
        return (
          <>
            <Input
              label="Description"
              name="description"
              value={form.extra.description}
              onChange={handleExtraChange}
            />
            <Input
              label="Quantity Available"
              name="quantityAvailable"
              type="number"
              min="0"
              value={form.extra.quantityAvailable}
              onChange={handleExtraChange}
            />
          </>
        );
      case 'Job Openings':
        return (
          <>
            <Input
              label="Job Description"
              name="jobDescription"
              value={form.extra.jobDescription}
              onChange={handleExtraChange}
            />
            <div className="max-w-xs">
              <label className="block text-xs font-medium text-gray-700 mb-1">Job Type</label>
              <select
                name="jobType"
                value={form.extra.jobType}
                onChange={handleExtraChange}
                className="w-full px-2 py-1 text-sm rounded border border-gray-300 h-8"
              >
                <option value="">Select</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </>
        );
      case 'Rentals & Properties':
        return (
          <>
            <Input
              label="Description"
              name="description"
              value={form.extra.description}
              onChange={handleExtraChange}
            />
            <Input
              label="Size / Area (Sq. Ft)"
              name="sizeArea"
              value={form.extra.sizeArea}
              onChange={handleExtraChange}
            />
          </>
        );
      case 'Announcements':
        return (
          <>
            <Input
              label="Description"
              name="description"
              value={form.extra.description}
              onChange={handleExtraChange}
            />
          </>
        );
      case 'Contests & Giveaways':
        return (
          <>
            <Input
              label="Description"
              name="description"
              value={form.extra.description}
              onChange={handleExtraChange}
            />
            <Input
              label="Participation Rules"
              name="participationRules"
              value={form.extra.participationRules}
              onChange={handleExtraChange}
            />
            <Input
              label="Winner Announcement Date"
              name="winnerAnnouncementDate"
              type="date"
              value={form.extra.winnerAnnouncementDate}
              onChange={handleExtraChange}
            />
          </>
        );
      default:
        return null;
    }
  };
useEffect(() => {
  // Cleanup previous URLs when component unmounts or previewImages change
  return () => {
    previewImages.forEach((url) => {
      if (typeof url === 'string') URL.revokeObjectURL(url);
    });
  };
}, [previewImages]);
 // Make sure this import is at the top

const handleSubmit = async (status) => {
  try {
    // 🚫 Restriction logic first
    if (
      status === 'published' &&
      role === 'Standard' &&
      publishedCount >= 2 &&
      !isAdEditing
    ) {
      showToast('Standard users can only publish up to 2 ads. Upgrade to Premium to add more.', 'warning');
      return;
    }

    const token = localStorage.getItem('token');
    const fd = new FormData();

    Object.entries(form).forEach(([k, v]) => {
      if (k === 'extra') {
        Object.entries(v).forEach(([ek, ev]) => {
          if (ev !== undefined && ev !== '') fd.append(ek, ev);
        });
      } else if (k === 'images') {
        previewImages.forEach((__, idx) => {
          if (form.images[idx]) fd.append('images', form.images[idx]);
        });
      } else {
        fd.append(k, v);
      }
    });

    fd.append('stage', status === 'draft' ? 'DRAFT' : 'PUBLISHED');
    fd.append('reset', form.reset);

    // Log FormData entries for debugging
    const fdEntries = [];
for (const pair of fd.entries()) {
  if (pair[1] instanceof File) {
    fdEntries.push(`${pair[0]}: File(name=${pair[1].name}, size=${pair[1].size} bytes)`);
  } else {
    fdEntries.push(`${pair[0]}: ${pair[1]}`);
  }
}

console.log('FormData content:', fdEntries.join(', '));

    const endpoint = isAdEditing
      ? `${BACKEND_BUSINESS_URL}/ads/${form.adCode}`
      : `${BACKEND_BUSINESS_URL}/new-ad`;

    const res = await fetch(endpoint, {
      method: isAdEditing ? 'PUT' : 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    if (!res.ok) throw new Error('Submission failed');

    const updated = await res.json();

    setAds((prev) =>
      isAdEditing
        ? prev.map((a) => (a.adCode === updated.adCode ? updated : a))
        : [updated, ...prev]
    );

    setForm(initialAddData);
    setPreviewImages([]);
    setIsAdEditing(false);
    showToast('Ad successfully submitted!', 'success');
  } catch (error) {
    showToast('Failed to submit ad: ' + error.message, 'error');
  }
};

const resetForm = () => {
  setForm({ ...initialAddData, businessName: businessName || '', location: businessLocation || '' });
  setPreviewImages([]);
  setIsAdEditing(false);
};


  return (
    <div className="border bg-white rounded-2xl shadow-md text-gray-800 max-w-5xl mx-auto">
      <div className="bg-blue-400 p-4 rounded-t-2xl">
        <h2 className="text-white text-sm font-semibold">Create New Ad</h2>
      </div>
      <form
  className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 items-start"
  onSubmit={(e) => {
    e.preventDefault();
    handleSubmit('published');
  }}
>
      
        {/* Left Column */}
        <div className=" grid grid-cols-2 gap-4">
          <Input
            label="Business Name"
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
          />
          <div className="max-w-xs">
            <label className="block text-xs font-medium text-gray-700 mb-1">Ad Type</label>
            <select
              name="adType"
              value={form.adType}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm rounded border border-gray-300 h-8"
            >
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <Input
            label={form.adType === 'Discounts and Deals' ? 'Deal Name' : 'Ad Title'}
            name="title"
            value={form.title}
            onChange={handleChange}
          />
          <Input
            label="Price/Rate"
            name="priceRate"
            type="number"
            min="0"
            step="any"
            value={form.priceRate}
            onChange={handleChange}
          />
          {form.adType === 'Discounts and Deals' && (
            <div className="max-w-xs">
              <label className="block text-xs font-medium text-gray-700 mb-1">Discount Type</label>
              <select
                name="discountType"
                onChange={handleChange}
                className="w-full px-2 py-1 text-sm rounded border border-gray-300 h-8"
                value={form.discountType}
              >
                <option value="">Select</option>
                <option value="Flat">Flat</option>
                <option value="Percentage">Percentage</option>
                <option value="Same">Same</option>
              </select>
            </div>
          )}
          {form.discountType && (
            <Input
              label="Discounted Price"
              name="discountedPrice"
              value={form.discountedPrice}
              readOnly
            />
          )}
         
            <Input
  label="Start Date"
  name="startDate"
  type="date"
  min={new Date().toISOString().split('T')[0]}
  value={form.startDate}
  onChange={handleChange}
/>
<Input
  label="End Date"
  name="endDate"
  type="date"
  min={form.startDate || new Date().toISOString().split('T')[0]}
  value={form.endDate}
  onChange={handleChange}
/>

          <Input
            label="Website Link"
            name="websiteLink"
            type="url"
            value={form.websiteLink}
            onChange={handleChange}
          />
          <Input
            label="Booking Link"
            name="bookingLink"
            type="url"
            value={form.bookingLink}
            onChange={handleChange}
          />
          <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
          <Input
            label="Contact No."
            name="contactNo"
            type="tel"
            value={form.contactNo}
            onChange={handleChange}
          />
        
          <div className="md:col-span-2 flex justify-center space-x-3 w-full mt-4">
  <button
    type="button"
    onClick={() => setIsAdEditing(false)}
    className="px-4 py-2 border-gray-300 border-2 hover:text-white text-gray-300 rounded hover:bg-gray-300 cursor-pointer"
  >
    Cancel
  </button>
  <button
    type="button"
    onClick={() => handleSubmit('draft')}
    className="px-4 py-2 border-yellow-400 hover:text-white border-2 rounded cursor-pointer text-yellow-400 hover:bg-yellow-400"
  >
    Save as Draft
  </button>
  <button
    type="submit"
    className="px-4 py-2 border-blue-400 border-2 text-blue-400 hover:text-white cursor-pointer rounded hover:bg-blue-400"
  >
    Publish
  </button>
</div>

        </div>

        {/* Right Column */}
        <div className=" p-6 rounded-md border max-h-[700px] overflow-y-auto space-y-2">
            <h4 className="text-xs font-semibold text-gray-600 mb-4">Additional Details</h4>
          <div className = "grid grid-cols-2 gap-2" >
            {renderExtraFields() || (
              <p className="text-xs text-gray-400 italic">Select an Ad Type to see more</p>
            )}
          </div>

          <input
            type="file"
            id="imageUploadInput"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div
                key={i}
                onClick={() => openFileDialog(i)}
                className="relative cursor-pointer rounded border-dashed border-2 border-gray-400 bg-white flex items-center justify-center overflow-hidden"
                style={{ aspectRatio: '3 / 2' }}
              >
                {previewImages[i] ? (
                  <img src={previewImages[i]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FiPlus className="text-gray-400 text-4xl" />
                )}
              </div>
            ))}
            <div
              onClick={() => openFileDialog(2)}
              className="col-span-2 relative cursor-pointer rounded border-dashed border-2 border-gray-400 bg-white flex items-center justify-center overflow-hidden"
              style={{ aspectRatio: '4 / 1' }}
            >
              {previewImages[2] ? (
                <img src={previewImages[2]} alt="" className="w-full h-full object-cover" />
              ) : (
                <FiPlus className="text-gray-400 text-6xl" />
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 