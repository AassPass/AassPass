'use client';

import { useEffect, useState, useCallback, useMemo, useTransition } from 'react';

import { useRole } from '@/Context/RoleContext';
import { saveBusiness } from '@/services/business';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const businessTypeMap = {
  'Retail Store': 'RETAIL_STORE',
  'Restaurant / Café': 'RESTAURANT_CAFE',
  'Salon / Spa': 'SALON_SPA',
  'Gym / Fitness Center': 'GYM_FITNESS',
  'Medical / Health Store': 'MEDICAL_HEALTH',
  'Service Provider': 'SERVICE_PROVIDER',
  'Freelancer / Consultant': 'FREELANCER_CONSULTANT',
  'Event Organizer': 'EVENT_ORGANIZER',
  'Education / Coaching': 'EDUCATION_COACHING',
  'Home-based Business': 'HOME_BASED',
  'Real Estate / Rentals': 'REAL_ESTATE_RENTALS',
  'Courier / Delivery': 'COURIER_DELIVERY',
  'Automobile Services': 'AUTOMOBILE_SERVICES',
  'Pet Services': 'PET_SERVICES',
  'NGO / Community Org.': 'NGO_COMMUNITY',
  'Shop / Store / Office': 'SHOP_STORE_OFFICE',
  Other: 'OTHER',
};

const inputClass = 'w-full px-2 py-1 text-xs rounded border border-gray-300 text-black h-8';
const labelClass = 'block font-medium text-gray-700 text-xs';

const initialFormData = {
  businessId: '',
  businessName: '',
  ownerName: '',
  phoneNumber: '',
  emailAddress: '',
  address: '',
  subscriptionType: '',
  gstNumber: '',
  latitude: '',
  longitude: '',
  websiteLink: '',
  businessType: '',
  socialLinks: {
    instagram: '',
    facebook: '',
    twitter: '',
  },
};

