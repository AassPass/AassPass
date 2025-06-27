'use client';

import { BACKEND_USER_URL } from '@/app/Utils/backendUrl';
import React, { useState } from 'react';

const businessTypeOptions = [
    'Retail Store',
    'Restaurant / Café',
    'Salon / Spa',
    'Gym / Fitness Center',
    'Medical / Health Store',
    'Service Provider',
    'Freelancer / Consultant',
    'Event Organizer',
    'Education / Coaching',
    'Home-based Business',
    'Real Estate / Rentals',
    'Courier / Delivery',
    'Automobile Services',
    'Pet Services',
    'NGO / Community Org.',
    'Shop / Store / Office',
    'Other',
];

const inputClass = 'w-full p-2 text-sm border border-gray-300 rounded';

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
        socialLinks: [{ platform: '', link: '' }],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (index, field, value) => {
        const updated = [...form.socialLinks];
        updated[index][field] = value;
        setForm(prev => ({ ...prev, socialLinks: updated }));
    };

    const addSocialLink = () => {
        setForm(prev => ({
            ...prev,
            socialLinks: [...prev.socialLinks, { platform: '', link: '' }],
        }));
    };

    const removeSocialLink = (index) => {
        setForm(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index),
        }));
    };

    const handleUseLocation = () => {
        navigator.geolocation.getCurrentPosition(
            pos => {
                setForm(prev => ({
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
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${BACKEND_USER_URL}/business`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to save');

            alert('Business saved successfully!');
            console.log(data.business);
            localStorage.setItem('token', data.token)
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4 bg-white rounded shadow">
            <h2 className="text-lg font-bold">Business Form</h2>

            <input className={inputClass} name="businessName" placeholder="Business Name" value={form.businessName} onChange={handleChange} required />
            <input className={inputClass} name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} required />
            <input className={inputClass} name="emailAddress" placeholder="Email Address" value={form.emailAddress} onChange={handleChange} required />
            <input className={inputClass} name="address" placeholder="Address" value={form.address} onChange={handleChange} />
            <input className={inputClass} name="gstNumber" placeholder="GST Number" value={form.gstNumber} onChange={handleChange} />

            <select className={inputClass} name="businessType" value={form.businessType} onChange={handleChange} required>
                <option value="">Select Business Type</option>
                {businessTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>

            <input className={inputClass} name="websiteLink" placeholder="Website Link" value={form.websiteLink} onChange={handleChange} />

            <div className="grid grid-cols-2 gap-2">
                <input
                    className={inputClass}
                    type="number"
                    step="any"
                    name="latitude"
                    placeholder="Latitude"
                    value={form.latitude}
                    onChange={handleChange}
                />
                <input
                    className={inputClass}
                    type="number"
                    step="any"
                    name="longitude"
                    placeholder="Longitude"
                    value={form.longitude}
                    onChange={handleChange}
                />
            </div>

            <button
                type="button"
                onClick={handleUseLocation}
                className="text-xs text-blue-600 hover:underline"
            >
                Use My Location
            </button>

            <div className="space-y-2">
                <label className="text-sm font-medium block">Social Links</label>
                {form.socialLinks.map((link, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <input
                            type="text"
                            placeholder="Platform"
                            value={link.platform}
                            onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                            className={`${inputClass} w-1/3`}
                        />
                        <input
                            type="url"
                            placeholder="Link"
                            value={link.link}
                            onChange={(e) => handleSocialChange(index, 'link', e.target.value)}
                            className={`${inputClass} flex-grow`}
                        />
                        {form.socialLinks.length > 1 && (
                            <button type="button" onClick={() => removeSocialLink(index)} className="text-red-600 font-bold">
                                ×
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addSocialLink}
                    className="text-xs text-blue-500 hover:underline"
                >
                    + Add another link
                </button>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
                Submit
            </button>
        </form>
    );
}
