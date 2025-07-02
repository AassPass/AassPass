'use client';

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
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BACKEND_USER_URL}/business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
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
        {/* Column 1 */}
        <div className="space-y-4">
          <div className="max-w-xs">
            <label className={labelClass}>Business Name *</label>
            <input
              type="text"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="max-w-xs">
            <label className={labelClass}>Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="max-w-xs">
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              name="emailAddress"
              value={form.emailAddress}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

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

        {/* Column 2 */}
        <div className="space-y-4">
          <div className="max-w-xs">
            <label className={labelClass}>Business Type *</label>
            <select
              name="businessType"
              value={form.businessType}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Business Type</option>
              {businessTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

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

          <div className="max-w-xl space-y-4">
            <label className="text-sm font-medium block text-gray-700">Social Links</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FaInstagram className="text-pink-500 text-xl" />
                <input
                  type="url"
                  name="instagram"
                  placeholder="Instagram URL"
                  value={form.socialLinks.instagram}
                  onChange={handleSocialLinkChange}
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-2">
                <FaFacebookF className="text-blue-600 text-xl" />
                <input
                  type="url"
                  name="facebook"
                  placeholder="Facebook URL"
                  value={form.socialLinks.facebook}
                  onChange={handleSocialLinkChange}
                  className={inputClass}
                />
              </div>
              <div className="flex items-center gap-2">
                <FaTwitter className="text-sky-500 text-xl" />
                <input
                  type="url"
                  name="twitter"
                  placeholder="Twitter URL"
                  value={form.socialLinks.twitter}
                  onChange={handleSocialLinkChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Footer */}
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
