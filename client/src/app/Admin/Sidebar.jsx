'use client';

import React, { memo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/Context/RoleContext';
import { PERMISSIONS } from '@/libs/permissions';
import { hasPermission } from '@/libs/hasPermisson';
import colors from '@/libs/colors';

const Sidebar = ({ activeComponent, setActiveComponent ,setSidebarOpen}) => {
    const { role } = useRole();
    const router = useRouter();
    const [menuItems, setMenuItems] = useState([]);

    // Set menu items based on role permissions
    useEffect(() => {
        const items = [    { name: 'home', label: 'Home' }, // Add Home to the menu
            { name: 'dashboard', label: 'Dashboard' },];
        
         if (hasPermission(role, PERMISSIONS.CREATE_PROFILE)) {
            items.push({ name: 'profile', label: 'Profile' });
        }

        if (hasPermission(role, PERMISSIONS.CREATE_ADMIN)) {
            items.push({ name: 'user-master', label: 'User Master' });
        }

        if (hasPermission(role, PERMISSIONS.CREATE_BUSINESS)) {
            items.push({ name: 'company-management', label: 'Business Master' });
        }

        if (hasPermission(role, PERMISSIONS.USER_CREATE_BUSINESS)) {
            items.push({ name: 'Add Business', label: 'Add Business' });
        }

        if (hasPermission(role, PERMISSIONS.ADD_ADS)) {
            items.push({ name: 'ad-listing', label: 'Ad Listing' });
        }

        setMenuItems(items);
    }, [role]);

    // Set selected component from localStorage on load
    useEffect(() => {
        const stored = localStorage.getItem('activeComponent');
        if (stored) {
            setActiveComponent(stored);
        }
    }, [setActiveComponent]);

    // Save selection to localStorage and state
    const handleMenuClick = (name) => {
        setActiveComponent(name);
        localStorage.setItem('activeComponent', name);
         if (name === 'home') {
            router.push('/'); // Navigate to home when Home is clicked
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        localStorage.removeItem('adminId');
        localStorage.removeItem('businessId');
        localStorage.removeItem('activeComponent');
        router.push('/');
    };

    const activeIndex = menuItems.findIndex((item) => item.name === activeComponent);

    return (
        <div className="flex flex-col md:flex-nowrap justify-start md:justify-between items-center gap-6 w-full p-2">
            {/* Navigation */}
            <nav className="relative flex flex-col gap-2 w-full">
                {/* Animated Active Highlight */}
                {activeIndex !== -1 && (
                    <div
                        className="absolute left-0 w-full h-10 rounded-md z-0 transition-all duration-300 ease-in-out"
                        style={{
                            backgroundColor: colors.primary,
                            top: `${activeIndex * 44}px`, // 44px = button height
                        }}
                    />
                )}

                {/* Buttons */}
                {menuItems.map(({ name, label }) => (
                    <button
  key={name}
  onClick={() => {
    handleMenuClick(name);
    if (window.innerWidth < 768) {
      setSidebarOpen(false); // Close sidebar only on mobile
    }
  }}
  className="relative z-10 w-full cursor-pointer text-left px-4 py-2 text-sm font-medium text-white transition-all duration-300 ease-in-out"
>
  {label}
</button>


                ))}
            </nav>

            {/* Logout */}
            <div className="mt-6 w-full">
                <button
                    onClick={handleLogout}
                    className="font-semibold cursor-pointer text-xs  px-5 py-2 text-white whitespace-nowrap w-full rounded transition-all duration-300"
                    style={{ backgroundColor: '#ef4444' }} // Tailwind red-500
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default memo(Sidebar);
