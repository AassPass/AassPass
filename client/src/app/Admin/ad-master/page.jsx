'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import { useRole } from '@/Context/RoleContext';
import { BACKEND_BUSINESS_URL } from '@/Utils/backendUrl';

const AdList = dynamic(() => import('./Component/AdList'), { ssr: false });
const AdListing = dynamic(() => import('./Component/AdListing'), { ssr: false });

export default function page() {
const [ads, setAds] = useState([]);

  const [editingAd, setEditingAd] = useState(null);
  const [isAdEditing, setIsAdEditing] = useState(false);

  const [publishedCount, setPublishedCount] = useState(0); // 👈 track published ads count

  const { businessID, role } = useRole(); // 👈 include role
  const fetchedRef = useRef(false);

  useEffect(() => {
  if (fetchedRef.current) return;

  if (!businessID && role !== 'Super Admin' && role !== 'Admin') return;

  fetchedRef.current = true;

  const fetchAds = async () => {
    try {
      let url;

      if (role === 'Super Admin' || role === 'Admin') {
        // Fetch all ads for admin roles
        url = `${BACKEND_BUSINESS_URL}/ads`;
      } else {
        // Fetch ads only for the user's business
        url = `${BACKEND_BUSINESS_URL}/${businessID}/ads`;
      }

      const res = await fetch(url);
console.log(res)
      if (!res.ok) throw new Error('Failed to fetch ads');

      const data = await res.json();
      setAds(data);

      // Count only published ads, only for user role (if needed)
      if (role !== 'Super Admin' && role !== 'Admin') {
        const activeAds = data.filter((ad) => ad.stage === 'PUBLISHED');
        setPublishedCount(activeAds.length);
      } else {
        // For admin roles, you can decide what to do with publishedCount
        setPublishedCount(data.filter((ad) => ad.stage === 'PUBLISHED').length);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
      setAds([]);
      setPublishedCount(0);
    }
  };

  fetchAds();
}, []);

  return (
    <div className="flex flex-col h-full p-6 overflow-hidden">
      <div className="mb-4">
        <AdListing
          ads={ads}
          setAds={setAds}
          editingAd={editingAd}
          setEditingAd={setEditingAd}
          isAdEditing={isAdEditing}
          setIsAdEditing={setIsAdEditing}
          businessID={businessID}
          publishedCount={publishedCount} // ✅ pass to child
          role={role} // ✅ pass to child
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
