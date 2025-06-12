'use client';

import React, { useCallback, memo } from 'react';
import { useRole } from '@/Context/RoleContext';
import { PERMISSIONS } from '@/libs/permissions';
import { hasPermission } from '@/libs/hasPermisson';

function Sidebar({ activeComponent, setActiveComponent }) {
    const { role } = useRole();

    const getMenuItemClass = useCallback(
        (itemName) => `
      truncate text-[10px] sm:text-xs md:text-sm rounded-md cursor-pointer
      hover:bg-blue-100 hover:text-blue-800 transition duration-200 px-2 py-1
      ${activeComponent === itemName ? 'bg-blue-600 text-white font-semibold shadow' : 'text-gray-700'}
    `,
        [activeComponent]
    );

    return (
        <aside className="w-full max-w-[1200px] px-2 py-1 md:px-4 md:py-2 bg-white text-black flex flex-wrap md:flex-row justify-between items-center shadow-sm">
            <nav className="flex flex-wrap gap-1 md:gap-2">
                {/* {hasPermission(role, PERMISSIONS.CREATE_ADMIN) && (
                    <>
                        <button
                            type="button"
                            className={getMenuItemClass('dashboard')}
                            onClick={() => setActiveComponent('dashboard')}
                        >
                            Dashboard
                        </button>
                        <button
                            type="button"
                            className={getMenuItemClass('user-master')}
                            onClick={() => setActiveComponent('user-master')}
                        >
                            User Master
                        </button>
                    </>
                )} */}

                {hasPermission(role, PERMISSIONS.CREATE_BUSINESS) && (
                    <button
                        type="button"
                        className={getMenuItemClass('business-master')}
                        onClick={() => setActiveComponent('business-master')}
                    >
                        Business Master
                    </button>
                )}

                {/* {hasPermission(role, PERMISSIONS.ADD_ADS) && (
                    <button
                        type="button"
                        className={getMenuItemClass('ad-listing')}
                        onClick={() => setActiveComponent('ad-listing')}
                    >
                        Ad Listing
                    </button>
                )} */}

                {/* <button
                    type="button"
                    className={getMenuItemClass('map')}
                    onClick={() => setActiveComponent('map')}
                >
                    Map
                </button> */}
            </nav>

            <div className="mt-2 md:mt-0">
                <button className="bg-green-500 px-2 py-1 text-[10px] sm:text-xs rounded-md font-bold text-white hover:bg-green-600 transition">
                    Ad Credit −5$
                </button>
            </div>
        </aside>
    );
}

export default memo(Sidebar);
