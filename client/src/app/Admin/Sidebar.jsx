'use client';

import Link from 'next/link';
import { useRole } from '@/Context/RoleContext';
import { PERMISSIONS } from '@/libs/permissions';
import { hasPermission } from '@/libs/hasPermisson';


export default function Sidebar() {
    // const { role } = useRole(); // Assumes role is from context like 'super_admin', 'admin', or 'business'

    // Temporary override for testing
    const role = 'super_admin';

    return (
        <aside className="bg-gray-800 text-white w-64 min-h-screen fixed p-6">
            <h2 className="text-2xl font-bold mb-6 capitalize">
                {role || 'Guest'}
            </h2>

            <nav className="space-y-3">

                {/* Universal / Common Routes */}
                <Link href="/dashboard" className="block hover:bg-gray-700 p-2 rounded">
                    Dashboard
                </Link>

                {/* Super Admin */}
                {hasPermission(role, PERMISSIONS.CREATE_ADMIN) && (
                    <Link href="/Admin/user-master" className="block hover:bg-gray-700 p-2 rounded">
                        User Master
                    </Link>
                )}

                {hasPermission(role, PERMISSIONS.CREATE_BUSINESS) && (
                    <Link href="/Admin/company-management" className="block hover:bg-gray-700 p-2 rounded">
                        Company Management
                    </Link>
                )}

                {hasPermission(role, PERMISSIONS.VERIFY_ADS) && (
                    <Link href="/Admin/ad-master" className="block hover:bg-gray-700 p-2 rounded">
                        Ad Master
                    </Link>
                )}



                {/* Business-specific Routes */}
                {role === 'business' && (
                    <>
                        <Link href="/Company/company-profile" className="block hover:bg-gray-700 p-2 rounded">
                            Company Profile
                        </Link>
                        <Link href="/Company/ad-listing" className="block hover:bg-gray-700 p-2 rounded">
                            Ad Listing
                        </Link>

                    </>
                )}

                {/* Map – let’s show it for all for now */}
                <Link href="/Admin/map" className="block hover:bg-gray-700 p-2 rounded">
                    Map
                </Link>
            </nav>
        </aside>
    );
}
