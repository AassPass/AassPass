'use client'; // Required for client-side components in Next.js

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import sub-components to reduce initial bundle size
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });
const CompanyManagement = dynamic(() => import('./company-management/page'));
const DashboardContent = dynamic(() => import('./dashboard/page'));
const UserMaster = dynamic(() => import('./user-master/page'));
const Profile = dynamic(() => import('./Profile/page'));
const AdListing = dynamic(() => import('./ad-master/page'));
const MapContent = dynamic(() => import('./map/page'));

export default function AdminDashboard() {
    const [activeComponent, setActiveComponent] = useState('company-management');

    const componentMap = {
        dashboard: DashboardContent,
        'user-master': UserMaster,
        'ad-listing': AdListing,
        map: MapContent,
        profile: Profile,
        'company-management': CompanyManagement,
    };

    const ActiveComponent = componentMap[activeComponent] || CompanyManagement;

    return (
        <div className="bg-white font-sans antialiased min-h-screen flex flex-col">
            {/* Sidebar Navigation */}
            <Sidebar
                activeComponent={activeComponent}
                setActiveComponent={setActiveComponent}
            />

            {/* Dynamic Main Content */}
            <main className="flex-grow p-4">
                <ActiveComponent />
            </main>
        </div>
    );
}
