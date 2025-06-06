'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BACKEND_ADMIN_URL } from '@/app/Utils/backendUrl';
import { useRole } from '@/Context/RoleContext';

export default function AddBusinessForm({ editingCompany, isEditing, setIsEditing, companies, setCompanies }) {
    const { businessId: contextBusinessId } = useRole();

    const initialFormData = {
        businessId: '',
        businessName: '',
        ownerName: '',
        phoneNumber: '',
        emailAddress: '',
        address: '',
        verificationStatus: 'Pending',
        subscriptionType: '',
        gstNumber: '',
        latitude: '',
        longitude: '',
        websiteLink: '',
        businessType: '',
        socialLinks: [{ platform: '', link: '' }],
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const subscriptionTypes = ['Free', 'Basic', 'Standard', 'Premium', 'Enterprise'];
    const businessTypes = [
        'Retail',
        'Restaurant/Café',
        'Salon/Spa',
        'Gym/Fitness Center',
        'Medical/Health Store',
        'Service Provider',
        'Freelancer/Consultant',
        'Event Organizer',
        'Education/Coaching',
        'Home-based Business',
        'Real Estate/Rentals',
        'Courier/Delivery',
        'Automobile Services',
        'Pet Services',
        'NGO/Community Org.',
        'Shop/Store/Office',
    ];

    useEffect(() => {
        if (isEditing && editingCompany) {
            setFormData({
                ...editingCompany,
                socialLinks: editingCompany.socialMediaLinks || [{ platform: '', link: '' }],
            });
        } else {
            setFormData({
                ...initialFormData,

            });
        }
    }, [isEditing, editingCompany, contextBusinessId]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleSocialLinkChange(index, field, value) {
        const updatedLinks = [...formData.socialLinks];
        updatedLinks[index][field] = value;
        setFormData(prev => ({ ...prev, socialLinks: updatedLinks }));
    }

    const addSocialLink = () => {
        setFormData(prev => ({
            ...prev,
            socialLinks: [...prev.socialLinks, { platform: '', link: '' }]
        }));
    };

    const removeSocialLink = (index) => {
        const updatedLinks = [...formData.socialLinks];
        updatedLinks.splice(index, 1);
        setFormData(prev => ({ ...prev, socialLinks: updatedLinks }));
    };

    async function handleSubmit(e) {
        e.preventDefault();

        if (!formData.businessName || !formData.businessType || !formData.phoneNumber || !formData.latitude || !formData.longitude) {
            toast.error('Business Name, Phone Number, and Business Type are required');
            return;
        }

        const newBusiness = {
            businessId: editingCompany?.businessId || formData.businessId || `BUS${Date.now()}`,
            ...formData,
            joinedDate: editingCompany?.joinedDate || new Date().toISOString().split('T')[0],
        };

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const url = isEditing
                ? `${BACKEND_ADMIN_URL}/update-business/${editingCompany.businessId}`
                : `${BACKEND_ADMIN_URL}/business`;

            const response = await axios.post(url, newBusiness, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success(isEditing ? 'Business updated successfully!' : 'Business added successfully!');

                const returnedCompany = response.data.data || newBusiness;

                if (isEditing) {
                    setCompanies(prev =>
                        prev.map(company =>
                            company.businessId === editingCompany.businessId ? returnedCompany : company
                        )
                    );
                    setIsEditing(false);
                } else {
                    setCompanies(prev => [returnedCompany, ...prev]);
                    setFormData(initialFormData);
                }
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error submitting business');
        } finally {
            setIsSubmitting(false);
        }


    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow space-y-6 max-w-4xl mx-auto"
        >
            <h2 className="text-2xl font-bold text-black">{isEditing ? 'Edit Business' : 'Add Business'}</h2>

            {/* Row 1: Business ID and Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium text-black">Business ID</label>
                    <input
                        type="text"
                        value={formData.businessId || 'Auto-generated'}
                        disabled
                        className="w-full bg-gray-100 text-black px-3 py-2 rounded border border-gray-300"
                    />
                </div>
                <div>
                    <label className="block font-medium text-black">
                        Business Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded border border-gray-300 text-black"
                    />
                </div>
            </div>

            {/* Owner & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium text-black">Owner Name</label>
                    <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded border border-gray-300 text-black"
                    />
                </div>
                <div>
                    <label className="block font-medium text-black">
                        Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded border border-gray-300 text-black"
                    />
                </div>
            </div>

            {/* Email & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium text-black">Email Address</label>
                    <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded border border-gray-300 text-black"
                    />
                </div>
                <div>
                    <label className="block font-medium text-black">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded border border-gray-300 text-black"
                    />
                </div>
            </div>

            {/* Latitude, Longitude, Verification */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium text-black">
                            Latitude <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="number"
                            step="any"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded border border-gray-300 text-black"
                        />
                    </div>
                    <div>
                        <label className="block font-medium text-black">
                            Longitude <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="number"
                            step="any"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 rounded border border-gray-300 text-black"
                        />
                    </div>
                </div>
                <div>
                    <label className="block font-medium text-black">Verification Status</label>
                    <select
                        name="verificationStatus"
                        value={formData.verificationStatus}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded border border-gray-300 text-black"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Subscription, GST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium text-black">Subscription Type</label>
                    <select
                        name="subscriptionType"
                        value={formData.subscriptionType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded border border-gray-300 text-black"
                    >
                        <option value="">Select subscription type</option>
                        {subscriptionTypes.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block font-medium text-black">GST/Business Reg No</label>
                    <input
                        type="text"
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded border border-gray-300 text-black"
                    />
                </div>
            </div>

            {/* Website & Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium text-black">Website Link</label>
                    <input
                        type="url"
                        name="websiteLink"
                        value={formData.websiteLink}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded border border-gray-300 text-black"
                    />
                </div>
                <div>
                    <label className="block font-medium text-black mb-2">Social Links</label>
                    {formData.socialLinks.map((link, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                            <input
                                type="text"
                                placeholder="Platform"
                                value={link.platform}
                                onChange={e => handleSocialLinkChange(index, 'platform', e.target.value)}
                                className="flex-1 px-3 py-2 rounded border border-gray-300 text-black w-[100px]"
                            />
                            <input
                                type="url"
                                placeholder="Link"
                                value={link.link}
                                onChange={e => handleSocialLinkChange(index, 'link', e.target.value)}
                                className="flex-1 px-3 py-2 rounded border border-gray-300 text-black w-[100px]"
                            />
                            <button
                                type="button"
                                onClick={() => removeSocialLink(index)}
                                disabled={formData.socialLinks.length === 1}
                                className="text-red-600 font-bold px-3"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addSocialLink}
                        className="text-blue-600 hover:underline text-sm mt-2"
                    >
                        + Add another social link
                    </button>
                </div>
            </div>

            {/* Business Type */}
            <div>
                <label className="block font-medium text-black">
                    Business Type <span className="text-red-600">*</span>
                </label>
                <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded border border-gray-300 text-black"
                >
                    <option value="">Select business type</option>
                    {businessTypes.map((type, index) => (
                        <option key={index} value={type}>
                            {index + 1}. {type}
                        </option>
                    ))}
                </select>
            </div>

            {/* Submit Buttons */}
            <div className="pt-4 flex space-x-4">
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save Business'}
                </button>
                {isEditing && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
                    >
                        Cancel Editing
                    </button>
                )}
            </div>
        </form>
    );
}
