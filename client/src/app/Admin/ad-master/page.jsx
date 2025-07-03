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

  const { businessId, role } = useRole(); // 👈 include role
  const fetchedRef = useRef(false);

  useEffect(() => {
  if (fetchedRef.current) return;
  console.log(businessId,role)

  if (!businessId && role !== 'Super Admin' && role !== 'Admin') return;

  fetchedRef.current = true;

const fetchAds = async () => {
  try {
    let url;

    if (role === 'Super Admin' || role === 'Admin') {
      // Fetch all ads for admin roles
      url = `${BACKEND_BUSINESS_URL}/ads`;
    } else {
      // Fetch ads only for the user's business
      url = `${BACKEND_BUSINESS_URL}/ads`;
    }

    // Assuming you have a token stored somewhere, e.g., localStorage or context
    const token = localStorage.getItem('token'); // or get it from wherever you store it

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,  // <-- send token here
      },
    });

    
    if (!res.ok) throw new Error('Failed to fetch ads');
    
    const data = await res.json();
    console.log(data, "sa");
    setAds(data?.data || []);

   
  } catch (error) {
    console.error('Error fetching ads:', error);
    setAds([]);
    setPublishedCount(0);
  }
};


  fetchAds();
}, []);

  return (
    <div className="flex flex-col gap-2 px-4 py-2 w-full max-w-[1200px] mx-auto">
      <div className="mb-4">
        <AdListing
          ads={ads}
          setAds={setAds}
          editingAd={editingAd}
          setEditingAd={setEditingAd}
          isAdEditing={isAdEditing}
          setIsAdEditing={setIsAdEditing}
      
          publishedCount={publishedCount} // ✅ pass to child
          role={role} // ✅ pass to child
        />
      </div>

     
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
