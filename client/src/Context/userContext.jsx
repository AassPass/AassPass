// context/UserContext.js
'use client';
import { BACKEND_USER_URL } from '@/Utils/backendUrl';
import { createContext, useCallback, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

 const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoadingUser(true);
    try {
      const res = await fetch(`${BACKEND_USER_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data.user)
        setUserData(data.user);
      } else {
        console.error('Failed to fetch user:', data.message);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoadingUser(false);
    }
   }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, loadingUser, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
