'use client';

import { useRole } from '@/Context/RoleContext';
import { BACKEND_USER_URL } from '@/Utils/backendUrl';
import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const businessTypeOptions = [
  'Retail Store', 'Restaurant / Café', 'Salon / Spa', 'Gym / Fitness Center',
  'Medical / Health Store', 'Service Provider', 'Freelancer / Consultant',
  'Event Organizer', 'Education / Coaching', 'Home-based Business',
  'Real Estate / Rentals', 'Courier / Delivery', 'Automobile Services',
  'Pet Services', 'NGO / Community Org.', 'Shop / Store / Office', 'Other',
];

const inputClass = 'w-full border border-gray-300 rounded px-3 py-2 text-sm';
const labelClass = 'block text-sm font-medium text-gray-700';

export default function UserBusinessAddForm() {
  const {role}=useRole();
  if (role === 'OWNER') {
  return (
    <div className="text-blue-400 text-center font-bold">
      You have already created a business. Contact us to update it.
    </div>
  );
}
const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};

  if (!form.businessName.trim()) newErrors.businessName = 'Business name is required';
  if (!form.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
  if (!/^\d{10}$/.test(form.phoneNumber)) newErrors.phoneNumber = 'Enter a valid 10-digit phone number';
  if (!form.businessType) newErrors.businessType = 'Business type is required';
  if (form.emailAddress && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.emailAddress))
    newErrors.emailAddress = 'Enter a valid email';
  if (form.websiteLink && !/^https?:\/\/\S+$/.test(form.websiteLink))
    newErrors.websiteLink = 'Enter a valid URL';
  if (form.latitude && (form.latitude < -90 || form.latitude > 90))
    newErrors.latitude = 'Latitude must be between -90 and 90';
  if (form.longitude && (form.longitude < -180 || form.longitude > 180))
    newErrors.longitude = 'Longitude must be between -180 and 180';

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const [form, setForm] = useState({
    businessName: '',
    phoneNumber: '',
    emailAddress: '',
    address: '',
    gstNumber: '',
    businessType: '',
    websiteLink: '',
    latitude: '',
    longitude: '',
    socialLinks: { instagram: '', facebook: '', twitter: '' },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handleUseLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      () => alert('Permission denied or unavailable.')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!validateForm()) return;
    const token = localStorage.getItem('token');

    // Convert socialLinks object to array of { platform, link }
    const socialLinksArray = Object.entries(form.socialLinks)
      .filter(([_, link]) => link.trim() !== '') // Optional: skip empty links
      .map(([platform, link]) => ({ platform, link }));

    // Construct final payload
    const payload = {
      ...form,
      socialLinks: socialLinksArray,
    };

    try {
      const res = await fetch(`${BACKEND_USER_URL}/business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      alert('Business saved successfully!');
      localStorage.setItem('token', data.token);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-md shadow-md w-full max-w-5xl mx-auto text-sm border overflow-hidden"
    >
      {/* Form Heading */}
      <div className="bg-blue-400 text-white px-4 py-2">
        <h2 className="text-sm font-semibold">Add Business</h2>
      </div>

      {/* Form Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Business Name */}
          <div className="max-w-xs">
            <label className={labelClass}>Business Name *</label>
            <input
              type="text"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.businessName && <div className={errorClass}>{errors.businessName}</div>}
          </div>

          {/* Phone Number */}
          <div className="max-w-xs">
            <label className={labelClass}>Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.phoneNumber && <div className={errorClass}>{errors.phoneNumber}</div>}
          </div>

          {/* Email */}
          <div className="max-w-xs">
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              name="emailAddress"
              value={form.emailAddress}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.emailAddress && <div className={errorClass}>{errors.emailAddress}</div>}
          </div>

          {/* Address */}
          <div className="max-w-xs">
            <label className={labelClass}>Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* GST Number */}
          <div className="max-w-xs">
            <label className={labelClass}>GST Number</label>
            <input
              type="text"
              name="gstNumber"
              value={form.gstNumber}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Business Type */}
          <div className="max-w-xs">
            <label className={labelClass}>Business Type *</label>
            <select
              name="businessType"
              value={form.businessType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Business Type</option>
              {businessTypeOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.businessType && <div className={errorClass}>{errors.businessType}</div>}
          </div>

          {/* Website */}
          <div className="max-w-xs">
            <label className={labelClass}>Website</label>
            <input
              type="url"
              name="websiteLink"
              value={form.websiteLink}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-3 gap-2">
            <div className="max-w-xs">
              <label className={labelClass}>Latitude</label>
              <input
                type="number"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="max-w-xs">
              <label className={labelClass}>Longitude</label>
              <input
                type="number"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="max-w-xs flex items-end">
              <button
                type="button"
                onClick={handleUseLocation}
                className="text-sm bg-blue-400 hover:bg-blue-600 cursor-pointer text-white px-4 py-1 rounded w-full"
              >
                Use My Location
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className="max-w-xl space-y-4">
            <label className="text-sm font-medium block text-gray-700">Social Links</label>
            <div className="space-y-2">
              {[
                { name: 'instagram', icon: <FaInstagram className="text-pink-500 text-xl" />, placeholder: 'Instagram URL' },
                { name: 'facebook', icon: <FaFacebookF className="text-blue-600 text-xl" />, placeholder: 'Facebook URL' },
                { name: 'twitter', icon: <FaTwitter className="text-sky-500 text-xl" />, placeholder: 'Twitter URL' },
              ].map(({ name, icon, placeholder }) => (
                <div key={name} className="flex items-center gap-2">
                  {icon}
                  <input
                    type="url"
                    name={name}
                    placeholder={placeholder}
                    value={form.socialLinks[name]}
                    onChange={handleSocialLinkChange}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-4 border-t px-6 py-4">
        <button
          type="submit"
          className="px-6 py-2 rounded hover:bg-blue-500 cursor-pointer border-2 border-blue-400 text-blue-500 hover:text-white text-sm font-bold transition-colors duration-200"
        >
          Submit
        </button>
        <button
          type="reset"
          onClick={() =>
            setForm({
              businessName: '',
              phoneNumber: '',
              emailAddress: '',
              address: '',
              gstNumber: '',
              businessType: '',
              websiteLink: '',
              latitude: '',
              longitude: '',
              socialLinks: { instagram: '', facebook: '', twitter: '' },
            })
          }
          className="px-6 py-2 rounded border-2 cursor-pointer text-sm font-bold text-gray-600 border-gray-400 hover:bg-gray-400 hover:text-white transition-colors duration-200"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
