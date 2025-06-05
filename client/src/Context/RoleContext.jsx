'use client'
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState("super_admin");
    const [businessId, setBusinessId] = useState(null)



    return (
        <RoleContext.Provider value={{ role, setRole, businessId, setBusinessId }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => useContext(RoleContext);
