'use client'

import Sidebar from './Sidebar'

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            {/* Persistent Sidebar */}
            <Sidebar role="admin" />

            {/* Main Content */}
            <main className="ml-64 flex-1 p-6 bg-gray-100">
                {children}
            </main>
        </div>
    )
}
