'use client';

import React, { memo, useCallback } from 'react';
import { useRole } from '@/Context/RoleContext';
import { PERMISSIONS } from '@/libs/permissions';
import { hasPermission } from '@/libs/hasPermisson';

const Sidebar = ({ activeComponent, setActiveComponent }) => {
    const { role } = useRole();

    const getMenuItemClass = useCallback(
        (item) => `
            capitalize px-4 py-2 rounded-md text-sm font-medium transition
            ${activeComponent === item
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-700 hover:bg-blue-100 hover:text-blue-800'}
        `,
        [activeComponent]
    );

    const menuItems = [];

    if (hasPermission(role, PERMISSIONS.CREATE_ADMIN)) {
        menuItems.push({ name: 'user-master', label: 'User Master' });
    }

    if (hasPermission(role, PERMISSIONS.CREATE_BUSINESS)) {
        menuItems.push({ name: 'company-management', label: 'Business Master' });
    }

    if (hasPermission(role, PERMISSIONS.VERIFY_ADS)) {
        menuItems.push({ name: 'ad-listing', label: 'Ad Listing' });
    }

    return (
        <div
            className="w-full"
        >
            <nav className="flex flex-row md:flex-col w-full gap-3">
                {menuItems.map(({ name, label }) => (
                    <button
                        key={name}
                        className={getMenuItemClass(name)}
                        onClick={() => setActiveComponent(name)}
                    >
                        {label}
                    </button>
                ))}
            </nav>

            <div className="ml-auto md:ml-0 mt-0 md:mt-6 w-full md:w-auto">
                <button className="bg-green-500 hover:bg-green-600 text-white font-semibold text-xs px-4 py-2 rounded w-full md:w-auto">
                    Ad Credit −5$
                </button>
            </div>
        </div>

    );
};

export default memo(Sidebar);
