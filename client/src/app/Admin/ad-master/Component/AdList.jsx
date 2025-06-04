'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

const AdList = ({ ads, setAds, editingAd, setIsAdEditing, setEditingAd }) => {

    const [loadingAdIds, setLoadingAdIds] = useState(new Set());

    async function toggleAdStatus(adCode, newStatus) {
        try {
            const response = await fetch(`/api/ads/${adCode}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: newStatus }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            toast.success(`Ad status updated to ${newStatus ? 'Active' : 'Inactive'}!`);
            return result;
        } catch (error) {
            toast.error('Status update failed. Please try again.');
            return null;
        }
    }

    async function handleToggle(ad) {
        if (loadingAdIds.has(ad.adCode)) return;

        const newStatus = !ad.isActive;

        // Optimistic UI update
        setAds(prev =>
            prev.map(a =>
                a.adCode === ad.adCode ? { ...a, isActive: newStatus } : a
            )
        );

        setLoadingAdIds(prev => new Set(prev).add(ad.adCode));

        const result = await toggleAdStatus(ad.adCode, newStatus);

        if (!result) {
            // Rollback on failure
            setAds(prev =>
                prev.map(a =>
                    a.adCode === ad.adCode ? { ...a, isActive: ad.isActive } : a
                )
            );
        }

        setLoadingAdIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(ad.adCode);
            return newSet;
        });
    }

    return (
        <div className="flex-1 overflow-auto rounded border border-gray-300 bg-white">
            <div className="max-w-[1000px]">
                <table className="w-full text-left text-black border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Ad Code</th>
                            <th className="py-2 px-4 border-b">Title</th>
                            <th className="py-2 px-4 border-b">Category</th>
                            <th className="py-2 px-4 border-b">Start Date</th>
                            <th className="py-2 px-4 border-b">End Date</th>
                            <th className="py-2 px-4 border-b">Active</th>
                            <th className="py-2 px-4 border-b">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ads.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-black">
                                    No ads added yet.
                                </td>
                            </tr>
                        ) : (
                            ads.map(ad => (
                                <tr key={ad.adCode} className="text-black text-sm border-t text-center">
                                    <td className="py-2 px-4">{ad.adCode}</td>
                                    <td className="py-2 px-4">{ad.title}</td>
                                    <td className="py-2 px-4">{ad.category}</td>
                                    <td className="py-2 px-4">{ad.startDate}</td>
                                    <td className="py-2 px-4">{ad.endDate}</td>
                                    <td className="py-2 px-4">
                                        <input
                                            type="checkbox"
                                            checked={ad.isActive}
                                            onChange={() => handleToggle(ad)}
                                            disabled={loadingAdIds.has(ad.adCode)}
                                        />
                                    </td>
                                    <td className="py-2 px-4">
                                        <button
                                            onClick={() => {
                                                setEditingAd(ad);

                                                setIsAdEditing(true);
                                            }}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdList;
