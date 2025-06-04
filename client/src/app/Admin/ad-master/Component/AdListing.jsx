'use client';

import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BACKEND_BUSINESS_URL } from '@/app/Utils/backendUrl';
import { useRole } from '@/Context/RoleContext';

const categories = [
    'DEAL',
    'EVENT',
    'Services',
    'Products for Sale',
    'Job Openings',
    'Rentals & Properties',
    'Announcements',
    'Contests & Giveaways'
];

export default function AdListing({ setIsAdEditing, editingAd, isAdEditing }) {
    const { businessId } = useRole()
    // const { businessId } = ''
    const initialAddData = {
        adCode: `AD${Date.now()}`,
        title: '',
        category: '',
        startDate: '',
        endDate: '',
        images: [],
        extra: {},
    };

    const [form, setForm] = useState(initialAddData);

    useEffect(() => {
        if (isAdEditing && editingAd) {
            setForm({
                ...editingAd,
                extra: editingAd.extra || {},
                images: [], // clear images on edit or handle as needed
            });
        } else {
            setForm(initialAddData);
        }
    }, [isAdEditing, editingAd]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        let files = Array.from(e.target.files);
        if (files.length > 3) {
            toast.warn('You can upload up to 3 images only');
            files = files.slice(0, 3);
        }
        setForm((prev) => ({ ...prev, images: files }));
    };

    const handleExtraChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            extra: { ...prev.extra, [name]: value }
        }));
    };

    const handleSubmit = async (status) => {
        try {
            const token = localStorage.getItem('token');

            const formData = new FormData();
            formData.append('adCode', form.adCode);
            formData.append('title', form.title);
            formData.append('category', form.category);
            formData.append('startDate', form.startDate);
            formData.append('endDate', form.endDate);
            formData.append('status', status);
            formData.append('extra', JSON.stringify(form.extra));

            form.images.forEach((file) => {
                formData.append('images', file);
            });

            const endpoint = isAdEditing
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/ads/${form.adCode}`
                : `${BACKEND_BUSINESS_URL}/${businessId}/new-ad`;

            const method = isAdEditing ? 'put' : 'post';

            await axios({
                method,
                url: endpoint,
                data: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success(`Ad ${isAdEditing ? 'updated' : status === 'draft' ? 'saved as draft' : 'submitted'} successfully!`);
            setForm(initialAddData);
            setIsAdEditing(false); // exit edit mode

        } catch (error) {
            console.error('Ad submission error:', error);
            toast.error('Failed to submit ad. Please try again.');
        }
    };

    const renderExtraFields = () => {
        switch (form.category) {
            case 'Events':
                return (
                    <>
                        <Input name="location" placeholder="Location" onChange={handleExtraChange} value={form.extra.location || ''} />
                        <Input name="time" placeholder="Time (e.g., 7 PM)" onChange={handleExtraChange} value={form.extra.time || ''} />
                        <Input name="rsvp" placeholder="RSVP or Ticket Link" onChange={handleExtraChange} value={form.extra.rsvp || ''} />
                    </>
                );
            case 'Services':
                return (
                    <>
                        <Input name="serviceType" placeholder="Service Type" onChange={handleExtraChange} value={form.extra.serviceType || ''} />
                        <Input name="contact" placeholder="Contact Info" onChange={handleExtraChange} value={form.extra.contact || ''} />
                        <Input name="radius" placeholder="Service Radius" onChange={handleExtraChange} value={form.extra.radius || ''} />
                    </>
                );
            case 'Products for Sale':
                return (
                    <>
                        <Input name="price" placeholder="Price" onChange={handleExtraChange} value={form.extra.price || ''} />
                        <Input name="deliveryOption" placeholder="Pickup/Delivery Option" onChange={handleExtraChange} value={form.extra.deliveryOption || ''} />
                    </>
                );
            case 'Job Openings':
                return (
                    <>
                        <Input name="salary" placeholder="Salary" onChange={handleExtraChange} value={form.extra.salary || ''} />
                        <Input name="hours" placeholder="Working Hours" onChange={handleExtraChange} value={form.extra.hours || ''} />
                        <Input name="location" placeholder="Location" onChange={handleExtraChange} value={form.extra.location || ''} />
                    </>
                );
            case 'Rentals & Properties':
                return (
                    <>
                        <Input name="area" placeholder="Area" onChange={handleExtraChange} value={form.extra.area || ''} />
                        <Input name="rent" placeholder="Rent" onChange={handleExtraChange} value={form.extra.rent || ''} />
                        <Input name="amenities" placeholder="Amenities" onChange={handleExtraChange} value={form.extra.amenities || ''} />
                        <Input name="contact" placeholder="Contact Info" onChange={handleExtraChange} value={form.extra.contact || ''} />
                    </>
                );
            case 'Contests & Giveaways':
                return (
                    <>
                        <Input name="rules" placeholder="Rules" onChange={handleExtraChange} value={form.extra.rules || ''} />
                        <Input name="endDate" placeholder="End Date" onChange={handleExtraChange} value={form.extra.endDate || ''} />
                        <Input name="eligibility" placeholder="Eligibility" onChange={handleExtraChange} value={form.extra.eligibility || ''} />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md text-gray-800 space-y-6">
            <ToastContainer />
            <h2 className="text-2xl font-bold border-b pb-2">🗂️ Create New Ad Listing</h2>

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
                </div>

                <div className="flex gap-4 pt-4">
                    <button onClick={() => handleSubmit('submit')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                        Submit
                    </button>
                    <button onClick={() => handleSubmit('draft')} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md font-medium">
                        Save as Draft
                    </button>
                </div>
            </div>
        </div>
    );
}

const Input = ({ label, ...props }) => (
    <div>
        {label && <label className="block text-sm font-medium mb-1">{label}</label>}
        <input
            {...props}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);
