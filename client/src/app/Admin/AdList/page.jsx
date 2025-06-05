'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AllAdsList from './Component/AllAdsList';

const AllAdsPage = () => {
    const [allAds, setAllAds] = useState([]);

    // Fetch ads from API
    const fetchAllAds = async () => {
        try {
            const response = await axios.get('/api/admin/ads');
            setAllAds(response.data);
        } catch (error) {
            console.error('Failed to fetch ads:', error);
            toast.error('Failed to fetch ads, showing dummy data.');

            // Fallback dummy ads
            setAllAds([
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
            ]);
        }
    };

    useEffect(() => {
        fetchAllAds();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">All Ads (Admin View)</h1>
            <AllAdsList allAds={allAds} setAllAds={setAllAds} />
        </div>
    );
};

export default AllAdsPage;
