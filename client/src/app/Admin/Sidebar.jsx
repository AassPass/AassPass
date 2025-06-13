'use client';

import React, { useCallback, memo } from 'react';
import { useRole } from '@/Context/RoleContext';
import { PERMISSIONS } from '@/libs/permissions';
import { hasPermission } from '@/libs/hasPermisson';

const Sidebar = ({ activeComponent, setActiveComponent }) => {
    const { role } = useRole();

    const getMenuItemClass = useCallback(
        (item) => `
            capitalize px-3 py-1 rounded-md text-xs md:text-sm font-medium transition
            ${activeComponent === item ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-800'}
        `,
        [activeComponent]
    );

    const menuItems = [];

    if (hasPermission(role, PERMISSIONS.CREATE_ADMIN)) {
        menuItems.push(

            { name: 'user-master', label: 'User Master' }
        );
    }

    if (hasPermission(role, PERMISSIONS.CREATE_BUSINESS)) {
        menuItems.push({ name: 'business-master', label: 'Business Master' });
    }

    if (hasPermission(role, PERMISSIONS.VERIFY_ADS)) {
        menuItems.push({ name: 'ad-listing', label: 'Ad Listing' });
    }



    return (
        <aside className="w-full max-w-[1200px] px-3 py-2 bg-white shadow-sm flex flex-wrap items-center justify-between">
            <nav className="flex flex-wrap gap-2">
                {menuItems.map(({ name, label }) => (
                    <button
                        key={name}
                        type="button"
                        className={getMenuItemClass(name)}
                        onClick={() => setActiveComponent(name)}
                    >
                        {label}
                    </button>
                ))}
            </nav>

            <div className="mt-2 md:mt-0">
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold text-xs px-3 py-1 rounded">
                    Ad Credit −5$
                </button>
            </div>
        </aside>
    );
};

export default memo(Sidebar);
