'use client';

import { useState } from 'react';
import { useRole } from '@/Context/RoleContext';
import { hasPermission } from '@/libs/hasPermisson';
import { PERMISSIONS } from '@/libs/permissions';
import { FiEdit, FiLock, FiUnlock } from 'react-icons/fi';
import { BACKEND_BUSINESS_URL } from '@/Utils/backendUrl';

const AdList = ({ ads, setAds, editingAd, setIsAdEditing, setEditingAd }) => {
  const [loadingAdIds, setLoadingAdIds] = useState(new Set());
  const { role,businessId } = useRole();

  function isExpired(endDate) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return endDate < today;
  }

  async function toggleAdStatus(adId, newStatus) {
    try {
      const response = await fetch(`${BACKEND_BUSINESS_URL}/ad/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function handleToggle(ad) {
    if (loadingAdIds.has(ad.adId)) return;

    const newStatus = !ad.isActive;

    setAds(prev =>
      prev.map(a => (a.adId === ad.adId ? { ...a, isActive: newStatus } : a))
    );

    setLoadingAdIds(prev => new Set(prev).add(ad.adId));

    const result = await toggleAdStatus(ad.adId, newStatus);

    if (!result) {
      // rollback
      setAds(prev =>
        prev.map(a => (a.adCode === ad.adCode ? { ...a, isActive: ad.isActive } : a))
      );
    }

    setLoadingAdIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(ad.adCode);
      return newSet;
    });
  }

  async function handleBlock(ad) {
    try {
      const response = await fetch(`/api/ads/${ad.adCode}/block`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked: !ad.isBlocked }),
      });

      if (!response.ok) throw new Error('Block/Unblock failed');

      const updated = await response.json();
      setAds(prev => prev.map(a => (a.adCode === ad.adCode ? { ...a, ...updated } : a)));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleResetAd(ad) {
    try {
      const response = await fetch(`/api/ads/${ad.adCode}/reset`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true }),
      });

      if (!response.ok) throw new Error('Reset failed');

      const updated = await response.json();
      setAds(prev => prev.map(a => (a.adCode === ad.adCode ? { ...a, ...updated } : a)));
    } catch (error) {
      console.error(error);
    }
  }

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
              <th className="py-3 px-6 border-b border border-blue-700 whitespace-nowrap">Active</th>
              <th className="py-3 px-6 border-b border border-blue-700 whitespace-nowrap">Status</th>
              <th className="py-3 px-6 border-b border border-blue-700 whitespace-nowrap">Reset</th>
              {hasPermission(role, PERMISSIONS.BLOCK_AD) && (
                <th className="py-3 px-6 border-b border border-blue-400 whitespace-nowrap">Block</th>
              )}
              <th className="py-3 px-6 border-b border border-blue-400 whitespace-nowrap">Edit</th>
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
              <>
                {ads.map(ad => (
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

                    {/* Active toggle */}
                    <td className="py-3 px-6 border border-blue-400">
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={ad.isActive}
                          onChange={() => handleToggle(ad)}
                          disabled={loadingAdIds.has(ad.id)}
                        />
                        <div
                          className={`w-11 h-6 rounded-full transition-colors ${
                            loadingAdIds.has(ad.id)
                              ? 'bg-gray-300'
                              : ad.isActive
                              ? 'bg-green-500 peer-checked:bg-green-500'
                              : 'bg-gray-400 peer-checked:bg-green-500'
                          } peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300`}
                        />
                        <div
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            ad.isActive ? 'translate-x-full' : ''
                          }`}
                        />
                      </label>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-6 border border-blue-400">
                      {isExpired(ad.visibleTo) ? (
                        <span className="text-red-600 font-medium">Expired</span>
                      ) : (
                        <span className="text-green-600">Active</span>
                      )}
                    </td>

                    {/* Reset */}
                    <td className="py-3 px-6 border border-blue-400">
                      {isExpired(ad.endDate) && (
                        <button
                          onClick={() => handleResetAd(ad)}
                          className="text-xs bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
                        >
                          Reset
                        </button>
                      )}
                    </td>

                    {/* Block */}
                    {hasPermission(role, PERMISSIONS.BLOCK_AD) && (
                      <td className="py-3 px-6 border border-blue-400">
                        <button
                          onClick={() => handleBlock(ad)}
                          className={`p-2 rounded-full ${
                            ad.isBlocked
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-red-600 hover:bg-red-700'
                          } text-white`}
                          title={ad.isBlocked ? 'Unblock Ad' : 'Block Ad'}
                        >
                          {ad.isBlocked ? <FiUnlock size={18} /> : <FiLock size={18} />}
                        </button>
                      </td>
                    )}

                    {/* Edit */}
                    <td className="py-3 px-6 border border-blue-400">
                      <button
                        onClick={() => {
                          setEditingAd(ad);
                          setIsAdEditing(true);
                        }}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                        title="Edit Ad"
                      >
                        <FiEdit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdList;
