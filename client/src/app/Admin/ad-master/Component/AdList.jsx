'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';

import { BACKEND_BUSINESS_URL } from '@/app/Utils/backendUrl';
import { useRole } from '@/Context/RoleContext';

const CATEGORIES = Object.freeze([
    'DEAL',
    'EVENT',
    'Services',
    'Products for Sale',
    'Job Openings',
    'Rentals & Properties',
    'Announcements',
    'Contests & Giveaways',
]);

const initialAdData = {
    adCode: `AD${Date.now()}`,
    title: '',
    category: '',
    startDate: '',
    endDate: '',
    images: [],
    extra: {},
};

const Input = ({ label, name, ...props }) => (
    <div>
        {label && (
            <label htmlFor={name} className="block text-sm font-medium mb-1">
                {label}
            </label>
        )}
        <input
            id={name}
            name={name}
            {...props}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

export default function AdListing({ setIsAdEditing, editingAd, isAdEditing, setAds }) {
    const { businessId } = useRole();
    const [form, setForm] = useState(initialAdData);
    const [previewImages, setPreviewImages] = useState([]);

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

    const handleImageUpload = useCallback((e) => {
        const files = Array.from(e.target.files).slice(0, 3);
        const previews = files.map((file) => URL.createObjectURL(file));

        setForm((prev) => ({ ...prev, images: files }));

        // Revoke old URLs
        previewImages.forEach((url) => URL.revokeObjectURL(url));
        setPreviewImages(previews);
    }, [previewImages]);

    const handleSubmit = useCallback(async (status) => {
        try {
            const token = localStorage.getItem('token');
            const { adCode, title, category, startDate, endDate, images, extra } = form;
            const formData = new FormData();

            formData.append('adCode', adCode);
            formData.append('title', title);
            formData.append('category', category);
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);
            formData.append('extra', JSON.stringify(extra));
            formData.append('status', status);
            images.forEach((img) => formData.append('images', img));

            const endpoint = isAdEditing
                ? `${BACKEND_BUSINESS_URL}/ads/${adCode}`
                : `${BACKEND_BUSINESS_URL}/${businessId}/new-ad`;

            const method = isAdEditing ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    // 'Content-Type' is automatically set for FormData; don't include it
                },
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to submit ad');

            const data = await res.json();

            setAds((prev) =>
                isAdEditing
                    ? prev.map((ad) => (ad.adCode === data.adCode ? data : ad))
                    : [data, ...prev]
            );

            setForm(initialAdData);
            setPreviewImages([]);
            setIsAdEditing(false);
        } catch (err) {
            console.error('Ad submission error:', err);
        }
    }, [form, isAdEditing, businessId, setAds, setIsAdEditing]);

    useEffect(() => {
        if (isAdEditing && editingAd) {
            setForm({
                ...editingAd,
                extra: editingAd.extra || {},
                images: [],
            });
            setPreviewImages([]);
        } else {
            setForm(initialAdData);
            setPreviewImages([]);
        }
    }, [isAdEditing, editingAd]);

    useEffect(() => {
        return () => {
            previewImages.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewImages]);

    const renderExtraFields = useMemo(() => {
        const { category, extra } = form;

        const commonInput = (name, placeholder) => (
            <Input
                key={name}
                name={name}
                placeholder={placeholder}
                value={extra[name] || ''}
                onChange={handleExtraChange}
            />
        );

        const fields = {
            EVENT: [
                ['location', 'Location'],
                ['time', 'Time (e.g., 7 PM)'],
                ['rsvp', 'RSVP or Ticket Link'],
            ],
            Services: [
                ['serviceType', 'Service Type'],
                ['contact', 'Contact Info'],
                ['radius', 'Service Radius'],
            ],
            'Products for Sale': [
                ['price', 'Price'],
                ['deliveryOption', 'Pickup/Delivery Option'],
            ],
            'Job Openings': [
                ['salary', 'Salary'],
                ['hours', 'Working Hours'],
                ['location', 'Location'],
            ],
            'Rentals & Properties': [
                ['area', 'Area'],
                ['rent', 'Rent'],
                ['amenities', 'Amenities'],
                ['contact', 'Contact Info'],
            ],
            'Contests & Giveaways': [
                ['rules', 'Rules'],
                ['endDate', 'End Date'],
                ['eligibility', 'Eligibility'],
            ],
        };

        return fields[category]?.map(([name, placeholder]) => commonInput(name, placeholder)) || null;
    }, [form.category, form.extra, handleExtraChange]);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md text-gray-800 space-y-6">
            <h2 className="text-2xl font-bold border-b pb-2">🗂️ {isAdEditing ? 'Edit' : 'Create'} Ad Listing</h2>

            <div className="space-y-4">
                <Input
                    label="Title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="e.g., 50% Off at Aroma Café"
                />

                <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Category</option>
                        {CATEGORIES.map((cat) => (
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
                        {renderExtraFields}
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
                        {isAdEditing ? 'Update' : 'Submit'}
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
