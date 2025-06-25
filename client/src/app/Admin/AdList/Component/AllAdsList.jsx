'use client';

import { BACKEND_ADMIN_URL } from '@/app/Utils/backendUrl';
import { useRole } from '@/Context/RoleContext';
import { hasPermission } from '@/libs/hasPermisson';
import { PERMISSIONS } from '@/libs/permissions';
// import axios from 'axios';
import { useState } from 'react';

import React from 'react';

const STATUS_OPTIONS = ['Verified', 'Rejected', 'Pending'];

const getStatusClasses = status => {
    switch (status) {
        case 'Verified':
            return 'bg-green-100 text-green-700';
        case 'Rejected':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-yellow-100 text-yellow-700';
    }
};

const getButtonClasses = status => {
    const base = 'text-xs px-3 py-1 rounded transition duration-200 font-medium';
    switch (status) {
        case 'Verified':
            return `${base} bg-green-200 hover:bg-green-300 text-green-800`;
        case 'Rejected':
            return `${base} bg-red-200 hover:bg-red-300 text-red-800`;
        default:
            return `${base} bg-yellow-200 hover:bg-yellow-300 text-yellow-800`;
    }
};

const AllAdsList = ({ allAds, setAllAds }) => {
    const [loadingIds, setLoadingIds] = useState(new Set());
    const { role } = useRole();
    const canVerify = hasPermission(role, PERMISSIONS.VERIFY_AD);

    const updateVerification = async (adCode, newStatus) => {
        try {
            const res = await fetch(`${BACKEND_ADMIN_URL}/verify-ad/${adCode}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ verificationStatus: newStatus }),
            });

            if (!res.ok) {
                throw new Error('Failed to update verification status');
            }

            const data = await res.json();
            return data;
        } catch (err) {
            console.error('Failed to update verification status');
            return null;
        }
    };


    const handleStatusChange = async (ad, newStatus) => {
        if (loadingIds.has(ad.adCode)) return;

        const previousStatus = ad.verificationStatus;
        setLoadingIds(prev => new Set(prev).add(ad.adCode));

        setAllAds(prev =>
            prev.map(a => a.adCode === ad.adCode ? { ...a, verificationStatus: newStatus } : a)
        );

        const result = await updateVerification(ad.adCode, newStatus);

        if (!result) {
            setAllAds(prev =>
                prev.map(a => a.adCode === ad.adCode ? { ...a, verificationStatus: previousStatus } : a)
            );
        }

        setLoadingIds(prev => {
            const next = new Set(prev);
            next.delete(ad.adCode);
            return next;
        });
    };

    return (
        <div className="flex-1 overflow-auto rounded border border-gray-300 bg-white mt-6">
            <div className="max-w-[1200px]">
                <table className="w-full text-left text-black border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-sm">
                            <th className="py-3 px-4 border-b">Ad Code</th>
                            <th className="py-3 px-4 border-b">Title</th>
                            <th className="py-3 px-4 border-b">Category</th>
                            <th className="py-3 px-4 border-b">Start</th>
                            <th className="py-3 px-4 border-b">End</th>
                            <th className="py-3 px-4 border-b">Active</th>
                            <th className="py-3 px-4 border-b">Verification</th>
                            {canVerify && <th className="py-3 px-4 border-b text-center">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {allAds.length === 0 ? (
                            <tr>
                                <td colSpan={canVerify ? 8 : 7} className="text-center py-4 text-black">
                                    No ads found.
                                </td>
                            </tr>
                        ) : (
                            allAds.map(ad => (
                                <tr
                                    key={ad.adCode}
                                    className="text-black text-sm border-t text-center hover:bg-gray-50 transition"
                                >
                                    <td className="py-2 px-4">{ad.adCode}</td>
                                    <td className="py-2 px-4">{ad.title}</td>
                                    <td className="py-2 px-4">{ad.category}</td>
                                    <td className="py-2 px-4">{ad.startDate}</td>
                                    <td className="py-2 px-4">{ad.endDate}</td>
                                    <td className="py-2 px-4">
                                        <span className={ad.isActive ? 'text-green-600' : 'text-red-600'}>
                                            {ad.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(ad.verificationStatus)}`}
                                        >
                                            {ad.verificationStatus}
                                        </span>
                                    </td>
                                    {canVerify && (
                                        <td className="py-2 px-4 flex justify-center gap-1">
                                            {STATUS_OPTIONS.map(status => (
                                                <button
                                                    key={status}
                                                    disabled={loadingIds.has(ad.adCode)}
                                                    onClick={() => handleStatusChange(ad, status)}
                                                    className={`${getButtonClasses(status)} disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ✅ Wrap in React.memo for performance optimization
export default React.memo(AllAdsList);
