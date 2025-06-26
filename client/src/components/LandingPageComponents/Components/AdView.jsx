'use client';

import React, { useEffect, useState } from 'react';

const dummyAds = [
    {
        adCode: 'DUMMY001',
        title: '🎉 25% Off on All Coffees!',
        category: 'DEAL',
        visibleFrom: '2025-06-20',
        visibleTo: '2025-06-30',
        status: 'PUBLISHED',
        extra: {
            discount: '25%',
            description: 'Limited time coffee offer!',
        },
        images: ['https://source.unsplash.com/600x400/?coffee'],
    },
    {
        adCode: 'DUMMY002',
        title: '👨‍💻 We’re Hiring React Devs!',
        category: 'Job Openings',
        visibleFrom: '2025-06-15',
        visibleTo: '2025-07-10',
        status: 'DRAFT',
        extra: {
            salary: '₹60,000/mo',
            hours: '10 AM - 7 PM',
            location: 'Remote',
        },
        images: ['https://source.unsplash.com/600x400/?developer'],
    },
];

const renderCategoryDetails = (category, extra = {}) => {
    switch (category) {
        case 'DEAL':
            return (
                <>
                    <p>Discount: {extra.discount}</p>
                    <p>Description: {extra.description}</p>
                </>
            );
        case 'Job Openings':
            return (
                <>
                    <p>Salary: {extra.salary}</p>
                    <p>Hours: {extra.hours}</p>
                    <p>Location: {extra.location}</p>
                </>
            );
        case 'EVENT':
            return (
                <>
                    <p>Time: {extra.time}</p>
                    <p>Location: {extra.location}</p>
                    <p>
                        RSVP:{' '}
                        <a
                            href={extra.rsvp}
                            className="text-blue-600 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {extra.rsvp}
                        </a>
                    </p>
                </>
            );
        default:
            return <p className="text-gray-500 text-sm">No extra info provided.</p>;
    }
};

export default function AdView({ businessId, onClose }) {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [businessName, setBusinessName] = useState('');

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch(`/api/business/${businessId}/ads`);
                if (!res.ok) throw new Error('Failed to fetch');

                const data = await res.json();
                const fetchedAds = data.ads || [];

                if (fetchedAds.length === 0) {
                    setAds(dummyAds);
                    setBusinessName('Dummy Business');
                } else {
                    setAds(fetchedAds);
                    setBusinessName(data.businessName || 'Business');
                }
            } catch (err) {
                console.error('Fetch error, showing dummy data:', err);
                setAds(dummyAds);
                setBusinessName('Dummy Business');
            } finally {
                setLoading(false);
            }
        };

        if (businessId) {
            fetchAds();
        }
    }, [businessId]);

    return (
        <div className="relative w-full h-full p-6 overflow-y-auto">
            <button
                className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
                onClick={onClose}
            >
                ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">
                {loading ? 'Loading...' : businessName}
            </h2>

            {loading ? (
                <p>Loading ads...</p>
            ) : (
                <div className="space-y-6">
                    {ads.map((ad) => (
                        <div
                            key={ad.adCode}
                            className="border  shadow hover:shadow-md transition bg-white overflow-hidden flex flex-col"
                        >
                            {ad.images?.[0] ? (
                                <img
                                    src={ad.images[0].url || ad.images[0]}
                                    alt={ad.title}
                                    className="w-full h-48 object-cover"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                    No Image
                                </div>
                            )}

                            <div className="p-4 flex flex-col gap-2">
                                <h3 className="text-lg font-semibold">{ad.title}</h3>
                                <span
                                    className={`inline-block w-fit px-2 py-0.5 text-xs rounded-full ${ad.status === 'PUBLISHED'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                >
                                    {ad.status}
                                </span>

                                <p className="text-sm text-gray-600">Category: {ad.category}</p>
                                <p className="text-xs text-gray-500">
                                    {ad.visibleFrom} → {ad.visibleTo}
                                </p>

                                <div className="text-sm text-gray-800 space-y-1 mt-2">
                                    {renderCategoryDetails(ad.category, ad.extra)}
                                </div>

                                <p className="text-[11px] text-gray-400 mt-3">
                                    Ad Code: {ad.adCode}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
