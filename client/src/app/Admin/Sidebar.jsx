'use client'
import { useRole } from '@/Context/RoleContext';
import Link from 'next/link';

export default function Sidebar() {
    // const { role } = useRole();
    const role = "superadmin"
    return (
        <aside className="bg-gray-800 text-white w-64 min-h-screen fixed p-6">
            <h2 className="text-2xl font-bold mb-6">
                {role === 'superadmin' ? 'superadmin' : 'admin'}
            </h2>

            <nav className="space-y-3">
                {role === 'superadmin' ? (
                    <>
                        <Link href="/Admin/dashboard" className="block hover:bg-gray-700 p-2 rounded">
                            Dashboard
                        </Link>
                        {/* Updated: link to company management page */}
                        <Link href="/Admin/company-management" className="block hover:bg-gray-700 p-2 rounded">
                            Company Management
                        </Link>
                        <Link href="/Admin/user-master" className="block hover:bg-gray-700 p-2 rounded">
                            User Master
                        </Link>
                        <Link href="/Admin/ad-master" className="block hover:bg-gray-700 p-2 rounded">
                            Ad Master
                        </Link>
                        <Link href="/Admin/offer-master" className="block hover:bg-gray-700 p-2 rounded">
                            Offer Master
                        </Link>
                        <Link href="/Admin/user-log" className="block hover:bg-gray-700 p-2 rounded">
                            User Log
                        </Link>
                        <Link href="/Admin/map" className="block hover:bg-gray-700 p-2 rounded">
                            Map
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/Company/dashboard" className="block hover:bg-gray-700 p-2 rounded">
                            Dashboard
                        </Link>
                        <Link href="/Company/company-profile" className="block hover:bg-gray-700 p-2 rounded">
                            Company Profile
                        </Link>
                        <Link href="/Company/ad-listing" className="block hover:bg-gray-700 p-2 rounded">
                            Ad Listing
                        </Link>
                        <Link href="/Company/ad-templates" className="block hover:bg-gray-700 p-2 rounded">
                            Ad Templates
                        </Link>

                    </>
                )}
            </nav>
        </aside>
    );
}
