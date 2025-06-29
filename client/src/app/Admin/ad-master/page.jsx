'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';



import { useRole } from '@/Context/RoleContext';
import { BACKEND_BUSINESS_URL } from '@/app/Utils/backendUrl';

// ✅ Lazy load components to reduce initial JS bundle size
const AdList = dynamic(() => import('./Component/AdList'), { ssr: false });
const AdListing = dynamic(() => import('./Component/AdListing'), { ssr: false });

// ✅ Move dummy data outside the component to reduce memory usage
const dummyAds = [
    {
        adCode: 'AD001',
        title: 'Summer Sale',
        category: 'Retail',
        startDate: '2025-06-01',
        endDate: '2025-06-30',
        isActive: true,
    },
    {
        adCode: 'AD002',
        title: 'New App Launch',
        category: 'Technology',
        startDate: '2025-07-10',
        endDate: '2025-07-25',
        isActive: false,
    },
    {
        adCode: 'AD003',
        title: 'Back to School',
        category: 'Education',
        startDate: '2025-08-01',
        endDate: '2025-08-31',
        isActive: true,
    },
];

export default function CompanyManagement() {
    const [ads, setAds] = useState([]);
    const [editingAd, setEditingAd] = useState(null);
    const [isAdEditing, setIsAdEditing] = useState(false);

    const { businessID } = useRole();
    const fetchedRef = useRef(false); // ✅ Prevent unnecessary re-fetching
    useEffect(() => {
        if (!businessID || fetchedRef.current) return;

        fetchedRef.current = true;

        const fetchAdsByBusiness = async () => {
            try {
                const res = await fetch(`${BACKEND_BUSINESS_URL}/${businessID}/ads`);

                if (!res.ok) throw new Error('Failed to fetch ads');

                const data = await res.json();
                setAds(data);
            } catch (error) {
                console.error('Error fetching ads:', error);
                setAds(dummyAds);
            }
        };

        fetchAdsByBusiness();
    }, [businessID]);


    return (
        <div className="flex flex-col h-full p-6 overflow-hidden">
            <h1 className="text-2xl font-bold mb-4 text-black">Ad Management</h1>

            <div className="mb-4">
                <AdListing
                    ads={ads}
                    setAds={setAds}
                    editingAd={editingAd}
                    setEditingAd={setEditingAd}
                    isAdEditing={isAdEditing}
                    setIsAdEditing={setIsAdEditing}
                    businessID={businessID}
                />
            </div>

            <h2 className="text-xl font-semibold mb-3 text-black">Ad List</h2>

            <AdList
                ads={ads}
                setAds={setAds}
                editingAd={editingAd}
                setEditingAd={setEditingAd}
                isAdEditing={isAdEditing}
                setIsAdEditing={setIsAdEditing}
            />
        </div>
    );
}
