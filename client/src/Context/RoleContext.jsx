'use client'
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const res = await axios.get("/api/me", { withCredentials: true });
            setUser(res.data.user);
            toast.success("User data fetched successfully!");
        } catch (err) {
            setUser(null);
            toast.error("Failed to fetch user data.");
        }
    };

    // You can call this after login to fetch and set user
    useEffect(() => {
        fetchUser(); // try auto-login if cookie exists
    }, []);

    return (
        <RoleContext.Provider value={{ user, fetchUser }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => useContext(RoleContext);
