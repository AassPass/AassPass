'use client';

import { useEffect, useState, useCallback } from 'react';

import { BACKEND_BUSINESS_URL } from '@/app/Utils/backendUrl';
import { useRole } from '@/Context/RoleContext';

// ✅ Define categories outside to avoid re-creation on every render
const categories = [
    'DEAL',
    'EVENT',
    'Services',
    'Products for Sale',
    'Job Openings',
    'Rentals & Properties',
    'Announcements',
    'Contests & Giveaways',
];

export default function AdListing({ setIsAdEditing, editingAd, isAdEditing, setAds }) {
    const { businessId } = useRole();

    const initialAddData = {

        title: '',
        category: '',
        startDate: '',
        endDate: '',
        images: [],
        extra: {},
    };

    const [form, setForm] = useState(initialAddData);
    const [previewImages, setPreviewImages] = useState([]);

    // ✅ Controlled edit mode with cleanup
    useEffect(() => {
        if (isAdEditing && editingAd) {
            setForm({
                ...editingAd,
                extra: editingAd.extra || {},
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
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
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
        const newPreviews = files.map((file) => URL.createObjectURL(file));

        setForm((prev) => ({ ...prev, images: files }));
        setPreviewImages(newPreviews);
    };
    const handleSubmit = async (status) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            const {
                title,
                category,
                startDate,   // needs to be renamed
                endDate,     // needs to be renamed
                stage,       // new field to add
                reset = false,
                images,
                extra,
            } = form;

            formData.append('title', title);
            formData.append('category', category);
            formData.append('visibleFrom', startDate); // ✅ renamed
            formData.append('visibleTo', endDate);     // ✅ renamed
            formData.append('stage', stage || 'DRAFT'); // ✅ default fallback
            formData.append('reset', reset ? 'true' : 'false');
            images.forEach((img) => formData.append('files', img));
            console.log(formData)
            const endpoint = isAdEditing
                ? `${BACKEND_BUSINESS_URL}/ads/${form.adCode}`
                : `${BACKEND_BUSINESS_URL}/new-ad`;

            const method = isAdEditing ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Don't set content-type manually!
                },
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to submit ad');

            const updatedAd = await res.json();

            setAds((prev) =>
                isAdEditing
                    ? prev.map((ad) => (ad.adCode === updatedAd.adCode ? updatedAd : ad))
                    : [updatedAd, ...prev]
            );

            console.success(`Ad ${isAdEditing ? 'updated' : status === 'draft' ? 'saved as draft' : 'submitted'} successfully!`);

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
            <Input name={name} placeholder={placeholder} onChange={handleExtraChange} value={extra[name] || ''} />
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
                    </>
                );
            case 'Job Openings':
                return (
                    <>
                        {commonInput('salary', 'Salary')}
                        {commonInput('hours', 'Working Hours')}
                        {commonInput('location', 'Location')}
                    </>
                );
            case 'Rentals & Properties':
                return (
                    <>
                        {commonInput('area', 'Area')}
                        {commonInput('rent', 'Rent')}
                        {commonInput('amenities', 'Amenities')}
                        {commonInput('contact', 'Contact Info')}
                    </>
                );
            case 'Contests & Giveaways':
                return (
                    <>
                        {commonInput('rules', 'Rules')}
                        {commonInput('endDate', 'End Date')}
                        {commonInput('eligibility', 'Eligibility')}
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

// ✅ Reusable Input component
const Input = ({ label, ...props }) => (
    <div>
        {label && <label className="block text-sm font-medium mb-1">{label}</label>}
        <input
            {...props}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);
