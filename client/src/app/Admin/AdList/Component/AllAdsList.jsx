'use client';

import { useRole } from '@/Context/RoleContext';
import { hasPermission } from '@/libs/hasPermisson';
import { PERMISSIONS } from '@/libs/permissions';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const AllAdsList = ({ allAds, setAllAds }) => {
    const [loadingIds, setLoadingIds] = useState(new Set());
    const { role } = useRole()

    async function updateVerification(adCode, newStatus) {
        try {
            const response = await axios.patch(`/api/admin/ads/${adCode}/verify`, {
                verificationStatus: newStatus,
            });

            toast.success(`Ad marked as ${newStatus}`);
            return response.data;
        } catch (err) {
            toast.error('Failed to update verification status');
            return null;
        }
    }

    const handleStatusChange = async (ad, newStatus) => {
        if (loadingIds.has(ad.adCode)) return;

        setAllAds(prev =>
            prev.map(a =>
                a.adCode === ad.adCode ? { ...a, verificationStatus: newStatus } : a
            )
        );
        setLoadingIds(prev => new Set(prev).add(ad.adCode));

        const result = await updateVerification(ad.adCode, newStatus);
        if (!result) {
            setAllAds(prev =>
                prev.map(a =>
                    a.adCode === ad.adCode ? { ...a, verificationStatus: ad.verificationStatus } : a
                )
            );
        }

        setLoadingIds(prev => {
            const set = new Set(prev);
            set.delete(ad.adCode);
            return set;
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
                            {hasPermission(role, PERMISSIONS.VERIFY_AD) && (

                                <th className="py-3 px-4 border-b text-center">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {allAds.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-black">
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
                                            className={`px-2 py-1 rounded-full text-xs font-medium
                                                ${ad.verificationStatus === 'Verified'
                                                    ? 'bg-green-100 text-green-700'
                                                    : ad.verificationStatus === 'Rejected'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                        >
                                            {ad.verificationStatus}
                                        </span>
                                    </td>
                                    {hasPermission(role, PERMISSIONS.VERIFY_AD) && (
                                        <td className="py-2 px-4 flex justify-center gap-1">
                                            {['Verified', 'Rejected', 'Pending'].map(status => (
                                                <button
                                                    key={status}
                                                    disabled={loadingIds.has(ad.adCode)}
                                                    onClick={() => handleStatusChange(ad, status)}
                                                    className={`text-xs px-3 py-1 rounded transition duration-200 font-medium
                    ${status === 'Verified'
                                                            ? 'bg-green-200 hover:bg-green-300 text-green-800'
                                                            : status === 'Rejected'
                                                                ? 'bg-red-200 hover:bg-red-300 text-red-800'
                                                                : 'bg-yellow-200 hover:bg-yellow-300 text-yellow-800'}
                    disabled:opacity-50 disabled:cursor-not-allowed`}
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

export default AllAdsList;
