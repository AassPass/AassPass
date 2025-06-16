'use client';

import { useEffect, useState, useCallback, useMemo, useTransition, memo, useRef } from 'react';

import { BACKEND_ADMIN_URL } from '@/app/Utils/backendUrl';
import { useRole } from '@/Context/RoleContext';
import { saveBusiness } from '@/services/business';

export function useRafDebounce(callback) {
    const frame = useRef(null);

    return (...args) => {
        if (frame.current) cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
            callback(...args);
        });
    };
}

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
    'Other': 'OTHER',
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
    socialLinks: [{ platform: '', link: '' }],
};

const SocialLinkInput = memo(({ index, link, onChange, onRemove, canRemove }) => (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 mb-1">
        <input
            type="text"
            placeholder="Platform"
            value={link.platform}
            onChange={e => onChange(index, 'platform', e.target.value)}
            className="w-full sm:w-[120px] px-2 py-1 text-xs rounded border border-gray-300 text-black"
        />
        <input
            type="url"
            placeholder="Link"
            value={link.link}
            onChange={e => onChange(index, 'link', e.target.value)}
            className="w-full flex-grow min-w-[180px] px-2 py-1 text-xs rounded border border-gray-300 text-black"
        />
        <button
            type="button"
            onClick={() => onRemove(index)}
            disabled={!canRemove}
            className="text-red-600 font-bold px-2 text-xs disabled:opacity-40"
        >
            ×
        </button>
    </div>
));


export default function AddCompanyForm({ editingCompany, isEditing, setIsEditing, companies, setCompanies }) {
    const { businessId: contextBusinessId } = useRole();
    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPending, startTransition] = useTransition();

    const subscriptionTypes = ['STANDARD', 'PREMIUM'];
    const businessTypes = Object.keys(businessTypeMap);

    useEffect(() => {
        startTransition(() => {
            if (isEditing && editingCompany) {
                setFormData({
                    ...editingCompany,
                    socialLinks: editingCompany.socialLinks || [{ platform: '', link: '' }],
                });
            } else {
                setFormData({ ...initialFormData });
            }
        });
    }, [isEditing, editingCompany, contextBusinessId]);

    const debouncedHandleChange = useRafDebounce((name, value) => {
        setFormData(prev => {
            if (prev[name] === value) return prev;
            return { ...prev, [name]: value };
        });
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        debouncedHandleChange(name, value);
    }, [debouncedHandleChange]);

    const debouncedSocialChange = useRafDebounce((index, field, value) => {
        setFormData(prev => {
            const updatedLinks = [...prev.socialLinks];
            updatedLinks[index][field] = value;
            return { ...prev, socialLinks: updatedLinks };
        });
    });

    const handleSocialLinkChange = useCallback((index, field, value) => {
        debouncedSocialChange(index, field, value);
    }, [debouncedSocialChange]);

    const addSocialLink = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            socialLinks: [...prev.socialLinks, { platform: '', link: '' }]
        }));
    }, []);

    const removeSocialLink = useCallback((index) => {
        setFormData(prev => {
            const updatedLinks = [...prev.socialLinks];
            updatedLinks.splice(index, 1);
            return { ...prev, socialLinks: updatedLinks };
        });
    }, []);

    const handleUseLocation = useCallback(() => {
        navigator.geolocation?.getCurrentPosition(
            pos => {
                setFormData(prev => ({
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

    const socialLinkElements = useMemo(() => {
        const canRemove = formData.socialLinks.length > 1;
        return formData.socialLinks.map((link, index) => (
            <SocialLinkInput
                key={index}
                index={index}
                link={link}
                onChange={handleSocialLinkChange}
                onRemove={removeSocialLink}
                canRemove={canRemove}
            />
        ));
    }, [formData.socialLinks, handleSocialLinkChange, removeSocialLink]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            console.error('Business Name, Phone, Type, Latitude and Longitude required');
            return;
        }

        const newBusiness = {
            ...formData,
            businessId: editingCompany?.businessId || formData.businessId || `BUS${Date.now()}`,
            businessType: businessTypeMap[formData.businessType] || 'OTHER',
            joinedDate: editingCompany?.joinedDate || new Date().toISOString().split('T')[0],
        };

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const savedBusiness = await saveBusiness(newBusiness, isEditing, token);

            if (isEditing) {
                setCompanies(prev =>
                    prev.map(company =>
                        company.businessId === editingCompany.businessId ? savedBusiness : company
                    )
                );
                setIsEditing(false);
            } else {
                setCompanies(prev => [savedBusiness, ...prev]);
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
            className="bg-white p-3 rounded shadow space-y-3 w-full mx-auto text-xs"

        >
            <h2 className="text-sm font-semibold text-black">{isEditing ? 'Edit Business' : 'Add Business'}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {!isEditing && (
                    <div>
                        <label className={labelClass}>Business ID</label>
                        <input type="text" value="Auto-generated" disabled className={`${inputClass} bg-gray-100`} />
                    </div>
                )}
                <div>
                    <label className={labelClass}>Business Name *</label>
                    <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className={inputClass} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                    <label className={labelClass}>Owner Name</label>
                    <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Phone *</label>
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputClass} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div>
                    <label className={labelClass}>Latitude *</label>
                    <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Longitude *</label>
                    <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label className={`${labelClass} invisible`}>Use Location</label>
                    <button
                        type="button"
                        className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-0 h-8 rounded w-full"
                        onClick={handleUseLocation}
                    >
                        Use My Location
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                    <label className={labelClass}>Subscription</label>
                    <select name="subscriptionType" value={formData.subscriptionType} onChange={handleChange} className={inputClass}>
                        <option value="">Select</option>
                        {subscriptionTypes.map((type, idx) => (
                            <option key={idx} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>GST No</label>
                    <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} className={inputClass} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                    <label className={labelClass}>Website</label>
                    <input type="url" name="websiteLink" value={formData.websiteLink} onChange={handleChange} className={inputClass} />
                </div>

                {/* Social links span full width on desktop */}
                <div className="md:col-span-1">
                    <label className={labelClass}>Business Type *</label>
                    <select name="businessType" value={formData.businessType} onChange={handleChange} className={inputClass}>
                        <option value="">Select</option>
                        {businessTypes.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Social Links span full width */}
            <div className="md:col-span-2">
                <label className={labelClass}>Social Links</label>
                {socialLinkElements}
                <button type="button" onClick={addSocialLink} className="text-blue-500 hover:underline text-xs mt-1">
                    + Add
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-2 pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs w-full md:w-auto"
                >
                    {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                {isEditing && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs w-full md:w-auto"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
