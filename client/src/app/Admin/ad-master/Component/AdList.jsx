'use client';

import { useEffect, useState } from 'react';
import { useRole } from '@/Context/RoleContext';
import { hasPermission } from '@/libs/hasPermisson';
import { PERMISSIONS } from '@/libs/permissions';
import { FiCheck, FiEdit, FiLock, FiUnlock } from 'react-icons/fi';
import { BACKEND_ADMIN_URL, BACKEND_BUSINESS_URL } from '@/Utils/backendUrl';

const AdList = ({ ads, setAds, editingAd, setIsAdEditing, setEditingAd }) => {
  const [loadingAdIds, setLoadingAdIds] = useState(new Set());
  const { role,businessId } = useRole();

  function isExpired(endDate) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return endDate < today;
  }




async function handleBlock(ad, newStatus) {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${BACKEND_ADMIN_URL}/ads/${ad.adId}/change-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) throw new Error('Failed to update status');

    const result = await response.json();  // { message: "...", data: { ...updated ad... } }
    const updatedAd = result.data;

    setAds(prev => prev.map(a => (a.adId === ad.adId ? { ...a, ...updatedAd } : a)));
  } catch (error) {
    console.error('Error updating ad status:', error);
  }
}





useEffect(() => {
  console.log('Ads updated:', ads);
}, [ads]);
  return (
    <div className="flex-1 overflow-auto rounded bg-white">
      <div className="max-w-[1200px]">
        <table className="w-full text-left text-black border-collapse border border-blue-400">
          <thead>
            <tr className="bg-blue-400">
              <th className="py-3 px-6 border-b border border-blue-700 whitespace-nowrap">Ad Code</th>
              <th className="py-3 px-6 border-b border border-blue-700 whitespace-nowrap">Title</th>
              <th className="py-3 px-6 border-b border border-blue-700 whitespace-nowrap">Start Date</th>
              <th className="py-3 px-6 border-b border border-blue-700 whitespace-nowrap">End Date</th>
              <th className="py-3 px-6 border-b border border-blue-700 whitespace-nowrap">Stage</th>
           
              <th className="py-3 px-6 border-b border border-blue-700 whitespace-nowrap">Status</th>

              {hasPermission(role, PERMISSIONS.BLOCK_AD) && (
                <th className="py-3 px-6 border-b border border-blue-400 whitespace-nowrap">Block</th>
              )}
              
            </tr>
          </thead>
        <tbody>
  {ads.length === 0 ? (
    <tr>
      <td colSpan="10" className="text-center py-4 text-black">
        No ads added yet.
      </td>
    </tr>
  ) : (
    ads.map(ad => (
      <tr key={ad.id} className="text-black text-sm border-t text-center">
        <td className="py-3 px-6 border border-blue-400 whitespace-nowrap">{ad.adId}</td>
        <td className="py-3 px-6 border border-blue-400 whitespace-nowrap">{ad.title}</td>
        <td className="py-3 px-6 border border-blue-400 whitespace-nowrap">
          {new Date(ad.visibleFrom).toLocaleDateString()}
        </td>
        <td className="py-3 px-6 border border-blue-400 whitespace-nowrap">
          {new Date(ad.visibleTo).toLocaleDateString()}
        </td>
        <td className="py-3 px-6 border border-blue-400 whitespace-nowrap">{ad.stage}</td>

        {/* Status */}
        <td className="py-3 px-6 border border-blue-400">
          {isExpired(ad.visibleTo) ? (
            <span className="text-red-600 font-medium">Expired</span>
          ) : (
            <span className="text-green-600">{ad.verificationStatus}</span>
          )}
        </td>

        {/* Block */}
    
{hasPermission(role, PERMISSIONS.BLOCK_AD) && (
  <td className="py-3 px-6 border border-blue-400 flex justify-center gap-2">

    {/* Verify Button */}
    <button
      onClick={() => handleBlock(ad, 'VERIFIED')}
      disabled={ad.verificationStatus === 'VERIFIED'}
      className={`p-2 rounded-full text-white flex items-center justify-center ${
        ad.verificationStatus === 'VERIFIED' 
          ? 'bg-green-600 cursor-default' 
          : ad.verificationStatus === 'REJECTED' 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gray-600 hover:bg-green-700'
      }`}
      title="Verify Ad"
    >
      {ad.verificationStatus === 'VERIFIED' ? <FiCheck size={18} /> : <FiUnlock size={18} />}
    </button>

    {/* Block Button */}
    <button
      onClick={() => handleBlock(ad, 'REJECTED')}
      disabled={ad.verificationStatus === 'REJECTED'}
      className={`p-2 rounded-full text-white flex items-center justify-center ${
        ad.verificationStatus === 'REJECTED' 
          ? 'bg-red-600 cursor-default' 
          : ad.verificationStatus === 'VERIFIED' 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-gray-600 hover:bg-red-700'
      }`}
      title="Block Ad"
    >
      <FiLock size={18} />
    </button>
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

export default AdList;
