'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });
const CompanyManagement = dynamic(() => import('./company-management/page'));
const DashboardContent = dynamic(() => import('./dashboard/page'));
const UserMaster = dynamic(() => import('./user-master/page'));
const Profile = dynamic(() => import('./Profile/page'));
const AdListing = dynamic(() => import('./ad-master/page'));
const MapContent = dynamic(() => import('./map/page'));

export default function Page() {
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
        <div className="flex min-h-screen overflow-hidden">
            <aside className="w-full md:w-[240px] md:sticky top-0 bg-white border-r shadow-md p-4 h-screen">
                <Sidebar
                    activeComponent={activeComponent}
                    setActiveComponent={setActiveComponent}
                />
            </aside>

            <main className="flex-1 p-4 overflow-y-auto">
                <ActiveComponent />
            </main>
        </div>



    );
}
