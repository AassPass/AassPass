'use client';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';


const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState();
    const [adminId, setAdminId] = useState(null);
    const [businessId, setBusinessId] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedBusinessId = localStorage.getItem('businessId');
        const storedAdminId = localStorage.getItem('adminId');

        if (storedRole) setRole(storedRole);
        if (storedBusinessId) setBusinessId(storedBusinessId);
        if (storedAdminId) setAdminId(storedAdminId);
    }, []);

    useEffect(() => {
        if (role) localStorage.setItem('role', role);
        if (businessId) localStorage.setItem('businessId', businessId);
        if (adminId) localStorage.setItem('adminId', adminId);
    }, [role, businessId, adminId]);

    const logout = () => {
        setRole(null);
        setAdminId(null);
        setBusinessId(null);
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        localStorage.removeItem('adminId');
        localStorage.removeItem('businessId');
    };

    const value = useMemo(() => ({
        role,
        setRole,
        businessId,
        setBusinessId,
        adminId,
        setAdminId,
        logout,
        setUserLocation
    }), [role, businessId, adminId]);

    return (
        <RoleContext.Provider value={value}>
            {children}
        </RoleContext.Provider>
    );
};


export const useRole = () => useContext(RoleContext);
