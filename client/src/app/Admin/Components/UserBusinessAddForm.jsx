'use client';

import { useRole } from '@/Context/RoleContext';
import { useUser } from '@/Context/userContext';
import { BACKEND_USER_URL } from '@/Utils/backendUrl';
import React, { useEffect, useState } from 'react';
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
  const {userData}=useUser();
  

const [errors, setErrors] = useState({});
const errorClass = 'text-red-500 text-sm mt-1'; 
const validateForm = () => {
  const newErrors = {};

  if (!form.businessName.trim())
    newErrors.businessName = 'Business name is required';

  if (!form.phoneNumber.trim())
    newErrors.phoneNumber = 'Phone number is required';
  else if (!/^\d{10}$/.test(form.phoneNumber))
    newErrors.phoneNumber = 'Enter a valid 10-digit phone number';

  if (!form.businessType)
    newErrors.businessType = 'Business type is required';

  if (!form.address || !form.address.trim())
    newErrors.address = 'Address is required';

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
    emailAddress: userData?.email || '',
    address: '',
    gstNumber: '',
    businessType: '',
    websiteLink: '',
    latitude: '',
    longitude: '',
    socialLinks: { instagram: '', facebook: '', twitter: '' },
  });
  useEffect(() => {
    if (userData && userData.businesses && userData.businesses.length > 0) {
      const business = userData.businesses[0]; // Assuming we want to edit the first business
      setForm((prevForm) => ({
        ...prevForm,
        businessName: business.businessName || '',
        phoneNumber: business.phoneNumber || '',
        emailAddress: business.emailAddress || userData.email,  // Keep user's email
        address: business.address || '',
        gstNumber: business.gstNumber || '',
        businessType: business.businessType || '',
        websiteLink: business.websiteLink || '',
        latitude: business.latitude || '',
        longitude: business.longitude || '',
        socialLinks: {
          instagram: business.socialLinks.instagram || '',
          facebook: business.socialLinks.facebook || '',
          twitter: business.socialLinks.twitter || '',
        },
      }));
    }
  }, [userData]);

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
console.log(payload)
    try {
      // console.log(payload)
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

      
      localStorage.setItem('token', data.token);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

 const isFormEditable = !userData.businesses || userData.businesses.length === 0;
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
              readOnly={!isFormEditable} 
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
              readOnly={!isFormEditable} 
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
    onChange={handleChange}  // This is still necessary, but won't change the value of email
    className={inputClass}
    readOnly
    
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
              readOnly={!isFormEditable} 
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
              readOnly={!isFormEditable} 
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
    className={`${inputClass} ${!isFormEditable ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
    disabled={!isFormEditable}  // Disable the select field when form is not editable
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
              readOnly={!isFormEditable} 
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
                readOnly={!isFormEditable} 
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
                readOnly={!isFormEditable} 
              />
            </div>
            <div className="max-w-xs flex items-end">
              <button
  type="button"
  onClick={handleUseLocation}
  className={`text-xs px-2 md:px-4 py-1 rounded w-full 
    ${!isFormEditable ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-600 text-white cursor-pointer'}`}
  disabled={!isFormEditable} // Disable button if form is not editable
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
                    readOnly={!isFormEditable} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
    <div className="flex justify-between gap-4 border-t px-6 py-4">
      {!isFormEditable && ( <p className='text-xs'>Contact us to update the business details</p>)}
 
  <div className='flex gap-2'>
    {/* Submit Button */}
    <button
      type="submit"
      className={`px-3 py-1 md:px-6 md:py-2 rounded border-2 text-sm font-bold transition-colors duration-200 
        ${!isFormEditable ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 border-blue-400 text-white hover:bg-blue-600 cursor-pointer hover:text-white'}`}
      disabled={!isFormEditable} // Disable if form is not editable
    >
      Submit
    </button>
    
    {/* Reset Button */}
    <button
      type="reset"
      onClick={() =>
        setForm({
          businessName: '',
          phoneNumber: '',
          emailAddress: userData?.email || '',
          address: '',
          gstNumber: '',
          businessType: '',
          websiteLink: '',
          latitude: '',
          longitude: '',
          socialLinks: { instagram: '', facebook: '', twitter: '' },
        })
      }
      className={`px-6 py-2 rounded border-2 cursor-pointer text-sm font-bold text-gray-600 border-gray-400 transition-colors duration-200 
        ${!isFormEditable ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'hover:bg-gray-400 hover:text-white'}`}
      disabled={!isFormEditable} // Disable if form is not editable
    >
      Reset
    </button>
  </div>
</div>


    </form>
  );
}
