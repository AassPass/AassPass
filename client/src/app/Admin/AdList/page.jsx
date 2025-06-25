'use client';

import React, { useState, useEffect, useCallback } from 'react';


import AllAdsList from './Component/AllAdsList';
import { BACKEND_ADMIN_URL } from '@/app/Utils/backendUrl';

const DUMMY_ADS = [
    {
        adCode: 'AD001',
        title: 'Summer Sale',
        category: 'Deals & Discounts',
        startDate: '2025-06-01',
        endDate: '2025-06-15',
        isActive: true,
        verificationStatus: 'Verified',
    },
    {
        adCode: 'AD002',
        title: 'Tech Conference',
        category: 'Events',
        startDate: '2025-06-05',
        endDate: '2025-06-07',
        isActive: false,
        verificationStatus: 'Pending',
    },
    {
        adCode: 'AD003',
        title: 'Luxury Apartments for Rent',
        category: 'Rentals & Properties',
        startDate: '2025-05-15',
        endDate: '2025-06-30',
        isActive: true,
        verificationStatus: 'Rejected',
    },
];

const page = () => {
    const [allAds, setAllAds] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllAds = useCallback(async () => {
        try {
            const res = await fetch(`${BACKEND_ADMIN_URL}/ads`);

            if (!res.ok) {
                throw new Error('Failed to fetch ads');
            }

            const data = await res.json();
            setAllAds(data);
        } catch (error) {
            console.error('Failed to fetch ads:', error);
            setAllAds(DUMMY_ADS); // Fallback in case of error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) fetchAllAds();
        return () => {
            isMounted = false;
        };
    }, [fetchAllAds]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Ads (Admin View)</h1>
            {loading ? (
                <p>Loading ads...</p>
            ) : (
                <AllAdsList allAds={allAds} setAllAds={setAllAds} />
            )}
        </div>
    );
};

export default page;
