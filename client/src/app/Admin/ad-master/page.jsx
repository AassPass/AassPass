'use client';

import { useEffect, useState } from 'react';
import AdList from './Component/AdList';
import AdListing from './Component/AdListing';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRole } from '@/Context/RoleContext';
import { BACKEND_BUSINESS_URL } from '@/app/Utils/backendUrl';

export default function CompanyManagement() {
    const [ads, setAds] = useState([]);
    const [editingAd, setEditingAd] = useState(null);
    const [isAdEditing, setIsAdEditing] = useState(false);

    const { businessID } = useRole(); // Replace with dynamic logic if needed

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

    useEffect(() => {
        const fetchAdsByBusiness = async () => {
            try {
                const response = await axios.get(`${BACKEND_BUSINESS_URL}/${businessID}/ads`);
                setAds(response.data);
                toast.success('Ads fetched successfully!');
            } catch (error) {
                console.error('Error fetching ads:', error);
                toast.error('Failed to fetch ads. Showing dummy data.');
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
