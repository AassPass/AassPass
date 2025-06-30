'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Dynamic imports
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });
const CompanyManagement = dynamic(() => import('./company-management/page'));
const DashboardContent = dynamic(() => import('./dashboard/page'));
const UserMaster = dynamic(() => import('./user-master/page'));
const Profile = dynamic(() => import('./Profile/page'));
const AdListing = dynamic(() => import('./ad-master/page'));
const MapContent = dynamic(() => import('./map/page'));
const UserBusinessAddForm = dynamic(() => import('./Components/UserBusinessAddForm'));

export default function Page() {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const [isMounted, setIsMounted] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const router = useRouter();

    // Load activeComponent from localStorage after mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
        } else {
            const savedComponent = localStorage.getItem('activeComponent');
            if (savedComponent) {
                setActiveComponent(savedComponent);
            }
            setIsMounted(true);
            setIsCheckingAuth(false);
        }
    }, [router]);

    // Save to localStorage when activeComponent changes
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('activeComponent', activeComponent);
        }
    }, [activeComponent, isMounted]);

    const componentMap = {
        dashboard: DashboardContent,
        'user-master': UserMaster,
        'ad-listing': AdListing,
        
        map: MapContent,
        profile: Profile,
        'company-management': CompanyManagement,
        'Add Business': UserBusinessAddForm,
    };

    const ActiveComponent = componentMap[activeComponent] || DashboardContent;

    if (isCheckingAuth) return null; // Optional loading spinner

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-black">
            {/* Mobile Sidebar */}
            <div className="block md:hidden w-full sticky top-0 z-20 bg-black border-b shadow-md p-4">
                <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:block md:w-60 h-screen sticky top-0 border-r shadow-md bg-black">
                <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-white p-4 overflow-y-auto">
                <ActiveComponent />
            </main>
        </div>
    );
}