export default function AddCompanyForm({ editingCompany, isEditing, setIsEditing, companies, setCompanies }) {
  const { businessId: contextBusinessId } = useRole();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const subscriptionTypes = ['STANDARD', 'PREMIUM'];
  const businessTypes = Object.keys(businessTypeMap);

  const reverseBusinessTypeMap = useMemo(() => {
    return Object.entries(businessTypeMap).reduce((acc, [label, value]) => {
      acc[value] = label;
      return acc;
    }, {});
  }, []);

 useEffect(() => {
  startTransition(() => {
    if (isEditing && editingCompany) {
      const socialObj = {
        instagram: '',
        facebook: '',
        twitter: '',
      };

      const socialLinks = editingCompany.socialLinks || {};

      // populate socialObj with existing links from socialLinks object
      for (const platform of ['instagram', 'facebook', 'twitter']) {
        if (socialLinks[platform]) {
          socialObj[platform] = socialLinks[platform];
        }
      }

      setFormData({
        ...initialFormData,
        ...editingCompany,
        businessType: reverseBusinessTypeMap[editingCompany.businessType] || '',
        socialLinks: socialObj,
      });
    } else {
      setFormData({ ...initialFormData });
    }
  });
}, [isEditing, editingCompany, contextBusinessId, reverseBusinessTypeMap]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSocialLinkChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  }, []);

  const handleUseLocation = useCallback(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      () => {
        console.error('Location permission denied');
      }
    );
  }, []);

  const isFormValid =
    formData.businessName &&
    formData.phoneNumber &&
    formData.businessType &&
    formData.latitude &&
    formData.longitude;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      console.error('Business Name, Phone, Type, Latitude and Longitude required');
      return;
    }

    const newBusiness = {
      ...formData,
      businessType: isEditing
        ? formData.businessType // send label as-is when editing
        : businessTypeMap[formData.businessType] || 'OTHER', // convert label to enum when adding
    };

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const savedBusiness = await saveBusiness(newBusiness, isEditing, token);

      if (isEditing) {
        setCompanies((prev) =>
          prev.map((company) => (company.businessId === editingCompany.businessId ? savedBusiness : company))
        );
        setIsEditing(false);
      } else {
        setCompanies((prev) => [savedBusiness, ...prev]);
        setFormData(initialFormData);
      }
    } catch (error) {
      console.error('Error submitting:', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-md shadow-md w-full max-w-5xl mx-auto text-sm border overflow-hidden"
    >
      {/* Form Heading */}
      <div className="bg-primary text-white px-4 py-2">
        <h2 className="text-sm font-semibold">{isEditing ? 'Edit Business' : 'Add Business'}</h2>
      </div>

      {/* Form Content */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1 */}
        <div className="space-y-4">
          <div className="max-w-xs">
            <label className={labelClass}>Business Name *</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="max-w-xs">
            <label className={labelClass}>Owner Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="max-w-xs">
            <label className={labelClass}>Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
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
              value={formData.emailAddress}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="max-w-xs">
            <label className={labelClass}>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            {/* Save Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="px-6 py-2 rounded hover:bg-blue-400 cursor-pointer border-2 border-blue-400 text-blue-400 hover:text-white text-sm font-bold w-full md:w-auto transition-colors duration-200"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>

            {/* Reset Button */}
            <button
              type="reset"
              onClick={() => setFormData(initialFormData)}
              className="px-6 py-2 rounded border-2 cursor-pointer text-sm font-bold w-full md:w-auto text-gray-600 border-gray-400 hover:bg-gray-400 hover:text-white transition-colors duration-200"
            >
              Reset
            </button>

            {/* Cancel Button */}
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(initialFormData);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-bold text-sm w-full md:w-auto transition-colors duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          {/* Row 1: Subscription & GST & Business Type & Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="max-w-xs">
              <label className={labelClass}>Subscription Type</label>
              <select
                name="subscriptionType"
                value={formData.subscriptionType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select</option>
                {subscriptionTypes.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="max-w-xs">
              <label className={labelClass}>GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="max-w-xs">
              <label className={labelClass}>Business Type *</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select</option>
                {businessTypes.map((type, index) => (
                  <option key={index} value={type}>
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
                value={formData.websiteLink}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 2: Location Info */}
          <div className="grid grid-cols-3 gap-2">
            <div className="max-w-xs">
              <label className={labelClass}>Latitude *</label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div className="max-w-xs">
              <label className={labelClass}>Longitude *</label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div className="max-w-xs">
              <label className={`${labelClass} invisible`}>Use Location</label>
              <button
                type="button"
                onClick={handleUseLocation}
                className="text-sm bg-blue-400 hover:bg-blue-600 cursor-pointer text-white px-4 py-1 rounded w-full"
              >
                Use My Location
              </button>
            </div>
          </div>

          {/* Row 3: Social Links */}
          <div className="max-w-2xl space-y-4">
            <label className={`${labelClass} block text-base font-medium text-gray-700`}>Social Links</label>

            <div className="grid grid-cols-1 gap-4">
              {/* Instagram */}
              <div className="flex items-center gap-2">
                <FaInstagram className="text-pink-500 text-xl" />
                <input
                  type="url"
                  name="instagram"
                  placeholder="Instagram URL"
                  value={formData.socialLinks?.instagram || ''}
                  onChange={handleSocialLinkChange}
                  className={inputClass}
                />
              </div>

              {/* Facebook */}
              <div className="flex items-center gap-2">
                <FaFacebookF className="text-blue-600 text-xl" />
                <input
                  type="url"
                  name="facebook"
                  placeholder="Facebook URL"
                  value={formData.socialLinks?.facebook || ''}
                  onChange={handleSocialLinkChange}
                  className={inputClass}
                />
              </div>

              {/* Twitter */}
              <div className="flex items-center gap-2">
                <FaTwitter className="text-sky-500 text-xl" />
                <input
                  type="url"
                  name="twitter"
                  placeholder="Twitter URL"
                  value={formData.socialLinks?.twitter || ''}
                  onChange={handleSocialLinkChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
