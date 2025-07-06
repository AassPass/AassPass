'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useRole } from '@/Context/RoleContext';
import { useUser } from '@/Context/userContext';

// Dynamic imports
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });
const CompanyManagement = dynamic(() => import('./company-management/page'));
const DashboardContent = dynamic(() => import('./dashboard/page'));
const UserMaster = dynamic(() => import('./user-master/page'));
const Profile = dynamic(() => import('./Profile/page'));
const AdListing = dynamic(() => import('./ad-master/page'));
const MapContent = dynamic(() => import('./map/page'));
const UserBusinessAddForm = dynamic(() => import('./Components/UserBusinessAddForm'));

export default function Page() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [isMounted, setIsMounted] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
   const { fetchUserData } = useUser(); 
  const router = useRouter();
  const { role } = useRole();

  // Load activeComponent and check auth
   useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/');
  } else {
    (async () => {
      await fetchUserData(); // Wait for user data to load before proceeding
      const savedComponent = localStorage.getItem('activeComponent');
      if (savedComponent) {
        setActiveComponent(savedComponent);
      }
      setIsMounted(true);
      setIsCheckingAuth(false);
    })();
  }
}, []);


  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('activeComponent', activeComponent);
    }
  }, [activeComponent, isMounted]);

  const componentMap = {
    dashboard: DashboardContent,
    'user-master': UserMaster,
    'ad-listing': AdListing,
    map: MapContent,
    profile: Profile,
    'company-management': CompanyManagement,
    'Add Business': UserBusinessAddForm,
  };

  const ActiveComponent = componentMap[activeComponent] || DashboardContent;

  if (isCheckingAuth) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white relative">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-blue-400 text-white shadow-md sticky top-0 z-30">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle Sidebar">
          {sidebarOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </div>

      {/* Mobile Sidebar (Slide-in) */}
      <aside
        className={`fixed top-0 left-0 z-40 w-60 h-screen bg-black transition-transform duration-300 transform md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 text-white font-bold border-b border-gray-700">Menu</div>
        <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} setSidebarOpen={setSidebarOpen} />
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
         
        ></div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-60 h-screen bg-black border-r shadow-md sticky top-0 z-10">
        <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-2 overflow-y-auto">
        <ActiveComponent />
      </main>
    </div>
  );
}
