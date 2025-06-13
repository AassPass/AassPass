'use client';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';


const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState("SUPER_ADMIN");
    const [adminId, setAdminId] = useState(null);
    const [businessId, setBusinessId] = useState(null);
    // console.log(role);

    // Load from localStorage if available (optional)
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedBusinessId = localStorage.getItem('businessId');

        if (storedRole) setRole(storedRole);
        if (storedBusinessId) setBusinessId(storedBusinessId);
    }, []);

    // Optionally persist in localStorage
    useEffect(() => {
        if (role) localStorage.setItem('role', role);
        if (businessId) localStorage.setItem('businessId', businessId);
        if (adminId) localStorage.setItem('adminId', adminId);
    }, [role, businessId, adminId]);

    // Memoize the context value to avoid unnecessary re-renders
    const value = useMemo(
        () => ({ role, setRole, businessId, setBusinessId, adminId, setAdminId }),
        [role, businessId, adminId]
    );

    return (
        <RoleContext.Provider value={value}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => useContext(RoleContext);
