'use client';

import React, { memo } from 'react';
import { useRole } from '@/Context/RoleContext';
import { PERMISSIONS } from '@/libs/permissions';
import { hasPermission } from '@/libs/hasPermisson';
import colors from '@/libs/colors';

const Sidebar = ({ activeComponent, setActiveComponent }) => {
    const { role } = useRole();

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
        <div className="flex md:flex-col md:flex-nowrap justify-start md:justify-between items-center gap-2 w-full">
            {/* Navigation Menu */}
            <nav className="flex flex-row md:flex-col gap-2 items-center w-full md:w-auto">
                {menuItems.map(({ name, label }) => (
                    <button
                        key={name}
                        onClick={() => setActiveComponent(name)}
                        className="px-3 md:px-5 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap  md:w-auto"
                        style={{
                            backgroundColor: activeComponent === name ? colors.primary : colors.background,
                            color: activeComponent === name ? '#fff' : colors.text,
                        }}
                    >
                        {label}
                    </button>
                ))}
            </nav>

            {/* Ad Credit Button */}
            <div className="md:mt-6 w-full md:w-auto">
                <button
                    className="font-semibold text-xs md:text-sm px-3 md:px-5 py-1.5 md:py-2 rounded text-white whitespace-nowrap w-full md:w-auto"
                    style={{
                        backgroundColor: colors.secondaryText,
                    }}
                >
                    Ad Credit −5$
                </button>
            </div>
        </div>


    );
};

export default memo(Sidebar);
