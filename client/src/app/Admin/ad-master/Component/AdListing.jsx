'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useRole } from '@/Context/RoleContext';
import { compressImage } from '@/Utils/imageCompresson';
import { showToast } from '@/Utils/toastUtil';
import { BACKEND_BUSINESS_URL } from '@/Utils/backendUrl';


import { useEffect, useState, useCallback } from 'react';
import { BACKEND_BUSINESS_URL } from '@/app/Utils/backendUrl';
import { useRole } from '@/Context/RoleContext';

// ✅ Enum category values as backend expects
const categories = [
    'Deals & Discounts',
    'Events',
    'Services',
    'Products for Sale',
    'Job Openings',
    'Rentals & Properties',
    'Announcements',
    'Contests & Giveaways',
];


export default function AdListing({ setIsAdEditing, editingAd, isAdEditing, setAds }) {
    const { businessId } = useRole();

    console.log(localStorage.getItem("token"))

    const initialAddData = {
        title: '',
        category: '',
        startDate: '',
        endDate: '',
        stage: 'DRAFT',
        reset: false,
        images: [],
        extra: {},
    };

    const [form, setForm] = useState(initialAddData);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        if (isAdEditing && editingAd) {
            setForm({
                ...editingAd,
                startDate: editingAd.visibleFrom?.split('T')[0] || '',
                endDate: editingAd.visibleTo?.split('T')[0] || '',
                stage: editingAd.stage || 'DRAFT',
                reset: editingAd.reset || false,
                extra: editingAd.metadata || {},
                images: [],
            });
            setPreviewImages([]);
        } else {
            setForm(initialAddData);
            setPreviewImages([]);
        }
    }, [isAdEditing, editingAd]);

    useEffect(() => {
        return () => previewImages.forEach((url) => URL.revokeObjectURL(url));
    }, [previewImages]);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);

    const handleExtraChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            extra: { ...prev.extra, [name]: value },
        }));
    }, []);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files).slice(0, 3);
        const previews = files.map((file) => URL.createObjectURL(file));
        setForm((prev) => ({ ...prev, images: files }));
        setPreviewImages(previews);
    };

    const handleSubmit = async (status) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            const {
                title,
                category,
                startDate,
                endDate,
                stage,
                reset,
                images,
                extra,
            } = form;

            formData.append('title', title);
            formData.append('category', category);
            formData.append('visibleFrom', startDate);
            formData.append('visibleTo', endDate);
            formData.append('stage', status === 'draft' ? 'DRAFT' : stage);
            formData.append('reset', reset ? true : false);
            Object.entries(extra).forEach(([key, value]) => {
                formData.append(key, value);
            });


            images.forEach((img) => formData.append('images', img)); // ✅ match backend


            const endpoint = isAdEditing
                ? `${BACKEND_BUSINESS_URL}/ads/${form.adCode}`
                : `${BACKEND_BUSINESS_URL}/new-ad`;

            const method = isAdEditing ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.status === 200 || !re.status === 201) throw new Error('Failed to submit ad');

            const updatedAd = await res.json();

            setAds((prev) =>
                isAdEditing
                    ? prev.map((ad) => (ad.adCode === updatedAd.adCode ? updatedAd : ad))
                    : [updatedAd, ...prev]
            );

            console.log(`Ad ${isAdEditing ? 'updated' : status === 'draft' ? 'saved as draft' : 'submitted'} successfully!`);

            setForm(initialAddData);
            setPreviewImages([]);
            setIsAdEditing(false);
        } catch (err) {
            console.error('Ad submission error:', err);
        }
    };

    const renderExtraFields = () => {
        const { category, extra } = form;
        const commonInput = (name, placeholder) => (
            <Input name={name} placeholder={placeholder} onChange={handleExtraChange} value={extra[name] ?? ''} />
        );

        switch (category) {
            case 'EVENT':
                return (
                    <>
                        {commonInput('location', 'Location')}
                        {commonInput('time', 'Time (e.g., 7 PM)')}
                        {commonInput('rsvp', 'RSVP or Ticket Link')}
                    </>
                );
            case 'Services':
                return (
                    <>
                        {commonInput('serviceType', 'Service Type')}
                        {commonInput('contact', 'Contact Info')}
                        {commonInput('radius', 'Service Radius')}
                    </>
                );
            case 'Products for Sale':
                return (
                    <>
                        {commonInput('price', 'Price')}
                        {commonInput('deliveryOption', 'Pickup/Delivery Option')}
                        {commonInput('condition', 'Condition (New/Used)')}
                    </>
                );
            case 'Job Openings':
                return (
                    <>
                        {commonInput('salary', 'Salary')}
                        {commonInput('hours', 'Working Hours')}
                        {commonInput('location', 'Location')}
                        {commonInput('qualifications', 'Qualifications')}
                    </>
                );
            case 'Rentals & Properties':
                return (
                    <>
                        {commonInput('area', 'Area')}
                        {commonInput('rent', 'Rent')}
                        {commonInput('amenities', 'Amenities')}
                        {commonInput('contact', 'Contact Info')}
                        {commonInput('availableFrom', 'Available From')}
                    </>
                );
            case 'Contests & Giveaways':
                return (
                    <>
                        {commonInput('rules', 'Rules')}
                        {commonInput('endDate', 'End Date')}
                        {commonInput('eligibility', 'Eligibility')}
                        {commonInput('prize', 'Prize')}
                    </>
                );
            case 'Announcements':
                return (
                    <>
                        {commonInput('announcementType', 'Type')}
                        {commonInput('content', 'Announcement Content')}
                        {commonInput('importanceLevel', 'Importance (Low/Medium/High)')}
                    </>
                );
            case 'DEAL':
                return (
                    <>
                        {commonInput('discountPercentage', 'Discount %')}
                        {commonInput('validTill', 'Valid Till')}
                        {commonInput('terms', 'Terms & Conditions')}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md text-gray-800 space-y-6">
            <h2 className="text-2xl font-bold border-b pb-2">🗂️ Create New Ad Listing</h2>

            <div className="space-y-4">
                <Input label="Title" name="title" value={form.title} onChange={handleChange} maxLength={100} placeholder="e.g., 50% Off at Aroma Café" />

                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input type="date" name="startDate" value={form.startDate} onChange={handleChange} label="Start Date" />
                    <Input type="date" name="endDate" value={form.endDate} onChange={handleChange} label="End Date" />
                </div>

                {form.category && (
                    <div className="bg-gray-50 p-4 rounded-md border mt-4 space-y-2">
                        <h4 className="font-semibold text-sm text-gray-600">Additional Details</h4>
                        {renderExtraFields()}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1">Upload Images (max 3)</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {previewImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mt-2">
                            {previewImages.map((src, index) => (
                                <img
                                    key={index}
                                    src={src}
                                    alt={`preview-${index}`}
                                    className="w-full h-24 object-cover rounded-md border"
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" name="reset" checked={form.reset} onChange={handleChange} />
                    <label htmlFor="reset">Reset after campaign ends</label>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={() => handleSubmit('submit')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                    >
                        Submit
                    </button>
                    <button
                        onClick={() => handleSubmit('draft')}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md font-medium"
                    >
                        Save as Draft
                    </button>
                </div>
            </div>
        </div>
    );
}

// ✅ Reusable Input Component
const Input = ({ label, ...props }) => (
    <div>
        {label && <label className="block text-sm font-medium mb-1">{label}</label>}
        <input
            {...props}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);
