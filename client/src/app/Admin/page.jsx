'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });
const CompanyManagement = dynamic(() => import('./company-management/page'));
const DashboardContent = dynamic(() => import('./dashboard/page'));
const UserMaster = dynamic(() => import('./user-master/page'));
const Profile = dynamic(() => import('./Profile/page'));
const AdListing = dynamic(() => import('./ad-master/page'));
const MapContent = dynamic(() => import('./map/page'));

export default function Page() {
    const [activeComponent, setActiveComponent] = useState('company-management');
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Optional loading state

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/'); // 🔁 redirect to login
        } else {
            setIsCheckingAuth(false); // ✅ show UI after auth check
        }
    }, [router]);

    const componentMap = {
        dashboard: DashboardContent,
        'user-master': UserMaster,
        'ad-listing': AdListing,
        map: MapContent,
        profile: Profile,
        'company-management': CompanyManagement,
    };

    const ActiveComponent = componentMap[activeComponent] || CompanyManagement;

    if (isCheckingAuth) return null; // Optional: Or show loading spinner

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Mobile Sidebar */}
            <div className="block md:hidden w-full sticky top-0 z-20 bg-white border-b shadow-md p-4">
                <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:block md:w-60 h-screen sticky top-0 bg-white border-r shadow-md p-4">
                <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-white p-4 overflow-y-auto">
                <ActiveComponent />
            </main>
        </div>
    );
}
